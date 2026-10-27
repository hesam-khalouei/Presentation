/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Purchase Credit Calculator Engine
   ───────────────────────────────────────────────────────────────
   فرمول رسمی (از سند نحوه محاسبه اقساط):
     مبلغ هر قسط = (اصل اعتبار ÷ تعداد اقساط) + (اصل اعتبار × درصد کارمزد)
   تعداد اقساط: ۴، ۶، ۱۲، ۱۸، ۲۴ ماهه
   درصد کارمزد: متغیر (پیش‌فرض ۱.۹٪)
   ═══════════════════════════════════════════════════════════════ */

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
    