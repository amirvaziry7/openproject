# Persian image build, staging and production rollout

The versioned candidate is
`ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c` for Linux/amd64.
It contains the working-tree institutional branding changes on Vazir commit
`e56ccd23c5c`. The source
manifest in `tmp/persian-build/source-manifest.json` records the exact normalized
source used to build it. This is a local image tag, not a published GHCR image.

The initial `.1` image was built and tested locally. Screenshot review then
found the desktop Persian navigation resize handle on the wrong side. The `.3`
candidate includes the corrected logical positioning, mirrored chevrons,
RTL drag direction and a guard against the click generated after releasing a drag.
The `.5` candidate adds a header language selector, including before login.
Selecting an enabled language reloads the whole page and remembers the choice
in the session. It preserves the login return URL and saved account preferences.
The `.6` candidate limits the header dropdown to Persian and English.
The `.7` candidate bundles Vazir v30.1.0 fonts for Persian pages.
The `.8` candidate replaces default application branding with the supplied
institutional logo and displays it prominently on the login page.
Authentication and project-management business logic are
unchanged. See [validation results](VALIDATION.md) for the tested scope, limits
and the unresolved anonymous time-entry bootstrap error.

## Build on Windows

From `D:\MyProject\openproject` in PowerShell:

```powershell
python script/i18n/prepare_docker_context.py --build --tag ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c
docker image inspect ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c
docker run --rm ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c ruby script/i18n/check_persian
```

The helper supplies a source tar archive to the repository's
`docker/prod/Dockerfile`, target `slim`. It preserves Git executable modes,
includes tracked files with their current edits and explicitly listed new
localization files, and converts UTF-8 text to LF inside the archive. It does
not copy ignored local credentials, dependency directories or generated assets.
Additional new source files must be tracked or added to its explicit list.
It does not change the checkout's line endings. The original direct Windows
build failed when Linux tried to execute a CRLF shell script.

For an existing snapshot, `--refresh --build` updates changed tracked files and
the explicit additions before building. `--reuse --build` deliberately builds
the previously recorded snapshot. Build output is saved to
`tmp/persian-build/build.log`. Use a new versioned tag for a different source
snapshot; do not overwrite a released tag.

The production Dockerfile now pins Bundler 4.0.21. It uses Ruby 4.0.7, Node
24.19.0 and npm 11.19.0. It installs backend/frontend dependencies, registers
plugins, exports i18n-js locales and compiles production assets using a
`nulldb` build database. Its normal `.dockerignore` excludes host-built assets.
The source archive also omits ignored host-built assets, so stale frontend
output does not suppress translation export.

On a Linux checkout with LF scripts and executable permissions, the equivalent
repository-supported command is:

```sh
docker build --platform linux/amd64 --progress=plain --target slim \
  -f docker/prod/Dockerfile \
  -t ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c .
```

Use `slim-bim` if the deployment requires the BIM edition. The validated target
here is standard `slim`, with the Dockerfile's normal BIM runtime tooling
support retained.

## Isolated staging

The staging Compose file is `docker/prod/persian.staging.compose.yml` and uses
project name `openproject-fa-staging`. It creates these new volumes:

- `openproject-fa-staging_pgdata`
- `openproject-fa-staging_opdata`

PostgreSQL has no published port and is attached only to the private internal
staging network. The web service additionally has a dedicated browser bridge
and publishes **127.0.0.1:18080**, not a public interface. No production database
URL, volume or network is referenced. The application database is
`openproject_fa_stage`; Rails specs use a separate `openproject_fa_test` database.

For a new staging environment, run the following from the repository root:

```powershell
python script/i18n/create_staging_env.py --image ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml config --quiet
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml up -d db cache
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml run --rm seeder
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml up -d web worker
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml ps
```

Open `http://localhost:18080`. The new staging admin is `admin`; its generated
password is stored locally in `tmp/persian-staging.env`. That file is ignored,
is never included in the build archive, and must not be shared or committed.
The generator refuses to overwrite an existing environment, so rerunning it
cannot invalidate a running staging database's credentials.

