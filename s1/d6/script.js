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

// Nav: click any link to move .is-active
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});
