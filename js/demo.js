/* ═══════════════════════════════════════════════════════════════
   EWANO B2B — Interactive PWA Demo Engine
   ───────────────────────────────────────────────────────────────
   • Phone screen tabs (ph-home, ph-c2c, ...)
   • Back navigation
   • Tab click handlers
   ═══════════════════════════════════════════════════════════════ */

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