For an existing staging environment, retain that file and update only its
`OPENPROJECT_FA_IMAGE` value when testing a new image. Recreate `web` and
`worker` with `up -d --no-deps --force-recreate web worker`. Do not rerun the
seeder for an image-only same-baseline update. Stop staging without deleting
data using:

```powershell
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml stop
```

## Repeat the focused tests

Build a disposable test image from the repository's `build-base` stage:

```powershell
python script/i18n/prepare_docker_context.py --reuse --build --target build-base --tag openproject-fa-build-base:18.0.0-d0d7ca836aa5
docker build --progress=plain -f docker/prod/persian.tests.Dockerfile -t openproject-fa-rails-tests:18.0.0-d0d7ca836aa5 tmp/persian-build
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml run --rm rails-tests bundle exec rake db:create db:migrate
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml run --rm rails-tests bundle exec rspec spec/features/localization_spec.rb spec/services/set_localization_service_spec.rb
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml run --rm rails-tests bundle exec i18n-tasks check-consistent-interpolations --config config/i18n-tasks-all-files.yml --locales fa
```

This test image installs development/test gem groups; the production image
excludes them. The test service binds the edited audit/spec/layout files so
their latest versions can be checked without modifying the staging application.
`db:structure:load` is not available in this Rails version; `db:create db:migrate`
successfully prepared the separate test database.

For frontend tests, install dependencies and generate plugin links. On Windows
without symbolic-link permission, use directory junctions for the generator's
seven plugin directories, preserving its generated registry. The current host
already has those links. Docker's frontend registration uses Linux symlinks.

```powershell
cd frontend
npm ci
$frontendRoot = (Get-Location).Path
$pluginOutput = [IO.Path]::GetFullPath((Join-Path $frontendRoot 'src/app/features/plugins/linked'))
if (-not $pluginOutput.StartsWith($frontendRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe plugin output path' }
node -e "const fs = require('node:fs'); const symlink = fs.symlinkSync; fs.symlinkSync = (target, link, type) => symlink(target, link, fs.statSync(target).isDirectory() ? 'junction' : type); require('./ci-plugins-generator.js');"
npm run typecheck
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm test -- --headless --include='**/{init-locale,main-menu-resizer.component}.spec.ts'
npx eslint src/app/core/setup/init-locale.spec.ts src/app/shared/components/resizer/resizer/main-menu-resizer.component.ts src/app/shared/components/resizer/resizer/main-menu-resizer.component.spec.ts
```

Playwright's bundled Chromium download returned a regional 403 on this host.
The installed Chrome channel worked; the Angular test builder supports the
`CHROME_BIN` override. The production frontend build runs inside the Docker
build after actual Rails locale export; the host's focused unit tests inject
locale fixtures and do not require generated locale JSON.

## Publish only after approval

No registry login, image push or Git push was performed. After explicit approval
and GHCR authentication, the publication command is:

```sh
docker push ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c
```

Record the published registry digest and deploy by digest where possible.
The local image ID and source manifest are not substitutes for the registry
digest returned by a successful push.

## Production at /opt/apps/openproject

These commands are an operator runbook; they have **not** been executed against
`185.231.59.205`. Current production Compose filenames, project name, edition
and source/image baseline still need confirmation. The examples assume
`docker-compose.yml` with services `web`, `worker`, `cron` and `seeder`; include
every existing override file in the commands if your installation uses them.

**Compatibility gate:** this checkout is 18.0.0 at `d0d7ca836aa5`. A matching
major version or version string alone is insufficient. Apply the localization
patch to the exact production source baseline if production differs. An older
release must not be replaced with this candidate as a translation-only update.
Any version/schema upgrade needs a separate supported upgrade procedure and
verified database/attachment backups.

After confirming an identical source/schema baseline, completing staging
validation, obtaining publication approval and publishing the image:

1. In `/opt/apps/openproject`, retain the existing `.env`, secrets, PostgreSQL
   image, Compose project name and all volume/bind-mount paths. Take and verify
   your normal PostgreSQL and attachment backups. Do not run `down -v`, rename
   the Compose project or recreate the database service.
