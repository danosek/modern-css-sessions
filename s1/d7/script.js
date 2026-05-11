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

// Range Container Queries — D7
// Statické kontejnery nepotřebují žádný JS.
// Breakpointy karty jsou plně řešeny CSS range syntaxí:
//   @container product (width < 360px)          { ... }
//   @container product (360px <= width < 560px) { ... }
//   @container product (width >= 560px)         { ... }
