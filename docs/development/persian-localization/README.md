# Persian localization

This fork identifies itself as OpenProject 18.0.0 in
`lib/open_project/version.rb`. Its interface uses Rails I18n and i18n-js;
Angular, Stimulus and server-rendered views share the same translation resources.

The custom Docker image and isolated staging installation have now been built
and tested. See the [current build/deployment/rollback runbook](DEPLOYMENT.md)
and [executed validation results](VALIDATION.md) for exact commands, image
identity, test scope and outstanding production compatibility inputs.

## Architecture and maintenance

| Resource | Location | Purpose |
| --- | --- | --- |
| English source | `config/locales/en.yml`, `config/locales/js-en.yml` | Backend and frontend source strings |
| Persian core | `config/locales/crowdin/fa.yml`, `config/locales/crowdin/js-fa.yml` | Persian interface |
| Module locales | `modules/*/config/locales/{en,js-en}.yml` and `crowdin/{fa,js-fa}.yml` | Module interface |
| Seed translations | `config/locales/crowdin/fa.seeders.yml`, corresponding module files | Localized defaults for new installations |
| Language names | `config/locales/generated/fa.yml` | Generated CLDR language name |
| Frontend export | `config/i18n.yml`, `assets:export_locales` | Generates ignored `frontend/src/locales/fa.json` |

Rails loads the core Crowdin directory in `config/application.rb`; module
engines load their Crowdin directories in `acts_as_op_engine.rb`. The frontend
imports the user's and instance's locale JSON during `initializeLocale`.
Production asset compilation exports translations before building Angular.
Do not edit generated frontend JSON or CLDR files.

Persian was registered but excluded from the default selectable language list.
The fork now includes `fa` while retaining every previously enabled language.
Saved instance settings still take precedence over source defaults.

The initial source audit found ten missing leaves: eight access-token expiry
strings and two meeting presentation/backlog strings. It also found English
fallback text in forms, automation, AI settings, CSV import, workflows and
several modules. These gaps have been translated, and mixed-language UI terms
have been reviewed for Persian equivalents. Core work-package, cancellation,
administration and password labels follow the requested glossary. Persian kaf
and yeh are used throughout the checked resources.

Crowdin manages upstream translations. Direct Persian changes here are a fork
patch; submit them to Crowdin where possible and retain/review the patch when
importing upstream translation updates. Do not regenerate or replace locale
files wholesale during an upstream merge.

## Coverage and validation

Run the standalone audit from the repository root; it needs Ruby's standard
library and does not boot Rails or connect to PostgreSQL:

```sh
ruby script/i18n/check_persian
```

It checks all present English backend/frontend locale files and generated
English seed locale files, when available, against their Persian counterparts.
It checks missing leaves, array entries, singular/plural keys, duplicate YAML
keys, placeholders, HTML tags, Markdown link destinations, inline code,
corrupted text, Persian character variants and English-only fallback strings.
Product names and technical values have an explicit allowlist. Mixed-language
prose still needs human review; a passing audit is not a linguistic or visual
certification.

At implementation time: **10,514 / 10,514 source leaves present**, zero audit
errors, and 81 English-only technical values intentionally retained (for
example GitHub, OAuth, CSV and provider names). The date-order symbols are
configuration, not prose. Subsequent validation generated the English seed
sources inside a disposable test container and passed the expanded audit of
**10,910 / 10,910 leaves**, including seed resources. Generate those English
sources before repeating the complete seed comparison.
Existing project names, statuses, priorities, user-entered content and stored
seeded records are not renamed. English third-party documentation, integration
responses and text outside translation resources are not covered by this count.

With Ruby **4.0.7**, Bundler **4.0.21**, Node **^24.15.0**, npm **11.x**, installed
dependencies and a test PostgreSQL database, run:

```sh
bundle exec rails runner script/i18n/generate_seeders_i18n_source_file
ruby script/i18n/check_persian
bundle exec i18n-tasks check-consistent-interpolations --config config/i18n-tasks-all-files.yml
bundle exec rspec spec/features/localization_spec.rb spec/services/set_localization_service_spec.rb
bundle exec rails assets:export_locales
bundle exec erb_lint app/views/layouts/base.html.erb app/views/layouts/only_logo.html.erb app/views/layouts/mailer.html.erb
bundle exec rubocop script/i18n/check_persian spec/features/localization_spec.rb config/constants/settings/definition.rb
cd frontend
npm ci
npm run typecheck
npm run build
```

