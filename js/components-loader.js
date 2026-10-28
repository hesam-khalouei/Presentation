/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Components Loader
   بارگذاری داینامیک Header, Footer, Drawer
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const COMPONENTS = [
  { file: 'drawer.html', target: '#drawerSlot' }
  ];

  async function loadComponent({ file, target }) {
    try {
      const response = await fetch('components/' + file);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const el = document.querySelector(target);
      if (el) el.innerHTML = html;
    } catch (err) {
      console.error(`[ComponentsLoader] خطا در بارگذاری ${file}:`, err);
    }
  }

  async function initComponents() {
    await Promise.all(COMPONENTS.map(loadComponent));
    console.log('✅ Header, Footer, Drawer بارگذاری شدند.');
    window.dispatchEvent(new Event('componentsLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
async function initComponents() {
  await Promise.all(COMPONENTS.map(loadComponent));
  console.log('✅ Header, Footer, Drawer بارگذاری شدند.');
  window.componentsLoadedFlag = true;  // ← این خط رو اضافه کن
  window.dispatchEvent(new Event('componentsLoaded'));
}