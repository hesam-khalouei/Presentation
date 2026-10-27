/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Purchase Credit Calculator Engine
   ═══════════════════════════════════════════════════════════════ */

(function() {
  const root = document.getElementById('creditCalc');
  if (!root) return;

  const FA = '۰۱۲۳۴۵۶۷۸۹';
  const INSTALLMENT_OPTIONS = [4, 6, 12, 18, 24];
  
  const el = {
    amount: document.getElementById('calcAmount'),
    countIdx: document.getElementById('calcCountIdx'),
    feeRate: document.getElementById('calcFeeRate'),
    feeInput: document.getElementById('calcFeeInput'),
    amountOut: document.getElementById('calcAmountOut'),
    countOut: document.getElementById('calcCountOut'),
    feeOut: document.getElementById('calcFeeOut'),
    inst: document.getElementById('calcInst'),
    formula: document.getElementById('calcFormulaText'),
    resBase: document.getElementById('calcResBase'),
    resFee: document.getElementById('calcResFee'),
    resCount: document.getElementById('calcResCount'),
    resTotal: document.getElementById('calcResTotal')
  };

  const fa = n => Math.round(n).toLocaleString('en-US').replace(/,/g, '٬').replace(/[0-9]/g, d => FA[+d]);
  const faDec = n => String(n).replace('.', '٫').replace(/[0-9]/g, d => FA[+d]);

  function renderTicks(r, labels) {
    const box = r.parentNode.querySelector('.calc-ticks');
    if (!box) return;
    const min = +r.min, max = +r.max, step = +r.step;
    const n = labels ? labels.length : Math.round((max - min) / step) + 1;
    
    if (box.children.length !== n) {
      box.innerHTML = '';
      for (let k = 0; k < n; k++) {
        const d = document.createElement('i'), b = document.createElement('b');
        b.textContent = labels ? labels[k] : fa((min + k * step) / 1e6);
        d.appendChild(b);
        box.appendChild(d);
      }
    }
    
    const curVal = +r.value;
    for (let j = 0; j < n; j++) {
      const v = labels ? j : (min + j * step);
      box.children[j].className = v < curVal ? 'on' : Math.abs(v - curVal) < 0.001 ? 'cur' : '';
    }
  }

  function updateTrackFill(r, mode) {
    const f = (+r.value - +r.min) / (+r.max - +r.min);
    r.parentNode.style.setProperty('--f', f);
    
    if (mode === 'amount') renderTicks(r, null);
    else if (mode === 'count') renderTicks(r, ['۴ ماهه', '۶ ماهه', '۱۲ ماهه', '۱۸ ماهه', '۲۴ ماهه']);
    else if (mode === 'fee') {
      const marks = [0, 1, 1.9, 3, 4];
      const box = r.parentNode.querySelector('.calc-ticks');
      if (box.children.length !== marks.length) {
        box.innerHTML = '';
        marks.forEach(m => {
          const d = document.createElement('i'), b = document.createElement('b');
          b.textContent = faDec(m) + '٪';
          d.appendChild(b);
          box.appendChild(d);
        });
      }
      const cur = +r.value;
      marks.forEach((m, idx) => {
        box.children[idx].className = m < cur ? 'on' : Math.abs(m - cur) < 0.05 ? 'cur' : '';
      });
    }
  }

  function updateCalculator() {
    const principal = +el.amount.value;
    const count = INSTALLMENT_OPTIONS[+el.countIdx.value] || 12;
    const feePct = +el.feeRate.value;
    
    const basePerMonth = principal / count;
    const feePerMonth = principal * (feePct / 100);
    const installment = basePerMonth + feePerMonth;
    const totalRepayment = installment * count;

    updateTrackFill(el.amount, 'amount');
    updateTrackFill(el.countIdx, 'count');
    updateTrackFill(el.feeRate, 'fee');

    el.amountOut.innerHTML = fa(principal) + '<small>تومان</small>';
    el.countOut.innerHTML = fa(count) + '<small>قسط ماهانه</small>';
    el.feeOut.innerHTML = faDec(feePct.toFixed(1).replace(/\.0$/, '')) + '<small>٪ ماهانه</small>';

    el.inst.textContent = fa(installment);
    el.formula.textContent = `(${principal.toLocaleString('en-US')} ÷ ${count}) + (${principal.toLocaleString('en-US')} × ${feePct}%) = ${Math.round(installment).toLocaleString('en-US')}`;

    el.resBase.textContent = fa(basePerMonth) + ' تومان';
    el.resFee.textContent = feePct > 0 ? (fa(feePerMonth) + ' تومان') : 'بدون کارمزد (۰ تومان)';
    el.resCount.textContent = fa(count) + ' ماهه · کارمزد ' + faDec(feePct) + '٪';
    el.resTotal.textContent = fa(totalRepayment) + ' تومان';
  }

  // Event Listeners
  el.amount.addEventListener('input', updateCalculator);
  el.countIdx.addEventListener('input', updateCalculator);
  
  el.feeRate.addEventListener('input', () => {
    el.feeInput.value = el.feeRate.value;
    updateCalculator();
  });
  
  el.feeInput.addEventListener('input', () => {
    const v = parseFloat(el.feeInput.value);
    if (!isNaN(v) && v >= 0 && v <= 10) {
      el.feeRate.value = Math.min(4, Math.max(0, v));
      updateCalculator();
    }
  });

  window.setCalcPreset = function(amt, cIdx, fee) {
    el.amount.value = amt;
    el.countIdx.value = cIdx;
    el.feeRate.value = fee;
    el.feeInput.value = fee;
    updateCalculator();
  };

  updateCalculator();
})();