# ۱۴ ـ تاریخچه و فهرست کامل فایل‌های تغییرکرده

[فهرست مستندات](README.md)

## مبنای مقایسه

این فهرست از Git بین پایهٔ `d0d7ca836aa` و آخرین commit پیاده‌سازی
`cdd80923d5b` تولید شده است. هر دو مربوط به checkout نسخهٔ ۱۸ هستند؛ این
فهرست diff کامل upstream نسخهٔ 17.6 با 18 نیست. migrationهای ارتقای اصلی
را با تغییرات شخصی‌سازی این فهرست یکی ندانید.

فایل‌های جدید همین پوشهٔ `Documentation` هنوز جزو آن commit پیاده‌سازی
نیستند و برای بزرگ‌تر نشان دادن شمار فایل‌های تغییرات قبلی در آن نیامده‌اند.
artifactها و credentialهای ignored نیز در فهرست Git نیستند.

## commitهای شخصی‌سازی

| commit | موضوع |
| --- | --- |
| `133f281f558` | ترجمهٔ فارسی، RTL اولیه، ممیزی و محیط Docker آزمایشی |
| `b68de2b1c14` | انتخاب زبان در header و نگهداری انتخاب در session |
| `db931a12227` | محدود شدن گزینه‌های header به فارسی و انگلیسی |
| `e56ccd23c5c` | فونت وزیر برای صفحه‌های فارسی |
| `a76b3e10c81` | جایگزینی لوگوی پیش‌فرض با لوگوی سازمانی |
| `ef70aff4adc` | برند کامل، footer و نمایش/انتخاب تاریخ شمسی و آزمون‌ها |
| `cdd80923d5b` | حذف زمینهٔ سفید و هماهنگی دارایی‌های شفاف لوگو |

این commitها به شاخهٔ `feature/persian-translation` در مخزن کاربر ارسال شدند.
عملیات استقرار Production و dumpها commit نشده‌اند و انتشار image در GHCR
انجام نشده است. درخواست مستندسازی نیز به‌خودی‌خود مجوز commit/push تازه نیست.

## همگام‌سازی با مخزن کاربر

remote استفاده‌شده `origin` با آدرس `https://github.com/amirvaziry7/openproject.git`
بود و شاخهٔ مقصد `feature/persian-translation` است. پس از push مربوط به
`cdd80923d5b`، شناسهٔ شاخهٔ remote با commit محلی تطبیق داده شد. یک خطای
موقتی DNS هنگام کنترل پس از push رخ داد؛ کنترل read-only تکرار و موفق شد.

برای بررسی وضعیت بدون تغییر تاریخچه:

```sh
git status --short --branch
git remote -v
git log -1 --oneline
git ls-remote origin refs/heads/feature/persian-translation
```

در همگام‌سازی ثبت‌شده از push شاخه استفاده شد، نه force-push یا بازنویسی
تاریخچه. برای انتشار تغییر تازه پس از بررسی و مجوز مربوط، فرمان شاخه چنین
است؛ در زمان تهیهٔ این مستندات اجرا نشده است:

```sh
git push origin HEAD:feature/persian-translation
```

push کردن commitها، سرور Production را خودکار به‌روز یا ایمیج را در GHCR
منتشر نمی‌کند. استقرار واقعی با image و Compose در فصل‌های عملیاتی ثبت شده است.

## روند candidateهای Docker

| خانوادهٔ tag | مرحله |
| --- | --- |
| `.1` تا `.3` | build اولیه و اصلاح resize/navigation در RTL |
| `.5` | انتخاب زبان header |
| `.6` | dropdown فارسی و انگلیسی |
| `.7` | وزیر |
| `.8` | لوگوی سازمانی |
| `.9` | footer سازمانی |
| `.12` | نام کامل سامانه و برند؛ برخی buildهای میانی از overlay محدود استفاده می‌کردند |
| `.17` | تقویم و نمایش تاریخ شمسی؛ build کامل |
| `.18` | لوگوی شفاف؛ build کامل و artifact نصب‌شده در Production |

برخی شماره‌ها candidate میانی/تشخیصی بودند؛ این جدول ادعای انتشار همهٔ
شماره‌ها یا موفق بودن هر تلاش اولیه نیست. شواهد نهایی در فصل آزمون‌ها آمده‌اند.
tag نهایی `.18-ef70aff4adc` شامل لوگویی است که بعداً در `cdd80923d5b`
commit شد؛ هویت دقیق artifact با Image ID و manifest فصل build ثبت شده است.

