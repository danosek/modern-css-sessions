/* font-feature-settings — ověří, co font umí a co se v kaskádě ztratilo.
 *
 * Obojí se pozná jedině z geometrie: featura, kterou font nemá a prohlížeč
 * nedopočítal, nezmění šířku vůbec. A featura shozená potomkem se pozná
 * tak, že se dvě čísla se stejným obsahem přestanou krýt. */
(function () {
  'use strict';

  function w(el) {
    return el.getBoundingClientRect().width;
  }

  /* ── Syntéza vs. surový tag */

  function checkCaps() {
    var ref = document.querySelector('[data-fs-ref]');
    if (!ref) return;
    var base = w(ref);

    var probes = document.querySelectorAll('[data-fs-probe]');
    var states = document.querySelectorAll('[data-fs-state]');

    for (var i = 0; i < probes.length; i++) {
      var diff = Math.abs(w(probes[i]) - base);
      var none = diff < 0.3;
      if (!states[i]) continue;
      states[i].textContent = none
        ? 'šířka se nezměnila — nestalo se nic'
        : 'šířka o ' + diff.toFixed(1) + ' px jinde — zabralo';
      states[i].dataset.fsNone = String(none);
    }
  }

  /* ── Přepsání výčtu v kaskádě */

  function checkReset() {
    var pairs = [
      ['[data-fs-parent]', '[data-fs-child]', '[data-fs-reset]', true],
      ['[data-fs-okparent]', '[data-fs-okchild]', '[data-fs-ok]', false]
    ];

    pairs.forEach(function (p) {
      var parent = document.querySelector(p[0]);
      var child = document.querySelector(p[1]);
      var out = document.querySelector(p[2]);
      if (!parent || !child || !out) return;

      var diff = Math.abs(w(parent) - w(child));
      var lost = diff > 0.3;

      out.textContent = lost
        ? 'rozdíl ' + diff.toFixed(1) + ' px — potomek tabulární sadu shodil'
        : 'shodná šířka — tabulární sada drží';
      out.dataset.fsLost = String(lost);
    });
  }

  function refresh() {
    checkCaps();
    checkReset();
  }

  /* Metriky se počítají z fontu, takže až po jeho doběhnutí. */
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
