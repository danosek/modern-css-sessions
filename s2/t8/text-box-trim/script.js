/* text-box-trim — změří, o kolik trim zmenšil box.
 *
 * CSS nastavuje jedinou vlastnost. Skript přečte skutečnou výšku
 * vykresleného prvku a spočítá, kolik z řádkování zbylo — půlmezera je
 * rozdíl mezi řádkem a tím, co box zabírá po odříznutí. */
(function () {
  'use strict';

  var boxes = document.querySelectorAll('[data-tb-measure]');
  var outs = document.querySelectorAll('[data-tb-num]');

  function refresh() {
    if (!boxes.length) return;
    var base = boxes[0].getBoundingClientRect().height;

    for (var i = 0; i < boxes.length; i++) {
      var h = boxes[i].getBoundingClientRect().height;
      var out = outs[i];
      if (!out) continue;

      var saved = base - h;
      out.innerHTML = 'výška <strong>' + h.toFixed(1) + ' px</strong>'
        + (saved > 0.5 ? ' · ubráno ' + saved.toFixed(1) + ' px' : ' · plné řádkování');
    }
  }

  /* Až po doběhnutí fontu — půlmezera se počítá z jeho metrik, takže
     před loadem by čísla platila pro fallback. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  } else {
    refresh();
  }

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