## بازتولید فهرست

```sh
git log --oneline d0d7ca836aa..cdd80923d5b
git diff --stat d0d7ca836aa..cdd80923d5b
git diff --name-status d0d7ca836aa..cdd80923d5b
git diff --numstat d0d7ca836aa..cdd80923d5b
```

در جدول‌ها `A` فایل افزوده و `M` فایل تغییرکرده است. اعداد افزوده/حذف‌شده،
تعداد خطوط diff متنی‌اند، نه تعداد قابلیت یا کلید ترجمه. برای باینری شمار
خط معنی ندارد. لینک هر ردیف به فایل واقعی در ریشهٔ مخزن می‌رود.

## خلاصهٔ دسته‌بندی

| دسته | تعداد فایل |
| --- | --- |
| لوگو و دارایی تصویری | 14 |
| ارائهٔ Rails، برند، پیش‌فرض‌ها و تاریخ | 32 |
| ترجمه و متن‌های رابط | 56 |
| مجوز الگوریتم تقویم | 1 |
| ساخت، staging و ممیزی | 8 |
| مستندات توسعه و اعتبارسنجی | 4 |
| رابط، RTL و تقویم frontend | 23 |
| تست و رگرسیون | 11 |
| فونت و مجوز وزیر | 5 |
| **کل فایل‌های پیاده‌سازی مقایسه‌شده** | **154** |

## لوگو و دارایی تصویری

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `M` | [app/assets/images/apple-touch-icon-120x120.png](../app/assets/images/apple-touch-icon-120x120.png) | باینری | باینری |
| `M` | [app/assets/images/development/apple-touch-icon-120x120.png](../app/assets/images/development/apple-touch-icon-120x120.png) | باینری | باینری |
| `M` | [app/assets/images/icon_logo.svg](../app/assets/images/icon_logo.svg) | 1 | 56 |
| `M` | [app/assets/images/icon_logo_white.svg](../app/assets/images/icon_logo_white.svg) | 1 | 6 |
| `M` | [app/assets/images/logo-black-bg-ua.png](../app/assets/images/logo-black-bg-ua.png) | باینری | باینری |
| `M` | [app/assets/images/logo-white-bg-ua.png](../app/assets/images/logo-white-bg-ua.png) | باینری | باینری |
| `M` | [app/assets/images/logo_openproject.png](../app/assets/images/logo_openproject.png) | باینری | باینری |
| `M` | [app/assets/images/logo_openproject_narrow.svg](../app/assets/images/logo_openproject_narrow.svg) | 1 | 9 |
| `M` | [app/assets/images/logo_openproject_white_big.png](../app/assets/images/logo_openproject_white_big.png) | باینری | باینری |
| `M` | [app/assets/images/styleguide/logo_openproject.png](../app/assets/images/styleguide/logo_openproject.png) | باینری | باینری |
| `A` | [app/assets/images/university_logo.png](../app/assets/images/university_logo.png) | باینری | باینری |
| `M` | [modules/bim/app/assets/images/bim/logo_openproject_bim_big.png](../modules/bim/app/assets/images/bim/logo_openproject_bim_big.png) | باینری | باینری |
| `M` | [modules/bim/app/assets/images/bim/logo_openproject_bim_big_coloured.png](../modules/bim/app/assets/images/bim/logo_openproject_bim_big_coloured.png) | باینری | باینری |
| `A` | [public/favicon.svg](../public/favicon.svg) | 1 | 0 |

