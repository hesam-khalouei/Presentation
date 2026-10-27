[{"key":"Alborz","fa":"البرز","center":"کرج","stores":450,"n":6},{"key":"Ardabil","fa":"اردبیل","center":"اردبیل","stores":65,"n":10},{"key":"Bushehr","fa":"بوشهر","center":"بوشهر","stores":110,"n":10},{"key":"ChaharmahalandBakhtiari","fa":"چهارمحال و بختیاری","center":"شهرکرد","stores":45,"n":9},{"key":"EastAzerbaijan","fa":"آذربایجان شرقی","center":"تبریز","stores":420,"n":20},{"key":"Fars","fa":"فارس","center":"شیراز","stores":480,"n":29},{"key":"Gilan","fa":"گیلان","center":"رشت","stores":280,"n":16},{"key":"Golestan","fa":"گلستان","center":"گرگان","stores":85,"n":14},{"key":"Hamadan","fa":"همدان","center":"همدان","stores":80,"n":9},{"key":"Hormozgan","fa":"هرمزگان","center":"بندرعباس","stores":190,"n":12},{"key":"Ilam","fa":"ایلام","center":"ایلام","stores":25,"n":9},{"key":"Isfahan","fa":"اصفهان","center":"اصفهان","stores":550,"n":24},{"key":"Kerman","fa":"کرمان","center":"کرمان","stores":220,"n":23},{"key":"Kermanshah","fa":"کرمانشاه","center":"کرمانشاه","stores":210,"n":14},{"key":"Khuzestan","fa":"خوزستان","center":"اهواز","stores":350,"n":27},{"key":"KohgiluyehAndBoyerAhmad","fa":"کهگیلویه و بویراحمد","center":"یاسوج","stores":30,"n":8},{"key":"Kurdistan","fa":"کردستان","center":"سنندج","stores":90,"n":10},{"key":"Lorestan","fa":"لرستان","center":"خرم‌آباد","stores":70,"n":11},{"key":"Markazi","fa":"مرکزی","center":"اراک","stores":140,"n":13},{"key":"Mazandaran","fa":"مازندران","center":"ساری","stores":170,"n":22},{"key":"NorthKhorasan","fa":"خراسان شمالی","center":"بجنورد","stores":40,"n":8},{"key":"Qazvin","fa":"قزوین","center":"قزوین","stores":150,"n":6},{"key":"Qom","fa":"قم","center":"قم","stores":240,"n":1},{"key":"RazaviKhorasan","fa":"خراسان رضوی","center":"مشهد","stores":700,"n":28},{"key":"Semnan","fa":"سمنان","center":"سمنان","stores":50,"n":8},{"key":"SistanAndBaluchestan","fa":"سیستان و بلوچستان","center":"زاهدان","stores":100,"n":19},{"key":"SouthKhorasan","fa":"خراسان جنوبی","center":"بیرجند","stores":35,"n":11},{"key":"Tehran","fa":"تهران","center":"تهران","stores":3200,"n":16},{"key":"WestAzerbaijan","fa":"آذربایجان غربی","center":"ارومیه","stores":160,"n":17},{"key":"Yazd","fa":"یزد","center":"یزد","stores":180,"n":10},{"key":"Zanjan","fa":"زنجان","center":"زنجان","stores":55,"n":9}]

// ═════════════════════════════════

