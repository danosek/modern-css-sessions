// dir — přepínání směru čtení JEN na kartách.
// Karty zůstávají na svých pozicích (grid je LTR), takže je vidět, jak se
// u logické karty překlopí inline-start (barevný pruh) na druhou stranu,
// kdežto u fyzické (border-left) zůstane vlevo.

const btns  = document.querySelectorAll('.seg-btn');
const cards = document.querySelectorAll('.lp-card');

function setDir(dir) {
  cards.forEach(c => c.setAttribute('dir', dir));
  btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dir === dir)));
}

btns.forEach(b => b.addEventListener('click', () => setDir(b.dataset.dir)));

setDir('ltr');
