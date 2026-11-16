# ۳۴ ـ منشأ snapshot و تکرارپذیری build

[فهرست اصلی](README.md) · [ساخت image](08-docker-image-build.md)

## مرجع artifact

نام branch یا tag، فهرست کامل بایت‌های استفاده‌شده در build نیست. working tree می‌تواند تغییر commit‌نشده داشته باشد و ابزار build نیز ممکن است snapshot قبلی را عمداً reuse کند. برای همین manifest فایل‌ها در کنار image نگهداری شد.

| مدرک | چه چیزی را مشخص می‌کند؟ |
| --- | --- |
| commit | وضعیت ثبت‌شدهٔ Git |
| status | تفاوت working tree با وضعیت ثبت‌شده |
| source manifest | hash ورودی‌های archive |
| image ID | artifact محلی Docker |
| archive hash | فایل منتقل‌شده |
| registry digest | artifact واقعاً منتشرشده در registry |

## رفتار ابزار موجود

snapshot تازه از فایل‌های tracked با محتوای فعلی و مسیرهای صریح `EXTRA_PATHS` ساخته می‌شود. متن UTF-8 داخل archive به LF عادی‌سازی و modeهای Git لحاظ می‌شوند. دادهٔ باینری resample یا تبدیل متن نمی‌شود.

`--reuse` ورودی قدیمی را نگه می‌دارد. `--refresh` تغییرات نسبت به HEAD فعلی و مسیرهای صریح را به snapshot موجود اعمال می‌کند؛ پس از جابه‌جایی HEAD، این الزاماً مقایسه با تاریخ ساخت snapshot قدیمی نیست.

## تصمیم برای release

برای release جدید با منشأ نامطمئن، snapshot کامل تازه بسازید. پیش از build تغییرهای موردنظر و فایل‌های جدید را کنترل کنید؛ برای وارد شدن یک فایل، secret را به Git اضافه نکنید.

در artifact `.18`، لوگوی شفاف هنگام build روی پایهٔ `ef70aff4adc` وجود داشت و بعداً در `cdd80923d5b` ثبت شد. ثبت این تفاوت از نسبت دادن نادرست تمام ورودی‌ها به نام tag جلوگیری می‌کند. checksumهای دقیق در فصل ۸ مرجع هستند.
