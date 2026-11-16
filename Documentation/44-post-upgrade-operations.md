# ۴۴ ـ کنترل و راهبری بعد از ارتقا

[فهرست اصلی](README.md) · [نقشهٔ سرویس‌ها](36-compose-service-map.md)

## ترتیب مشاهده

ابتدا health و وضعیت web را ببینید، سپس worker/cron و ورودی عمومی را بررسی کنید. پاسخ login موفق به‌تنهایی پردازش jobها یا همکاری اشتراکی را ثابت نمی‌کند. نسخهٔ واقعی image هر app service نیز باید با candidate نصب‌شده تطبیق داشته باشد.

```sh
cd /opt/apps/openproject
docker compose -p openproject ps
docker compose -p openproject logs --tail=100 web worker cron
docker compose -p openproject exec -T web curl --fail http://localhost:8080/health_checks/default
```

این فرمان‌های مشاهده نیاز به اجرای seeder ندارند. لاگ‌ها می‌توانند خصوصی باشند؛ پیش از اشتراک، اطلاعات حساس را حذف کنید.

## restart هم‌نسخه

```sh
cd /opt/apps/openproject
docker compose -p openproject up -d --no-deps --pull never web worker cron
```

این الگو به image موجود و override فعال تکیه دارد و جای فرایند ارتقای schema جدید نیست. اگر فایل‌های `-f` را صریح می‌دهید، override را کنار نگذارید.

## ارزیابی بعد از باز شدن دسترسی

| بخش | نمونهٔ کنترل |
| --- | --- |
| حساب | ورود با حساب مجاز، بدون reset برای تست |
| زبان | فارسی و انگلیسی و حفظ session |
| داده | پروژه، بستهٔ کاری و پیوست مورد انتظار |
| پردازش | وضعیت worker و خطای startup |
| ظاهر | فونت، لوگو، footer و موبایل |

در عملیات ثبت‌شده، سلامت و شمار داده‌ها و مرورگر واقعی کنترل شدند؛ ورود با رمز حساب موجود Production انجام نشد. صفر restart در آن بازه، تضمین عدم نیاز به پایش بعدی نیست. تاریخ هر بررسی تازه را کنار نتیجه بنویسید.
