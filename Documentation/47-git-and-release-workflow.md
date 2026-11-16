# ۴۷ ـ Git، commit، همگام‌سازی و release

[فهرست اصلی](README.md) · [تاریخچهٔ ثبت‌شده](14-history-and-file-inventory.md)

## چهار عملیات مستقل

| عملیات | نتیجه |
| --- | --- |
| commit | ثبت فایل‌ها در تاریخچهٔ محلی |
| push | ارسال تاریخچه به مخزن remote |
| انتشار image | قرار گرفتن artifact در registry |
| deploy | اجرای artifact روی محیط هدف |

موفقیت یکی، سه مورد دیگر را اثبات نمی‌کند. در این کار commitهای پیاده‌سازی روی شاخهٔ `feature/persian-translation` به مخزن کاربر push شدند، ولی image سفارشی در GHCR منتشر نشد و از archive منتقل شد.

## آماده‌سازی commit تازه

```sh
git status --short --branch
git diff --stat
git diff --check
```

برای فایل‌های untracked، diff معمولی به‌تنهایی بررسی محتوای آن‌ها نیست؛ فایل‌ها و فهرست دقیق مورد ثبت را نیز بازبینی کنید. artifact خصوصی و env را برای راحتی انتخاب فایل‌ها stage نکنید.

عنوان commit کمتر از ۷۲ کاراکتر، سپس خط خالی و توضیح اثر و اعتبارسنجی داشته باشد. نمونهٔ صرفاً پیشنهادی برای مستندات:

```text
docs: expand Persian localization and operations guides

Document implementation details, validation evidence and recovery limits.
```

## قبل از release

revision و status ساخت، tag تازه، manifest و نتایج آزمون کنار هم ثبت شوند. working tree دارای تغییر را به‌اشتباه build دقیق یک commit معرفی نکنید. publish/push/deploy تازه باید در محدودهٔ مجوز همان درخواست باشد؛ در این نوبت گسترش مستندات هیچ‌یک اجرا نشده‌اند.
