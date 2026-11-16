# ۳۶ ـ نقشهٔ سرویس‌های Compose و محدودهٔ عملیات

[فهرست اصلی](README.md) · [استقرار ثبت‌شده](11-production-deployment.md)

## نقش سرویس‌ها

| سرویس | نقش در نصب ثبت‌شده | رفتار در ارتقا |
| --- | --- | --- |
| web | HTTP برنامه و assetهای داخلی | با image سفارشی جایگزین شد |
| worker | jobهای پس‌زمینه | با image سفارشی جایگزین شد |
| cron | کارهای زمان‌بندی مربوط | با image سفارشی جایگزین شد |
| seeder | ایجاد/تکمیل دادهٔ اولیه | در ارتقا اجرا نشد |
| db | PostgreSQL | container و mount حفظ شد |
| cache | cache اختصاصی برنامه | container حفظ شد |
| proxy | ورودی HTTP متعلق به OpenProject | همان container متوقف/شروع شد |
| hocuspocus | همکاری و ویرایش اشتراکی | همان container/image حفظ شد |

نام سرویس، نام container و نام project سه مقدار مرتبط ولی متفاوت‌اند. فرمان Compose بر اساس project و فایل‌های انتخاب‌شده scope می‌گیرد. برای سرور دارای چند برنامه، این scope را پیش از هر دستور بررسی کنید.

## override فعال

در نصب ثبت‌شده، فایل اصلی و `.env` حفظ و `docker-compose.override.yml` اضافه شد. کشف خودکار Compose از همان دایرکتوری این فایل را می‌خواند. استفاده از تنها `-f docker-compose.yml` می‌تواند override را کنار بگذارد.

```sh
cd /opt/apps/openproject
docker compose -p openproject config --quiet
docker compose -p openproject ps
```

## جلوگیری از دامنهٔ ناخواسته

`up` سراسری با `up --no-deps web worker cron` یکسان نیست. dependencyها می‌توانند seeder یا سرویس زیرساختی را وارد عملیات کنند. برای restart روزمرهٔ app از دستور محدود فصل ۱۱ استفاده کنید و برای schema upgrade برنامهٔ مستقل داشته باشید.

خروجی کامل resolved config می‌تواند secret داشته باشد. برای تأیید ساختار از روش خصوصی استفاده کنید و نتیجهٔ بدون credential را مستند کنید؛ کپی آن فایل به README روش مستندسازی تنظیمات نیست.
