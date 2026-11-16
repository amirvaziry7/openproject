# ۱۲ ـ پشتیبان، صحت داده و بازگشت به 17.6

[فهرست مستندات](README.md)

## هدف و محدودیت بنیادی

پشتیبان برای بازیابی در صورت مشکل است، نه تضمین اینکه هیچ تغییر نسخه‌ای هرگز خطا نمی‌دهد. ارتقای 17.6 به 18 schema را تغییر داده است؛ **تعویض صرف image به 17.6، rollback معتبر نیست**.

در این عملیات، دیتابیس و پیوست‌های نسخهٔ قدیمی در مقصد جدا restore شدند تا بازگشت به جای بازنویسی یا حذف دیتابیس ارتقایافته، از آن کپی آماده استفاده کند. نسخهٔ ۱۸ و فایل‌های فعلی برای بررسی و تطبیق باقی می‌مانند.

## محل ثبت‌شده

```text
/opt/apps/openproject/rollout-fa-20261114T183957Z
```

دایرکتوری خصوصی با mode `0700` ساخته شد. فایل resolved و env، حتی اگر پسوند JSON/YAML داشته باشند، می‌توانند رمز داشته باشند؛ آن‌ها را به Git یا محتوای مستندات اضافه نکنید.

## اقلام پشتیبان

| فایل یا مقصد | نقش |
| --- | --- |
| `openproject.initial.dump` | snapshot اولیه در زمان فعال بودن نصب، برای تمرین |
| `assets.initial.tar.gz` | پیوست‌های مرحلهٔ اولیه |
| `openproject.cold.dump` | dump نهایی سازگار بعد از توقف writerهای OpenProject |
| `assets.cold.tar.gz` | پیوست‌های نهایی با metadata و ACL |
| `backup.cold.sha256` / `.json` | checksum دو فایل cold |
| فایل اصلی Compose و `.env` پشتیبان | تنظیمات نسخهٔ قبل؛ خصوصی |
| `compose.resolved.json` | config کامل قبلی؛ خصوصی |
| `rollback17.resolved.private.json` | config آمادهٔ نسخهٔ قدیمی و مقصد restore |
| `openproject-17.6.0-rollback.tar` | image قبلی برای بازیابی آفلاین |
| `rollback-image.sha256` | checksum archive تصویر قدیمی |
| `recovery17/assets` | کپی بازشدهٔ پیوست قدیمی |
| دیتابیس `openproject_recovery17_20261114191523` | کپی قابل‌استفادهٔ schema و دادهٔ 17.6 |
| `live_rollout.py` و `live-state.json` | helper و وضعیت اجرای همان عملیات تاریخی |

helper فقط روی همان سرور و با همان فایل‌های خصوصی آماده شده است؛ در clone تازهٔ Git وجود ندارد. نبود helper یا dump را با ایجاد یک فایل خالی یا استفاده از فایل نمونه جبران نکنید.

## چرا دو پشتیبان گرفته شد؟

پشتیبان اولیه برای تمرین ارتقا مناسب بود، اما ممکن بود کاربران بعد از آن داده ثبت کنند. به همین دلیل، پس از تأیید ارتقا و توقف فقط writerهای برنامه، backup نهایی گرفته شد. کپی مستقیم directory دیتابیس PostgreSQL در حال اجرا به جای logical dump انجام نشد.

پس از گرفتن پشتیبان، checksum فایل‌ها بررسی شد، dump قابل‌خواندن بود و restore واقعی در دیتابیس جدا انجام شد. صحت فهرست archive به‌تنهایی معادل موفقیت restore نیست؛ در این مورد هر دو بررسی صورت گرفتند.

## تطبیق داده

1. پس از توقف writerها، snapshot محتوایی از ۲۰۳ جدول گرفته شد.
2. dump در دیتابیس recovery مستقل داخل همان PostgreSQL restore شد.
3. تعداد و hash تمام محتوای ردیف‌ها با snapshot قبل یکسان بود.
4. SHA256 هر پنج فایل پیوست با کپی restore یکسان بود.
5. بعد از migration، ستون‌های مشترکِ داده‌های اصلی با همان دیتابیس recovery مقایسه شدند.
6. تغییر جدول یا انتقال داده به ساختار تازه، جدا با بررسی رابطه‌ها کنترل شد.

نمونهٔ مهم، انتقال ۲۳۴۴ transition قدیمی به ساختار جدید workflow است. مقایسهٔ سادهٔ count جدول قدیمی `workflows` با جدول جدیدِ هم‌نام، بدون لحاظ جدول transition جدید، گزارش گمراه‌کنندهٔ حذف داده می‌داد. ارتباط project/type و حالت فعال ویکی هم با ساختار جدید تطبیق داده شدند.

ردیف‌های permission و تنظیمات و شمارندهٔ migration از تغییرات مورد انتظار نسخهٔ اصلی‌اند. تطبیق داده به معنی برابری تمام بایت‌های schema قدیم و جدید نیست.

## آزمون واقعی آمادگی بازگشت

برنامهٔ واقعی 17.6.0 در container موقت با image قبلی، دیتابیس recovery و پیوست‌های recovery boot شد. نسخه و ۲۰۸ migration و امکان خواندن ۹ رکورد users، ۵ پروژه، ۴۱ بستهٔ کاری و ۵ پیوست تأیید شد.

