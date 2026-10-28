#!/usr/bin/env python3

import argparse
from pathlib import Path
import secrets


parser = argparse.ArgumentParser()
parser.add_argument("--image", default="ghcr.io/amirvaziry7/openproject:18.0.0-fa.17-a76b3e10c81")
args = parser.parse_args()
if not args.image or "\n" in args.image or "\r" in args.image:
    raise SystemExit("Invalid image reference")
root = Path(__file__).resolve().parents[2]
target = root / "tmp" / "persian-staging.env"
target.parent.mkdir(parents=True, exist_ok=True)
if target.exists():
    raise SystemExit("Staging environment already exists; reuse it without replacing its credentials")
values = {
    "OPENPROJECT_FA_IMAGE": args.image,
    "OPENPROJECT_FA_STAGE_DB_PASSWORD": secrets.token_hex(24),
    "OPENPROJECT_FA_STAGE_SECRET_KEY_BASE": secrets.token_hex(64),
    "OPENPROJECT_FA_STAGE_ADMIN_PASSWORD": "FaStage-" + secrets.token_hex(16),
}
with target.open("x", encoding="utf-8") as output:
    output.write("".join(f"{key}={value}\n" for key, value in values.items()))
target.chmod(0o600)
print(f"Created {target}; credentials were not displayed")
