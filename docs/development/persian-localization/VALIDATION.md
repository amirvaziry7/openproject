# Persian localization validation — 2026-10-14

## Transparent institutional logo — 2026-10-28

Candidate: `ghcr.io/amirvaziry7/openproject:18.0.0-fa.18-ef70aff4adc`.
Image ID:
`sha256:f602eeb0038865119ad0b8c213be4db41fd9e6e051c18df3a432d04319d62bc2`.
Source manifest SHA256:
`c725733acf4ce261401f97c2c094eede3ad7ced24a466d65862c92ee7ffcda35`.

The built-in image tool removed the white background from the institutional
logo. The selected PNG is RGBA, 1054 × 1492, with genuine transparency in both
outer margins and internal negative spaces. The original uploaded file was
not overwritten. See [the extraction record and exact prompt](transparent-logo.md).

Executed validation:

- All ten PNG aliases have identical output bytes, alpha extrema 0–255, and
  zero-alpha corner pixels. All four SVG wrappers and the standalone error
  page embed the same transparent PNG. SVG XML and native dimensions passed.
- Prawn successfully embedded the transparent image into a PDF with an alpha
  soft mask (`/SMask`). Local evidence:
  `tmp/transparent-logo-checks/university-logo-transparent.pdf`.
- Five browser scenarios passed on the built image: desktop login/header/icon,
  English login, standalone error page, mobile login/menu, and authenticated
  projects/work packages/administration. Browser checks decoded the served PNG
  pixels, including SVG-embedded payloads, and verified zero alpha in the
  background and visible blue artwork. They also matched served image hashes
  against the project master PNG.
- The full production build passed and the local web container is healthy.
  Only web and worker containers were recreated; existing staging database and
  volumes were retained. No seeder or database migrations ran.

Browser evidence is in ignored
`tmp/persian-validation/transparent-logo-brand-results.json` and the
`transparent-logo-*.png` screenshots. This asset-only update did not rerun the
full Rails or frontend test suites. No production deployment, image publication
or Git push was performed for this change.

## Pre-commit review — 2026-10-28

The combined institutional branding/footer and Persian calendar changes were
reviewed again before committing:

- **613 RSpec examples, 0 failures**, covering localization, settings, admin
  seeding, backup jobs, Unicode mail headers, date helpers, My work headers,
  reminder forms and meeting models, using the separate test database.
- **38 frontend tests, 0 failures**; application/spec typechecks passed.
- **32 browser checks passed**: 19 institutional-name/footer checks and 13
  Persian/English calendar checks against the healthy local `.17` image.
  An expired saved browser session was renewed through normal staging login
  before repeating the browser checks successfully.
- Translation audit in the running image: **10,517 leaves, 0 errors**.
- Eight focused TypeScript files passed ESLint; six templates passed ERB lint.
  All 22 staged Ruby files were inspected: **0 findings on changed lines**;
  13 pre-existing findings outside changed lines remain. This is not a claim
  that whole-repository linting or the complete application test suite passed.
- Both Python build/staging helpers passed syntax compilation. Generated
  bytecode was removed. Git whitespace validation passed, and credentials,
  browser sessions, private keys and temporary artifacts were excluded.
- All **106 staged implementation/build/license files** matched the normalized
  source manifest used for the validated `.17` image; only tests and
  documentation were excluded from that implementation comparison.

Only local Docker services were started for verification. Production was not
accessed and no image or commit was published.

## Persian calendar — 2026-10-27

Candidate: `ghcr.io/amirvaziry7/openproject:18.0.0-fa.17-a76b3e10c81`.

Persian sessions use Jalali display dates and a real Jalali month grid in the
shared date picker. Date and datetime inputs convert the selected day back to
Gregorian ISO values. English remains Gregorian. Gantt labels and visual month,
quarter and year boundaries use the selected calendar. FullCalendar labels are
localized, while its existing planning-view intervals remain Gregorian.

Executed checks:

- **484 Rails examples, 0 failures**: date localization, My work header,
  reminder form and meeting model tests, against the separate test database.
- **38 frontend examples, 0 failures**, in installed headless Chrome:
  Nowruz, leap-year Esfand, valid/invalid month lengths, Persian/Arabic digits,
  time-zone day boundaries, datetime round trips, shared picker integration,
  range selection, disabled/min/max days, English and unchanged ISO output.
