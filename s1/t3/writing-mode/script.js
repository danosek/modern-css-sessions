// writing-mode — přepínání osy textu na kartách.
// Karty mají stabilní fyzický rozměr; mění se jen orientace textu a poloha
// logických hran. Fyzický pruh (border-left) zůstane vlevo, logický
// (border-inline-start) se přesune na začátek řádku (ve vertical-rl = nahoru).

const btns  = document.querySelectorAll('.seg-btn');
const cards = document.querySelectorAll('.lp-card');

function setWritingMode(wm) {
  cards.forEach(c => c.style.writingMode = wm);
  btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.wm === wm)));
}

btns.forEach(b => b.addEventListener('click', () => setWritingMode(b.dataset.wm)));

setWritingMode('horizontal-tb');
