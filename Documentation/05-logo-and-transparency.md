# ۰۵ ـ لوگوی سازمانی و شفاف‌سازی

[فهرست مستندات](README.md)

## ورودی، خروجی و ابعاد

لوگوی ارسالی کاربر جایگزین لوگوی پیش‌فرض در مصرف‌کننده‌های مرتبط شد. فایل اصلی کاربر بازنویسی نشد. بعداً زمینهٔ سفید لوگو با ابزار داخلی ویرایش تصویر و خروجی شفاف حذف شد.

| مشخصه | ورودی اولیه | خروجی نصب‌شده |
| --- | --- | --- |
| ابعاد بومی | `1060 × 1500` | `1054 × 1492` |
| ساختار | PNG با زمینهٔ سفید | PNG از نوع RGBA با alpha واقعی |
| نقش | فایل مرجع ارسالی | دارایی اصلی و همهٔ aliasهای همسان |

مسیر دارایی اصلی: [university_logo.png](../app/assets/images/university_logo.png).

ابعاد خروجی ابزار اندکی با ورودی فرق دارد؛ ادعای حفظ پیکسل‌به‌پیکسل یا ابعاد یکسان با ورودی مطرح نشده است. دارایی نهایی بدون resample مجدد در نسخه‌های همسان کپی شد. برای استفادهٔ فعلی، نسبت تصویر باید حفظ شود؛ اندازهٔ CSS با ابعاد بومی PNG یکسان نیست.

## مصرف‌کننده‌های PNG

تمام ده فایل زیر بایت‌های PNG شفاف یکسان دارند:

1. `app/assets/images/university_logo.png`
2. `app/assets/images/logo_openproject.png`
3. `app/assets/images/logo_openproject_white_big.png`
4. `app/assets/images/logo-black-bg-ua.png`
5. `app/assets/images/logo-white-bg-ua.png`
6. `app/assets/images/apple-touch-icon-120x120.png`
7. `app/assets/images/development/apple-touch-icon-120x120.png`
8. `app/assets/images/styleguide/logo_openproject.png`
9. `modules/bim/app/assets/images/bim/logo_openproject_bim_big.png`
10. `modules/bim/app/assets/images/bim/logo_openproject_bim_big_coloured.png`

نام قدیمی مانند `120x120` در این پیاده‌سازی به معنی resize شدن فایل به آن ابعاد نیست؛ همان PNG پرتره استفاده شده است. اگر بعداً icon اختصاصی با سایز استاندارد لازم شد، آن را به‌عنوان تغییر جدا با آزمون نمایش در دستگاه هدف آماده کنید.

## SVG، favicon و خطای مستقل

این پنج مصرف‌کننده PNG جدید را به‌صورت embedded/base64 در خود دارند:

- `app/assets/images/icon_logo.svg`
- `app/assets/images/icon_logo_white.svg`
- `app/assets/images/logo_openproject_narrow.svg`
- `public/favicon.svg`
- `public/422.html`

چهار SVG فایل wrapper هستند؛ artwork اصلی به وکتور واقعی تبدیل نشده است. `viewBox` و ابعاد بومی آن‌ها با `1054 × 1492` هماهنگ شد. فایل HTML خطای ۴۲۲ مستقل از layout اصلی است و لوگوی داخلی آن جداگانه به‌روز شد.

ICOهای موجود از قبل alpha شفاف داشتند و به‌عنوان نسخهٔ سفید همین فایل شناسایی نشدند؛ تغییر نکردند. favicon اصلی برنامه از SVG جدید استفاده می‌کند.

## نحوهٔ نمایش در رابط

در صفحهٔ ورود، کلاس `.op-institution-logo` ارتفاع `180px`، عرض خودکار، `max-width: 100%` و `object-fit: contain` دارد تا لوگوی کامل بدون کشیدگی دیده شود. header از ناحیهٔ موجود خود استفاده می‌کند و نسخهٔ موبایل/منو از assetهای متناظر استفاده می‌کند.

مسیرهای قالب و انتخاب پیش‌فرض لوگو در `app/views/account/login.html.erb`، `app/views/common/_favicons.html.erb` و `lib/open_project/custom_styles/design.rb` تغییر کرده‌اند. لوگوی سفارشی ذخیره‌شدهٔ یک نصب ممکن است بر پیش‌فرض‌ها اولویت داشته باشد؛ وجود آن را با مدیریت ظاهر بررسی کنید.

## شفاف‌سازی و منشأ

ویرایش با `transparent_background: true` انجام شد. حذف زمینه شامل حاشیهٔ بیرونی و فضای سفید داخل نشان و میان حروف بود. رنگ آبی و خوشنویسی باید در بازبینی بصری حفظ شوند؛ checkerboard چاپ‌شده جای alpha واقعی نیست.

متن دقیق دستور ابزار و روش استخراج در [ثبت اصلی شفاف‌سازی](../docs/development/persian-localization/transparent-logo.md) موجود است.

```text
SHA256 ورودی:
d2b5d783f378e504ab03c34c0b07f12040b7ebd785acf7d2b8651823c6467abc

SHA256 PNG شفاف:
8cd1ee92a27ace0f75bc3d864e30bf606505e72bf30f6a8830fe3c0e23b4c50d
```

## بررسی‌های اجراشده

- هر ده PNG به RGBA decode شدند؛ بازهٔ alpha برابر صفر تا ۲۵۵ و گوشه‌ها شفاف بود.
- payload هر پنج مصرف‌کنندهٔ embedded با فایل اصلی همسان بود.
- ساختار XML و ابعاد SVGها بررسی شد.
- جاسازی PNG در PDF با Prawn موفق بود و `/SMask` مربوط به alpha وجود داشت.
- پنج سناریوی مرورگر شامل ورود دسکتاپ، انگلیسی، خطای مستقل، موبایل/منو و صفحات احراز‌شده بررسی شد.
- در Production، hash لوگوی سرو‌شده در بررسی داخلی و بارگذاری لوگو در مرورگر HTTPS واقعی تأیید شد.

آزمون جاسازی alpha در PDF، تأیید کامل فونت و شکل‌دهی فارسی در تمام خروجی‌های PDF نیست.

## نگهداری

هنگام تعویض آینده، فایل مرجع، PNGها، payloadهای embedded، ابعاد SVG، صفحهٔ ۴۲۲ و مصرف‌کنندهٔ PDF را با هم بازبینی کنید. روی زمینهٔ روشن، تیره و header آبی بررسی کنید. پس از build، بایت asset سرو‌شده را با فایل مرجع مقایسه کنید؛ مشاهدهٔ لوگوی درست در checkout به‌تنهایی برای تأیید ایمیج کافی نیست.