## ارائهٔ Rails، برند، پیش‌فرض‌ها و تاریخ

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `M` | [app/components/my/work/calendar_component.html.erb](../app/components/my/work/calendar_component.html.erb) | 1 | 1 |
| `M` | [app/components/my/work/list_component.html.erb](../app/components/my/work/list_component.html.erb) | 1 | 1 |
| `M` | [app/components/my/work/list_component.rb](../app/components/my/work/list_component.rb) | 1 | 1 |
| `M` | [app/components/my/work/stack_component.html.erb](../app/components/my/work/stack_component.html.erb) | 1 | 1 |
| `M` | [app/components/my/work/sub_header_component.rb](../app/components/my/work/sub_header_component.rb) | 2 | 2 |
| `M` | [app/components/users/non_working_times/sidebar_component.rb](../app/components/users/non_working_times/sidebar_component.rb) | 3 | 1 |
| `M` | [app/components/work_packages/reminder/modal_body_component.rb](../app/components/work_packages/reminder/modal_body_component.rb) | 1 | 1 |
| `M` | [app/controllers/application_controller.rb](../app/controllers/application_controller.rb) | 7 | 0 |
| `M` | [app/helpers/my/work_helper.rb](../app/helpers/my/work_helper.rb) | 12 | 3 |
| `M` | [app/mailers/interceptors/default_headers.rb](../app/mailers/interceptors/default_headers.rb) | 1 | 1 |
| `M` | [app/models/exports/concerns/csv.rb](../app/models/exports/concerns/csv.rb) | 1 | 1 |
| `M` | [app/seeders/oauth_applications_seeder.rb](../app/seeders/oauth_applications_seeder.rb) | 1 | 1 |
| `M` | [app/seeders/standard.yml](../app/seeders/standard.yml) | 4 | 4 |
| `M` | [app/views/account/login.html.erb](../app/views/account/login.html.erb) | 1 | 0 |
| `M` | [app/views/common/_favicons.html.erb](../app/views/common/_favicons.html.erb) | 4 | 2 |
| `A` | [app/views/layouts/_institution_footer.html.erb](../app/views/layouts/_institution_footer.html.erb) | 31 | 0 |
| `A` | [app/views/layouts/_language_selector.html.erb](../app/views/layouts/_language_selector.html.erb) | 41 | 0 |
| `M` | [app/views/layouts/base.html.erb](../app/views/layouts/base.html.erb) | 11 | 8 |
| `M` | [app/views/layouts/mailer.html.erb](../app/views/layouts/mailer.html.erb) | 1 | 1 |
| `M` | [app/views/layouts/only_logo.html.erb](../app/views/layouts/only_logo.html.erb) | 9 | 3 |
| `M` | [app/workers/backup_job.rb](../app/workers/backup_job.rb) | 1 | 1 |
| `M` | [config/constants/settings/definition.rb](../config/constants/settings/definition.rb) | 4 | 4 |
| `M` | [config/initializers/lookbook.rb](../config/initializers/lookbook.rb) | 1 | 1 |
| `M` | [lib/open_project/custom_styles/design.rb](../lib/open_project/custom_styles/design.rb) | 1 | 5 |
| `A` | [lib/open_project/internationalization/persian_calendar.rb](../lib/open_project/internationalization/persian_calendar.rb) | 74 | 0 |
| `M` | [lib_static/redmine/i18n.rb](../lib_static/redmine/i18n.rb) | 10 | 2 |
| `M` | [modules/bim/app/seeders/bim.yml](../modules/bim/app/seeders/bim.yml) | 5 | 5 |
| `M` | [modules/bim/lib/open_project/bim/bcf_xml/exporter.rb](../modules/bim/lib/open_project/bim/bcf_xml/exporter.rb) | 1 | 1 |
| `M` | [modules/meeting/app/components/meetings/side_panel/details_form_component.rb](../modules/meeting/app/components/meetings/side_panel/details_form_component.rb) | 2 | 1 |
| `M` | [modules/meeting/app/models/meeting/virtual_start_time.rb](../modules/meeting/app/models/meeting/virtual_start_time.rb) | 1 | 1 |
| `M` | [modules/xls_export/app/models/xls_export/concerns/spreadsheet_builder.rb](../modules/xls_export/app/models/xls_export/concerns/spreadsheet_builder.rb) | 1 | 1 |
| `M` | [public/422.html](../public/422.html) | 17 | 2 |

