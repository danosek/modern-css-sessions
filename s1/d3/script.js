
// D8 – Logical Properties: toggle dir="rtl" / dir="ltr" na demo kontejneru

document.querySelectorAll('.lp-dir-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const demo = btn.closest('.lp-demo-wrap');
    const current = demo.getAttribute('dir');
    const next = current === 'rtl' ? 'ltr' : 'rtl';

    demo.setAttribute('dir', next);
    btn.textContent = next === 'rtl' ? '→ Přepnout na LTR' : '→ Přepnout na RTL';

    // Aktualizuj badge se směrem
    const badge = demo.querySelector('#lp-dir-label');
    if (badge) {
      badge.innerHTML = `Aktuální směr: <strong>${next.toUpperCase()}</strong>`;
    }
  });
});
