/* overflow-wrap · hyphens — slider šířky a měření, co prohlížeč udělal.
 *
 * CSS drží jedinou proměnnou --oh-w. Skript do lámání nezasahuje: porovná
 * scrollWidth s clientWidth (přetéká?) a z výšky boxu spočítá počet řádků.
 * Zda šlo o dělení se spojovníkem, nebo o násilný zlom, se z geometrie
 * poznat nedá — to je na očích. */
(function () {
  'use strict';

  /* Kolik řádků text zabral — z výšky boxu a řádkování. */
  function lineCount(el) {
    var lh = parseFloat(getComputedStyle(el).lineHeight);
    if (!lh) return 1;
    var inner = el.clientHeight
      - parseFloat(getComputedStyle(el).paddingTop)
      - parseFloat(getComputedStyle(el).paddingBottom);
    return Math.max(1, Math.round(inner / lh));
  }

  var range = document.getElementById('oh-range');
  var out = document.querySelector('[data-oh-out]');
  var boxes = document.querySelectorAll('[data-oh-measure]');
  var states = document.querySelectorAll('[data-oh-state]');

  function refresh() {
    if (range) {
      document.documentElement.style.setProperty('--oh-w', range.value);
      if (out) out.textContent = range.value + 'ch';
    }

    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      var state = states[i];
      if (!state) continue;

      /* Přetečení: obsah je širší než box. Prahová 1px kryje
         zaokrouhlení při subpixelovém layoutu. */
      var over = box.scrollWidth - box.clientWidth > 1;
      var lines = lineCount(box);

      state.className = 'oh-cell__state' + (over ? ' oh-cell__state--over' : '');
      state.textContent = (over ? 'přetéká' : 'vejde se')
        + ' · ' + lines + (lines === 1 ? ' řádek' : ' řádků');
    }
  }

  if (range) range.addEventListener('input', refresh);

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