## ترجمه و متن‌های رابط

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `M` | [config/locales/crowdin/fa.seeders.yml](../config/locales/crowdin/fa.seeders.yml) | 3 | 18 |
| `M` | [config/locales/crowdin/fa.yml](../config/locales/crowdin/fa.yml) | 878 | 930 |
| `M` | [config/locales/crowdin/js-fa.yml](../config/locales/crowdin/js-fa.yml) | 29 | 31 |
| `M` | [config/locales/en.yml](../config/locales/en.yml) | 123 | 121 |
| `M` | [config/locales/js-en.yml](../config/locales/js-en.yml) | 4 | 2 |
| `M` | [modules/auth_saml/config/locales/crowdin/fa.yml](../modules/auth_saml/config/locales/crowdin/fa.yml) | 17 | 17 |
| `M` | [modules/auth_saml/config/locales/en.yml](../modules/auth_saml/config/locales/en.yml) | 23 | 23 |
| `M` | [modules/avatars/config/locales/crowdin/fa.yml](../modules/avatars/config/locales/crowdin/fa.yml) | 3 | 3 |
| `M` | [modules/avatars/config/locales/en.yml](../modules/avatars/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/backlogs/config/locales/crowdin/fa.yml](../modules/backlogs/config/locales/crowdin/fa.yml) | 14 | 14 |
| `M` | [modules/backlogs/config/locales/en.yml](../modules/backlogs/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/bim/config/locales/crowdin/fa.seeders.yml](../modules/bim/config/locales/crowdin/fa.seeders.yml) | 4 | 4 |
| `M` | [modules/bim/config/locales/crowdin/fa.yml](../modules/bim/config/locales/crowdin/fa.yml) | 3 | 3 |
| `M` | [modules/bim/config/locales/en.yml](../modules/bim/config/locales/en.yml) | 3 | 3 |
| `M` | [modules/boards/config/locales/crowdin/fa.yml](../modules/boards/config/locales/crowdin/fa.yml) | 3 | 5 |
| `M` | [modules/boards/config/locales/crowdin/js-fa.yml](../modules/boards/config/locales/crowdin/js-fa.yml) | 1 | 3 |
| `M` | [modules/boards/config/locales/en.yml](../modules/boards/config/locales/en.yml) | 1 | 1 |
| `M` | [modules/calendar/config/locales/crowdin/fa.yml](../modules/calendar/config/locales/crowdin/fa.yml) | 1 | 1 |
| `M` | [modules/calendar/config/locales/en.yml](../modules/calendar/config/locales/en.yml) | 1 | 1 |
| `M` | [modules/costs/config/locales/crowdin/fa.yml](../modules/costs/config/locales/crowdin/fa.yml) | 2 | 2 |
| `M` | [modules/documents/config/locales/crowdin/fa.yml](../modules/documents/config/locales/crowdin/fa.yml) | 2 | 2 |
| `M` | [modules/documents/config/locales/en.yml](../modules/documents/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/github_integration/config/locales/crowdin/fa.yml](../modules/github_integration/config/locales/crowdin/fa.yml) | 8 | 8 |
| `M` | [modules/github_integration/config/locales/en.yml](../modules/github_integration/config/locales/en.yml) | 7 | 7 |
| `M` | [modules/gitlab_integration/config/locales/crowdin/fa.yml](../modules/gitlab_integration/config/locales/crowdin/fa.yml) | 15 | 15 |
| `M` | [modules/gitlab_integration/config/locales/crowdin/js-fa.yml](../modules/gitlab_integration/config/locales/crowdin/js-fa.yml) | 1 | 1 |
| `M` | [modules/gitlab_integration/config/locales/en.yml](../modules/gitlab_integration/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/job_status/config/locales/crowdin/fa.yml](../modules/job_status/config/locales/crowdin/fa.yml) | 1 | 1 |
| `M` | [modules/job_status/config/locales/en.yml](../modules/job_status/config/locales/en.yml) | 1 | 1 |
| `M` | [modules/ldap_departments/config/locales/crowdin/fa.yml](../modules/ldap_departments/config/locales/crowdin/fa.yml) | 5 | 5 |
| `M` | [modules/ldap_departments/config/locales/en.yml](../modules/ldap_departments/config/locales/en.yml) | 6 | 6 |
| `M` | [modules/ldap_groups/config/locales/crowdin/fa.yml](../modules/ldap_groups/config/locales/crowdin/fa.yml) | 11 | 11 |
| `M` | [modules/ldap_groups/config/locales/en.yml](../modules/ldap_groups/config/locales/en.yml) | 13 | 13 |
| `M` | [modules/meeting/config/locales/crowdin/fa.yml](../modules/meeting/config/locales/crowdin/fa.yml) | 6 | 4 |
| `M` | [modules/meeting/config/locales/en.yml](../modules/meeting/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/openid_connect/config/locales/crowdin/fa.yml](../modules/openid_connect/config/locales/crowdin/fa.yml) | 9 | 9 |
| `M` | [modules/openid_connect/config/locales/en.yml](../modules/openid_connect/config/locales/en.yml) | 6 | 6 |
| `M` | [modules/recaptcha/config/locales/crowdin/fa.yml](../modules/recaptcha/config/locales/crowdin/fa.yml) | 2 | 2 |
| `M` | [modules/recaptcha/config/locales/en.yml](../modules/recaptcha/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/reporting/config/locales/crowdin/fa.yml](../modules/reporting/config/locales/crowdin/fa.yml) | 2 | 2 |
| `M` | [modules/reporting/config/locales/en.yml](../modules/reporting/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/resource_management/config/locales/crowdin/fa.yml](../modules/resource_management/config/locales/crowdin/fa.yml) | 6 | 6 |
| `M` | [modules/resource_management/config/locales/crowdin/js-fa.yml](../modules/resource_management/config/locales/crowdin/js-fa.yml) | 2 | 2 |
| `M` | [modules/resource_management/config/locales/en.yml](../modules/resource_management/config/locales/en.yml) | 1 | 1 |
| `M` | [modules/storages/config/locales/crowdin/fa.yml](../modules/storages/config/locales/crowdin/fa.yml) | 52 | 52 |
| `M` | [modules/storages/config/locales/crowdin/js-fa.yml](../modules/storages/config/locales/crowdin/js-fa.yml) | 1 | 3 |
| `M` | [modules/storages/config/locales/en.yml](../modules/storages/config/locales/en.yml) | 55 | 55 |
| `M` | [modules/storages/config/locales/js-en.yml](../modules/storages/config/locales/js-en.yml) | 2 | 2 |
| `M` | [modules/team_planner/config/locales/en.yml](../modules/team_planner/config/locales/en.yml) | 1 | 1 |
| `M` | [modules/two_factor_authentication/config/locales/crowdin/fa.yml](../modules/two_factor_authentication/config/locales/crowdin/fa.yml) | 19 | 21 |
| `M` | [modules/two_factor_authentication/config/locales/en.yml](../modules/two_factor_authentication/config/locales/en.yml) | 2 | 2 |
| `M` | [modules/webhooks/config/locales/crowdin/fa.yml](../modules/webhooks/config/locales/crowdin/fa.yml) | 5 | 5 |
| `M` | [modules/webhooks/config/locales/en.yml](../modules/webhooks/config/locales/en.yml) | 4 | 4 |
| `M` | [modules/wikis/config/locales/crowdin/fa.yml](../modules/wikis/config/locales/crowdin/fa.yml) | 12 | 12 |
| `M` | [modules/wikis/config/locales/en.yml](../modules/wikis/config/locales/en.yml) | 20 | 20 |
| `M` | [modules/xls_export/config/locales/en.yml](../modules/xls_export/config/locales/en.yml) | 1 | 1 |