This patch changes 898 existing translation leaves and adds ten missing leaves
across 23 locale files. Alongside the three core resources, module changes are
in avatars, backlogs, BIM seeds, boards, costs, GitHub/GitLab integration, LDAP
departments, meetings, OpenID Connect, reporting, resource management, storages,
two-factor authentication, webhooks and wikis. The other changed files are
`config/constants/settings/definition.rb`, the three application/login/email
layouts, `frontend/src/global_styles/openproject/_generic.sass`,
`spec/features/localization_spec.rb`, the audit script, this document and the
production Compose override.

Initial native backend checks were blocked by host Ruby 4.0.2 / Bundler 4.0.6.
Subsequent Docker builds used Ruby 4.0.7 / Bundler 4.0.21 successfully. The
production frontend build, 17 Rails examples, 10 frontend tests, typechecks,
interpolation checks, focused linting and browser verification passed.
Staging runs on a separate local database and volumes. Production was not
accessed and the image was not published. See the validation report for exact
results and limits; this was not the complete repository test suite.

## Default language and RTL

Use the existing deployment setting on all Rails services:

```yaml
environment:
  OPENPROJECT_DEFAULT__LANGUAGE: "fa"
```

An example override is provided in `docker/prod/persian.compose.yml`. It changes
the image and default language for `web`, `worker`, `cron` and `seeder`; it does
not declare or modify database services, volumes, credentials or networks.

For an existing instance, retain its enabled-language list and add Persian in
**Administration → System settings → Languages** if needed. Alternatively, if
you already configure `OPENPROJECT_AVAILABLE__LANGUAGES`, append `fa` to that
YAML array without dropping other entries. A Persian default is considered
valid even when absent from an older saved available-language list.

Locale selection still follows `SetLocalizationService`: explicit user
preference, supported browser Accept-Language, then instance default. Consequently
an English browser or a user with an English preference can still see English.
The header language selector overrides these defaults for the current browser
session, including before login. It reloads the page when the selection changes;
the Apply button also works without JavaScript. The header dropdown offers only
Persian and English from the enabled languages. Switching to Persian applies
RTL, and switching to English restores
LTR. The login return URL is preserved, and saved account preferences are not
rewritten. Users can permanently select فارسی in their language and region settings.
No user preferences or database records are rewritten. Rails' English fallback
locale is retained.

Persian pages use locally bundled Vazir v30.1.0 WOFF2 fonts in regular, medium
and bold weights. The application and Primer font variables switch on
`html[lang="fa"]`; English uses its existing font stack. Font files and the
original SIL Open Font License are in `frontend/src/assets/fonts/vazir/`.

The institutional logo is stored in `app/assets/images/university_logo.png`.
The supplied 1060 × 1500 PNG is preserved unchanged in the desktop/theme,
touch-icon, PDF-export, style-guide and BIM default logo assets. The mobile and
favicon SVG assets embed the same PNG without redrawing or changing its text.
The login page displays the full portrait logo at 180px high with its original
proportions; the header scales it to fit its existing logo area.

Application and logo-only pages display the institutional footer using the
`institutional_footer` translation key. The requested Persian text is identical
in both interface languages, with explicit Persian language, RTL direction and
Vazir styling. The content area reserves a separate grid row for the footer so
it stays below forms and tables without covering them.

The application display name is «سامانه جامع مدیریت پروژه» in both supported
interface languages. The default application/software title, default admin
display name, translated core/module messages, backup descriptions, built-in
mobile-client display name and mailer metadata use this branding. The Compose
overrides set `OPENPROJECT_APP__TITLE` and `OPENPROJECT_SOFTWARE__NAME` explicitly.
Ruby/JavaScript namespaces, API/header identifiers, URLs, code examples and
upstream copyright notices retain their technical/original names.

For the isolated staging instance, only the five presentation settings
`app_title`, `software_name`, `welcome_title`, `welcome_text`, `consent_info` and
the unchanged stock admin display name were updated. Their earlier values are
backed up in ignored `tmp/institutional-branding-before.json`. Existing content
and production databases are not bulk-renamed. On production, review persisted
welcome/consent text through administration when applying the new image.

Application, login and HTML email layouts now use the existing `direction`
translation (`rtl` in Persian, `ltr` in English). The Persian-only Sass rule
keeps code, email/URL/telephone/numeric/password inputs and the Gantt timeline
LTR. Form labels use logical alignment. Persian sessions display Jalali dates in the shared Rails and frontend date
formatters. English sessions retain Gregorian dates. The shared date picker
renders actual Persian months, including leap-year Esfand and Nowruz; desktop
and mobile Persian date inputs accept Jalali dates and Persian/Arabic digits.
Gantt month/quarter/year labels and their visual boundaries use the Persian
calendar. FullCalendar date labels use Jalali dates; its planning view ranges
and navigation retain their existing Gregorian intervals.

