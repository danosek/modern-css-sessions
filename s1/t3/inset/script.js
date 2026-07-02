// Zkratka inset — posuvník mění odsazení boxu od containeru. Jedna CSS proměnná
// (--inset) řídí obě verze najednou: fyzickou (top/right/bottom/left) i logickou
// (inset) — vizuálně dokazuje, že dávají identický výsledek.

const range = document.getElementById('inset-range');
const out   = document.getElementById('inset-val');
const boxes = document.querySelector('.lp-inset-boxes');

function update() {
  const value = range.value + '%';
  boxes.style.setProperty('--inset', value);
  out.textContent = 'inset: ' + value;
}

range.addEventListener('input', update);
update();