2. Save a private rollback configuration and the current local image ID before
   changing the application image. The rendered configuration contains secrets;
   keep it on the server with restricted permissions and do not paste it into
   chat. Commands below use Bash:

   ```sh
   cd /opt/apps/openproject
   umask 077
   ROLLBACK_DIR=$(mktemp -d /opt/apps/openproject/rollback-fa-XXXXXXXX)
   docker compose -f docker-compose.yml config > "$ROLLBACK_DIR/compose.resolved.yml"
   WEB_CONTAINER=$(docker compose -f docker-compose.yml ps -q web)
   ORIGINAL_PROJECT=$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }}' "$WEB_CONTAINER")
   PREVIOUS_IMAGE=$(docker inspect --format '{{.Image}}' "$WEB_CONTAINER")
   printf '%s\n' "$ORIGINAL_PROJECT" > "$ROLLBACK_DIR/project-name"
   printf '%s\n' "$PREVIOUS_IMAGE" > "$ROLLBACK_DIR/previous-image"
   ```

   Record image IDs separately for worker/cron if they currently differ from
   web, and preserve those IDs in the rollback image overlay. Keep the previous
   local image and backups until the rollout has been accepted.
3. Copy `docker/prod/persian.compose.yml` from the reviewed source to this
   directory as `persian.compose.yml`. Export the approved published image or
   digest in the operator's shell; no existing `.env` value needs replacement:

   ```sh
   export OPENPROJECT_FA_IMAGE=ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml config --quiet
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml config --images
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml pull web worker cron
   ```

   Privately compare the merged configuration with the saved configuration.
   Only the app images and Persian default setting should change. Verify that
   app startup commands do not independently run a seeder, and `MIGRATE` is
   false. Inspect and adapt any custom startup wrapper before proceeding.
4. Schedule a short maintenance window and recreate only Rails services:

   ```sh
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml stop web worker cron
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml up -d --no-deps web worker cron
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml ps
   docker compose -p "$ORIGINAL_PROJECT" -f docker-compose.yml -f persian.compose.yml logs --tail=100 web worker cron
   ```

   `--no-deps` prevents automatic recreation of PostgreSQL and the seeder.
   Same-baseline localization needs no migrations or reseeding. Existing
   database content and user language preferences remain intact.
5. Check the health endpoint, login, Persian selection/default, an English user
   preference, job processing, navigation collapse/resize, forms and tables.
   Users with a supported English browser or explicit English preference can
   still see English. Keep the reviewed override in the deployment's normal
   command configuration so later restarts use the same image/settings.

## Roll back a same-baseline image update

Choose the rollback directory recorded above. Restore the previous local image
ID without pulling a mutable tag, and use the saved configuration to restore
the former environment settings and original project name:

```sh
cd /opt/apps/openproject
ROLLBACK_DIR=/opt/apps/openproject/rollback-fa-REPLACE_WITH_RECORDED_DIRECTORY
ORIGINAL_PROJECT=$(cat "$ROLLBACK_DIR/project-name")
PREVIOUS_IMAGE=$(cat "$ROLLBACK_DIR/previous-image")
cat > "$ROLLBACK_DIR/images.yml" <<EOF
services:
  web:
    image: $PREVIOUS_IMAGE
  worker:
    image: $PREVIOUS_IMAGE
  cron:
    image: $PREVIOUS_IMAGE
EOF
docker compose -p "$ORIGINAL_PROJECT" -f "$ROLLBACK_DIR/compose.resolved.yml" -f "$ROLLBACK_DIR/images.yml" up -d --no-deps --force-recreate web worker cron
docker compose -p "$ORIGINAL_PROJECT" -f "$ROLLBACK_DIR/compose.resolved.yml" -f "$ROLLBACK_DIR/images.yml" ps
```

Use each service's separately recorded ID if its previous image differed.
Restore the original deployment command configuration for future restarts.
This leaves PostgreSQL and attachment volumes in place and runs no seeder.
It is not a database rollback. If a separate upgrade ran migrations, use that
upgrade's verified backup restoration procedure instead of an image-only rollback.