- **27,420 cross-runtime conversion comparisons passed**, sampling five days
  in each month from Gregorian 1800 through 2256 against jalaali-js.
- Application/spec typechecks passed. New calendar TypeScript files and eight
  changed Ruby presentation files passed focused linting. Whole-file linting of
  older touched files also reports existing issues (including `any` types,
  empty callbacks, legacy delegation and `Date.today`); it is not reported as a
  clean whole-repository lint run.
- Translation audit: **10,517 source leaves, 0 errors**.

An initial component run found five failures caused by a helper not being
included in My work components. The helper inclusion was corrected; the final
combined Rails run passed. An initial frontend browser invocation used the
unsupported `ChromeHeadless` name. The successful run used `chromium`, headless
mode and the supported `CHROME_BIN` executable override.

The full repository Docker build completed successfully, and isolated staging
web/worker containers run the `.17` image with a healthy web health check.
The image ID is
`sha256:0965a1c0b7734b76903d5f5387a61c9a3be33c6be2f04ea69b4287610627d388`.
The normalized source manifest SHA256 is
`ecf8eff97e3aea5a6cd55f4a7f0be14724507f4e407db454268837a862178e1f`.
Nine calendar runtime files matched the recorded source hashes. The audit
inside the running image also passed with 10,517 leaves and zero errors.

**13 browser checks passed against the final image**, without script/style
injection or disabling CSP. They covered Persian/English server and frontend
dates, real Persian month grids, ISO form values, Persian digit typing, preview
re-rendering, unchanged persisted dates after cancelling previews, Gantt labels,
and mobile layout (including a 320px viewport and an Android user agent).
The private local evidence is in `tmp/persian-validation/calendar-results.json`,
`fa-jalali-datepicker.png`, `fa-jalali-mobile-datepicker.png`,
`fa-jalali-gantt.png` and `en-gregorian-datepicker.png`.

An earlier image check exposed Turbo previews removing the visible Persian
inputs while retaining the calendar component. A scoped observer now restores
the input adapters after form changes; a regression test covers input morphing
and replacement. Visual review also led to bounded month-panel widths so two
months fit the desktop dialog and one month fits narrow mobile screens.
Diagnostic injection was used to investigate these issues; it was not used in
the final image verification. No seeder or migrations ran during this rollout.
No production database or production volumes were accessed. No image was
published and no commits were pushed.

Reproduction commands (from the repository root, PowerShell):

```powershell
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml run --rm rails-tests bundle exec rspec spec/lib/redmine/i18n_spec.rb spec/components/my/work/sub_header_component_spec.rb spec/components/work_packages/reminder/modal_body_component_spec.rb modules/meeting/spec/models/meeting_spec.rb --format progress
cd frontend
$env:CHROME_BIN='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm test -- --include=src/app/core/datetime/*.spec.ts --include=src/app/shared/components/datepicker/persian-calendar.plugin.spec.ts --include=src/app/core/setup/init-locale.spec.ts --browsers=chromium --headless
npm run typecheck
```

## Full institutional application name — 2026-10-27

The candidate is `ghcr.io/amirvaziry7/openproject:18.0.0-fa.12-a76b3e10c81`.
The full application name is «سامانه جامع مدیریت پروژه» in the English/Persian
interfaces. The changes cover application/software title defaults, 512 display
values in 52 catalogs, nine values in the canonical standard/BIM seed sources,
stock admin/mobile-client display names, backup descriptions, mail metadata,
Lookbook branding and the standalone emergency error page. YAML structure,
interpolation, markup, URLs, code examples and copyright comments were preserved.

Focused settings/localization/seeder/backup tests passed **128 examples,
0 failures**. The separate Unicode mail-header encoding test passed **1 example,
0 failures**. Modified Ruby and ERB checks passed with the existing
`BackupJob#dump_database!` predicate-name warning excluded. The locale audit
passed with **10,516 leaves, 0 errors**.

Only isolated staging presentation settings and unchanged stock display names
were updated. Backups are in ignored `tmp/institutional-branding-before.json`
and `tmp/institutional-oauth-display-before.json`. Mobile-client authentication
fields were checked to remain unchanged. No production database was accessed.

