# مستندات سامانه جامع مدیریت پروژه

این مجموعه، تغییرات فارسی‌سازی و شخصی‌سازی OpenProject، ساخت و آزمون نسخهٔ سفارشی و استقرار آن را به تفکیک موضوع توضیح می‌دهد. مخاطب آن توسعه‌دهنده، مدیر سامانه و مسئول استقرار است.

**تاریخ تدوین:** ۲۰۲۶-۱۱-۱۶. **آخرین بررسی واقعی ثبت‌شدهٔ Production:** ۲۰۲۶-۱۱-۱۴. تهیهٔ این مستندات به معنی اتصال مجدد به سرور، اجرای دوبارهٔ آزمون‌ها یا تأیید سلامت لحظه‌ای سامانه در تاریخ تدوین نیست.

این مجموعه **۵۰ فایل Markdown** دارد: یک فهرست اصلی و ۴۹ فصل. فصل‌های ۱ تا ۱۴ راهنماهای مرجع و فصل‌های ۱۵ تا ۴۹ جزئیات تخصصی‌اند؛ مطالب عملیاتیِ تاریخی از روش پیشنهادی آزمون یا تحویل آینده تفکیک شده‌اند.

## راهنمای مطالعه

| فایل | موضوع و محتوای اصلی |
| --- | --- |
| [01-project-overview.md](01-project-overview.md) | معماری، محدودهٔ تغییرات، وضعیت نهایی و تفکیک نسخهٔ پایه از شخصی‌سازی |
| [02-persian-translations.md](02-persian-translations.md) | ترجمه‌ها، پوشش منابع، ممیزی، seedها و نگهداری ترجمه |
| [03-language-selector-and-rtl.md](03-language-selector-and-rtl.md) | انتخاب فارسی/انگلیسی، اولویت زبان، session و اصلاحات راست‌چین |
| [04-vazir-font.md](04-vazir-font.md) | فونت وزیر، وزن‌ها، CSS، مجوز و آزمون بارگذاری |
| [05-logo-and-transparency.md](05-logo-and-transparency.md) | لوگوی سازمانی، حذف زمینهٔ سفید، همهٔ نسخه‌های PNG/SVG و محدودیت ابعاد |
| [06-branding-and-footer.md](06-branding-and-footer.md) | نام سامانه، متن پایین صفحات، ایمیل، پیش‌فرض‌ها و حفظ محتوای کاربران |
| [07-jalali-calendar.md](07-jalali-calendar.md) | تاریخ شمسی، تقویم انتخاب تاریخ، منطقهٔ زمانی و حفظ ISO میلادی |
| [08-docker-image-build.md](08-docker-image-build.md) | ساخت کامل ایمیج، نسخهٔ ابزارها، CRLF، manifest، انتقال و تفاوت tag/digest |
| [09-local-and-staging.md](09-local-and-staging.md) | محیط محلی، staging مستقل، دیتابیس آزمون و تمرین بازیابی |
| [10-tests-and-validation.md](10-tests-and-validation.md) | آزمون‌های واقعاً اجراشده، دستورات تکرار، شواهد و آزمون‌های انجام‌نشده |
| [11-production-deployment.md](11-production-deployment.md) | استقرار واقعی 17.6 به 18، ترتیب عملیات، سرویس‌ها و کنترل بعد از ارتقا |
| [12-backup-and-rollback.md](12-backup-and-rollback.md) | پشتیبان نهایی، تطبیق داده‌ها، نسخهٔ آمادهٔ بازیابی و دستور بازگشت |
| [13-maintenance-and-troubleshooting.md](13-maintenance-and-troubleshooting.md) | راهبری روزمره، عیب‌یابی، به‌روزرسانی بعدی و محدودیت‌های باز |
| [14-history-and-file-inventory.md](14-history-and-file-inventory.md) | commitها، روند نسخه‌ها و فهرست کامل فایل‌های تغییرکرده در شخصی‌سازی |

## راهنماهای تخصصی

فصل‌های قبلی مرجع کلی و سابقهٔ اجرا هستند. راهنماهای زیر جزئیات فنی و روش بررسی هر زیرموضوع را باز می‌کنند. برای انتخاب مسیر مطالعه از [راهنمای نقش‌ها](15-reading-paths.md) شروع کنید.

### مسیر مطالعه و جزئیات ترجمه

