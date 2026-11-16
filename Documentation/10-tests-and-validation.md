# ۱۰ ـ آزمون‌ها، شواهد و حدود تأیید

[فهرست مستندات](README.md)

## اصل گزارش‌نویسی

نتیجه‌های زیر از اجرای ثبت‌شدهٔ هر مرحله‌اند. تاریخ تدوین مستندات، تاریخ اجرای دوبارهٔ تست نیست. نتایج مرحله‌های هم‌پوشان را جمع نزنید؛ مثلاً اجرای ۴۸۴ مثال Rails و اجرای بعدی ۶۱۳ مثال، لزوماً ۱۰۹۷ تست مستقل نیستند.

## نتیجه‌های ثبت‌شده

| مرحله | بررسی | نتیجه و حدود |
| --- | --- | --- |
| ممیزی اولیه | منابع فارسی | ۱۰٬۵۱۴ leaf، صفر خطا |
| ممیزی seed توسعه | منابع seed انگلیسی تولیدشده | ۱۰٬۹۱۰ leaf، صفر خطا در آن مجموعه |
| بازبینی پیش از commit، ۲۰۲۶-۱۰-۲۸ | RSpec | ۶۱۳ مثال، صفر شکست؛ دیتابیس جدا |
| همان بازبینی | frontend | ۳۸ تست، صفر شکست؛ typecheck برنامه و spec موفق |
| همان بازبینی | مرورگر ایمیج `.17` | ۳۲ بررسی: ۱۹ برند/footer و ۱۳ تقویم |
| تبدیل تقویم | مقایسهٔ Ruby/JavaScript | ۲۷٬۴۲۰ مقایسهٔ نمونه، موفق |
| بازبینی کد | lint متمرکز | ESLint روی ۸ فایل و ERB lint روی ۶ قالب موفق |
| Ruby lint | ۲۲ فایل تغییرکرده | صفر finding روی خطوط تغییر؛ ۱۳ finding قدیمی بیرون آن‌ها |
| لوگوی شفاف، `.18` | PNG/SVG/HTML/PDF | تطبیق بایت‌ها، alpha، XML و `/SMask` موفق |
| همان ایمیج | مرورگر | ۵ سناریوی لوگو موفق |
| build کامل `.18` | Docker | موفق؛ Image ID و manifest ثبت‌شده |
| ممیزی نهایی ایمیج | ترجمه | ۱۰٬۵۱۷ leaf، صفر خطا، ۷۸ مقدار فنی انگلیسی |
| تمرین بازیابی، ۲۰۲۶-۱۱-۱۴ | کپی دادهٔ واقعی | بازیابی موفق و اجرای ۸۲ migration موفق |
| همان تمرین | محتوای جداول | ۱۹۳ جدول مشترک بررسی؛ ۱۸۷ hash برابر، ۶ تبدیل تنظیمات شناخته‌شده |
| همان تمرین | مرورگر | ۱۰ مسیر/حالت ورود و صفحات احراز‌شده در دو زبان بررسی شد |
| پشتیبان نهایی Production | بازیابی قدیمی | ۲۰۳ جدول و ۵ فایل کاملاً با کپی بازیابی‌شده تطبیق یافت |
| ارتقای Production | schema | ۸۲ migration، مجموع ۲۹۰؛ migration معوق false |
| Production | مرورگر HTTPS | ورود fa/en، جهت، لوگو، وزیر و موبایل موفق؛ خطای شناخته‌شده جدا ثبت شد |
| آماده‌بودن rollback | اجرای برنامهٔ 17.6 | boot روی دیتابیس بازیابی‌شده و خواندن داده موفق |

در کنترل تغییرات Production، جدول `schema_migrations` هم به‌طور مورد انتظار تغییر می‌کند؛ این جدول دادهٔ کاربر نیست. تعداد شش جدول تنظیمات تغییرکرده در مقایسهٔ تمرین، با گزارش هفت‌تاییِ شامل جدول migration در Production تناقض ندارد.

## دامنهٔ RSpec

اجرای ترکیبی ۶۱۳ مثال حوزه‌های localization، تنظیمات، seed مدیر، backup job، header Unicode ایمیل، helper تاریخ، My work، reminder و meeting را پوشش داد. مسیرهای اصلی:

```text
spec/features/localization_spec.rb
spec/services/set_localization_service_spec.rb
spec/models/setting_spec.rb
spec/seeders/admin_user_seeder_spec.rb
spec/workers/backup_job_spec.rb
spec/mailers/interceptors/default_headers_spec.rb
spec/lib/redmine/i18n_spec.rb
spec/components/my/work/sub_header_component_spec.rb
spec/components/work_packages/reminder/modal_body_component_spec.rb
modules/meeting/spec/models/meeting_spec.rb
```

برای تکرار در محیط backend تستِ آماده، نه Production:

```sh
bundle exec rspec spec/features/localization_spec.rb spec/services/set_localization_service_spec.rb spec/models/setting_spec.rb spec/seeders/admin_user_seeder_spec.rb spec/workers/backup_job_spec.rb spec/mailers/interceptors/default_headers_spec.rb spec/lib/redmine/i18n_spec.rb spec/components/my/work/sub_header_component_spec.rb spec/components/work_packages/reminder/modal_body_component_spec.rb modules/meeting/spec/models/meeting_spec.rb --format progress
```

service `rails-tests` در Compose آزمایشی می‌تواند همین فرمان را اجرا کند، مشروط بر اینکه نسخهٔ فعلی همهٔ کد و specهای مورد نظر واقعاً داخل test image یا bind mount باشند. ایمیج slim تولید را به جای test image به کار نبرید و صرف وجود یک tag قدیمی تست را دلیل همسان بودن تمام sourceها ندانید.

