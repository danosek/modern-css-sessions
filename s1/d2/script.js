// ── Fullscreen sections: měření výšky nad demo-stage ─────────────────────
(function () {
  function update() {
    var stage = document.querySelector('.demo-stage');
    if (!stage) return;
    document.documentElement.style.setProperty(
      '--above-stage-h',
      Math.round(stage.getBoundingClientRect().top) + 'px'
    );
  }
  update();
  window.addEventListener('resize', update);
}());

// D9 — CSS Comparison Functions
// Žádná JavaScript logika není potřeba — vše je řešeno čistým CSS.
