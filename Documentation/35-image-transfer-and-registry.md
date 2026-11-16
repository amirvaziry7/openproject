# ۳۵ ـ انتقال image و تفاوت آن با انتشار registry

[فهرست اصلی](README.md) · [هویت image نصب‌شده](08-docker-image-build.md)

## مسیر انجام‌شده

image محلی export شد، فایل به سرور انتقال یافت، checksum کامل بررسی و سپس `docker image load` اجرا شد. بارگذاری image به مخزن محلی Docker، container را اجرا نمی‌کند و migration هم انجام نمی‌دهد.

```text
docker save → انتقال کامل → SHA256 برابر → docker load → کنترل Image ID
```

| وضعیت | نتیجهٔ قابل ادعا |
| --- | --- |
| انتقال بخشی از فایل | image آمادهٔ نصب نیست |
| انتقال کامل بدون checksum | سلامت انتقال هنوز تأیید نشده |
| load موفق و Image ID صحیح | artifact در Docker سرور موجود است |
| container با همان image اجرا شده | مرحلهٔ اجرای جدا انجام شده است |
| نام image دارای `ghcr.io` | به‌تنهایی هیچ انتشار registry را ثابت نمی‌کند |

## tag در برابر digest

tag یک نام قابل ارجاع است. Image ID محلی را نباید به جای registry digest در `image@sha256:...` گذاشت. برای digest registry باید artifact واقعاً منتشر و پاسخ registry ثبت شود. انتشار این image انجام نشده است.

## انتقال دوباره

برای نسخهٔ آینده از archive و tag تازه و مسیر staging انتقال استفاده کنید. فایل نیمه‌کاره را به‌عنوان فایل نهایی معرفی نکنید. پس از برابر بودن checksum و load، image فعال container را نیز جدا کنترل کنید؛ وجود tag جدید، تعویض سرویس قبلی را اثبات نمی‌کند.

اگر image منتشر نشده، `pull` از همان نام ممکن است شکست بخورد. استقرار ثبت‌شده به image از قبل load‌شده و `--pull never` تکیه دارد. push کردن Git نیز image را خودکار منتشر یا سرور را deploy نمی‌کند.