| فایل | موضوع |
| --- | --- |
| [15-reading-paths.md](15-reading-paths.md) | مسیر مطالعه بر اساس نقش و مسئله |
| [16-localization-pipeline.md](16-localization-pipeline.md) | جریان ترجمه از YAML تا مرورگر |
| [17-translation-quality.md](17-translation-quality.md) | قرارداد کیفیت ترجمه و ممیزی |
| [18-module-translations.md](18-module-translations.md) | ترجمه در ماژول‌ها و engineها |
| [19-seed-and-existing-content.md](19-seed-and-existing-content.md) | seed، پیش‌فرض و محتوای موجود |
| [20-language-request-session.md](20-language-request-session.md) | چرخهٔ درخواست و session انتخاب زبان |
| [21-language-settings.md](21-language-settings.md) | تنظیمات زبان instance و حساب |

### تعامل RTL و دارایی‌های بصری

| فایل | موضوع |
| --- | --- |
| [22-rtl-menu.md](22-rtl-menu.md) | منوی اصلی، resize و تعامل RTL |
| [23-rtl-forms-and-tables.md](23-rtl-forms-and-tables.md) | فرم، جدول و محتوای ترکیبی در RTL |
| [24-font-asset-lifecycle.md](24-font-asset-lifecycle.md) | چرخهٔ دارایی فونت و تشخیص cache |
| [25-logo-asset-matrix.md](25-logo-asset-matrix.md) | ماتریس مصرف لوگو و کنترل همسانی |
| [26-standalone-error-page.md](26-standalone-error-page.md) | صفحهٔ مستقل خطای ۴۲۲ |
| [27-mail-and-export-branding.md](27-mail-and-export-branding.md) | برند در ایمیل، پشتیبان و خروجی‌ها |

### جزئیات تقویم و قرارداد تاریخ

| فایل | موضوع |
| --- | --- |
| [28-frontend-date-formatting.md](28-frontend-date-formatting.md) | نمایش و parse تاریخ در frontend |
| [29-backend-date-formatting.md](29-backend-date-formatting.md) | formatter شمسی در Rails |
| [30-jalali-picker-internals.md](30-jalali-picker-internals.md) | شبکهٔ ماه‌های شمسی در date picker |
| [31-date-input-and-turbo.md](31-date-input-and-turbo.md) | تطبیق ورودی تاریخ و بازسازی Turbo |
| [32-timezone-and-iso-contract.md](32-timezone-and-iso-contract.md) | منطقهٔ زمانی و قرارداد ISO |
| [33-gantt-and-fullcalendar.md](33-gantt-and-fullcalendar.md) | گانت و FullCalendar: تفاوت مرز و label |

### ساخت، انتقال و جداسازی محیط

| فایل | موضوع |
| --- | --- |
| [34-build-snapshot-provenance.md](34-build-snapshot-provenance.md) | منشأ snapshot و تکرارپذیری build |
| [35-image-transfer-and-registry.md](35-image-transfer-and-registry.md) | انتقال image و تفاوت آن با انتشار registry |
| [36-compose-service-map.md](36-compose-service-map.md) | نقشهٔ سرویس‌های Compose و محدودهٔ عملیات |
| [37-staging-isolation.md](37-staging-isolation.md) | معیار جداسازی staging و تمرین restore |

### روش‌های آزمون و پذیرش

| فایل | موضوع |
| --- | --- |
| [38-backend-test-workflow.md](38-backend-test-workflow.md) | روش آزمون backend برای این تغییرات |
| [39-frontend-test-workflow.md](39-frontend-test-workflow.md) | روش آزمون frontend و تاریخ |
| [40-browser-acceptance.md](40-browser-acceptance.md) | پذیرش مرورگر و ثبت شواهد |

### عملیات، صحت داده و بازیابی

| فایل | موضوع |
| --- | --- |
| [41-production-preflight-and-maintenance.md](41-production-preflight-and-maintenance.md) | preflight و وقفهٔ نگهداری Production |
| [42-database-migration-verification.md](42-database-migration-verification.md) | تطبیق داده در migration نسخهٔ اصلی |
| [43-attachment-backup-integrity.md](43-attachment-backup-integrity.md) | پیوست‌ها، archive و صحت بازیابی فایل |
| [44-post-upgrade-operations.md](44-post-upgrade-operations.md) | کنترل و راهبری بعد از ارتقا |
| [45-rollback-decision.md](45-rollback-decision.md) | تصمیم بازگشت و داده‌های بعد از cutover |
| [46-known-issues-and-coverage.md](46-known-issues-and-coverage.md) | مسائل باز و ماتریس حدود پوشش |

