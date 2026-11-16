# ۱۱ ـ استقرار واقعی Production

[فهرست مستندات](README.md)

## وضعیت و تاریخ

این فصل عملیات انجام‌شده در **۲۰۲۶-۱۱-۱۴** را ثبت می‌کند. در آخرین بررسی همان عملیات، نسخهٔ `18.0.0` روی [سامانهٔ اصلی](https://project.techvertex.ir/login?ui_language=fa) فعال و سالم بود. این نوشتار نتیجهٔ اتصال مجدد در تاریخ تدوین نیست.

| مشخصه | مقدار ثبت‌شده |
| --- | --- |
| دایرکتوری | `/opt/apps/openproject` |
| پروژهٔ Compose | `openproject` |
| فایل اصلی | `docker-compose.yml` |
| فایل محیطی | `.env`؛ خصوصی و حفظ‌شده |
| override فعال جدید | `docker-compose.override.yml` |
| نسخهٔ قبلی | `17.6.0`؛ revision upstream برابر `2ba1fce1196268ce5686ae308eceee744237440c` |
| نسخهٔ جدید | `18.0.0` با image سفارشی `.18` |
| PostgreSQL | ۱۷؛ همان container و همان data mount قبلی |
| پیوست فعال | `/var/openproject/assets` |

ایمیج و شناسهٔ دقیق در [فصل build](08-docker-image-build.md) ثبت شده‌اند. نام GHCR این image به معنی انتشار آن نیست؛ انتقال از فایل archive انجام شد.

## تشخیص سازگاری و تأیید

ابتدا معلوم شد Production نسخهٔ 17.6 دارد، اما checkout سفارشی نسخهٔ ۱۸ است. بنابراین تعویض آن به عنوان «فقط ترجمه و لوگو» انجام نشد. کپی داده بازیابی و روی آن upgrade آزمایشی اجرا شد. پس از توضیح خطر تغییر schema، کاربر صریحاً درخواست پشتیبان‌گیری و ارتقا با امکان بازگشت کرد.

این تأیید مربوط به همین ارتقا بود؛ مستندات، مجوز خودکار برای تغییر نسخه‌های آینده، انتشار registry، push Git یا تغییر برنامه‌های دیگر نیستند.

## دامنهٔ تغییر تنظیمات

override بررسی‌شده، image سرویس‌های برنامه و متغیرهای ارائه را تنظیم کرد:

```text
OPENPROJECT_DEFAULT__LANGUAGE=fa
OPENPROJECT_APP__TITLE=سامانه جامع مدیریت پروژه
OPENPROJECT_SOFTWARE__NAME=سامانه جامع مدیریت پروژه
MIGRATE=false
```

پارامترهای اتصال دیتابیس فعال، secret برنامه، project name، networkها، bind mountها و image دیتابیس/cache برای استقرار جدید تغییر نکردند. فایل اصلی Compose و `.env` بازنویسی نشدند. override جدید به‌صورت خودکار توسط Compose همان دایرکتوری خوانده می‌شود و خروجی config خودکار با candidate بازبینی‌شده تطبیق داده شد.

وجود `MIGRATE=false` جلوی migration خودکار startup وب را می‌گیرد؛ جایگزین برنامهٔ ارتقای صریح نیست و الزاماً رفتار یک seeder مستقل را کنترل نمی‌کند. seeder اجرا نشد.

## ترتیب عملیات انجام‌شده

1. config، image ID، سرویس‌ها، منابع و نبود drift با آماده‌سازی قبلی بررسی شد.
2. نسخهٔ آمادهٔ rollback و نام دیتابیس بازیابی تعیین شد.
3. فقط proxy متعلق به OpenProject، hocuspocus، worker/cron و سپس web برای نگهداری متوقف شدند؛ PostgreSQL و cache و برنامه‌های دیگر فعال ماندند.
4. dump نهایی و archive پیوست‌ها گرفته و SHA256 کنترل شد.
5. dump و پیوست‌ها در مقصد بازیابی جدا restore شدند؛ تمام ۲۰۳ جدول و ۵ فایل با اصل یکسان بودند.
6. یک job صریح `bundle exec rake db:migrate` با `--no-deps` و بدون seeder اجرا شد.
7. دادهٔ ارتقایافته با کپی cold قدیمی از نظر محتوا و ارتباط‌ها مقایسه شد؛ ۸۲ migration اجرا و count از ۲۰۸ به ۲۹۰ رسید.
8. override فعال نصب و فقط web جدید برای بررسی داخلی اجرا شد؛ proxy عمومی هنوز بسته بود.
9. سلامت، دو زبان، عنوان، footer، گزینه‌های زبان و hash لوگو در backend واقعی بررسی شد.
10. cache اختصاصی برنامه پاک، worker/cron جدید اجرا و hocuspocus/proxy با همان container/image قبلی شروع شدند.
11. مرورگر روی HTTPS واقعی، دسکتاپ و موبایل بررسی شد؛ TLS verification روشن بود.
12. برنامهٔ واقعی 17.6 یک بار در container موقت با دیتابیس بازیابی‌شده boot شد تا آمادگی بازگشت تأیید شود.
13. نسخهٔ قدیمی image برای بازگشت آفلاین archive و checksum شد؛ گزارش‌ها ذخیره شدند.

فایل‌های عملیاتی اجرای تاریخی زیر پوشهٔ خصوصی پشتیبان هستند و جزئی از source معمول clone تازه نیستند. برای استقرار آینده به کپی کورکورانهٔ نام همان dump یا اجرای دوبارهٔ helper تاریخ‌دار تکیه نکنید.

## نتیجهٔ نهایی

| کنترل | نتیجهٔ ثبت‌شده |
| --- | --- |
| نسخه | `18.0.0` |
| زبان پیش‌فرض | `fa` |
| migration معوق | `false` |
| users | ۹ رکورد؛ شمار جدول، نه الزاماً ۹ کاربر انسانی فعال |
| projects | ۵ |
| work_packages | ۴۱ |
| journals | ۸۳ |
| attachments | ۵ |
| web | healthy، بدون restart |
| worker و cron | running با image جدید، بدون restart در بررسی |
| proxy و hocuspocus | running، image و ID قبلی حفظ شد |

صفر restart و نبود الگوی fatal در tail بررسی‌شده، تضمین نبود هر خطا در آینده نیست. خطای شناخته‌شدهٔ درخواست ناشناس صفحهٔ ورود باقی مانده و در [فصل آزمون‌ها](10-tests-and-validation.md) تفکیک شده است.

حساب Production برای آزمون ساخته نشد و رمز هیچ حساب قبلی reset نشد. ورود احراز‌شده با دادهٔ بازیابی‌شده روی کپی جدا آزمون شد؛ تست Production با رمز یک کاربر واقعی انجام نشد.

## راهبری پس از استقرار

فرمان‌های کم‌دامنه، از همان دایرکتوری و با override خودکار:

```sh
cd /opt/apps/openproject
docker compose -p openproject ps
docker compose -p openproject logs --tail=100 web worker cron
docker compose -p openproject up -d --no-deps --pull never web worker cron
docker compose -p openproject exec -T web curl --fail http://localhost:8080/health_checks/default
```

این دستورات نمایش log یا restart سرویس‌های برنامه‌اند، نه اجرای دوبارهٔ ارتقای اصلی. لاگ ممکن است دادهٔ خصوصی داشته باشد؛ خروجی کامل آن را عمومی منتشر نکنید.

استفادهٔ صریح از `-f docker-compose.yml` به‌تنهایی می‌تواند override خودکار را کنار بگذارد و نسخهٔ قدیمی تعریف‌شده در فایل پایه را برگرداند. یا از کشف خودکار بالا استفاده کنید، یا هر دو فایل را صریح بدهید:

```sh
docker compose -p openproject -f docker-compose.yml -f docker-compose.override.yml config --quiet
```

ایمیج در registry منتشر نشده است؛ `pull` از نام GHCR الزاماً موفق نیست. `up` سراسری برای این عملیات لازم نیست و می‌تواند serviceهای دیگر همان پروژه مانند seeder را نیز درگیر کند. حفظ `--no-deps` و نام دقیق سرویس‌ها مهم است.

## سایر برنامه‌های سرور

در ارتقای تأییدشده هیچ lifecycle/config command برای برنامه‌های دیگر اجرا نشد و baseline همان مرحله تغییر در آن‌ها نشان نداد. در مرحلهٔ آماده‌سازی زودتر، تغییر مستقل یک سرویس نامرتبط مشاهده و ثبت شده بود؛ بنابراین ادعای «هیچ container در کل زمان آماده‌سازی توسط هیچ عاملی تغییر نکرد» صحیح نیست.

## ارتقای بعدی

revision، image ID، edition، schema و config فعلی را دوباره بررسی کنید؛ این گزارش جای preflight تازه را نمی‌گیرد. candidate را با tag تازه بسازید، روی restore مستقل آزمون کنید، پشتیبان cold تازه بگیرید و برای تغییر schema از مسیر تأییدشده استفاده کنید. شیوهٔ بازگشت و محدودیت داده‌های جدید در [فصل پشتیبان و rollback](12-backup-and-rollback.md) آمده است.