The `.11` repository-supported production build succeeded. The final `.12`
layer copies only the updated canonical seed definitions using
`docker/prod/persian.seed-overrides.Dockerfile`; a clean full build from the
current source is also supported. **115 runtime branding source files** were
verified against the normalized build manifest, and the baked locale audit
also passed. Final image ID:
`sha256:b2039cd16a93ae3678ff0533f11e8268671a376468733c3327a413cc67f27cdc`.
Source manifest SHA256:
`3c5af46973251963659287a112bc66e01fc091fd9786e2e0f24825c763df155c`.

Chrome passed **19 display-name checks** in English/Persian across login, home,
projects, work packages, administration, general settings, users and error pages,
including mobile login and the emergency document. Checks verified the full
page title, global-search label, exported JavaScript backup title, retained
institutional footer and absence of unprotected visible old application names.
The emergency document's image and accessible name were also verified. Results
and inspected screenshots are in ignored `tmp/persian-validation/institution-name-*`.

## Institutional footer — 2026-10-27

The footer candidate is `ghcr.io/amirvaziry7/openproject:18.0.0-fa.9-a76b3e10c81`.
The shared application and logo-only layouts render the exact requested Persian
institutional credit in both interface languages. The footer has explicit
Persian language, RTL direction and Vazir font styling. The content wrapper
reserves a separate grid row for it rather than overlaying page content.

The focused localization/service tests passed **22 examples, 0 failures**.
All three changed ERB templates passed lint; the feature spec passed RuboCop.
The translation audit checked 10,515 source leaves with zero errors. The
additional source leaf is the institutional footer key, whose Persian text is
intentionally identical in the English and Persian resources.
Source manifest SHA256:
`49c01088886c72db37cbe81f86c9ae1c9fcd714e2218368f0db01d92d9aa97e9`.
The production Docker build completed successfully. The base-image layers had
changed since the previous build and required dependency installation again.
The baked translation audit also passed with 10,515 leaves and zero errors;
runtime Ruby reports 4.0.7. Local image ID:
`sha256:0bcb009d7f51bba45c00ddb6c9381ecb749c11f6792aa3456e699137b5a8e03d`.
Only local staging application containers were recreated, retaining its database
and volumes. No production connection, image push or Git push occurred.

Chrome completed **17 footer checks** across Persian/English desktop login,
projects, work packages, administration, users and error pages, plus mobile login
in both languages and mobile projects/work packages/administration. Each check
verified the exact Persian text, a single footer, Persian/RTL attributes, Vazir
font selection, viewport fit and no overlap with the content area. Results and
screenshots are saved in ignored `tmp/persian-validation/institution-footer-*`.

## Institutional logo

The branded candidate is `ghcr.io/amirvaziry7/openproject:18.0.0-fa.8-e56ccd23c5c`.
It uses the supplied `logouni.png` for the default application branding and
displays the full portrait on the login page. Ten PNG assets and four SVG
wrappers were verified to preserve the exact original image bytes, including
their contents in the source archive. SVG wrappers embed the original PNG;
the artwork and Persian text were not regenerated.

The focused localization/service/branding-helper run passed **52 examples,
0 failures**. Both changed ERB templates passed lint. RuboCop passed with the
existing missing frozen-string-comment rule excluded for the branding design
helper. The default export logo decoded as 1060 × 1500 and rendered successfully
using the application's PDF logo module with Prawn; the result is stored in
ignored `tmp/university-logo.pdf`. This checks PDF embedding, not a complete
browser-driven export workflow.

The production image build succeeded and its translation audit passed with
10,514 leaves and zero errors. Local image ID:
`sha256:98004fa7ccdef254f72858bd76bbb38fc0998a44b0d2f273fb6b29b9e50cce16`.
Source manifest SHA256:
`a1b5d8e4af6d8c53e1107662e777f48ac29552193c8ca94a99123b32768973b8`.
Docker Desktop was stopped initially; its installed per-user application was
started locally. Existing staging data and volumes were retained. No production
connection or image publication occurred.

Chrome verified the exact supplied image on desktop/mobile login pages, default
header assets, SVG favicon, touch icon, English login, and authenticated project,
work-package and administration pages. The existing saved staging login session
had expired; signing in normally with the existing staging admin credentials
restored it without resetting the account. Desktop/mobile screenshots were
inspected; the portrait logo retains its proportions and the mobile form remains
usable. Results are saved to `tmp/persian-validation/university-brand-results.json`.
The mobile navigation dialog was also opened and its visible logo verified.

