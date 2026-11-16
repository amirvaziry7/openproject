# ۱۳ ـ راهبری، عیب‌یابی و نگهداری آینده

[فهرست مستندات](README.md)

## ترتیب عیب‌یابی

قبل از تغییر فایل یا داده، محیط، نسخهٔ واقعی image، زبان انتخاب‌شده و نوع مسئله را تعیین کنید. شباهت نام container یا tag کافی نیست. مشاهدهٔ HTTP 200 نیز به معنی صحت همهٔ JavaScriptها و پردازش‌های پس‌زمینه نیست.

روی Production ثبت‌شده، مشاهدهٔ محدود:

```sh
cd /opt/apps/openproject
docker compose -p openproject ps
docker compose -p openproject logs --tail=100 web worker cron
docker compose -p openproject exec -T web curl --fail http://localhost:8080/health_checks/default
```

برای بررسی config از `config --quiet` استفاده کنید. خروجی کامل `config` ممکن است رمزها را باز کند و نباید در چت، issue یا فایل عمومی قرار بگیرد.

## مشکلات متداول

| نشانه | علت‌های قابل بررسی | اقدام مناسب |
| --- | --- | --- |
| همهٔ labelها انگلیسی هستند | ترجیح کاربر، Accept-Language، session یا image قدیمی | انتخاب `ui_language=fa`، بررسی `html lang` و image فعال |
| dropdown فارسی ندارد | فهرست زبان‌های ذخیره‌شده، قالب قدیمی | بررسی تنظیم زبان instance و version؛ همهٔ localeها را حذف نکنید |
| بعد از refresh زبان تغییر می‌کند | session/cookie یا مسیر متفاوت | درخواست و cookie همان مرورگر را بررسی کنید؛ رمز کاربر را reset نکنید |
| صفحه فارسی است اما فونت قبلی دیده می‌شود | asset، CSS override یا lang نادرست | Network فونت و computed style و fingerprint را کنترل کنید |
| لوگو زمینهٔ سفید دارد | alias یا embedded قدیمی، cache یا image قبلی | hash PNG سرو‌شده و مصرف‌کنندهٔ SVG/HTML را بررسی کنید |
| متن OpenProject هنوز دیده می‌شود | دادهٔ کاربر، متن welcome قدیمی یا شناسهٔ فنی | ابتدا منبع متن را تشخیص دهید؛ replace سراسری انجام ندهید |
| تاریخ شمسی نیست | مسیر خارج از formatter مشترک، locale انگلیسی، ورودی native | locale و component را پیدا کنید و دامنهٔ فصل تقویم را بخوانید |
| تاریخ در ذخیره یک روز جابه‌جا می‌شود | timezone یا parse به‌جای تبدیل روز | منطقهٔ زمانی کاربر و UTC round-trip را بررسی کنید |
| picker بعد از preview ناپدید می‌شود | DOM morph و adapter قدیمی | نسخهٔ دارای observer محدود و cleanup را کنترل کنید |
| فونت/لوگو روی سیستم درست ولی روی سرور قدیمی است | build نشده یا snapshot کهنه | manifest و image ID و build کامل را تطبیق دهید |
| `exec format` یا script not found در build | CRLF/shebang یا mode | snapshot LF و حالت اجرایی Git را بررسی کنید |
| web محلی باز نمی‌شود | internal-only network، پورت مشغول یا Docker خاموش | project و bridge web و loopback binding را بررسی کنید |
| بعد از انتخاب image، هنوز نسخهٔ قدیمی اجرا می‌شود | فایل override کنار گذاشته شده | همهٔ `-f`های واقعی یا auto-discovery را بررسی کنید |
| `pull` از GHCR شکست می‌خورد | image منتشر نشده یا دسترسی registry | این artifact از archive load شده؛ انتشار را فرض نکنید |
| login آماده نشده/connection refused | Puma هنوز boot نشده | health و log startup را بررسی کنید، سپس probe را تکرار کنید |
| probe دستی ۴۰۰ می‌گیرد | Host یا forwarded protocol با نصب سازگار نیست | Host واقعی را برای صفحه/asset بفرستید؛ allowlist را باز نکنید |

## خطای باز صفحهٔ ورود