## frontend و تقویم

از دایرکتوری `frontend` در PowerShell با وابستگی‌ها و pluginهای آماده:

```powershell
$env:CHROME_BIN='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm test -- --include=src/app/core/datetime/*.spec.ts --include=src/app/shared/components/datepicker/persian-calendar.plugin.spec.ts --include=src/app/core/setup/init-locale.spec.ts --browsers=chromium --headless
npm run typecheck
```

نام `ChromeHeadless` در runner استفاده‌شده پشتیبانی نمی‌شد؛ اجرای موفق از `chromium` استفاده کرد. محتوای تست شامل نوروز، کبیسه، طول ماه، رقم فارسی/عربی، تاریخ نامعتبر، timezone، round-trip، محدودیت روزها، حالت range و حفظ ISO انگلیسی بود.

در ۲۷٬۴۲۰ مقایسهٔ تبدیل، پنج روز از هر ماه در نمونه‌های سال‌های میلادی ۱۸۰۰ تا ۲۲۵۶ بررسی شدند؛ این آزمون exhaustive تمام روزهای تاریخ نیست.

## سناریوهای مرورگر

بررسی‌ها انتخاب زبان پیش از ورود، session، RTL/LTR، resize/collapse منو، ورود دسکتاپ/موبایل، برند/footer، فرم تاریخ بستهٔ کاری، مقدار نمایشی شمسی و ISO مخفی، تایپ رقم فارسی، Turbo preview، گانت و تقویم انگلیسی را در مراحل مربوط پوشش دادند.

تست تقویم نهایی روی ایمیج ساخته‌شده بدون تزریق script/style یا خاموش کردن CSP اجرا شد. تست تغییر تاریخ در preview را با ذخیرهٔ واقعی تاریخ کاربر یکی ندانید؛ در سناریوی لغو، تاریخ پایدار با reload بررسی شد که تغییر نکرده باشد.

در Production ورود با رمز یک حساب موجود انجام نشد و رمز هیچ حسابی برای تست reset نشد. بررسی صفحات احراز‌شده روی کپی جدا با حساب آزمایشی صورت گرفت؛ تست مرورگر واقعی Production به صفحهٔ ورود، زبان، دارایی‌ها و موبایل محدود بود.

## خطاهای پیدا و اصلاح‌شده

| مسئله | اقدام و نتیجه |
| --- | --- |
| CRLF اسکریپت Linux | snapshot با LF؛ build کامل موفق |
| Bundler ناسازگار | pin روی 4.0.21 |
| نبود registry/plugin frontend | تولید لینک‌ها؛ typecheck موفق |
| دانلود Chromium با ۴۰۳ | Chrome محلی از مسیر پشتیبانی‌شده |
| web روی شبکهٔ کاملاً internal در دسترس نبود | bridge مستقل فقط برای web |
| نبود helper در My work | inclusion اصلاح و تست Rails تکرار شد |
| Turbo ورودی شمسی را حذف می‌کرد | observer محدود و تست morph/replacement |
| عرض picker موبایل | اندازهٔ panel محدود و بررسی viewport باریک |
| session آزمایشی منقضی | ورود عادی دوباره، سپس تکرار موفق تست |
| تغییر شمارندهٔ migration در verifier | استثنای metadata اصلاح؛ تطبیق داده دوباره موفق |
| probe پیش از آماده شدن Puma | انتظار برای readiness و تکرار |
| درخواست asset با Host نامناسب | ارسال Host/forwarded protocol درست و تکرار |

این خطاهای setup یا verifier را نباید به عنوان شکست SQL migration نهایی گزارش کرد؛ همچنین نباید از گزارش تاریخی حذف شوند یا اجرای اولیه را موفق نامید.

## موارد تأییدنشده و باز

- کل تست‌های برنامه، تمام امکانات Enterprise و تمام مسیرهای accessibility اجرا نشده‌اند.
- تمام editorها، ادغام‌های خارجی، drag-and-dropها و رفتارهای تقویم در همهٔ ماژول‌ها پوشش کامل ندارند.
- صحت shape/فونت فارسی در همهٔ PDFها و همهٔ ایمیل‌کلاینت‌ها تأیید نشده است.
- FullCalendar planning interval همچنان میلادی است.
- در صفحهٔ ورود، خطای JavaScript درخواست ناشناس time-entry با مضمون «نیاز به احراز هویت» در هر دو زبان مشاهده شده و هنوز باز است. HTTP 200 صفحهٔ ورود به معنی رفع آن خطا نیست.
- در گزارش قدیمی npm، ۱۲ آسیب‌پذیری در درخت lockشده ثبت شد؛ dependencyها برای حذف اجباری آن‌ها تغییر داده نشدند. این عدد ادعای ممیزی امنیتی تازه در تاریخ تدوین نیست.
- lint کل مخزن پاک گزارش نشده است؛ یافته‌های قدیمی خارج از خطوط تغییر باقی مانده‌اند.

## محل شواهد

گزارش تاریخی قابل‌نسخه‌بندی: [VALIDATION.md](../docs/development/persian-localization/VALIDATION.md).

شواهد محلی خصوصی و خارج از Git شامل `tmp/persian-validation/` برای تصاویر و JSON سناریوها، `tmp/transparent-logo-checks/` برای PDF و `tmp/production-rollout/` برای مقایسهٔ داده و بررسی Production هستند. این فایل‌ها ممکن است در clone تازه نباشند؛ browser session و credential همراه شواهد نباید منتشر شود.

در این نوبت فقط مستندات بررسی می‌شوند؛ هیچ نتیجهٔ جدید RSpec، frontend یا Production به نتایج بالا اضافه نشده است.
