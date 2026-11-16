# ۰۸ ـ ساخت و انتقال ایمیج Docker

[فهرست مستندات](README.md)

## فرایند پشتیبانی‌شده

ایمیج کامل از [Dockerfile تولید](../docker/prod/Dockerfile) و target `slim` ساخته شد. build، gemها و وابستگی‌های frontend را نصب، pluginها را ثبت، ترجمه‌ها را export و assetهای Production را compile می‌کند. دیتابیس build از نوع `nulldb` است؛ ساخت ایمیج به اطلاعات Production نیاز ندارد.

| ابزار | نسخه/شرط در build ثبت‌شده |
| --- | --- |
| Ruby | `4.0.7`؛ مطابق `.ruby-version` |
| Bundler | `4.0.21`؛ مطابق lockfile و pin اصلاح‌شدهٔ Dockerfile |
| Node.js | شرط پروژه `^24.15.0`؛ Docker build ثبت‌شده `24.19.0` |
| npm | سری `11.x`؛ Docker build ثبت‌شده `11.19.0` |
| پلتفرم | `linux/amd64` |

این‌ها نسخه‌های ثبت‌شده در فرایندند؛ پیش از build آینده، فایل‌های همان revision و نسخهٔ واقعی محیط را بررسی کنید. Ruby/Bundler اولیهٔ میزبان Windows با نیاز پروژه هماهنگ نبود؛ اجرای موفق backend داخل Docker انجام شد.

## علت ابزار آماده‌سازی Windows

build مستقیم اولیه به علت shebang با پایان خط CRLF نتوانست اسکریپت Linux را اجرا کند. [prepare_docker_context.py](../script/i18n/prepare_docker_context.py) یک archive کنترل‌شده می‌سازد:

- فایل‌های tracked را با محتوای فعلی checkout می‌خواند.
- executable mode ثبت‌شده در Git و symlink را لحاظ می‌کند.
- متن UTF-8 را فقط داخل archive از CRLF به LF تبدیل می‌کند.
- بایت فایل باینری را تغییر نمی‌دهد.
- مسیرهای جدید مشخص در `EXTRA_PATHS` را اضافه می‌کند.
- manifest با SHA256 هر ورودی تولید می‌کند.

فایل جدیدی که نه tracked باشد و نه در `EXTRA_PATHS`، الزاماً وارد build نمی‌شود. فایل خصوصی را برای حل این مسئله stage نکنید. از این ابزار به‌صورت هم‌زمان روی یک `tmp/persian-build` استفاده نکنید.

## دستور ساخت روی Windows

از ریشهٔ مخزن، برای نسخهٔ جدید یک tag تازه انتخاب کنید؛ tag منتشر/نصب‌شدهٔ موجود را بازنویسی نکنید:

```powershell
git status --short
ruby --version
bundle --version
node --version
npm --version
docker version

$candidateImage = 'ghcr.io/amirvaziry7/openproject:18.0.0-fa.YYYYMMDD-REVISION'
python script/i18n/prepare_docker_context.py --build --tag $candidateImage
docker image inspect $candidateImage
docker run --rm --network none $candidateImage ruby script/i18n/check_persian
```

`YYYYMMDD-REVISION` نمونه است؛ پیش از اجرا با شناسهٔ واقعی نسخه جایگزین شود. خروجی‌ها در `tmp/persian-build/source.tar`، `source-manifest.json` و `build.log` قرار می‌گیرند.

### انتخاب snapshot

| حالت | رفتار |
| --- | --- |
| بدون گزینهٔ reuse/refresh | snapshot تازه از فایل‌های Git و مسیرهای صریح |
| `--refresh --build` | به‌روزرسانی snapshot قبلی از diff نسبت به HEAD و مسیرهای صریح |
| `--reuse --build` | ساخت عمدی همان snapshot قبلی |

پس از تغییر HEAD، `--refresh` الزاماً همهٔ تفاوت‌های snapshot قدیمی با commit تازه را پیدا نمی‌کند. برای release جدید یا شک دربارهٔ کهنگی snapshot، snapshot کامل تازه بسازید. وجود `--reuse` به معنی استفاده از جدیدترین کد نیست.

## معادل Linux

روی checkout با LF و mode درست:

```sh
docker build --platform linux/amd64 --progress=plain --target slim \
  -f docker/prod/Dockerfile \
  -t ghcr.io/amirvaziry7/openproject:18.0.0-fa.YYYYMMDD-REVISION .
```

target نسخهٔ BIM، `slim-bim` است و انتخاب آن باید با edition نصب هماهنگ باشد. فایل `persian.seed-overrides.Dockerfile` مربوط به مرحلهٔ قدیمی seed-only بود؛ برای تغییر تقویم، کد و assetهای فعلی جای build کامل را نمی‌گیرد.

## هویت ایمیج نصب‌شده

```text
Tag:
ghcr.io/amirvaziry7/openproject:18.0.0-fa.18-ef70aff4adc

Image ID:
sha256:f602eeb0038865119ad0b8c213be4db41fd9e6e051c18df3a432d04319d62bc2

Source manifest SHA256:
c725733acf4ce261401f97c2c094eede3ad7ced24a466d65862c92ee7ffcda35

Archive SHA256:
90da304b45014a843cedbd2fe95e0eb2f9c77d2c3b72aa056f57bb3dc5e6a15d
```

tag این ایمیج به پایهٔ `ef70aff4adc` اشاره می‌کند؛ تغییر شفاف‌سازی لوگو هنگام build روی همان پایه وجود داشت و بعداً در `cdd80923d5b` commit شد. برای هویت دقیق این artifact از manifest و Image ID استفاده کنید، نه استنباط اینکه همهٔ ورودی‌ها دقیقاً همان commit درج‌شده در tag بوده‌اند.

## انتقال بدون registry

مسیر واقعی استفاده‌شده، export محلی، انتقال از مسیر SSH موجود و load روی سرور بود:

```powershell
docker image save --output tmp/production-rollout/openproject-fa18.tar ghcr.io/amirvaziry7/openproject:18.0.0-fa.18-ef70aff4adc
Get-FileHash tmp/production-rollout/openproject-fa18.tar -Algorithm SHA256
```

پس از انتقال کامل و تطبیق SHA256، روی سرور:

```sh
docker image load --input /opt/apps/openproject/rollout-fa-20261114T183957Z/openproject-fa18.tar
docker image inspect ghcr.io/amirvaziry7/openproject:18.0.0-fa.18-ef70aff4adc --format '{{.Id}}'
```

این load برای استقرار ثبت‌شده انجام شده است؛ مثال، دستور برای بازسازی وضعیت جدید نیست. export/import به معنی اجرای برنامه یا migration نیست.

## انتشار و شناسه‌ها

هیچ `docker push` برای این ایمیج انجام نشده است. نام GHCR صرفاً tag محلی نیز می‌تواند باشد. Image ID محلی، SHA فایل archive، SHA manifest منابع و registry digest چهار مفهوم متفاوت‌اند. digest قابل‌استفاده با `image@sha256:...` باید از registry پس از انتشار واقعی گرفته شود؛ Image ID ثبت‌شده را جای آن قرار ندهید.

انتشار ایمیج و push کد نیاز به مجوز جداگانه دارند. فایل‌های env، dump، browser session، کلید و گزارش resolved خصوصی نباید وارد context یا Git شوند.
