# Persian localization validation — 2026-10-14

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