## مجوز الگوریتم تقویم

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `A` | [doc/licenses/jalaali-js.txt](../doc/licenses/jalaali-js.txt) | 23 | 0 |

## ساخت، staging و ممیزی

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `M` | [docker/prod/Dockerfile](../docker/prod/Dockerfile) | 1 | 1 |
| `A` | [docker/prod/persian.compose.yml](../docker/prod/persian.compose.yml) | 17 | 0 |
| `A` | [docker/prod/persian.seed-overrides.Dockerfile](../docker/prod/persian.seed-overrides.Dockerfile) | 4 | 0 |
| `A` | [docker/prod/persian.staging.compose.yml](../docker/prod/persian.staging.compose.yml) | 149 | 0 |
| `A` | [docker/prod/persian.tests.Dockerfile](../docker/prod/persian.tests.Dockerfile) | 9 | 0 |
| `A` | [script/i18n/check_persian](../script/i18n/check_persian) | 180 | 0 |
| `A` | [script/i18n/create_staging_env.py](../script/i18n/create_staging_env.py) | 27 | 0 |
| `A` | [script/i18n/prepare_docker_context.py](../script/i18n/prepare_docker_context.py) | 176 | 0 |

## مستندات توسعه و اعتبارسنجی

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `A` | [docs/development/persian-localization/DEPLOYMENT.md](../docs/development/persian-localization/DEPLOYMENT.md) | 287 | 0 |
| `A` | [docs/development/persian-localization/README.md](../docs/development/persian-localization/README.md) | 290 | 0 |
| `A` | [docs/development/persian-localization/VALIDATION.md](../docs/development/persian-localization/VALIDATION.md) | 473 | 0 |
| `A` | [docs/development/persian-localization/transparent-logo.md](../docs/development/persian-localization/transparent-logo.md) | 29 | 0 |

