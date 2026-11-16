# ۱۶ ـ جریان ترجمه از YAML تا مرورگر

[فهرست اصلی](README.md) · [مرور ترجمه‌ها](02-persian-translations.md)

## دو مصرف‌کنندهٔ یک منبع

Rails متن template، خطای فرم و پیام‌های backend را از I18n می‌گیرد. frontend به JSON تولیدشده از منابع ترجمه نیاز دارد. ویرایش YAML بدون تولید مجدد asset می‌تواند وضعیتی بسازد که صفحهٔ server-rendered اصلاح شده ولی بخش JavaScript هنوز قدیمی است.

```text
English/Farsi YAML → بارگذاری Rails
                  → export locale → frontend JSON → build asset → image → browser
```

| نقطه | بررسی لازم |
| --- | --- |
| YAML اصلی | کلید، nesting، encoding و placeholder |
| engine ماژول | ثبت و بارگذاری locale همان ماژول |
| export | حضور کلید در خروجی تولیدشده |
| build | استفاده از snapshot جدید و خروجی locale واقعی |
| مرورگر | image فعال، asset fingerprint و locale انتخاب‌شده |

## روش دنبال کردن یک کلید

1. متن یا کلید را با `rg` در منابع اصلی و ماژول‌ها پیدا کنید.
2. تشخیص دهید مصرف‌کننده ERB/Ruby است یا TypeScript.
3. معادل `fa` و منبع `en` را در همان سطح تطبیق دهید.
4. ممیزی را اجرا و برای frontend، export/build مربوط را تکرار کنید.
5. مسیر مصرف‌کننده را در هر دو زبان ببینید؛ وجود مقدار در فایل کافی نیست.

```sh
rg -n 'institutional_footer' config/locales app/views
bundle exec rails assets:export_locales
```

فرمان export برای محیط توسعه/ساخت آماده است؛ در این نوبت اجرا نشده است. خروجی `frontend/src/locales/` فایل مرجع ویرایش نیست و می‌تواند در build دوباره تولید شود.

## تمایز خطاها

اگر backend و frontend هر دو قدیمی‌اند، ابتدا image و snapshot را بررسی کنید. اگر فقط frontend قدیمی است، export، build و cache asset محتمل‌ترند. اگر فقط یک ماژول مشکل دارد، محل locale و ثبت engine همان ماژول را بررسی کنید. اصلاح هم‌زمان همهٔ این لایه‌ها بدون تشخیص، منشأ مسئله را پنهان می‌کند.