### تاریخچه، مجوز و تحویل

| فایل | موضوع |
| --- | --- |
| [47-git-and-release-workflow.md](47-git-and-release-workflow.md) | Git، commit، همگام‌سازی و release |
| [48-licenses-and-source-tracking.md](48-licenses-and-source-tracking.md) | مجوزها و پیگیری منشأ دارایی‌ها |
| [49-change-handover-template.md](49-change-handover-template.md) | الگوی تحویل تغییر و ثبت نتیجه |

## وضعیت ثبت‌شدهٔ نهایی

| مورد | نتیجه در آخرین بررسی |
| --- | --- |
| نام نمایشی | سامانه جامع مدیریت پروژه |
| نسخهٔ برنامه | `18.0.0` |
| شاخهٔ توسعه | `feature/persian-translation` |
| آخرین commit پیاده‌سازی | `cdd80923d5b` |
| زبان‌های dropdown | فارسی و English |
| زبان پیش‌فرض پیکربندی‌شده | `fa` |
| جهت و تقویم | فارسی: RTL و شمسی؛ انگلیسی: LTR و میلادی در مسیرهای پوشش‌داده‌شده |
| فونت فارسی | Vazir نسخهٔ `30.1.0`، فایل‌های محلی WOFF2 |
| لوگو | PNG شفاف با ابعاد بومی `1054 × 1492` |
| نسخهٔ قبلی Production | `17.6.0` |
| ارتقای دیتابیس | ۸۲ migration؛ تعداد ثبت‌شده از ۲۰۸ به ۲۹۰ رسید |
| محیط اصلی | [صفحهٔ ورود فارسی](https://project.techvertex.ir/login?ui_language=fa) |

ایمیج نصب‌شده در گزارش استقرار:

```text
ghcr.io/amirvaziry7/openproject:18.0.0-fa.18-ef70aff4adc
```

این نام دارای پیشوند GHCR است، اما **انتشار ایمیج در GHCR انجام نشده است**. ایمیج از سیستم محلی به سرور منتقل و با `docker load` وارد Docker شد. tag به‌تنهایی اثبات انتشار یا شناسهٔ registry نیست.

## روش خواندن دستورات

- بلوک‌های `powershell` برای محیط Windows و ریشهٔ همین مخزن هستند، مگر مسیر دیگری مشخص شود.
- بلوک‌های `sh` برای Linux/Bash هستند؛ دستورهای Production در `/opt/apps/openproject` اجرا می‌شوند.
- دستور نمونه به معنی اجرای آن در زمان تدوین نیست؛ نتیجهٔ واقعی در فصل آزمون‌ها مشخص شده است.
- دستورات اولیه‌سازی staging را روی Production یا روی دیتابیس دارای داده اجرا نکنید.
- بازگشت پس از تغییر schema فقط با تعویض ایمیج انجام نمی‌شود؛ ابتدا فصل پشتیبان و بازگشت را بخوانید.

## حفاظت از اطلاعات

رمز SSH، رمز دیتابیس، `SECRET_KEY_BASE`، session مرورگر، dump دیتابیس و محتوای فایل‌های محیطی در این مستندات قرار نگرفته‌اند. مسیر یک فایل خصوصی صرفاً برای یافتن آن ذکر می‌شود و مجوز انتشار محتوای آن نیست. artifactهای زیر `tmp/` و فایل‌های خصوصی روی سرور، وابستگی‌های عملیاتی خارج از Git هستند و ممکن است در یک clone تازه وجود نداشته باشند.

## منابع و تقدم زمانی

مبنای این مجموعه، کد موجود، تاریخچهٔ Git، [مستندات قبلی توسعه](../docs/development/persian-localization/README.md) و گزارش‌ها و خروجی‌های ثبت‌شدهٔ استقرار است. گزارش‌های قدیمی حاوی عبارت «Production بررسی نشده» مربوط به همان مرحله‌اند؛ استقرار واقعی پس از تأیید کاربر در ۲۰۲۶-۱۱-۱۴ انجام شد. نتیجهٔ جدیدتر، ادعای تاریخی مرحلهٔ قبلی را به نتیجهٔ آزمون جدید تبدیل نمی‌کند.

مجموعهٔ حاضر گزارشی از همهٔ قابلیت‌های OpenProject نیست؛ تغییرات انجام‌شده در این fork و عملیات مرتبط با آن را مستند می‌کند.