برای جلوگیری از آمیختن cache دو نسخه، probe قدیمی از file cache مستقل استفاده کرد. این probe اثبات boot شدن config بازیابی است؛ **یک rollback واقعی Production اجرا نشده است**.

## دستور بررسی فایل‌های همان backup

این فرمان‌ها فقط صحت archiveهای همان تاریخ را بررسی می‌کنند و عملیات بازگشت نیستند:

```sh
cd /opt/apps/openproject/rollout-fa-20261114T183957Z
sha256sum --check backup.cold.sha256
sha256sum --check rollback-image.sha256
```

کپی dump و پیوست cold روی سیستم محلی هم در `tmp/production-rollout` نگه داشته و SHA256 آن با سرور تطبیق داده شد. این امر جای برنامهٔ منظم offsite backup و کنترل بازیابی آینده را نمی‌گیرد.

## شرط حیاتی بعد از فعال‌سازی ۱۸

هر اطلاعاتی که **بعد از زمان cold backup** در نسخهٔ ۱۸ ثبت شود، داخل snapshot قدیمی نیست. باقی نگه داشتن دیتابیس ۱۸ مانع حذف فیزیکی آن داده‌ها می‌شود، اما آن‌ها را خودکار در برنامهٔ 17.6 نشان نمی‌دهد.

پیش از rollback بعد از استفادهٔ کاربران باید داده‌های جدید شناسایی، پشتیبان گرفته و روش نگهداری/تطبیق آن‌ها تصمیم‌گیری شود. هیچ merge خودکار cross-version در helper آماده‌شده وجود ندارد. تایید قبلی ارتقا، توجیه بازنویسی کورکورانهٔ داده‌های تازه نیست.

## دستور بازگشت آماده‌شده

فقط برای مسئول عملیات، روی همان سرور، بعد از بررسی بند قبل و تأیید بازگشت:

```sh
set -eu
cd /opt/apps/openproject
rollbackDir=/opt/apps/openproject/rollout-fa-20261114T183957Z
test "$(cat /opt/apps/openproject/.persian-rollout-path)" = "$rollbackDir"
test -s "$rollbackDir/live_rollout.py"
cd "$rollbackDir"
sha256sum --check backup.cold.sha256
sha256sum --check rollback-image.sha256

# Only if the pinned original image is missing from Docker's local store:
# docker image load --input "$rollbackDir/openproject-17.6.0-rollback.tar"

ACK_POST_CUTOVER_RESTORE=1 python3 "$rollbackDir/live_rollout.py" rollback
python3 "$rollbackDir/live_rollout.py" status
```

متغیر `ACK_POST_CUTOVER_RESTORE=1` تأیید آگاهانهٔ restore بعد از باز شدن دسترسی عمومی است؛ اسکریپت بدون آن از این حالت جلوگیری می‌کند. تنظیم آن، داده‌های تازه را به snapshot قدیمی merge نمی‌کند.

کنترل فایل `.persian-rollout-path` عمدی است: helper این مسیر را می‌خواند. اگر عملیات جدیدتری pointer را تغییر داده باشد، این دستورهای تاریخ‌دار نباید بدون بازبینی برای rollback استفاده شوند. `set -e` باعث می‌شود شکست کنترل مسیر یا checksum ادامهٔ دستورها را متوقف کند.

### کارهایی که helper انجام می‌دهد

1. فقط سرویس‌های OpenProject را متوقف می‌کند.
2. از دیتابیس ارتقایافته dump تازهٔ پیش از rollback می‌گیرد.
3. config فعال را به image دقیق قدیمی، دیتابیس recovery و کپی پیوست قدیمی هدایت می‌کند.
4. web/worker/cron قدیمی و proxy/hocuspocus موجود را اجرا می‌کند.

دیتابیس ۱۸ با نام اصلی و پیوست‌های فعال اصلی حذف یا reset نمی‌شوند. دیتابیس PostgreSQL و volume آن نیز recreate نمی‌شوند. با این حال snapshot recovery پس از شروع برنامهٔ قدیمی دیگر ثابت نمی‌ماند و می‌تواند نوشتن‌های جدید نسخهٔ برگشتی را دریافت کند؛ رفت‌وبرگشت مکرر بدون برنامهٔ داده انجام ندهید.

## کنترل پس از بازگشت

- نسخه باید 17.6 و اتصال برنامه باید به دیتابیس recovery ثبت‌شده باشد.
- health، ورود، دسترسی کاربران، فایل‌ها و پردازش کارها بررسی شود.
- حساب‌های موجود و داده‌های snapshot باید قابل مشاهده باشند.
- jobهای پشتیبان که نام `openproject` را hardcode کرده‌اند باید به نام دیتابیس فعال recovery تطبیق داده شوند؛ صرف فعال بودن container PostgreSQL کافی نیست.
- دیتابیس ۱۸ و dump پیش از rollback تا پایان بررسی دادهٔ جدید حفظ شوند.

## update هم‌پایه با این rollback فرق دارد

برای تغییر ترجمه/asset روی schema یکسان، rollback معمولاً می‌تواند تعویض image بدون restore دیتابیس باشد. این روش را به ارتقای ۸۲ migration این استقرار تعمیم ندهید. هر release بعدی باید baseline، schema و مسیر بازیابی خودش را داشته باشد.