## Vazir font for Persian

The Vazir candidate is `ghcr.io/amirvaziry7/openproject:18.0.0-fa.7-db931a12227`.
It bundles original Vazir v30.1.0 regular, medium and bold WOFF2 assets with their
SIL Open Font License. Font selection is scoped to Persian HTML and covers the
application and Primer font variables.

The source-context refresh now preserves newly added binary files. The three
WOFF2 assets were verified to match the build archive byte for byte.
Source manifest SHA256:
`aa1e5df8348d0588a6e2851f48e7acd995d6f20f402f8b7c89973921da943f9b`.

The production Docker build succeeded. Local image ID:
`sha256:588c408dc9bbba520b08962cd0bd5274b0282f44de7e1e4cbb2c225e0a8a1885`.
Its baked translation audit passed with 10,514 leaves and zero errors.
Chrome verified all three font weights loaded successfully from local URLs,
the Persian login body/heading/labels/inputs/buttons/selector used Vazir, and
the heading actually rendered custom Vazir glyphs using the browser's font
inspection API. English restored its original font stack and LTR direction.
Authenticated project, work-package and administration pages also used Vazir.
Desktop/mobile screenshots were captured in `tmp/persian-validation/`, alongside
`vazir-results.json`. Only local staging web/worker containers were recreated.

## Persian and English dropdown

The current candidate is `ghcr.io/amirvaziry7/openproject:18.0.0-fa.6-b68de2b1c14`.
The header selector offers only Persian and English, filtering the existing
enabled-language options. A regression test enables German alongside these two
and verifies that the header still contains exactly English and فارسی.
The focused Rails run passed **21 examples, 0 failures**; the selector template
also passed ERB lint and the changed files passed `git diff --check`.
The production image build succeeded and its baked audit passed with 10,514
source leaves and zero errors. Local image ID:
`sha256:6ad436fb432aed4debc7cf98e56f8df9a3d07fd325f5b1aae7f63e9a7bd89972`.
Source manifest SHA256:
`a33694823396dde84d538640a0ea9088755bac4cb8406e6c0a2c05b4a9ff358a`.
Chrome confirmed exactly the `en` and `fa` options, automatic language switching,
session persistence, mobile layout, and navigation through authenticated pages
against the updated local staging image. Its database and volumes were retained.

## Header language selector

The updated candidate is `ghcr.io/amirvaziry7/openproject:18.0.0-fa.5-133f281f558`.
It adds a session language selector to the application and logo-only headers.
The selection overrides browser/account defaults for the session without
rewriting account preferences or changing authentication behavior.

The focused Rails run completed **20 examples, 0 failures**, covering language
switching, persistence across pages, login return URLs, invalid/array parameters,
and unchanged account preferences. All three modified ERB templates passed lint.
RuboCop found six existing controller offenses outside the edited localization
methods; excluding their four existing rules yielded no offenses. The changed
files also passed `git diff --check`.

Screenshot review caught malformed copyright delimiter text in the initial
`.4` selector partial. This was corrected in `.5` and covered by a regression
assertion. The earlier image validation below describes the previous `.3` build.

The `.5` production Docker build completed successfully. Its baked translation
audit checked **10,514 source leaves, 0 errors**. Local image ID:
`sha256:87f7d46731cdadac65272f3f92348ba02560e7a03235c84419cdd2c8ccf729ff`.
Source manifest SHA256:
`8a55e28bbbd6dc333cb8c7c247eca6be1703e8c8b10de6975da791b8acdb3d74`.
Only local staging web/worker containers were recreated, retaining its database
and volumes. No production connection, image publication or Git push occurred.

Installed Chrome verified automatic Persian/English switching, both HTML and
frontend locales, RTL/LTR direction, retained login return URLs, persistence on
subsequent pages, and selection on authenticated projects/work-package pages.
The selector fit within a 390px mobile viewport. Final desktop/mobile screenshots
were inspected, and no copyright delimiter text remained. Browser results and
screenshots are stored in ignored `tmp/persian-validation/`.

