
const btns      = document.querySelectorAll('.sizing-btn');
const box       = document.querySelector('.demo-box');
const stage     = document.querySelector('.live-stage');
const indicator = document.querySelector('.width-indicator');
const widthVal  = document.getElementById('width-value');

function updateWidth() {
  const w = Math.round(stage.getBoundingClientRect().width);
  widthVal.textContent = w + 'px';
  indicator.style.width = w + 'px';
}

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    box.dataset.sizing = btn.dataset.value;
    requestAnimationFrame(updateWidth);
  });
});

new ResizeObserver(updateWidth).observe(stage);
updateWidth();
