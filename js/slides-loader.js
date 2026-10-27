/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Slides Loader Engine
   ───────────────────────────────────────────────────────────────
   • بارگذاری داینامیک اسلایدها از پوشه slides/
   • رندر درون main#stageContainer
   • ارسال رویداد slidesLoaded برای هماهنگی با navigation.js
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
      if (!response.ok) throw new Error(`فایل ${file} پیدا نشد.`);
      return await response.text();
    } catch (err) {
      console.error(`[SlidesLoader] خطا در بارگذاری ${file}:`, err);
      return `<div class="glass-card" style="padding:40px; text-align:center; color:#F16273;">
                <h3>خطا در بارگذاری اسلاید</h3>
                <p>${file}</p>
              </div>`;
    }
  }

  async function initSlides() {
    if (!container) return;

    // بارگذاری موازی (برای سرعت بیشتر)
    const results = await Promise.all(SLIDES_MANIFEST.map(loadSlide));

    // پاک کردن لودر و قرار دادن اسلایدها
    container.innerHTML = results.join('');

    // تنظیم اسلاید اول به‌عنوان active
    const firstSlide = container.querySelector('.slide');
    if (firstSlide) firstSlide.classList.add('active');

    console.log(`✅ ${SLIDES_MANIFEST.length} اسلاید با موفقیت بارگذاری شد.`);

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