The earlier validated local candidate is
`ghcr.io/amirvaziry7/openproject:18.0.0-fa.3-d0d7ca836aa5`, Linux/amd64,
713,567,129 bytes as reported by Docker image inspection.

- Local image ID: `sha256:239caf3237b9ec0c04beb08d3e5b756d5bc6fa85041b578039a8ec0ecbbb6248`
- Source manifest SHA256: `0ade43386a6cff87c0e1141691a21689266b4e96fbdcea1eaa272020184c568a`
- Source baseline: `d0d7ca836aa5`, with the uncommitted localization and UI fixes.
- Published registry digest: unavailable; no image was pushed.

## Environment

| Tool | Host | Docker build/runtime |
| --- | --- | --- |
| Docker | Engine 29.6.2, Desktop Linux context | Linux/amd64, approximately 16 GB memory available |
| Ruby | 4.0.2 | 4.0.7 |
| Bundler | 4.0.6 | 4.0.21, now pinned in the production Dockerfile |
| Node | 24.18.0 | 24.19.0 |
| npm | 11.16.0 | 11.19.0 |
| Rails | Native backend blocked by Ruby mismatch | 8.1.4 from Gemfile.lock |
| Frontend dependencies | `npm ci` completed, 1,103 packages installed | Production installation completed |
| Browser | Installed Chrome 154.0.8037.98 | Browser checks ran on the host against isolated staging |

The host Ruby installation was retained. Backend validation ran with the
required versions in disposable containers. The production build used the
repository's `slim` target, including actual Rails locale export and frontend
production compilation.

## Executed checks

| Check | Actual result |
| --- | --- |
| Production image build | Passed; final `.3` image created locally |
| Rails assets / frontend production build | Passed inside the Docker build |
| Audit of resources baked into the image | Passed: 10,514 source leaves, zero errors |
| Audit after generating English seed sources | Passed: 10,910 source leaves, zero errors |
| Repository interpolation consistency check, locale `fa` | Passed: no inconsistent interpolations |
| `spec/features/localization_spec.rb` and `spec/services/set_localization_service_spec.rb` | Passed: 17 examples, zero failures |
| Locale initialization and menu resize frontend specs | Passed: 2 files, 10 tests |
| Frontend application and spec typechecks | Passed |
| ESLint on edited locale/resize TypeScript files | Passed |
| RuboCop on audit script, localization spec and settings definition | Passed: 3 files, no offenses |
| ERB lint on application, login and mailer layouts | Passed: 3 files, no errors |
| Diff whitespace check | Passed |
| Staging Compose syntax | Passed |
| Staging environment generator overwrite protection | Passed; existing credentials remained unchanged |
| Staging health endpoint | HTTP 200; web and PostgreSQL healthy |
| Anonymous login bootstrap | Known issue: protected `/api/v3/time_entries` request returns 401 and emits a console error in both Persian and English browser sessions |

The generated English seed locale files were written only inside a disposable
test container. The staging application uses `openproject_fa_stage`; the
RSpec schema and factories use `openproject_fa_test`. Both belong to the new
local staging PostgreSQL service. No production database was used.

## Browser verification

Browser checks used Playwright with installed Chrome, authenticated as the new
staging admin. The initial seed selected Persian and the admin account's locale
was `fa`. The new-user form also selected `fa` by default.

| Area | Verified behavior |
| --- | --- |
| Login | HTTP 200; Persian text; `lang=fa`, `dir=rtl`; password input remains LTR |
| Navigation/home | Persian frontend locale loaded; navigation on the right; desktop screenshots reviewed |
| Projects | Persian labels and RTL project table; desktop and 390px mobile screenshots reviewed |
| Project creation form | HTTP 200; Persian labels and RTL fields |
| Work packages | Populated Persian table and localized controls; new-work-package form rendered |
| Administration | Admin overview, user table and language settings rendered in Persian/RTL |
| Language selection | Persian option present; selection saved through normal account settings |
| English preference | Saved English preference took precedence over a Persian browser; English/LTR project page rendered |
| Persian restoration | Re-selected Persian through normal account settings after the English check |
| Default fallback | Unsupported browser language fell back to configured Persian |
| New users | New-user language selector defaulted to Persian |
| Gantt smoke check | Rendered in Persian; timeline retained LTR geometry; screenshot reviewed |
| Navigation resize | Handle aligned with the correct edge in both languages; RTL outward drag enlarged width from 280 to 319 pixels; LTR outward drag enlarged width from 319 to 358 pixels |
| Navigation activation | Mouse collapse/expand and keyboard activation after dragging passed in both languages |

