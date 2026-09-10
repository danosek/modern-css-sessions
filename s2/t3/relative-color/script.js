/* oklch(from …) — přepíná zdrojový token a vypisuje použité hodnoty.
 *
 * Odvozovací pravidla v style.css skript nesahá; mění jen data-src na
 * .rc-derive, tedy to jediné místo, kde je konkrétní token napsaný.
 * Výpisy pak čtou, co z relativních barev prohlížeč skutečně spočítal. */
(function () {
  'use strict';

  var derive = document.querySelector('.rc-derive');
  var buttons = document.querySelectorAll('.seg-btn');
  var items = document.querySelectorAll('.rc-derive__item');

  function refresh() {
    for (var i = 0; i < items.length; i++) {
      var swatch = items[i].querySelector('.rc-derive__swatch');
      var value = items[i].querySelector('.rc-derive__value');
      if (swatch && value) value.textContent = getComputedStyle(swatch).backgroundColor;
    }
  }

  function setSource(name) {
    derive.dataset.src = name;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.rcSrc === name));
    }
    refresh();
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      setSource(this.dataset.rcSrc);
    });
  }

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
