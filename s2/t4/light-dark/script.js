/* light-dark() — vypisuje k barevným vzorkům jejich použitou hodnotu.
 *
 * V CSS je u každého vzorku jediná deklarace (background: var(--token)).
 * Tenhle skript jen přečte, co z ní prohlížeč po vyhodnocení light-dark()
 * skutečně udělal, a přepíše výpis při každé změně data-theme. */
(function () {
  'use strict';

  var items = document.querySelectorAll('.ld-proof__item');

  function refresh() {
    for (var i = 0; i < items.length; i++) {
      var swatch = items[i].querySelector('.ld-proof__swatch');
      var value = items[i].querySelector('.ld-proof__value');
      if (swatch && value) value.textContent = getComputedStyle(swatch).backgroundColor;
    }
  }

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