## رابط، RTL و تقویم frontend

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `M` | [frontend/package-lock.json](../frontend/package-lock.json) | 10 | 0 |
| `M` | [frontend/package.json](../frontend/package.json) | 1 | 0 |
| `A` | [frontend/src/app/core/datetime/calendar-presentation.ts](../frontend/src/app/core/datetime/calendar-presentation.ts) | 54 | 0 |
| `A` | [frontend/src/app/core/datetime/persian-calendar.ts](../frontend/src/app/core/datetime/persian-calendar.ts) | 103 | 0 |
| `M` | [frontend/src/app/core/datetime/timezone.service.ts](../frontend/src/app/core/datetime/timezone.service.ts) | 11 | 4 |
| `M` | [frontend/src/app/features/calendar/op-calendar.service.ts](../frontend/src/app/features/calendar/op-calendar.service.ts) | 2 | 1 |
| `M` | [frontend/src/app/features/calendar/op-work-packages-calendar.service.ts](../frontend/src/app/features/calendar/op-work-packages-calendar.service.ts) | 2 | 1 |
| `M` | [frontend/src/app/features/work-packages/components/filters/abstract-filter-date-time-value/abstract-filter-date-time-value.controller.ts](../frontend/src/app/features/work-packages/components/filters/abstract-filter-date-time-value/abstract-filter-date-time-value.controller.ts) | 5 | 4 |
| `M` | [frontend/src/app/features/work-packages/components/wp-table/timeline/header/wp-timeline-header.directive.ts](../frontend/src/app/features/work-packages/components/wp-table/timeline/header/wp-timeline-header.directive.ts) | 17 | 16 |
| `M` | [frontend/src/app/features/work-packages/components/wp-table/timeline/wp-timeline.ts](../frontend/src/app/features/work-packages/components/wp-table/timeline/wp-timeline.ts) | 10 | 4 |
| `M` | [frontend/src/app/shared/components/datepicker/basic-range-date-picker/basic-range-date-picker.component.ts](../frontend/src/app/shared/components/datepicker/basic-range-date-picker/basic-range-date-picker.component.ts) | 1 | 1 |
| `M` | [frontend/src/app/shared/components/datepicker/basic-single-date-picker/basic-single-date-picker.component.ts](../frontend/src/app/shared/components/datepicker/basic-single-date-picker/basic-single-date-picker.component.ts) | 1 | 1 |
| `M` | [frontend/src/app/shared/components/datepicker/datepicker.ts](../frontend/src/app/shared/components/datepicker/datepicker.ts) | 24 | 0 |
| `M` | [frontend/src/app/shared/components/datepicker/modal-single-date-picker/modal-single-date-picker.component.html](../frontend/src/app/shared/components/datepicker/modal-single-date-picker/modal-single-date-picker.component.html) | 5 | 4 |
| `M` | [frontend/src/app/shared/components/datepicker/modal-single-date-picker/modal-single-date-picker.component.ts](../frontend/src/app/shared/components/datepicker/modal-single-date-picker/modal-single-date-picker.component.ts) | 19 | 0 |
| `A` | [frontend/src/app/shared/components/datepicker/persian-calendar.plugin.ts](../frontend/src/app/shared/components/datepicker/persian-calendar.plugin.ts) | 189 | 0 |
| `A` | [frontend/src/app/shared/components/datepicker/persian-date-input.ts](../frontend/src/app/shared/components/datepicker/persian-date-input.ts) | 107 | 0 |
| `M` | [frontend/src/app/shared/components/datepicker/wp-date-picker-modal/wp-date-picker-instance.component.ts](../frontend/src/app/shared/components/datepicker/wp-date-picker-modal/wp-date-picker-instance.component.ts) | 8 | 0 |
| `M` | [frontend/src/app/shared/components/resizer/resizer/main-menu-resizer.component.ts](../frontend/src/app/shared/components/resizer/resizer/main-menu-resizer.component.ts) | 11 | 3 |
| `M` | [frontend/src/global_styles/content/_datepicker.sass](../frontend/src/global_styles/content/_datepicker.sass) | 44 | 0 |
| `M` | [frontend/src/global_styles/openproject/_generic.sass](../frontend/src/global_styles/openproject/_generic.sass) | 114 | 0 |
| `M` | [frontend/src/stimulus/controllers/dynamic/my/work.controller.ts](../frontend/src/stimulus/controllers/dynamic/my/work.controller.ts) | 2 | 0 |
| `M` | [frontend/src/stimulus/controllers/dynamic/users/non-working-times.controller.ts](../frontend/src/stimulus/controllers/dynamic/users/non-working-times.controller.ts) | 2 | 0 |

