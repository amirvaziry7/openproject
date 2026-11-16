# ۰۹ ـ توسعهٔ محلی، staging و محیط آزمون

[فهرست مستندات](README.md)

## پیش‌نیاز و انتخاب روش

نسخهٔ ابزارها را با `.ruby-version`، `Gemfile.lock` و `package.json` هماهنگ کنید. فرمان‌های مشاهدهٔ نسخه و build در [فصل ساخت](08-docker-image-build.md) آمده‌اند. برای توسعهٔ Docker، [راهنمای docker/dev](../docker/dev/AGENTS.md) نیز مرجع است؛ Compose ریشهٔ مخزن، دستور ارتقای Production نیست.

روش native فقط در محیط توسعه و با دیتابیس توسعهٔ آماده:

```sh
bundle install
cd frontend
npm ci
cd ..
bundle exec rails db:migrate
bin/dev
```

این دستورات در این نوبتِ مستندسازی اجرا نشده‌اند. `db:migrate` باید به دیتابیس توسعهٔ خودتان متصل باشد، نه URL تولید. در پیاده‌سازی، backend به علت عدم تطابق Ruby/Bundler میزبان از مسیر Docker آزمون شد.

## staging مستقل

فایل [persian.staging.compose.yml](../docker/prod/persian.staging.compose.yml) پروژهٔ `openproject-fa-staging` را تعریف می‌کند:

| جزء | مقدار |
| --- | --- |
| دیتابیس برنامه | `openproject_fa_stage` |
| دیتابیس RSpec | `openproject_fa_test` |
| volume دیتابیس | `openproject-fa-staging_pgdata` |
| volume پیوست‌ها | `openproject-fa-staging_opdata` |
| آدرس web | `127.0.0.1:18080` |
| پورت PostgreSQL روی میزبان | منتشر نشده |
| شبکه | شبکهٔ داخلی staging؛ bridge مجزای web برای مرورگر |

دو دیتابیس آزمون و برنامه می‌توانند در instance PostgreSQL آزمایشی مشترک باشند، اما هیچ‌کدام دیتابیس Production نیستند. وجود bridge برای web، PostgreSQL را روی میزبان منتشر نمی‌کند.

## ایجاد نصب تازهٔ staging

فقط برای نصب تازه و جدا، از ریشهٔ مخزن در PowerShell:

```powershell
python script/i18n/create_staging_env.py --image ghcr.io/amirvaziry7/openproject:18.0.0-fa.18-ef70aff4adc
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml config --quiet
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml up -d db cache
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml run --rm seeder
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml up -d web worker
```

فایل `tmp/persian-staging.env` شامل رمز تصادفی و secret نصب محلی است، ignored می‌ماند و مولد از بازنویسی فایل موجود خودداری می‌کند. رمز آن را در راهنما یا Git قرار ندهید. مرحلهٔ seeder این بخش برای **ایجاد staging تازه** است و نباید برای update نصب دارای داده یا Production تکرار شود.

آدرس بررسی: `http://localhost:18080/login?ui_language=fa`.

## به‌روزرسانی staging دارای داده

همان env و همان project/volumeها را حفظ کنید. فقط مقدار `OPENPROJECT_FA_IMAGE` را برای candidate جدید تغییر دهید و پس از بررسی نسخه/schema:

```powershell
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml up -d --no-deps --force-recreate web worker
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml ps
```

این الگو برای update هم‌پایه بدون migration است. برای ارتقای schema باید برنامهٔ ارتقا و پشتیبان جدا داشته باشید. برای توقف بدون حذف داده:

```powershell
docker compose --env-file tmp/persian-staging.env -f docker/prod/persian.staging.compose.yml stop
```

## تصویر مخصوص Rails tests

ایمیج slim تولید، gemهای تست و تمام sourceهای توسعه را نگه نمی‌دارد. فایل `docker/prod/persian.tests.Dockerfile` و service با profile `validation` برای این نیاز ساخته شدند. تست‌ها باید به `openproject_fa_test` بروند؛ تنظیم `DATABASE_URL` آن را پیش از اجرای فرمان‌های دیتابیس بررسی کنید.

ساخت تصویر آزمون از stage `build-base`، نصب gemهای گروه test و آماده‌سازی دیتابیس آزمون در راهنمای فنی [DEPLOYMENT.md](../docs/development/persian-localization/DEPLOYMENT.md) توضیح داده شده است. `db:structure:load` در مسیر آزموده‌شدهٔ این نسخه در دسترس نبود؛ دیتابیس آزمون با `db:create db:migrate` آماده شد.

## وابستگی‌های frontend در Windows

ثبت pluginها باید پیش از typecheck/build انجام شود. در اجرای ثبت‌شده، مجوز ساخت symbolic link روی Windows وجود نداشت و برای دایرکتوری‌های plugin از junction استفاده شد. مولد اصلی `frontend/ci-plugins-generator.js` و registry حاصل باید هماهنگ بمانند؛ junctionهای میزبان جای symlink استاندارد داخل Docker را نمی‌گیرند.

دانلود Chromium بسته‌بندی‌شده در آن محیط با خطای منطقه‌ای ۴۰۳ مواجه شد. Chrome نصب‌شده با `CHROME_BIN` و نام browser برابر `chromium` برای تست‌ها استفاده شد.

## تمرین بازیابی دادهٔ واقعی

پیش از ارتقا، dump و پیوست‌های Production در پروژهٔ محلی مستقل `openproject-prod-rehearsal-20261114` بازیابی شدند. این محیط شبکه، credential، دیتابیس و volumeهای مستقل داشت و web آزمایشی فقط روی loopback پورت ۱۸۰۹۰ بود. worker/cron ارسال‌کنندهٔ عملیات واقعی برای آن فعال نشدند؛ روش تحویل ایمیل آزمون تنظیم شد.

ابتدا schema قدیمی و دادهٔ اصلی snapshot گرفته شد، سپس ۸۲ migration روی نسخهٔ آزمایشی اجرا و داده‌ها تطبیق داده شدند. فقط در همین کپی محلی، یک مدیر آزمایشی برای بررسی صفحات پس از ورود ایجاد شد. پس از آزمون، محیط متوقف و volumeها نگه داشته شدند.

فایل Compose این تمرین زیر `tmp/production-rollout/rehearsal.compose.json` خصوصی و خارج از Git است. در clone تازه وجود ندارد؛ برای تکرار تمرین باید محیط مستقل و credential تازه ساخته شود، نه اینکه فایل خصوصی حاوی دادهٔ واقعی را به مخزن اضافه کنید.