پیام `You need to be authenticated to access this resource.` یا معادل فارسی آن برای درخواست ناشناس time-entry در مراحل staging و Production مشاهده شد. صفحهٔ ورود می‌تواند HTTP 200 داشته باشد و این page error همچنان ثبت شود.

در این کار، برای پنهان کردن پیام، احراز هویت یا مجوز API تضعیف نشد و پاسخ ۴۰۱ به ۲۰۰ تبدیل نشد. رفع مسئله نیاز به بررسی مستقل مصرف‌کنندهٔ frontend و درخواست ناشناس و آزمون مسیر ورود دارد. خطای شناخته‌شده را نباید به عنوان «مرورگر بدون خطا» گزارش کرد.

## حدود تقویم و RTL

FullCalendar label فارسی دارد، اما interval برنامه‌ریزی آن همچنان میلادی است. مسیرهای native مستقل ماژول‌ها الزاماً از picker مشترک استفاده نمی‌کنند. تمام CSSهای قدیمی، editorها، drag-and-dropها، PDFها و ایمیل‌کلاینت‌ها تأیید جامع ندارند. برای هر گزارش جدید، component و locale و نمونهٔ ورودی را ثبت کنید، نه اینکه از روی زبان صفحه نتیجه بگیرید تمام زیرسیستم‌ها پوشش دارند.

## نگهداری ترجمه، لوگو و مجوزها

- ترجمهٔ Crowdin را با patch fork merge کنید؛ فایل فارسی را کامل با upstream جایگزین نکنید.
- منابع generated را از منبع اصلی دوباره تولید کنید.
- فونت و `OFL.txt` و انتساب `jalaali-js`/MIT را نگه دارید.
- هنگام تعویض لوگو همهٔ aliasها، embedded SVG/HTML و ابعاد را هماهنگ کنید.
- متن کاربر و دادهٔ قدیمی را با ترجمهٔ locale اشتباه نگیرید.
- namespace، API، URL، OAuth UID و copyright را برای برند rename نکنید.

## روند تغییر بعدی

1. شاخه و status Git را بررسی کنید؛ تغییر کاربر را بازنویسی نکنید.
2. از baseline صحیح release شروع کنید و scope تغییر را مشخص کنید.
3. تست مرتبط، ممیزی و lint خطوط تغییر را اجرا و نتیجهٔ واقعی ثبت کنید.
4. اگر کد/asset عوض شد build کامل با tag تازه بگیرید؛ یک tag تثبیت‌شده را بازنویسی نکنید.
5. manifest، image ID، نسخهٔ ابزارها و محدودیت آزمون را ثبت کنید.
6. روی staging یا restore مستقل کنترل کنید؛ برای schema تازه پشتیبان و برنامهٔ بازیابی تازه لازم است.
7. commit و push و انتشار image و استقرار را مطابق مجوز همان درخواست انجام دهید.

برای پیام commit، عنوان کمتر از ۷۲ کاراکتر، خط خالی و توضیح اثر/اعتبارسنجی رعایت شود. commit ساختن با push کردن یا انتشار image یکسان نیست.

## چه چیزی وارد Git نشود؟

رمزها، `.env` واقعی، کلید خصوصی، browser storage state، dump، آرشیو دادهٔ واقعی، config resolved دارای secret و لاگ خام خصوصی. فایل‌های زیر `tmp/` شواهد عملیاتی‌اند، نه منبع کد. فقط نتیجهٔ بدون اطلاعات محرمانه را در مستندات نگه دارید.

## مدیریت خطا و rollback

برای خطای ظاهری هم‌پایه، ابتدا image و asset و cache را کنترل کنید. برای شکست پس از تغییر schema، image قدیمی را مستقیم به دیتابیس جدید وصل نکنید. برای بازگشت این استقرار، [فرایند نسخهٔ 17.6](12-backup-and-rollback.md) را اجرا کنید و دادهٔ ثبت‌شده پس از ارتقا را قبل از restore لحاظ کنید.

این مجموعهٔ راهنما در زمان تدوین هیچ command عملیاتی روی سرور اجرا نمی‌کند. بررسی زندهٔ تازه، نتیجه و تاریخ تازه می‌خواهد.