## تست و رگرسیون

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `A` | [frontend/src/app/core/datetime/calendar-presentation.spec.ts](../frontend/src/app/core/datetime/calendar-presentation.spec.ts) | 51 | 0 |
| `A` | [frontend/src/app/core/datetime/persian-calendar.spec.ts](../frontend/src/app/core/datetime/persian-calendar.spec.ts) | 75 | 0 |
| `M` | [frontend/src/app/core/datetime/timezone.service.spec.ts](../frontend/src/app/core/datetime/timezone.service.spec.ts) | 23 | 2 |
| `M` | [frontend/src/app/core/setup/init-locale.spec.ts](../frontend/src/app/core/setup/init-locale.spec.ts) | 33 | 0 |
| `A` | [frontend/src/app/shared/components/datepicker/persian-calendar.plugin.spec.ts](../frontend/src/app/shared/components/datepicker/persian-calendar.plugin.spec.ts) | 179 | 0 |
| `A` | [frontend/src/app/shared/components/resizer/resizer/main-menu-resizer.component.spec.ts](../frontend/src/app/shared/components/resizer/resizer/main-menu-resizer.component.spec.ts) | 114 | 0 |
| `M` | [spec/features/localization_spec.rb](../spec/features/localization_spec.rb) | 119 | 2 |
| `M` | [spec/lib/redmine/i18n_spec.rb](../spec/lib/redmine/i18n_spec.rb) | 36 | 0 |
| `A` | [spec/mailers/interceptors/default_headers_spec.rb](../spec/mailers/interceptors/default_headers_spec.rb) | 46 | 0 |
| `M` | [spec/models/setting_spec.rb](../spec/models/setting_spec.rb) | 5 | 5 |
| `M` | [spec/seeders/admin_user_seeder_spec.rb](../spec/seeders/admin_user_seeder_spec.rb) | 2 | 2 |

## فونت و مجوز وزیر

| وضعیت | فایل | خطوط افزوده | خطوط حذف‌شده |
| --- | --- | --- | --- |
| `A` | [frontend/src/assets/fonts/vazir/OFL.txt](../frontend/src/assets/fonts/vazir/OFL.txt) | 93 | 0 |
| `A` | [frontend/src/assets/fonts/vazir/README.md](../frontend/src/assets/fonts/vazir/README.md) | 14 | 0 |
| `A` | [frontend/src/assets/fonts/vazir/Vazir-Bold.woff2](../frontend/src/assets/fonts/vazir/Vazir-Bold.woff2) | باینری | باینری |
| `A` | [frontend/src/assets/fonts/vazir/Vazir-Medium.woff2](../frontend/src/assets/fonts/vazir/Vazir-Medium.woff2) | باینری | باینری |
| `A` | [frontend/src/assets/fonts/vazir/Vazir-Regular.woff2](../frontend/src/assets/fonts/vazir/Vazir-Regular.woff2) | باینری | باینری |

## راهنمای تفسیر و نگهداری

- فایل‌های locale در چند دستهٔ ماژولی هستند؛ تغییر برند انگلیسی نیز می‌تواند در آن‌ها ثبت شده باشد.
- یک فایل CSS می‌تواند هم RTL، هم فونت و هم footer را پوشش دهد؛ دسته‌بندی جدول برای خوانایی است و مالکیت انحصاری یک قابلیت را القا نمی‌کند.
- تغییر فایل spec نشان می‌دهد پوشش مربوط اضافه/اصلاح شده است؛ به‌تنهایی مدرک اجرای تست نیست. نتیجهٔ واقعی در [فصل آزمون‌ها](10-tests-and-validation.md) آمده است.
- file pathهای قدیمی دارای نام OpenProject به خاطر قرارداد asset/import حفظ شده‌اند؛ نام فایل فنی لزوماً نام نمایشی روی صفحه نیست.
- هنگام توسعهٔ بعدی، baseline و commit انتهایی و این فهرست باید با یکدیگر به‌روز شوند؛ آمار مرحلهٔ اولیهٔ ترجمه را برای همهٔ تغییرات جدید دوباره استفاده نکنید.
