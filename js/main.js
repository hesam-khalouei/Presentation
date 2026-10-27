// js/main.js — bootstrap پروژه (production-ready)
// ─────────────────────────────────────────────

(function () {
  'use strict';

  const DEBUG = false; // ← production: false, development: true

  document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');

    // اطمینان از اینکه اسلاید اول فعاله
    if (slides.length > 0 && !document.querySelector('.slide.active')) {
      slides[0].classList.add('active');
    }

    // در حالت debug، بررسی توابع
    if (DEBUG) {
      const requiredFns = ['goToSlide', 'nextSlide', 'toggleDrawer', 'toggleFullScreen'];
      requiredFns.forEach(fn => {
        if (typeof window[fn] !== 'function') {
          console.warn(`⚠️ تابع ${fn} پیدا نشد`);
        }
      });
      console.log(
        `%c✅ Ewano B2B Presentation — ${slides.length} slides`,
        'background:#00D4B4;color:#0B0F13;padding:4px 12px;border-radius:6px;font-weight:bold;'
      );
    }

    // ریسایز: recalibrate در صورت نیاز
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // فعلاً کاری لازم نیست
      }, 150);
    });
  });

})();