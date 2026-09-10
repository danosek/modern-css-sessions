/* contrast-color() — čte, co funkce reálně vrátila, a krmí ji barvou z pickeru.
 *
 * V CSS je u každé buňky jediná deklarace (color: contrast-color(...)). Skript
 * do CSS nezasahuje: jen přečte použitou hodnotu, a u pickeru přepíše jedinou
 * custom property, ze které funkce počítá. */
(function () {
  'use strict';

  /* rgb(0, 0, 0) → black. Cokoli jiného vypíšeme, jak přišlo. */
  function keyword(value) {
    if (value === 'rgb(0, 0, 0)') return 'black';
    if (value === 'rgb(255, 255, 255)') return 'white';
    return value;
  }

  /* ── Mřížka povrchů: co funkce vrátila na každém z nich */

  var cells = document.querySelectorAll('.cc-proof__cell');

  function refreshCells() {
    for (var i = 0; i < cells.length; i++) {
      var line = cells[i].querySelector('.cc-proof__line--auto');
      var out = cells[i].querySelector('.cc-proof__out');
      if (line && out) out.textContent = '→ ' + keyword(getComputedStyle(line).color);
    }
  }

  /* ── Hranice funkce: tři role textu vedle sebe, dvakrát */

  var rows = document.querySelectorAll('.cc-limit__row');

  function refreshRows() {
    for (var i = 0; i < rows.length; i++) {
      var out = rows[i].querySelector('.cc-limit__val');
      if (out) out.textContent = keyword(getComputedStyle(rows[i]).color);
    }
  }

  /* ── Picker: barva, kterou generátor tokenů nikdy neviděl */

  var live = document.querySelector('.cc-live');
  var input = document.getElementById('cc-pick');
  var echo = document.querySelector('[data-cc-echo]');
  var result = document.querySelector('.cc-live [data-fn-value]');
  var swatch = document.querySelector('.cc-live__swatch');
  var random = document.querySelector('[data-cc-random]');

  function applyPick() {
    if (!live || !input) return;
    live.style.setProperty('--cc-pick', input.value);
    if (echo) echo.textContent = input.value;
    if (result && swatch) result.textContent = keyword(getComputedStyle(swatch).color);
  }

  if (random && input) {
    random.addEventListener('click', function () {
      var hex = Math.floor(Math.random() * 0x1000000).toString(16);
      input.value = '#' + ('000000' + hex).slice(-6);
      applyPick();
    });
  }

  if (input) input.addEventListener('input', applyPick);

  function refreshAll() {
    refreshCells();
    refreshRows();
    applyPick();
  }

  refreshAll();

  new MutationObserver(refreshAll).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
