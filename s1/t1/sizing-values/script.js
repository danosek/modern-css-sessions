
const btns      = document.querySelectorAll('.seg-btn');
const box       = document.querySelector('.demo-box');
const stage     = document.querySelector('.live-stage');
const indicator = document.querySelector('.width-indicator');
const widthVal  = document.getElementById('width-value');

// Měříme BOX (ne stage) — číslo i délka pravítka se mění s vybranou hodnotou.
// Stage má border a padding, takže box nezačíná na levé hraně sekce; pravítko
// proto odsadíme o skutečnou vzdálenost boxu od hrany, aby s ním lícovalo.
function updateWidth() {
  const boxRect = box.getBoundingClientRect();
  const secRect = indicator.parentElement.getBoundingClientRect();
  const offset  = boxRect.left - secRect.left;

  // Naměřená hodnota je vždy skutečná šířka boxu; pravítko se jen nikdy
  // neprotáhne za sekci, aby při přetečení neuteklo i s číslem mimo okno.
  widthVal.textContent = Math.round(boxRect.width) + 'px';
  indicator.style.width = Math.round(Math.min(boxRect.width, secRect.width - offset)) + 'px';
  indicator.style.marginInlineStart = Math.round(offset) + 'px';
}

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    box.dataset.sizing = btn.dataset.value;
    requestAnimationFrame(updateWidth);
  });
});

// Box mění šířku přepínačem, stage resizem (roh) — sledujeme obojí.
new ResizeObserver(updateWidth).observe(box);
new ResizeObserver(updateWidth).observe(stage);
// Když box přeteče stage a divák jím odscrolluje, pravítko zůstane u boxu.
stage.addEventListener('scroll', updateWidth);
updateWidth();
