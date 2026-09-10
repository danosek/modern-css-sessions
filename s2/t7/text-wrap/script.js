/* text-wrap — dva slidery a měření toho, jak text doopravdy padl.
 *
 * Do lámání skript nezasahuje. Přes Range projede text po znacích,
 * pozná z geometrie, kde prohlížeč zalomil, a z toho spočítá délky
 * řádků (pro balance) a poslední řádek (pro pretty). */
(function () {
  'use strict';

  /* Text rozdělený tak, jak doopravdy padl. Nový řádek se pozná podle
     skoku v top; bílé znaky na zlomu mají nulový rámec a přeskočí se. */
  function lines(el) {
    var node = el.firstChild;
    while (node && node.nodeType !== 3) node = node.firstChild;
    if (!node) return [];

    var text = node.textContent;
    var range = document.createRange();
    var out = [''];
    var lastTop = null;

    for (var i = 0; i < text.length; i++) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      var rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) continue;

      if (lastTop !== null && Math.abs(rect.top - lastTop) > 1) out.push('');
      lastTop = rect.top;
      out[out.length - 1] += text[i];
    }
    return out;
  }

  /* ── balance: délky všech řádků a jejich rozptyl */

  var headRange = document.getElementById('tw-head-range');
  var headOut = document.querySelector('[data-tw-head-out]');
  var heads = document.querySelectorAll('[data-tw-lines]');
  var headReports = document.querySelectorAll('[data-tw-lines-out]');

  function refreshHeads() {
    if (headRange) {
      document.documentElement.style.setProperty('--tw-head-w', headRange.value);
      if (headOut) headOut.textContent = headRange.value + 'ch';
    }

    for (var i = 0; i < heads.length; i++) {
      var all = lines(heads[i]).map(function (l) { return l.trim().length; })
        .filter(function (n) { return n > 0; });
      var report = headReports[i];
      if (!report) continue;

      if (!all.length) { report.textContent = '—'; continue; }
      var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
      report.innerHTML = 'řádky ' + all.join(' · ')
        + ' · <strong>rozdíl ' + (max - min) + '</strong>';
    }
  }

  /* ── pretty: poslední řádek a počet slov na něm */

  var paraRange = document.getElementById('tw-para-range');
  var paraOut = document.querySelector('[data-tw-para-out]');
  var paras = document.querySelectorAll('[data-tw-last]');
  var paraReports = document.querySelectorAll('[data-tw-last-out]');

  function refreshParas() {
    if (paraRange) {
      document.documentElement.style.setProperty('--tw-para-w', paraRange.value);
      if (paraOut) paraOut.textContent = paraRange.value + 'ch';
    }

    for (var i = 0; i < paras.length; i++) {
      var all = lines(paras[i]);
      var report = paraReports[i];
      if (!report) continue;

      if (!all.length) { report.textContent = '—'; continue; }
      var last = all[all.length - 1].trim();
      var words = last ? last.split(/\s+/).length : 0;

      report.innerHTML = all.length + ' řádků · poslední ' + last.length + ' znaků, '
        + '<strong>' + words + (words === 1 ? ' slovo — sirotek' : ' slova') + '</strong>';
      report.dataset.twOrphan = String(words === 1);
    }
  }

  if (headRange) headRange.addEventListener('input', refreshHeads);
  if (paraRange) paraRange.addEventListener('input', refreshParas);

  function refresh() {
    refreshHeads();
    refreshParas();
  }

  /* Až po doběhnutí webfontu — šířka je v ch, takže se před ním
     počítá z fallbacku a čísla by neplatila pro to, co je vidět. */
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