Storage, API values, HTML datetime attributes, scheduling calculations and
calendar event timestamps remain Gregorian ISO values. Formatted datetime
inputs convert from Jalali into the user's time zone before serialization.
Existing server-side ISO form values opt out of display conversion with
`calendar: false`. Do not change Moment's global calendar or localize machine
values. The conversion uses jalaali-js 2.0.1 and a matching Ruby year-boundary
implementation; the MIT attribution is in `doc/licenses/jalaali-js.txt`.

Before release, check desktop and mobile navigation, project/work-package
tables, scrolling, sorting, drag-and-drop, resizers, dialogs, forms, both rich
text editors, notifications, calendars, Gantt date/bar alignment, email clients
and PDF exports. Check an English session as well. Legacy physical CSS offsets
are not comprehensively mirrored by these minimal changes. Focused desktop/mobile checks and navigation
resize/collapse/keyboard checks have now passed in Persian and English. PDF
font/shaping, email clients and comprehensive system/accessibility coverage
remain unverified.

## Build and publish a custom Docker image

Build from the repository root. Choose an immutable tag containing the source
revision; replace the example registry/tag below with your own. Commands in this
section use a POSIX shell.

```sh
docker build --target slim -f docker/prod/Dockerfile -t registry.example.com/openproject:18.0.0-fa-REVISION .
docker push registry.example.com/openproject:18.0.0-fa-REVISION
```

Use `slim-bim` for the BIM image if your current deployment requires it. The
production Dockerfile builds Rails assets and exports frontend translations.
Its `.dockerignore` excludes locally precompiled assets and the frontend
manifest, so those do not mask the new translations. The build has executed successfully using a normalized source archive; the
current runbook provides the exact Windows command and versioned image identity.

## Update an existing deployment and preserve data

Use your existing production Compose deployment, its current project name,
its `.env`, secrets and volume paths. The repository root `docker-compose.yml`
is a development setup. The official deployment has app services `web`,
`worker`, `cron` and `seeder`; if yours differs, adapt the override to your
actual service names. See the [official Compose deployment](https://github.com/opf/openproject-docker-compose/blob/master/docker-compose.yml)
and [installation instructions](https://www.openproject.org/docs/installation-and-operations/installation/docker-compose/).

**Version compatibility:** this checkout is 18.0.0. Do not replace an older
production release with this image as a translation-only update. First apply
the localization patch to the exact release/revision currently deployed and
build that release, or complete a separate supported upgrade with backups and
migration planning. The simple image rollback below only applies when there
has been no schema upgrade.

1. Record the current image digest and retain the current Compose files and
   language settings. Take and verify a PostgreSQL backup and an attachment
   backup using your established procedure. Keep the current image available.
2. Copy `docker/prod/persian.compose.yml` into the existing deployment directory
   as `persian.compose.yml`. Add the custom image to the deployment's existing
   `.env` without changing its other values:

   ```dotenv
   OPENPROJECT_FA_IMAGE=registry.example.com/openproject:18.0.0-fa-REVISION
   ```

3. Render and inspect the merged configuration. Include any override files
   already used by your deployment in every command. Confirm that PostgreSQL
   image, database connection, project name and volume mappings are unchanged:

   ```sh
   docker compose -f docker-compose.yml -f persian.compose.yml config --quiet
   docker compose -f docker-compose.yml -f persian.compose.yml config --images
   docker compose -f docker-compose.yml -f persian.compose.yml pull web worker cron
   ```

4. For a localization-only image built on the **same release**, schedule a short
   maintenance window and restart only the Rails app services:

   ```sh
   docker compose -f docker-compose.yml -f persian.compose.yml stop web worker cron
   docker compose -f docker-compose.yml -f persian.compose.yml up -d --no-deps web worker cron
   docker compose -f docker-compose.yml -f persian.compose.yml ps
   docker compose -f docker-compose.yml -f persian.compose.yml logs --tail=100 web worker cron
   ```

   This does not recreate PostgreSQL or run the seeder. A translation-only
   change needs no migrations or reseeding. Never run `docker compose down -v`,
   remove volumes, or create a new Compose project name for this rollout.
5. Verify the health endpoint, login, Persian screens, an explicit English
   user preference, jobs and the RTL checklist above. Keep previous images and
   backups until verification is complete.

## Roll back

For a same-release rollout without migrations, set `OPENPROJECT_FA_IMAGE` to
the recorded previous image/digest, restore the previous language environment
setting in the override (or remove that setting if it was previously absent),
and recreate only the application services:

```sh
docker compose -f docker-compose.yml -f persian.compose.yml up -d --no-deps --force-recreate web worker cron
```

Alternatively restore the original Compose configuration and run its normal
app restart command. Keep PostgreSQL and attachment volumes in place. If a
separate version upgrade ran migrations, an image-only rollback is insufficient;
follow the upgrade's database/attachment backup restoration procedure.
