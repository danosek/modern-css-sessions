// Přepínač kroku 3. Všechny tři varianty jsou skutečná pravidla ve style.css;
// přepínač jen rozhoduje, které z nich na tlačítku platí. O výsledné barvě
// pak rozhodne kaskáda vrstev, nic se nedopočítává v JS.

const ghost   = document.querySelector('.rv-btn--ghost, .rv-btn--revert, #rv-ghost-btn');
const btns    = document.querySelectorAll('.seg-btn');
const readout = document.getElementById('rv-readout');
const step3   = document.getElementById('rv-step3');
const swatch  = document.getElementById('rv-swatch');
const decl    = document.getElementById('rv-decl');
const verdict = document.getElementById('rv-verdict');
const cap     = document.getElementById('rv-cap');
const note    = document.getElementById('rv-note');

const VARIANTS = {
  'none': {
    cls: '',
    readout: 'bez deklarace',
    decl: '.rv-btn (bez modifikátoru)',
    swatch: 'var(--surface-brand-primary-strong)',
    verdict: 'ghost = krok 2, nic se nevrací',
    cap: '↑ krok 3 = krok 2',
    win: false,
    note: 'Bez deklarace platí pro ghost pořád krok 2 — obě tlačítka jsou stejná.',
  },
  'revert-layer': {
    cls: 'rv-btn--ghost',
    readout: 'background: revert-layer',
    decl: '.rv-btn--ghost { background: revert-layer }',
    swatch: 'var(--surface-gray-strong)',
    verdict: '[ WIN ] pro ghost → hodnota z kroku 1',
    cap: '↑ krok 3 = krok 1',
    win: true,
    note: 'Vzorek u kroku 3 je tentýž jako u kroku 1 — revert-layer jde o jednu vrstvu níž, ne na průhlednou.',
  },
  'revert': {
    cls: 'rv-btn--revert',
    readout: 'background: revert',
    decl: '.rv-btn--revert { background: revert }',
    swatch: 'buttonface',
    verdict: 'až na styl prohlížeče — krok 1 se přeskočí',
    cap: '↑ krok 3 = styl prohlížeče',
    win: false,
    note: 'Tady je ten rozdíl: revert přeskočí všechny vrstvy až na styl prohlížeče, kdežto revert-layer se zastaví o jednu vrstvu níž.',
  },
};

function apply(value) {
  const v = VARIANTS[value];

  // Aktivní zůstane právě jedna varianta ze style.css.
  ghost.className = 'rv-btn' + (v.cls ? ' ' + v.cls : '');

  btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === value)));
  readout.textContent = v.readout;
  decl.textContent = v.decl;
  swatch.style.background = v.swatch;
  verdict.textContent = v.verdict;
  cap.textContent = v.cap;
  step3.classList.toggle('ex-rule--win', v.win);
  note.textContent = v.note;
}

btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.value)));

apply('revert-layer');
