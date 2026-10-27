# -*- coding: utf-8 -*-
import os
import re

# 1. ساخت پوشه slides
os.makedirs('slides', exist_ok=True)

# 2. لیست اسلایدها
slides = [
    ('slide-01-hero.html', 0, 'صفحه عنوان: راهکارهای سازمانی و اعتباری اوانو'),
    ('slide-02-ecosystem.html', 0, 'اکوسیستم همراه اول و شرکت‌های کلیدی'),
    ('slide-03-ebcom.html', 0, 'درباره EBCOM و پلتفرم استراتژیک اوانو'),
    ('slide-04-services.html', 0, 'خدمات اوانو در یک نگاه (۱۰ حوزه کلیدی)'),
    ('slide-05-brands.html', 0, 'شرکای تجاری کیف پول اوانو (۲۵ برند برتر)'),
    ('slide-06-challenges.html', 1, 'چالش‌های مدیریت مزایا و خدمات رفاهی کارکنان'),
    ('slide-07-ebcom-credit.html', 1, 'راهکارهای اعتباری EBCOM و رفاهیات سازمانی'),
    ('slide-08-pwa-demo.html', 1, 'دموی تعاملی سوپراپلیکیشن اوانو و سه بالانس سازمانی'),
    ('slide-09-features.html', 1, 'ویژگی‌های کلیدی اعتبار سازمانی اوانو'),
    ('slide-10-calculator.html', 1, 'ماشین حساب اعتبار خرید و نحوه محاسبه اقساط'),
    ('slide-11-journey-1.html', 2, 'مسیر اعتبار (گام ۱ از ۶): شارژ اعتبار پرسنل'),
    ('slide-12-journey-2.html', 2, 'مسیر اعتبار (گام ۲ از ۶): استفاده از اعتبار و خرید'),
    ('slide-13-journey-3.html', 2, 'مسیر اعتبار (گام ۳ از ۶): صدور صورتحساب و دوره تنفس ۳ روزه'),
    ('slide-14-journey-4.html', 2, 'مسیر اعتبار (گام ۴ از ۶): پرداخت اولین قسط و دوره ۱۲ ماهه ریوالوینگ'),
    ('slide-15-journey-5.html', 2, 'مسیر اعتبار (گام ۵ از ۶): روز معرفی به سازمان'),
    ('slide-16-welfare.html', 3, 'معرفی رفاهیات سازمانی و سرفصل‌های انتخابی'),
    ('slide-17-overcharge.html', 3, 'مدل‌های ارائه اوورشارژ رفاهیات سازمانی'),
    ('slide-18-settlement.html', 3, 'روش‌های تسویه سازمانی اوورشارژ (پیش‌پرداخت و پس‌پرداخت)'),
    ('slide-19-cash-solution.html', 3, 'راهکار نقدی (اوانو کارت)، ظرفیت‌های همراه اول و ارزش‌آفرینی'),
    ('slide-20-map.html', 4, 'شبکه گسترده پذیرندگی کشوری اوانو (اینفوگرافیک نقشه ایران)'),
    ('slide-21-clients.html', 4, 'گزارش آماری اوانو، سازمان‌های همکار و جمع‌بندی چرا اوانو؟'),
]

# 3. ساخت فایل‌های خالی
for i, (filename, chapter, title) in enumerate(slides):
    active = ' active' if i == 0 else ''
    content = f'''<section class="slide{active}" data-chapter="{chapter}" data-title="{title}">
  <div class="slide-inner">
    <!-- محتوای اسلاید {i+1} را اینجا کپی کنید -->
  </div>
</section>
'''
    with open(f'slides/{filename}', 'w', encoding='utf-8') as f:
        f.write(content)

print(f'✅ {len(slides)} فایل خالی ساخته شد.')

# 4. اگر فایل index.html قدیمی وجود داره، خودکار اسلایدها رو جدا کن
if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # پیدا کردن همه تگ‌های section با کلاس slide
    pattern = r'<section class="slide[^"]*"[^>]*>.*?</section>'
    found = re.findall(pattern, html, re.DOTALL)
    
    if len(found) == len(slides):
        print(f'📖 {len(found)} اسلاید در index.html پیدا شد، در حال کپی خودکار...')
        for i, (filename, chapter, title) in enumerate(slides):
            with open(f'slides/{filename}', 'w', encoding='utf-8') as f:
                f.write(found[i])
        print('✅ تمام اسلایدها با موفقیت از index.html جدا شدند!')
    else:
        print(f'⚠️ در index.html تعداد {len(found)} اسلاید پیدا شد، اما انتظار {len(slides)} می‌رفت.')
        print('   اگر index.html جدید (پوسته خالی) هست، این پیام طبیعیه.')
else:
    print('ℹ️ فایل index.html پیدا نشد. فایل‌های خالی ساخته شدن.')

print('\n📁 محتوای پوشه slides:')
for f in sorted(os.listdir('slides')):
    size = os.path.getsize(f'slides/{f}')
    print(f'   - {f} ({size} bytes)')
