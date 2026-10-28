/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Bootstrap & Initialization
   ───────────────────────────────────────────────────────────────
   • اطمینان از وجود اسلاید فعال
   • بررسی صحت توابع اصلی
   • مدیریت resize و visibility
   • منتظر لود شدن اسلایدها و کامپوننت‌ها می‌مونه
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // ۱) تنظیمات
  // ═══════════════════════════════════════════
  const CONFIG = {
    DEBUG: false,
    REQUIRED_FNS: [
      'goToSlide',
      'nextSlide',
      'prevSlide',
      'toggleDrawer',
      'toggleFullScreen'
    ],
    REQUIRED_DOM: [
      '.stage-container',
      '.deck-header',
      '.deck-footer'
    ]
  };

  // ═══════════════════════════════════════════
  // ۲) Utilities
  // ═══════════════════════════════════════════
  const log = {
    info(msg) {
      if (CONFIG.DEBUG) {
        console.log(
          `%c[Ewano]%c ${msg}`,
          'background:#00D4B4;color:#0B0F13;padding:2px 6px;border-radius:4px;font-weight:bold;',
          'color:inherit;'
        );
      }
    },
    warn(msg) {
      if (CONFIG.DEBUG) console.warn(`[Ewano] ${msg}`);
    },
    error(msg) {
      console.error(`[Ewano] ${msg}`);
    },
    summary(count) {
      if (CONFIG.DEBUG) {
        console.log(
          `%c✅ Ewano B2B Presentation — ${count} slides`,
          'background:#00D4B4;color:#0B0F13;padding:4px 12px;border-radius:6px;font-weight:bold;font-size:13px;'
        );
      }
    }
  };

  function isFn(name) {
    return typeof window[name] === 'function';
  }

  function $(sel) {
    return document.querySelector(sel);
  }

  // ═══════════════════════════════════════════
  // ۳) Bootstrap Steps
  // ═══════════════════════════════════════════
  function ensureActiveSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) {
      return null;
    }
    if (!document.querySelector('.slide.active')) {
      slides[0].classList.add('active');
      log.info('اسلاید اول به عنوان active تنظیم شد');
    }
    return slides;
  }

  function checkRequiredFns() {
    const missing = CONFIG.REQUIRED_FNS.filter(fn => !isFn(fn));
    if (missing.length > 0) {
      missing.forEach(fn => log.warn(`تابع ${fn} پیدا نشد`));
    }
    return missing.length === 0;
  }

  function checkRequiredDOM() {
    const missing = CONFIG.REQUIRED_DOM.filter(sel => !$(sel));
    if (missing.length > 0) {
      missing.forEach(sel => log.warn(`عنصر ${sel} پیدا نشد`));
    }
    return missing.length === 0;
  }

  function setupResizeHandler() {
    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        log.info(`viewport: ${window.innerWidth}×${window.innerHeight}`);
      }, 200);
    });
  }

  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        log.info('صفحه مخفی شد — pause');
      } else {
        log.info('صفحه دوباره نمایان شد — resume');
      }
    });
  }

  function setupErrorBoundary() {
    window.addEventListener('error', (event) => {
      log.error(`خطای JS: ${event.message} در ${event.filename}:${event.lineno}`);
    });
    window.addEventListener('unhandledrejection', (event) => {
      log.error(`Promise rejection: ${event.reason}`);
    });
  }

  // ═══════════════════════════════════════════
  // ۴) Main Bootstrap
  // ═══════════════════════════════════════════
  function bootstrap() {
    log.info('شروع bootstrap...');

    if (!checkRequiredDOM()) {
      log.warn('برخی از عناصر DOM اصلی پیدا نشدن');
    }

    const slides = ensureActiveSlide();
    if (!slides) {
      log.error('هیچ اسلایدی پیدا نشد — bootstrap متوقف شد');
      return;
    }

    const fnsOk = checkRequiredFns();
    if (!fnsOk) {
      log.warn('برخی از توابع اصلی تعریف نشدن');
    }

    setupResizeHandler();
    setupVisibilityHandler();
    setupErrorBoundary();

    log.summary(slides.length);
    log.info('bootstrap کامل شد ✅');
  }

  // ═══════════════════════════════════════════
  // ۵) اجرا — منتظر اسلایدها می‌مونه
  // ═══════════════════════════════════════════
  let hasRun = false;

  function startBootstrap() {
    if (hasRun) return;
    hasRun = true;

    // اگه اسلایدها هنوز لود نشدن، صبر کن
    if (document.querySelectorAll('.slide').length === 0) {
      log.info('اسلایدها هنوز لود نشدن — منتظر slidesLoaded...');
      window.addEventListener('slidesLoaded', () => {
        log.info('slidesLoaded دریافت شد — اجرای bootstrap');
        bootstrap();
      }, { once: true });

      // fallback: بعد از ۵ ثانیه اگه هنوز خبری نشد
      setTimeout(() => {
        if (!hasRun) return;
        if (document.querySelectorAll('.slide').length === 0) {
          log.error('اسلایدها لود نشدن — bootstrap اجرا نمی‌شه');
        }
      }, 5000);
      return;
    }

    bootstrap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBootstrap);
  } else {
    startBootstrap();
  }
})();