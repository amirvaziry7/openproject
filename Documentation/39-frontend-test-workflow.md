# ۳۹ ـ روش آزمون frontend و تاریخ

[فهرست اصلی](README.md) · [ماتریس تقویم](30-jalali-picker-internals.md)

## آماده‌سازی

نسخهٔ Node/npm، نصب lockfile و ثبت pluginها باید با checkout هماهنگ باشد. در Windows، مولد plugin ممکن است به junction نیاز داشته باشد؛ فایل registry تولیدشده نباید با لینک‌های ناسازگار رها شود.

فرمان ثبت‌شده برای مجموعهٔ تاریخ، از دایرکتوری `frontend`:

```powershell
$env:CHROME_BIN='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm test -- --include=src/app/core/datetime/*.spec.ts --include=src/app/shared/components/datepicker/persian-calendar.plugin.spec.ts --include=src/app/core/setup/init-locale.spec.ts --browsers=chromium --headless
npm run typecheck
```

این دستور روش تکرار است؛ اکنون اجرا نشده است. نام `chromium` و override فایل اجرایی Chrome با runner استفاده‌شده سازگار بودند؛ نام نامعتبر browser می‌تواند قبل از اجرای تست شکست ایجاد کند.

## ماتریس رفتار

| گروه | نمونهٔ سناریو |
| --- | --- |
| تبدیل | نوروز، طول ماه، کبیسه |
| ورودی | رقم فارسی/عربی، مقدار خالی و نامعتبر |
| serialization | ISO میلادی و حفظ ASCII |
| datetime | ساعت عصر و مرز روز timezone |
| picker | range، min/max، disabled و روز کاری |
| رگرسیون DOM | morph و replacement فرم |
| انگلیسی | حفظ نمایش و picker قبلی |

## گزارش

نتیجهٔ ۳۸ تست قبلی، تأیید مجموعهٔ مشخص همان مرحله است، نه تمام frontend. typecheck نیز رفتار بصری را ثابت نمی‌کند. برای یک تغییر جدید، تست مرتبط و سناریوی مرورگر مکمل لازم‌اند؛ screenshot به‌تنهایی parse و مقدار payload را تأیید نمی‌کند.
