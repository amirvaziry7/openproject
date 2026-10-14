#!/usr/bin/env python3

import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tarfile


EXTRA_PATHS = [
    "script/i18n/check_persian",
    "script/i18n/prepare_docker_context.py",
    "docker/prod/persian.compose.yml",
    "docker/prod/persian.staging.compose.yml",
    "frontend/src/app/shared/components/resizer/resizer/main-menu-resizer.component.spec.ts",
]


def refresh_snapshot(archive, manifest_path, root):
    changed = subprocess.check_output(["git", "-c", "core.safecrlf=false", "diff", "HEAD", "--name-only", "-z"], cwd=root)
    names = set(filter(None, changed.decode("utf-8").split("\0"))) | set(EXTRA_PATHS)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    temporary = archive.with_name("source.next.tar")
    with tarfile.open(archive, "r") as previous, tarfile.open(temporary, "w") as updated:
        for info in previous:
            if info.name in names:
                names.remove(info.name)
                path = root / info.name
                if not path.exists():
                    manifest.pop(info.name, None)
                    continue
                data = path.read_bytes()
                try:
                    data.decode("utf-8")
                    if b"\0" not in data:
                        data = data.replace(b"\r\n", b"\n")
                except UnicodeDecodeError:
                    pass
                info.size = len(data)
                manifest[info.name] = hashlib.sha256(data).hexdigest()
                updated.addfile(info, io.BytesIO(data))
            else:
                updated.addfile(info, previous.extractfile(info) if info.isfile() else None)
        for name in sorted(names):
            path = root / name
            if not path.is_file():
                continue
            data = path.read_bytes().replace(b"\r\n", b"\n")
            info = tarfile.TarInfo(name)
            info.mode = 0o644
            info.size = len(data)
            updated.addfile(info, io.BytesIO(data))
            manifest[name] = hashlib.sha256(data).hexdigest()
    temporary.replace(archive)
    manifest_path.write_text(json.dumps(manifest, sort_keys=True, indent=2), encoding="utf-8")
    print("Refreshed source manifest SHA256: " + hashlib.sha256(manifest_path.read_bytes()).hexdigest(), flush=True)


def build(archive, root, args):
    command = ["docker", "build", "--progress=plain", "--target", args.target,
               "-f", "docker/prod/Dockerfile", "-t", args.tag, "-"]
    print("Building " + args.tag, flush=True)
    with archive.open("rb") as context, (archive.parent / "build.log").open("w", encoding="utf-8") as log:
        process = subprocess.Popen(command, stdin=context, cwd=root, stdout=subprocess.PIPE,
                                   stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
        for line in process.stdout:
            log.write(line)
            log.flush()
            sys.stdout.write(line)
            sys.stdout.flush()
        return process.wait()


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--build", action="store_true")
    parser.add_argument("--reuse", action="store_true", help="Build the previously recorded snapshot")
    parser.add_argument("--refresh", action="store_true", help="Update the snapshot from changed tracked files and the explicit extras")
    parser.add_argument("--target", default="slim")
    parser.add_argument("--tag", default="ghcr.io/amirvaziry7/openproject:18.0.0-fa.3-d0d7ca836aa5")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    output = root / "tmp" / "persian-build"
    output.mkdir(parents=True, exist_ok=True)
    archive = output / "source.tar"
    if args.reuse or args.refresh:
        if not archive.exists() or not (output / "source-manifest.json").exists():
            raise RuntimeError("No recorded source snapshot exists")
        if args.refresh:
            refresh_snapshot(archive, output / "source-manifest.json", root)
        return build(archive, root, args) if args.build else 0
    entries = subprocess.check_output(["git", "ls-files", "--stage", "-z"], cwd=root).split(b"\0")
    files = {}
    for entry in filter(None, entries):
        metadata, name = entry.decode("utf-8").split("\t", 1)
        mode, _, stage = metadata.split()
        if stage != "0":
            raise RuntimeError("Resolve merge conflicts before building")
        files[name] = mode
    for name in EXTRA_PATHS:
        if (root / name).is_file():
            files.setdefault(name, "100644")
    manifest = {}
    normalized = 0
    with tarfile.open(archive, "w") as bundle:
        for name, mode in sorted(files.items()):
            path = root / name
            if not path.exists() and not path.is_symlink():
                continue
            if mode == "160000":
                raise RuntimeError(f"Submodule needs an explicit build snapshot: {name}")
            info = tarfile.TarInfo(name)
            info.mode = 0o755 if mode == "100755" else 0o644
            if mode == "120000":
                info.type = tarfile.SYMTYPE
                info.linkname = path.readlink().as_posix() if path.is_symlink() else path.read_text(encoding="utf-8").strip()
                manifest[name] = hashlib.sha256(info.linkname.encode("utf-8")).hexdigest()
                bundle.addfile(info)
                continue
            data = path.read_bytes()
            try:
                data.decode("utf-8")
                is_text = b"\0" not in data
            except UnicodeDecodeError:
                is_text = False
            if is_text and b"\r\n" in data:
                data = data.replace(b"\r\n", b"\n")
                normalized += 1
            manifest[name] = hashlib.sha256(data).hexdigest()
            info.size = len(data)
            bundle.addfile(info, io.BytesIO(data))
    manifest_path = output / "source-manifest.json"
    manifest_path.write_text(json.dumps(manifest, sort_keys=True, indent=2), encoding="utf-8")
    digest = hashlib.sha256(manifest_path.read_bytes()).hexdigest()
    print(f"Snapshot: {len(manifest)} files; normalized {normalized} text files in the archive", flush=True)
    print(f"Source manifest SHA256: {digest}", flush=True)
    print(f"Archive: {archive}", flush=True)
    if args.build:
        return build(archive, root, args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
