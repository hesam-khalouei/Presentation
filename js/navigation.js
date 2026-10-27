/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Navigation & Slide Engine
   ───────────────────────────────────────────────────────────────
   • goToSlide / nextSlide / prevSlide
   • Chapter navigation
   • Keyboard controls (←/→/F/Esc/Space)
   • Slide dots + Drawer
   • Fullscreen
   • Card Flip handlers
   • Iran Map tooltip
   • Async-compatible (منتظر componentsLoaded و slidesLoaded)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════
  let slides = [];
  let totalSlides = 0;
  let currentIndex = 0;

  // ═══════════════════════════════════════════
  // Utilities
  // ═══════════════════════════════════════════
  function toPersianDigits(num) {
    const farsiDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(num).replace(/\d/g, x => farsiDigits[x]);
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  // ═══════════════════════════════════════════
  // Init Deck (فقط یه بار اجرا می‌شه)
  // ═══════════════════════════════════════════
  let deckInitialized = false;

  function initDeck() {
    if (deckInitialized) return;

    slides = $$('.slide');
    totalSlides = slides.length;

    if (totalSlides === 0) {
      console.warn('[Navigation] هنوز اسلایدی بارگذاری نشده.');
      return;
    }

    // چک می‌کنیم که Header و Footer هم لود شده باشن
    if (!$('#chapterNav') || !$('#slideDots')) {
      console.warn('[Navigation] Header یا Footer هنوز آماده نیست.');
      return;
    }

    console.log(`[Navigation] ${totalSlides} اسلاید آماده شد.`);

    // تنظیم total slide number
    const totalSlideNumEl = $('#totalSlideNum');
    if (totalSlideNumEl) totalSlideNumEl.textContent = toPersianDigits(totalSlides);

    // ساخت Dots
    const slideDotsContainer = $('#slideDots');
    if (slideDotsContainer) {
      slideDotsContainer.innerHTML = '';
      slides.forEach((slide, idx) => {
        const dot = document.createElement('div');
        // ۵ اسلاید وسط مسیر ۶ مرحله‌ای (indices 10-14) رنگ نارنجی می‌گیرن
        dot.className = 'slide-dot' + (idx >= 10 && idx <= 14 ? ' journey-dot' : '');
        dot.title = slide.getAttribute('data-title') || `اسلاید ${idx + 1}`;
        dot.onclick = () => goToSlide(idx);
        slideDotsContainer.appendChild(dot);
      });
    }

    // ساخت Drawer List
    const drawerList = $('#drawerList');
    if (drawerList) {
      drawerList.innerHTML = '';
      slides.forEach((slide, idx) => {
        const item = document.createElement('div');
        item.className = 'drawer-item';
        item.onclick = () => { goToSlide(idx); toggleDrawer(); };
        item.innerHTML = `
          <div class="drawer-item-num">${toPersianDigits(idx + 1)}</div>
          <div style="font-size:13px; font-weight:700; color:#E2E8F0;">
            ${slide.getAttribute('data-title') || 'اسلاید'}
          </div>
        `;
        drawerList.appendChild(item);
      });
    }

    // راه‌اندازی اولیه
    currentIndex = 0;
    updateDeckUI();
    deckInitialized = true;

    // فعال‌سازی نقشه (اگه وجود داشت)
    initMapTooltips();

    // فعال‌سازی کلیک روی کارت‌ها برای باز/بسته شدن (موبایل)
    setupCardExpand();
  }

  // ═══════════════════════════════════════════
  // Update UI (بعد از هر تغییر)
  // ═══════════════════════════════════════════
  function updateDeckUI() {
    if (!slides.length) return;

    // اسلاید فعال
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // شمارنده
    const currentSlideNumEl = $('#currentSlideNum');
    if (currentSlideNumEl) currentSlideNumEl.textContent = toPersianDigits(currentIndex + 1);

    // نوار پیشرفت
    const progressFill = $('#progressFill');
    if (progressFill) progressFill.style.width = `${((currentIndex + 1) / totalSlides) * 100}%`;

    // دکمه‌ها
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;

    // Dots
    const slideDotsContainer = $('#slideDots');
    if (slideDotsContainer) {
      Array.from(slideDotsContainer.children).forEach((d, idx) => {
        d.classList.toggle('active', idx === currentIndex);
      });
    }

    // Drawer
    const drawerList = $('#drawerList');
    if (drawerList) {
      Array.from(drawerList.children).forEach((item, idx) => {
        item.classList.toggle('active', idx === currentIndex);
      });
    }

    // Chapter Nav
    const activeChapter = parseInt(slides[currentIndex].getAttribute('data-chapter') || '0', 10);
    $$('.chapter-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === activeChapter);
    });
  }

  // ═══════════════════════════════════════════
  // Navigation
  // ═══════════════════════════════════════════
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;
    updateDeckUI();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateDeckUI();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateDeckUI();
    }
  }

  function toggleDrawer() {
    const drawer = $('#drawerBackdrop');
    if (drawer) drawer.classList.toggle('open');
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // ═══════════════════════════════════════════
  // Card Flip Handlers
  // ═══════════════════════════════════════════
  window.toggleDebitCardFlip = function (el) {
    if (!el) el = $('#debitCardFlipper');
    if (el) el.classList.toggle('is-flipped');
  };

  window.toggleVoucherFlip = function (el) {
    if (el) el.classList.toggle('is-flipped');
  };

  // ═══════════════════════════════════════════
  // Keyboard Controls
  // ═══════════════════════════════════════════
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullScreen();
    } else if (e.key === 'Escape') {
      const drawer = $('#drawerBackdrop');
      if (drawer) drawer.classList.remove('open');
    }
  });

  // ═══════════════════════════════════════════
  // Iran Map Tooltip
  // ═══════════════════════════════════════════
  const MAP_DATA = [
    {"key":"Alborz","fa":"البرز","center":"کرج","stores":450},
    {"key":"Ardabil","fa":"اردبیل","center":"اردبیل","stores":65},
    {"key":"Bushehr","fa":"بوشهر","center":"بوشهر","stores":110},
    {"key":"ChaharmahalandBakhtiari","fa":"چهارمحال و بختیاری","center":"شهرکرد","stores":45},
    {"key":"EastAzerbaijan","fa":"آذربایجان شرقی","center":"تبریز","stores":420},
    {"key":"Fars","fa":"فارس","center":"شیراز","stores":480},
    {"key":"Gilan","fa":"گیلان","center":"رشت","stores":280},
    {"key":"Golestan","fa":"گلستان","center":"گرگان","stores":85},
    {"key":"Hamadan","fa":"همدان","center":"همدان","stores":80},
    {"key":"Hormozgan","fa":"هرمزگان","center":"بندرعباس","stores":190},
    {"key":"Ilam","fa":"ایلام","center":"ایلام","stores":25},
    {"key":"Isfahan","fa":"اصفهان","center":"اصفهان","stores":550},
    {"key":"Kerman","fa":"کرمان","center":"کرمان","stores":220},
    {"key":"Kermanshah","fa":"کرمانشاه","center":"کرمانشاه","stores":210},
    {"key":"Khuzestan","fa":"خوزستان","center":"اهواز","stores":350},
    {"key":"KohgiluyehAndBoyerAhmad","fa":"کهگیلویه و بویراحمد","center":"یاسوج","stores":30},
    {"key":"Kurdistan","fa":"کردستان","center":"سنندج","stores":90},
    {"key":"Lorestan","fa":"لرستان","center":"خرم‌آباد","stores":70},
    {"key":"Markazi","fa":"مرکزی","center":"اراک","stores":140},
    {"key":"Mazandaran","fa":"مازندران","center":"ساری","stores":170},
    {"key":"NorthKhorasan","fa":"خراسان شمالی","center":"بجنورد","stores":40},
    {"key":"Qazvin","fa":"قزوین","center":"قزوین","stores":150},
    {"key":"Qom","fa":"قم","center":"قم","stores":240},
    {"key":"RazaviKhorasan","fa":"خراسان رضوی","center":"مشهد","stores":700},
    {"key":"Semnan","fa":"سمنان","center":"سمنان","stores":50},
    {"key":"SistanAndBaluchestan","fa":"سیستان و بلوچستان","center":"زاهدان","stores":100},
    {"key":"SouthKhorasan","fa":"خراسان جنوبی","center":"بیرجند","stores":35},
    {"key":"Tehran","fa":"تهران","center":"تهران","stores":3200},
    {"key":"WestAzerbaijan","fa":"آذربایجان غربی","center":"ارومیه","stores":160},
    {"key":"Yazd","fa":"یزد","center":"یزد","stores":180},
    {"key":"Zanjan","fa":"زنجان","center":"زنجان","stores":55}
  ];

  function initMapTooltips() {
    const svg = $('.imap-svg');
    const box = $('.imap-map');
    if (!svg || !box) return;

    const byKey = {};
    MAP_DATA.forEach(m => byKey[m.key] = m);

    let tip = document.getElementById('imapTip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'imapTip';
      tip.className = 'imap-tip-rich';
      box.appendChild(tip);
    }

    const FA = '۰۱۲۳۴۵۶۷۸۹';
    function fa(n) {
      return n.toLocaleString('en-US').replace(/,/g, '٬').replace(/[0-9]/g, d => FA[+d]);
    }

    function show(el, x, y) {
      const m = byKey[el.getAttribute('data-k')];
      if (!m) return;
      const b = box.getBoundingClientRect();
      tip.innerHTML = `
        <div class="tip-title-row">
          <span class="tip-prov-name">استان ${m.fa}</span>
          <span class="tip-city-name">مرکز: ${m.center || '—'}</span>
        </div>
        <div class="tip-merch-row">
          <span>تعداد مرچنت:</span>
          <strong class="tip-merch-num">${m.stores ? fa(m.stores) : '۰'} فروشگاه</strong>
        </div>
      `;
      tip.style.left = (x - b.left) + 'px';
      tip.style.top = (y - b.top) + 'px';
      tip.classList.add('show');
    }

    svg.querySelectorAll('.imap-prov').forEach(p => {
      p.addEventListener('pointermove', e => show(p, e.clientX, e.clientY));
      p.addEventListener('click', e => show(p, e.clientX, e.clientY));
      p.addEventListener('pointerleave', () => tip.classList.remove('show'));
    });
  }

  // ═══════════════════════════════════════════
  // Card Expand (کلیک روی کارت‌ها در موبایل)
  // ═══════════════════════════════════════════
  function setupCardExpand() {
    $$('.glass-card:not(.no-collapse), .service-tile').forEach(box => {
      box.addEventListener('click', e => {
        if (e.target.closest('button, a, input, select, label')) return;
        box.classList.toggle('expanded-box');
      });
    });
  }

  // ═══════════════════════════════════════════
  // Export to Global (برای onclick ها در HTML)
  // ═══════════════════════════════════════════
  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.toggleDrawer = toggleDrawer;
  window.toggleFullScreen = toggleFullScreen;

  // ═══════════════════════════════════════════
  // Async Bootstrap (منتظر کامپوننت‌ها و اسلایدها)
  // ═══════════════════════════════════════════
  let componentsReady = false;
  let slidesReady = false;

  function tryInit() {
    if (componentsReady && slidesReady) {
      initDeck();
    }
  }

  window.addEventListener('componentsLoaded', () => {
    componentsReady = true;
    tryInit();
  });

  window.addEventListener('slidesLoaded', () => {
    slidesReady = true;
    tryInit();
  });

  // اگر قبلاً لود شده بودن (مثلاً صفحه رفرش شده)
  if (document.getElementById('chapterNav')) {
    componentsReady = true;
    tryInit();
  }
  if (document.querySelectorAll('.slide').length > 0) {
    slidesReady = true;
    tryInit();
  }
})();