const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentIndex = 0;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideNumEl = document.getElementById('currentSlideNum');
    const totalSlideNumEl = document.getElementById('totalSlideNum');
    const progressFill = document.getElementById('progressFill');
    const slideDotsContainer = document.getElementById('slideDots');
    const drawerList = document.getElementById('drawerList');
    const chapterBtns = Array.from(document.querySelectorAll('.chapter-btn'));

    function toPersianDigits(num) {
      const farsiDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
      return String(num).replace(/\d/g, x => farsiDigits[x]);
    }

    // Initialize Dots and Drawer List
    function initDeck() {
      totalSlideNumEl.textContent = toPersianDigits(totalSlides);

      slides.forEach((slide, idx) => {
        // Dot
        const dot = document.createElement('div');
        dot.className = 'slide-dot' + (idx >= 10 && idx <= 15 ? ' journey-dot' : '');
        dot.title = slide.getAttribute('data-title') || `اسلاید ${idx + 1}`;
        dot.onclick = () => goToSlide(idx);
        slideDotsContainer.appendChild(dot);

        // Drawer Item
        const item = document.createElement('div');
        item.className = 'drawer-item';
        item.onclick = () => {
          goToSlide(idx);
          toggleDrawer();
        };
        item.innerHTML = `
          <div class="drawer-item-num">${toPersianDigits(idx + 1)}</div>
          <div style="font-size:13px; font-weight:700; color:#E2E8F0;">${slide.getAttribute('data-title')}</div>
        `;
        drawerList.appendChild(item);
      });

      updateDeckUI();
    }

    function updateDeckUI() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
      });

      // Update Counter & Progress
      currentSlideNumEl.textContent = toPersianDigits(currentIndex + 1);
      const pct = ((currentIndex + 1) / totalSlides) * 100;
      progressFill.style.width = `${pct}%`;

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalSlides - 1;

      // Update Dots
      const dots = Array.from(slideDotsContainer.children);
      dots.forEach((d, idx) => d.classList.toggle('active', idx === currentIndex));

      // Update Drawer active item
      const drawerItems = Array.from(drawerList.children);
      drawerItems.forEach((item, idx) => item.classList.toggle('active', idx === currentIndex));

      // Update Chapter Highlight
      const activeChapter = parseInt(slides[currentIndex].getAttribute('data-chapter') || '0', 10);
      chapterBtns.forEach((btn, idx) => btn.classList.toggle('active', idx === activeChapter));
    }

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
      document.getElementById('drawerBackdrop').classList.toggle('open');
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Slide 8 Interactive Wallet Mockup Switcher
    function switchBalanceMockup(type, btnEl) {
      const card = document.getElementById('phoneActiveCard');
      const title = document.getElementById('phoneBalType');
      const amount = document.getElementById('phoneBalAmount');
      const sub = document.getElementById('phoneBalSub');

      if (btnEl) {
        const siblings = btnEl.parentElement.querySelectorAll('.seg-btn');
        siblings.forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
      }

      if (type === 'welfare') {
        card.style.background = 'linear-gradient(135deg, #00D4B4, #008872)';
        card.style.color = '#0B0F13';
        title.textContent = 'کیف پول رفاهی اوانو';
        amount.textContent = '۵۰٬۰۰۰٬۰۰۰ ریال';
        sub.textContent = 'سرفصل: معیشتی، فروشگاه، سفر و بیمه';
      } else if (type === 'credit') {
        card.style.background = 'linear-gradient(135deg, #FF7722, #C84B00)';
        card.style.color = '#FFFFFF';
        title.textContent = 'کیف پول اعتباری (BNPL)';
        amount.textContent = '۲۰۰٬۰۰۰٬۰۰۰ ریال';
        sub.textContent = 'اقساط ۱۲ ماهه ریوالوینگ · بدون ضامن';
      } else if (type === 'cash') {
        card.style.background = 'linear-gradient(135deg, #0093DD, #00548A)';
        card.style.color = '#FFFFFF';
        title.textContent = 'کیف پول نقدی و اوانوکارت';
        amount.textContent = '۳۵٬۰۰۰٬۰۰۰ ریال';
        sub.textContent = 'متصل به شبکه بانکی (همپا بانک پارسیان)';
      }
    }

    // Keyboard Navigation (RTL aware: Left Arrow = Next Slide, Right Arrow = Prev Slide, Space = Next)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement && document.activeElement.tagName)) return;
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
        document.getElementById('drawerBackdrop').classList.remove('open');
      }
    });

    initDeck();

    // =========================================================================
    // SLIDE 18: VOUCHER CARD FLIP HANDLER
    // =========================================================================
    function toggleVoucherFlip(el) {
      if (el) {
        el.classList.toggle('is-flipped');
      }
    }
    window.toggleVoucherFlip = toggleVoucherFlip;


    // =========================================================================
    // ITEM 3: DEBIT CARD FLIP HANDLER (FRONT & BACK)
    // =========================================================================
    function toggleDebitCardFlip(el) {
      if (!el) el = document.getElementById('debitCardFlipper');
      if (el) {
        el.classList.toggle('is-flipped');
      }
    }
    window.toggleDebitCardFlip = toggleDebitCardFlip;

    // =========================================================================
    // ITEM 11: RICH POPUP ON IRAN MAP (NAME, CITY, MERCHANTS)
    // =========================================================================
    (function(){
      var svg = document.querySelector('.imap-svg');
      var metaEl = document.getElementById('imapMeta');
      if (!svg || !metaEl) return;
      var META = JSON.parse(metaEl.textContent);
      var byKey = {}; META.forEach(function(m){ byKey[m.key] = m; });
      var box = document.querySelector('.imap-map');
      if (!box) return;

      var tip = document.getElementById('imapTip');
      if (!tip) {
        tip = document.createElement('div');
        tip.id = 'imapTip';
        tip.className = 'imap-tip-rich';
        box.appendChild(tip);
      } else {
        tip.className = 'imap-tip-rich';
      }

      var FA = '۰۱۲۳۴۵۶۷۸۹';
      function fa(n){ return n.toLocaleString('en-US').replace(/,/g, '٬').replace(/[0-9]/g, function(d){ return FA[+d]; }); }

      function showRichTip(el, x, y){
        var k = el.getAttribute('data-k');
        var m = byKey[k];
        if (!m) return;
        var b = box.getBoundingClientRect();
        tip.innerHTML = '<div class="tip-title-row">' +
                          '<span class="tip-prov-name">استان ' + m.fa + '</span>' +
                          '<span class="tip-city-name">مرکز: ' + (m.center || '—') + '</span>' +
                        '</div>' +
                        '<div class="tip-merch-row">' +
                          '<span>تعداد مرچنت و پذیرنده:</span>' +
                          '<strong class="tip-merch-num">' + (m.stores ? fa(m.stores) : '۰') + ' فروشگاه</strong>' +
                        '</div>';
        tip.style.left = (x - b.left) + 'px';
        tip.style.top = (y - b.top) + 'px';
        tip.classList.add('show');
      }

      Array.prototype.forEach.call(svg.querySelectorAll('.imap-prov'), function(p){
        p.addEventListener('pointermove', function(e){ showRichTip(p, e.clientX, e.clientY); });
        p.addEventListener('click', function(e){ showRichTip(p, e.clientX, e.clientY); });
        p.addEventListener('pointerleave', function(){ tip.classList.remove('show'); });
      });

      // LTR Marquee Setup
      Array.prototype.forEach.call(document.querySelectorAll('.logo-dots'), function(lbox){
        lbox.classList.add('lm-ltr');
      });
    })();


    // Touch / Click toggle for collapsible boxes on mobile viewports (e.g., 412x917)
    document.querySelectorAll('.glass-card:not(.no-collapse), .service-tile').forEach(function(box){
      box.addEventListener('click', function(e){
        if (e.target.closest('button, a, input, select, label')) return;
        box.classList.toggle('expanded-box');
      });
    });


    // =========================================================================
    // MOUSE & TOUCH SWIPE ON PHONE HOME BALANCE CARDS (#cc-center)
    // =========================================================================
    (function(){
      var el = document.getElementById('cc-center');
      if (!el) return;
      el.style.cursor = 'grab';
      el.style.userSelect = 'none';
      el.style.touchAction = 'pan-y';
      var startX = null, dx = 0;

      function animateCardTransition(dir, targetIdx){
        var next = typeof targetIdx === 'number' ? targetIdx : (cardIdx + dir + 3) % 3;
        var outSign = dir >= 0 ? 1 : -1;
        el.style.transition = 'transform 0.22s ease, opacity 0.22s ease';
        el.style.transform = 'translateX(' + (outSign * 90) + 'px) rotate(' + (outSign * 5) + 'deg) scale(0.94)';
        el.style.opacity = '0.25';
        setTimeout(function(){
          cardIdx = next;
          renderCard();
          el.style.transition = 'none';
          el.style.transform = 'translateX(' + (-outSign * 90) + 'px) rotate(' + (-outSign * 5) + 'deg) scale(0.94)';
          void el.offsetWidth;
          el.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease';
          el.style.transform = 'translateX(0) rotate(0) scale(1)';
          el.style.opacity = '1';
        }, 180);
      }

      window.swapCard = function(dir){ animateCardTransition(dir); };
      window.goToCard = function(i){
        if (i === cardIdx) return;
        animateCardTransition(i > cardIdx ? 1 : -1, i);
      };

      el.addEventListener('pointerdown', function(e){
        startX = e.clientX;
        dx = 0;
        el.style.cursor = 'grabbing';
        el.style.transition = 'none';
        if (el.setPointerCapture) {
          try { el.setPointerCapture(e.pointerId); } catch(err){}
        }
      });
      el.addEventListener('pointermove', function(e){
        if (startX === null) return;
        dx = e.clientX - startX;
        el.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx * 0.04) + 'deg)';
      });
      function endSwipe(){
        if (startX === null) return;
        startX = null;
        el.style.cursor = 'grab';
        if (dx > 38) {
          animateCardTransition(1);
        } else if (dx < -38) {
          animateCardTransition(-1);
        } else if (Math.abs(dx) < 6) {
          el.style.transition = 'transform 0.25s ease';
          el.style.transform = 'translateX(0) rotate(0)';
          animateCardTransition(1);
        } else {
          el.style.transition = 'transform 0.25s ease';
          el.style.transform = 'translateX(0) rotate(0)';
        }
        dx = 0;
      }
      el.addEventListener('pointerup', endSwipe);
      el.addEventListener('pointercancel', endSwipe);
    })();

    // =========================================================================
    // BILLS PAYMENT (قبوض خدماتی) INTERACTIVE LOGIC IN PHONE DEMO
    // =========================================================================
    (function(){
      var billItems = document.querySelectorAll('#billList .inv-item');
      var billTitle = document.getElementById('billTitle');
      var billId = document.getElementById('billId');
      var billAmt = document.getElementById('billAmt');
      var billPayBtn = document.getElementById('billPayBtn');
      var billSheet = document.getElementById('billSheet');
      var billDoneAmt = document.getElementById('billDoneAmt');
      var billDoneSub = document.getElementById('billDoneSub');

      if (!billItems.length) return;
      var curBill = { title: 'قبض برق مشترکین (توزیع برق تهران)', id: '۴۸۲۹۱۰۳۴۵۰۱۲۸', amt: '۱,۴۸۰,۰۰۰' };

      billItems.forEach(function(btn){
        btn.addEventListener('click', function(){
          billItems.forEach(function(b){ b.classList.remove('on'); });
          btn.classList.add('on');
          curBill = {
            title: btn.getAttribute('data-title'),
            id: btn.getAttribute('data-id'),
            amt: btn.getAttribute('data-amt')
          };
          if (billTitle) billTitle.textContent = curBill.title;
          if (billId) billId.textContent = curBill.id;
          if (billAmt) billAmt.textContent = curBill.amt;
        });
      });

      if (billPayBtn) {
        billPayBtn.addEventListener('click', function(){
          if (billDoneAmt) billDoneAmt.textContent = curBill.amt + ' ریال';
          if (billDoneSub) billDoneSub.textContent = curBill.title + ' · کد پیگیری: ۹۸۴۱۲۰۵۶';
          if (billSheet) billSheet.hidden = false;
        });
      }

      window.openBills = function(){
        if (billSheet) billSheet.hidden = true;
        showPhoneScreen('ph-bills');
      };
    })();


    // =========================================================================
    // REQUIREMENT 3: PURCHASE CREDIT CALCULATOR ENGINE
    // Formula from نحوه محاسبه اقساط اعتبار.docx:
    // مبلغ هر قسط = (اصل مبلغ اعتبار مصرفی / تعداد اقساط) + (اصل مبلغ اعتبار مصرفی * درصد کارمزد)
    // تعداد اقساط: 4، 6، 12، 18، 24 | درصد کارمزد: متغیر (پیش‌فرض 1.9%)
    // =========================================================================
    (function(){
      var root = document.getElementById('creditCalc');
      if (!root) return;
      var FA = '۰۱۲۳۴۵۶۷۸۹';
      function fa(n){
        return Math.round(n).toLocaleString('en-US').replace(/,/g, '٬').replace(/[0-9]/g, function(d){ return FA[+d]; });
      }
      function faDec(n){
        return String(n).replace('.', '٫').replace(/[0-9]/g, function(d){ return FA[+d]; });
      }
      var INSTALLMENT_OPTIONS = [4, 6, 12, 18, 24];
      var amountEl = document.getElementById('calcAmount');
      var countIdxEl = document.getElementById('calcCountIdx');
      var feeRateEl = document.getElementById('calcFeeRate');
      var feeInputEl = document.getElementById('calcFeeInput');

      function renderTicks(r, customLabels){
        var box = r.parentNode.querySelector('.calc-ticks');
        if (!box) return;
        var min = +r.min, max = +r.max, step = +r.step;
        var n = customLabels ? customLabels.length : Math.round((max - min) / step) + 1;
        if (box.children.length !== n) {
          box.textContent = '';
          for (var k = 0; k < n; k++) {
            var d = document.createElement('i'), b = document.createElement('b');
            b.textContent = customLabels ? customLabels[k] : fa((min + k * step) / 1e6);
            d.appendChild(b);
            box.appendChild(d);
          }
        }
        for (var j = 0; j < n; j++) {
          var v = customLabels ? j : (min + j * step);
          var curVal = +r.value;
          box.children[j].className = v < curVal ? 'on' : Math.abs(v - curVal) < 0.001 ? 'cur' : '';
        }
      }

      function renderFeeTicks(r){
        var box = r.parentNode.querySelector('.calc-ticks');
        if (!box) return;
        var marks = [0, 1, 1.9, 3, 4];
        if (box.children.length !== marks.length) {
          box.textContent = '';
          marks.forEach(function(m){
            var d = document.createElement('i'), b = document.createElement('b');
            b.textContent = faDec(m) + '٪';
            d.appendChild(b);
            box.appendChild(d);
          });
        }
        var cur = +r.value;
        marks.forEach(function(m, idx){
          box.children[idx].className = m < cur ? 'on' : Math.abs(m - cur) < 0.05 ? 'cur' : '';
        });
      }

      function updateTrackFill(r, mode){
        var f = (+r.value - +r.min) / (+r.max - +r.min);
        var t = r.parentNode;
        t.style.setProperty('--f', f);
        if (mode === 'amount') renderTicks(r, null);
        else if (mode === 'count') renderTicks(r, ['۴ ماهه', '۶ ماهه', '۱۲ ماهه', '۱۸ ماهه', '۲۴ ماهه']);
        else if (mode === 'fee') renderFeeTicks(r);
      }

      function updateCalculator(){
        var principal = +amountEl.value;
        var count = INSTALLMENT_OPTIONS[+countIdxEl.value] || 12;
        var feePct = +feeRateEl.value;
        var rate = feePct / 100;

        // Exact formula from نحوه محاسبه اقساط اعتبار.docx:
        // مبلغ هر قسط = (اصل مبلغ اعتبار مصرفی / تعداد اقساط) + (درصد کارمزد * اصل مبلغ اعتبار مصرفی)
        var basePerMonth = principal / count;
        var feePerMonth = principal * rate;
        var installment = basePerMonth + feePerMonth;
        var totalRepayment = installment * count;

        updateTrackFill(amountEl, 'amount');
        updateTrackFill(countIdxEl, 'count');
        updateTrackFill(feeRateEl, 'fee');

        document.getElementById('calcAmountOut').innerHTML = fa(principal) + '<small>تومان</small>';
        document.getElementById('calcCountOut').innerHTML = fa(count) + '<small>قسط ماهانه</small>';
        document.getElementById('calcFeeOut').innerHTML = faDec(feePct.toFixed(1).replace(/\.0$/, '')) + '<small>٪ ماهانه</small>';

        document.getElementById('calcInst').textContent = fa(installment);
        document.getElementById('calcFormulaText').textContent =
          '(' + principal.toLocaleString('en-US') + ' ÷ ' + count + ') + (' + principal.toLocaleString('en-US') + ' × ' + feePct + '%) = ' + Math.round(installment).toLocaleString('en-US');

        document.getElementById('calcResBase').textContent = fa(basePerMonth) + ' تومان';
        document.getElementById('calcResFee').textContent = feePct > 0 ? (fa(feePerMonth) + ' تومان') : 'بدون کارمزد (۰ تومان)';
        document.getElementById('calcResCount').textContent = fa(count) + ' ماهه · کارمزد ' + faDec(feePct) + '٪';
        document.getElementById('calcResTotal').textContent = fa(totalRepayment) + ' تومان';
      }

      amountEl.addEventListener('input', updateCalculator);
      countIdxEl.addEventListener('input', updateCalculator);
      feeRateEl.addEventListener('input', function(){
        feeInputEl.value = feeRateEl.value;
        updateCalculator();
      });
      feeInputEl.addEventListener('input', function(){
        var v = parseFloat(feeInputEl.value);
        if (!isNaN(v) && v >= 0 && v <= 10) {
          feeRateEl.value = Math.min(4, Math.max(0, v));
          var principal = +amountEl.value;
          var count = INSTALLMENT_OPTIONS[+countIdxEl.value] || 12;
          var basePerMonth = principal / count;
          var feePerMonth = principal * (v / 100);
          var installment = basePerMonth + feePerMonth;
          updateTrackFill(feeRateEl, 'fee');
          document.getElementById('calcFeeOut').innerHTML = faDec(v) + '<small>٪ ماهانه</small>';
          document.getElementById('calcInst').textContent = fa(installment);
          document.getElementById('calcResFee').textContent = v > 0 ? (fa(feePerMonth) + ' تومان') : 'بدون کارمزد';
          document.getElementById('calcResCount').textContent = fa(count) + ' ماهه · کارمزد ' + faDec(v) + '٪';
          document.getElementById('calcResTotal').textContent = fa(installment * count) + ' تومان';
        }
      });

      window.setCalcPreset = function(amt, cIdx, fee){
        amountEl.value = amt;
        countIdxEl.value = cIdx;
        feeRateEl.value = fee;
        feeInputEl.value = fee;
        updateCalculator();
      };

      updateCalculator();
    })();

    // =========================================================================
    // REQUIREMENT 4: INTERACTIVE APP DEMO ENGINE (PWA + ewano-b2b-deck.html)
    // =========================================================================
    (function(){
      var demoTabs = document.querySelectorAll('.demo-tab');
      var prevScreen = 'ph-home';
      function showPhoneScreen(id){
        var cur = document.querySelector('.ph-screen.active');
        if (cur && cur.id !== id) prevScreen = cur.id;
        demoTabs.forEach(function(t){ t.classList.toggle('active', t.dataset.screen === id); });
        document.querySelectorAll('.ph-screen').forEach(function(s){ s.classList.toggle('active', s.id === id); });
      }
      window.showPhoneScreen = showPhoneScreen;
      window.phoneBack = function(){ showPhoneScreen(prevScreen); };
      demoTabs.forEach(function(tab){
        tab.addEventListener('click', function(){ showPhoneScreen(tab.dataset.screen); });
      });
      document.querySelectorAll('.ph-nav a[data-tab]').forEach(function(a){
        a.addEventListener('click', function(){ showPhoneScreen(a.dataset.tab); });
      });
    })();

    // Wallet Cards in Phone Demo (Synced with user's logged-in PWA session balances)
    var walletCards = [
      { label:'موجودی رفاهی (ریال)', value:'۵۰,۰۰۰,۰۰۰', bg:'linear-gradient(135deg,#1AA7E8 0%,#006FA8 100%)', shadow:'rgba(0,111,168,.35)' },
      { label:'موجودی نقدی (ریال)', value:'۱۳۲,۰۰۰,۰۰۰', bg:'linear-gradient(135deg,#27DCAE 0%,#0AAE97 100%)', shadow:'rgba(10,174,151,.35)' },
      { label:'اعتبار اوانو - فراگیر (ریال)', value:'۶۰,۰۰۰,۰۰۰', bg:'linear-gradient(135deg,#FF8A5C 0%,#F4561C 100%)', shadow:'rgba(244,86,28,.35)' }
    ];
    var cardIdx = 1;
    function renderCard(){
      var c = walletCards[cardIdx];
      var center = document.getElementById('cc-center');
      if(!center) return;
      center.style.background = c.bg;
      center.style.boxShadow = '0 16px 32px ' + c.shadow + ', inset 0 1px 0 rgba(255,255,255,.35)';
      document.getElementById('cc-label').textContent = c.label;
      document.getElementById('cc-value').textContent = c.value;
      document.querySelectorAll('.cc-dot').forEach(function(d,i){
        d.style.background = i===cardIdx ? '#0094D8' : '#E4E4E7';
        d.style.width = i===cardIdx ? '14px' : '5px';
        d.style.borderRadius = '99px';
        d.style.transition = 'width .25s ease, background .25s ease';
      });
      var left = walletCards[(cardIdx+2)%3];
      var right = walletCards[(cardIdx+1)%3];
      document.getElementById('cc-left').style.background = left.bg;
      document.getElementById('cc-right').style.background = right.bg;
    }
    var ccBusy = false;
    function animateSwap(dir, target){
      var el = document.getElementById('cc-center');
      if (!el || ccBusy) return;
      cardIdx = typeof target === 'number' ? target : (cardIdx + dir + 3) % 3;
      renderCard();
    }
    window.swapCard = function(dir){ animateSwap(dir); };
    window.goToCard = function(i){ animateSwap(1, i); };
    renderCard();

    var walletReorderMode = false;
    var walletDragEl = null;
    function renumberWallet(){
      var rows = document.querySelectorAll('#walletList .wrow');
      rows.forEach(function(r, i){
        var badge = r.querySelector('.wprio');
        if (badge) badge.textContent = String(i + 1);
      });
    }
    window.toggleWalletReorder = function(){
      walletReorderMode = !walletReorderMode;
      var toggle = document.getElementById('wprioToggle');
      var rows = document.querySelectorAll('#walletList .wrow');
      rows.forEach(function(r){
        var grip = r.querySelector('.wgrip');
        r.setAttribute('draggable', walletReorderMode ? 'true' : 'false');
        if (grip) grip.style.display = walletReorderMode ? 'flex' : 'none';
        r.style.border = walletReorderMode ? '1px dashed #009BA6' : '1px solid #DEE4E3';
      });
      if (toggle) {
        toggle.style.background = walletReorderMode ? '#009BA6' : '#EAF3F2';
        var label = toggle.querySelector('span');
        var icon = toggle.querySelector('svg');
        if (label) { label.style.color = walletReorderMode ? '#fff' : '#161D1C'; label.textContent = walletReorderMode ? 'پایان اولویت‌بندی' : 'اولویت‌بندی کیف پول'; }
        if (icon) icon.style.color = walletReorderMode ? '#fff' : '#009BA6';
      }
    };

    (function(){
      var FA = '۰۱۲۳۴۵۶۷۸۹';
      function fa(s){ return String(s).replace(/[0-9]/g, function(d){ return FA[+d]; }); }
      function en(s){ return String(s).replace(/[۰-۹]/g, function(d){ return FA.indexOf(d); }); }
      function money(n){ return fa(Math.round(n).toLocaleString('en-US')); }
      function $(id){ return document.getElementById(id); }
      if (!$('ph-c2c')) return;

      var dest = $('c2cDest'), amt = $('c2cAmt'), go = $('c2cGo');
      function c2cCheck(){
        var d = en(dest.value).replace(/\D/g, ''), a = +en(amt.value).replace(/\D/g, '');
        $('c2cOwner').hidden = d.length < 16;
        go.disabled = !(d.length === 16 && a > 0);
      }
      dest.addEventListener('input', function(){
        var d = en(dest.value).replace(/\D/g, '').slice(0, 16);
        dest.value = fa(d.replace(/(\d{4})(?=\d)/g, '$1 '));
        c2cCheck();
      });
      amt.addEventListener('input', function(){ var a = en(amt.value).replace(/\D/g, '').slice(0, 12); amt.value = a ? money(+a) : ''; c2cCheck(); });
      Array.prototype.forEach.call(document.querySelectorAll('.phx-quick button'), function(b){
        b.addEventListener('click', function(){ amt.value = money(+b.getAttribute('data-v')); c2cCheck(); });
      });
      go.addEventListener('click', function(){
        $('c2cSumAmt').textContent = amt.value + ' ریال'; $('c2cSumDest').textContent = dest.value;
        $('c2cConfirm').hidden = false; $('c2cDone').hidden = true; $('c2cSheet').hidden = false;
      });
      $('c2cOk').addEventListener('click', function(){
        $('c2cSheet').hidden = true; $('c2cDoneAmt').textContent = amt.value; $('c2cRcDest').textContent = dest.value;
        try { $('c2cRcDate').textContent = new Date().toLocaleString('fa-IR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }); } catch (e) {}
        $('c2cDone').hidden = false;
      });
      window.openC2C = function(){ dest.value = ''; amt.value = ''; $('c2cSheet').hidden = true; $('c2cDone').hidden = true; c2cCheck(); showPhoneScreen('ph-c2c'); };

      var ASSETS = {
        gold:   { name:'طلای ۱۸ عیار', price:74800000, chg:'▲ ۰٫۸٪ امروز', unit:'گرم', dec:3, pts:[40,38,41,39,44,42,47,45,50,49,53,56] },
        silver: { name:'نقرهٔ ۹۹۹', price:1120000, chg:'▲ ۱٫۲٪ امروز', unit:'گرم', dec:2, pts:[30,34,31,36,35,39,37,42,40,45,47,50] },
        fund:   { name:'صندوق درآمد ثابت', price:132450, chg:'▲ ۰٫۰۸٪ امروز', unit:'واحد', dec:0, pts:[20,22,23,25,26,28,30,31,33,35,36,38] }
      };
      var sel = null, invAmt = $('invAmt');
      function spark(pts){ var mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts); return pts.map(function(v, i){ return (i ? 'L' : 'M') + (i / (pts.length - 1) * 280).toFixed(1) + ',' + (56 - (v - mn) / (mx - mn || 1) * 48).toFixed(1); }).join(' '); }
      function invEst(){
        var a = +en(invAmt.value).replace(/\D/g, ''), s = ASSETS[sel];
        if (!s || !a) { $('invEst').textContent = ''; $('invBuy').disabled = true; return; }
        var q = a / s.price;
        $('invEst').textContent = 'معادل حدود ' + fa(s.dec ? q.toFixed(s.dec).replace('.', '٫') : Math.floor(q)) + ' ' + s.unit;
        $('invBuy').disabled = s.dec ? q <= 0 : Math.floor(q) < 1;
      }
      function pick(k){
        sel = k; var s = ASSETS[k];
        Array.prototype.forEach.call(document.querySelectorAll('.inv-item'), function(b){ b.classList.toggle('on', b.getAttribute('data-k') === k); });
        $('invName').textContent = s.name; $('invPrice').textContent = money(s.price); $('invChg').textContent = s.chg;
        $('invSpark').setAttribute('d', spark(s.pts));
        $('invDetail').hidden = false;
        invAmt.value = ''; invEst();
      }
      Array.prototype.forEach.call(document.querySelectorAll('.inv-item'), function(b){ b.addEventListener('click', function(){ pick(b.getAttribute('data-k')); }); });
      invAmt.addEventListener('input', function(){ var a = en(invAmt.value).replace(/\D/g, '').slice(0, 12); invAmt.value = a ? money(+a) : ''; invEst(); });
      $('invBuy').addEventListener('click', function(){
        var s = ASSETS[sel];
        $('invDoneTxt').textContent = $('invEst').textContent.replace('معادل حدود ', '');
        $('invDoneSub').textContent = s.name + ' · ' + invAmt.value + ' ریال';
        $('invSheet').hidden = false;
      });
      window.openInvest = function(){ sel = null; $('invDetail').hidden = true; $('invSheet').hidden = true; invAmt.value = ''; showPhoneScreen('ph-invest'); };

      var STORES = {
        digikala: { name:'دیجی‌کالا', cat:'کالای دیجیتال', cb:'تا ٪۵ برگشت پول', type:'آنلاین و حضوری', tags:['خرید آنلاین','خرید حضوری','تسویه با اوانو'],
          about:'بزرگ‌ترین فروشگاه اینترنتی ایران با تنوع بالای کالای دیجیتال، لوازم خانگی و کالای اساسی. با اوانو می‌توانید نقدی یا اقساطی خرید کنید.',
          branches:[['دیجی‌کالا سنتر — ونک','۲٫۱ کیلومتر','تهران، خیابان ونک، نبش خیابان گاندی'],['دیجی‌کالا — شریعتی','۴٫۶ کیلومتر','تهران، خیابان شریعتی، بالاتر از پل رومی']] },
        snapp: { name:'اسنپ', cat:'حمل‌ونقل و خدمات', cb:'تا ٪۳ برگشت پول', type:'آنلاین', tags:['سفر درون‌شهری','پرداخت درون‌برنامه‌ای'], about:'سفرهای درون‌شهری و خدمات اسنپ را با کیف پول اوانو پرداخت کنید.', branches:[] },
        shahrvand: { name:'فروشگاه شهروند', cat:'سوپرمارکت و هایپرمارکت', cb:'تا ٪۴ برگشت پول', type:'حضوری و آنلاین', tags:['کالای اساسی','خرید حضوری','بستهٔ ارزاق'],
          about:'فروشگاه‌های زنجیره‌ای شهروند با تنوع کالای اساسی؛ کارت ارزاق اوانو در همهٔ شعب قابل استفاده است.',
          branches:[['شهروند — بیهقی','۳٫۲ کیلومتر','تهران، میدان آرژانتین، خیابان بیهقی'],['شهروند — صادقیه','۷٫۸ کیلومتر','تهران، فلکهٔ دوم صادقیه']] },
        okala: { name:'اکالا', cat:'سوپرمارکت آنلاین', cb:'تا ٪۳ برگشت پول', type:'آنلاین', tags:['ارسال سریع','خرید آنلاین'], about:'سوپرمارکت آنلاین با ارسال در همان روز؛ پرداخت با کیف پول و کارت ارزاق اوانو.', branches:[] }
      };
      window.openStore = function(k, el){
        var s = STORES[k]; if (!s) return;
        var img = el && el.querySelector('img');
        $('stTitle').textContent = s.name; $('stName').textContent = s.name; $('stName2').textContent = s.name;
        $('stCat').textContent = s.cat; $('stCb').textContent = s.cb; $('stCb2').textContent = s.cb.replace(' برگشت پول', ' روی هر خرید'); $('stType').textContent = s.type;
        $('stAbout').textContent = s.about;
        var lg = $('stLogo'); lg.textContent = ''; if (img) { var c = img.cloneNode(); c.removeAttribute('style'); lg.appendChild(c); }
        var tg = $('stTags'); tg.textContent = ''; s.tags.forEach(function(t){ var x = document.createElement('span'); x.textContent = t; tg.appendChild(x); });
        var br = $('stBranches'); br.textContent = '';
        s.branches.forEach(function(b){ var d = document.createElement('div'); d.className = 'st-br';
          d.innerHTML = '<div class="st-br-h"></div><p></p><div class="st-br-acts"><span>تماس</span><span class="nav">مسیریابی</span></div>';
          d.firstChild.textContent = b[0]; var sp = document.createElement('span'); sp.textContent = b[1]; d.firstChild.appendChild(sp); d.children[1].textContent = b[2]; br.appendChild(d); });
        $('stBranchWrap').hidden = !s.branches.length;
        showPhoneScreen('ph-store');
      };

      window.openSearch = function(){ $('srIn').value = ''; $('srResults').hidden = true; $('srIdle').hidden = false; showPhoneScreen('ph-search'); };
      var qa = $('qrAmt'), qp = $('qrPay'), wsel = 'کارت ارزاق';
      window.openScan = function(){ $('qrSheet').hidden = true; showPhoneScreen('ph-qr'); };
      window.qrScanned = function(){ qa.value = ''; qp.disabled = true; $('qrPayBox').hidden = false; $('qrDone').hidden = true; $('qrSheet').hidden = false; };
      if (qa) qa.addEventListener('input', function(){ var a = en(qa.value).replace(/\D/g, '').slice(0, 12); qa.value = a ? money(+a) : ''; qp.disabled = !a; });
      Array.prototype.forEach.call(document.querySelectorAll('#qrWallets button'), function(b){ b.addEventListener('click', function(){
        wsel = b.getAttribute('data-w'); Array.prototype.forEach.call(document.querySelectorAll('#qrWallets button'), function(x){ x.classList.toggle('on', x === b); }); }); });
      if (qp) qp.addEventListener('click', function(){ $('qrDoneAmt').textContent = qa.value + ' ریال'; $('qrDoneW').textContent = wsel; $('qrPayBox').hidden = true; $('qrDone').hidden = false; });

      var log = $('chatLog'), form = $('chatForm'), inp = $('chatIn');
      if (form) {
        form.addEventListener('submit', function(e){
          e.preventDefault(); var q = inp.value.trim(); if (!q) return; inp.value = '';
          var r1 = document.createElement('div'); r1.style.cssText = 'display:flex;margin-bottom:10px;justify-content:flex-end;';
          r1.innerHTML = '<div style="max-width:78%;background:#0088CC;color:#fff;border-radius:14px;padding:8px 12px;font-size:10.5px;">' + q + '</div>';
          log.appendChild(r1);
          setTimeout(function(){
            var ans = /رفاهی/.test(q) ? 'موجودی کارت رفاهی شما ۵۰,۰۰۰,۰۰۰ ریال است.' : /اعتبار/.test(q) ? 'اعتبار فراگیر شما ۶۰,۰۰۰,۰۰۰ ریال و اعتبار همکاری ۱,۵۰۰,۰۰۰,۰۰۰ ریال است.' : 'موجودی نقدی شما ۱۳۲,۰۰۰,۰۰۰ ریال است.';
            var r2 = document.createElement('div'); r2.style.cssText = 'display:flex;margin-bottom:10px;gap:8px;';
            r2.innerHTML = '<div style="max-width:78%;background:#F4F4F5;color:#09090B;border-radius:14px;padding:8px 12px;font-size:10.5px;">' + ans + '</div>';
            log.appendChild(r2); log.scrollTop = log.scrollHeight;
          }, 600);
        });
      }
    })();

    // =========================================================================
    // REQUIREMENT 5: IRAN PROVINCES MAP INFOGRAPHIC ENGINE & LOGO MARQUEE
    // =========================================================================
    (function(){
      var svg = document.querySelector('.imap-svg');
      var metaEl = document.getElementById('imapMeta');
      if (!svg || !metaEl) return;
      var META = JSON.parse(metaEl.textContent);
      var byKey = {}; META.forEach(function(m){ byKey[m.key] = m; });
      var tip = document.querySelector('.imap-tip'), box = document.querySelector('.imap-map');
      var FA = '۰۱۲۳۴۵۶۷۸۹';
      function fa(n){ return n.toLocaleString('en-US').replace(/,/g, '٬').replace(/[0-9]/g, function(d){ return FA[+d]; }); }
      function showTip(el, x, y){
        var m = byKey[el.getAttribute('data-k')];
        if (!m) return;
        var b = box.getBoundingClientRect();
        tip.innerHTML = m.fa + (m.stores ? '<small>' + fa(m.stores) + ' فروشگاه فعال</small>' : '');
        tip.style.left = (x - b.left) + 'px';
        tip.style.top = (y - b.top) + 'px';
        tip.classList.add('show');
      }
      Array.prototype.forEach.call(svg.querySelectorAll('.imap-prov'), function(p){
        p.addEventListener('pointermove', function(e){ showTip(p, e.clientX, e.clientY); });
        p.addEventListener('click', function(e){ showTip(p, e.clientX, e.clientY); });
        p.addEventListener('pointerleave', function(){ tip.classList.remove('show'); });
      });

      // Sliding marquee for merchant logo circles
      Array.prototype.forEach.call(document.querySelectorAll('.logo-dots'), function(lbox){
        var dots = Array.prototype.slice.call(lbox.children);
        if (!dots.length) return;
        var track = document.createElement('div'); track.className = 'lm-track';
        var a = document.createElement('div'); a.className = 'lm-set';
        dots.forEach(function(d){ a.appendChild(d); });
        var b = a.cloneNode(true); b.setAttribute('aria-hidden', 'true');
        track.appendChild(a); track.appendChild(b);
        lbox.appendChild(track); lbox.classList.add('lm');
        lbox.style.setProperty('--lm-dur', (dots.length * 2.5) + 's');
      });
    })();