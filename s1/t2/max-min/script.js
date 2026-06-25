// max() · min() — řízené centrování: přepínání techniky aplikované na .wrapper.

const btns      = document.querySelectorAll('.seg-btn');
const wrapper   = document.querySelector('.cc-wrapper');
const stage     = document.querySelector('.cc-stage');
const solutions = document.querySelectorAll('.cc-solution');
const widthOut  = document.querySelector('[data-cc-width]');
const ctxOut    = document.querySelector('[data-cc-context]');

function setTechnique(t) {
  wrapper.dataset.technique = t;
  btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.technique === t)));
  solutions.forEach(s => s.classList.toggle('is-active', s.dataset.technique === t));
  updateWidth();
}

function updateWidth() {
  // šířka kontejneru (obsahová šířka stage) — referenční hodnota pro 100%
  if (ctxOut && stage) ctxOut.textContent = Math.round(stage.clientWidth) + 'px';
  if (widthOut) widthOut.textContent = 'obsah: ' + Math.round(wrapper.getBoundingClientRect().width) + 'px';
}

btns.forEach(b => b.addEventListener('click', () => setTechnique(b.dataset.technique)));
const ro = new ResizeObserver(updateWidth);
ro.observe(wrapper);
ro.observe(stage);

// počáteční sync (aktivní řešení = max)
setTechnique('max');