Authenticated page checks reported no uncaught JavaScript errors. Anonymous
login probes were inconsistent initially, but the final `.3` probes reproduced
a 401 from `/api/v3/time_entries` and an uncaught authentication-required
message in both Persian and English browser sessions. The login pages still
rendered correctly and normal login succeeded. This startup issue is unresolved;
no authentication/authorization behavior was changed to bypass the protected
endpoint. It needs separate investigation before treating the application as
free of browser console errors.

Screenshots and machine-readable results remain under
`tmp/persian-validation/`:

- `browser-results.json`
- `browser-extra-results.json`
- `resizer-results.json`
- `fa-login.png`, `fa-projects.png`, `fa-work-packages-table.png`
- `fa-project-form.png`, `fa-work-package-form.png`, `fa-admin-users-table.png`
- `fa-mobile-projects.png`, `fa-gantt.png`
- `fa-resizer-verified.png`, `en-resizer-verified.png`, `en-projects.png`

The private `admin-session.json` file in that directory contains staging
session cookies. Do not share or commit it. The screenshots and results contain
only the isolated demo installation.

## Failures encountered and their resolution

1. The direct Windows Docker build could not execute `preinstall-common.sh`
   because of CRLF shebangs. The build archive now preserves executable modes
   and converts text to LF without changing the checkout globally.
2. Docker originally installed Bundler 4.0.23. It is now pinned to the required
   4.0.21.
3. Initial frontend typechecking lacked generated plugin registration. Windows
   symbolic links were denied; directory junctions allowed the existing
   generator to produce its registry. Both typecheck targets then passed.
4. Playwright's bundled Chromium download returned a regional HTTP 403. The
   installed Chrome browser worked through the supported `CHROME_BIN` setting.
5. A fully internal staging network did not publish the web port. Adding a
   dedicated web browser bridge enabled loopback access while keeping
   PostgreSQL private.
6. `db:structure:load` was unavailable in this Rails version. `db:create` and
   `db:migrate` successfully prepared the separate test database.
7. Linting found audit/spec style issues and pre-existing ERB block indentation.
   They were corrected; LF normalization of the edited files also avoided
   CRLF-related lint/parser errors.
8. The first RTL screenshot review exposed the navigation resize handle on the
   left of the page. Its Persian positioning and chevrons now use the proper
   side, and drag direction follows the menu's computed direction.
9. Actual dragging then exposed a click after pointer release that collapsed
   the resized menu. The component now suppresses that pointer click while
   retaining ordinary clicks and keyboard activation. Unit and browser
   regression checks passed.

## Remaining limits and operator actions

This is focused localization/RTL validation, not the entire repository test
suite. Full system/accessibility coverage, every licensed enterprise feature,
PDF rendering, email-client rendering, all calendars and all drag-and-drop
workflows were not tested. Resource coverage is not a full linguistic review;
existing user/demo content and product/technical names can contain English.

npm reported 12 vulnerabilities in the locked frontend dependency tree
(2 moderate, 10 high). No dependency versions were changed or forced audit fixes
applied. The builds also emitted existing xeokit CommonJS/ESM warnings and
Docker warnings about secret environment variable placeholders. ERB lint
emitted a Ruby/parser compatibility warning but completed successfully. These
are recorded independently of the passing focused tests.

Production Compose filenames, project name, source/image baseline and edition
still need confirmation. Do not use the 18.0.0 candidate as a translation-only
replacement for a different release or source/schema baseline. The current
host Ruby/Bundler mismatch matters only for native backend development; the
container build and tests used the required versions.

The anonymous time-entry bootstrap error is an outstanding application issue,
seen in both locales. The focused automated tests pass, but that does not make
this browser finding a passing check.

Staging is left running locally at `http://localhost:18080` for review. No
registry login, image push, Git commit/push, SSH session, production deployment,
production PostgreSQL connection or production volume operation was performed.
See [the deployment and rollback runbook](DEPLOYMENT.md) for the next operator
steps after publication approval and compatibility confirmation.
