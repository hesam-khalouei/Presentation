/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Slides Loader Engine
   ───────────────────────────────────────────────────────────────
   • بارگذاری داینامیک اسلایدها از پوشه slides/
   • رندر درون main#stageContainer
   • ارسال رویداد slidesLoaded برای هماهنگی با navigation.js
   • اسلایدهای گم‌شده نادیده گرفته می‌شن (بدون پیام خطا در UI)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // 📋 لیست تمام فایل‌های اسلاید (به ترتیب نمایش)
  const SLIDES_MANIFEST = [
    'slide-01-hero.html',
    'slide-02-ecosystem.html',
    'slide-03-ebcom.html',
    'slide-04-services.html',
    'slide-05-brands.html',
    'slide-06-challenges.html',
    'slide-07-ebcom-credit.html',
    'slide-08-pwa-demo.html',
    'slide-09-features.html',
    'slide-10-calculator.html',
    'slide-11-journey-1.html',
    'slide-12-journey-2.html',
    'slide-13-journey-3.html',
    'slide-14-journey-4.html',
    'slide-15-journey-5.html',
    'slide-16-welfare.html',
    'slide-17-overcharge.html',
    'slide-18-settlement.html',
    'slide-19-cash-solution.html',
    'slide-20-map.html',
    'slide-21-clients.html'
  ];

  const BASE_PATH = 'slides/';
  const container = document.getElementById('stageContainer');

  async function loadSlide(file) {
    try {
      const response = await fetch(BASE_PATH + file);
      if (!response.ok) {
        // ❌ خطا رو فقط توی کنسول لاگ کن، به DOM چیزی اضافه نکن
        console.warn(`[SlidesLoader] ${file} پیدا نشد (HTTP ${response.status}) — نادیده گرفته شد`);
        return null;
      }
      return await response.text();
    } catch (err) {
      // ❌ خطای شبکه یا CORS — فقط لاگ کن
      console.warn(`[SlidesLoader] ${file} بارگذاری نشد — نادیده گرفته شد:`, err.message);
      return null;
    }
  }

  async function initSlides() {
    if (!container) {
      console.error('[SlidesLoader] #stageContainer پیدا نشد!');
      return;
    }

    // بارگذاری موازی
    const results = await Promise.all(SLIDES_MANIFEST.map(loadSlide));

    // ✅ فیلتر کردن اسلایدهای گم‌شده (null)
    const validSlides = results.filter(html => html !== null);
    const missingCount = results.length - validSlides.length;

    // اگه هیچ اسلایدی لود نشد، پیام خطا بده
    if (validSlides.length === 0) {
      container.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; height:100%; color:#F16273; font-family:Vazirmatn; text-align:center; padding:40px;">
          <div>
            <h2 style="margin-bottom:12px;">اسلایدی بارگذاری نشد</h2>
            <p style="color:#94A3B8;">لطفاً با سرور محلی اجرا کن: <code style="background:#1F2933; padding:4px 10px; border-radius:6px;">python -m http.server 8000</code></p>
          </div>
        </div>`;
      console.error('[SlidesLoader] هیچ اسلایدی بارگذاری نشد!');
      window.dispatchEvent(new Event('slidesLoaded'));
      return;
    }

    // تزریق اسلایدها
    container.innerHTML = validSlides.join('');

    // تنظیم اسلاید اول به‌عنوان active
    const firstSlide = container.querySelector('.slide');
    if (firstSlide) firstSlide.classList.add('active');

    // لاگ نهایی
    if (missingCount > 0) {
      console.warn(`⚠️ ${validSlides.length} اسلاید بارگذاری شد — ${missingCount} فایل پیدا نشد (نادیده گرفته شد)`);
    } else {
      console.log(`✅ ${validSlides.length} اسلاید با موفقیت بارگذاری شد.`);
    }

    // ارسال رویداد برای navigation.js
    window.dispatchEvent(new Event('slidesLoaded'));
  }

  // اجرا
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlides);
  } else {
    initSlides();
  }
})();