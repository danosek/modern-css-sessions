/* font-variant-numeric — změří šířku číslic a ověří, co font umí.
 *
 * Šířka se nedá odečíst ze zápisu — je to vlastnost fontu. Skript proto
 * vysází každou číslici zvlášť do skryté sondy, která zdědí styl té
 * tabulky, a porovná výsledky. Když jsou všechny stejné, sada je
 * tabulární; když se liší, sloupec bude poskakovat. */
(function () {
  'use strict';

  var DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /* Sonda se vloží do měřeného prvku, aby zdědila font i variant. */
  function digitWidths(host) {
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
    host.appendChild(probe);

    var widths = DIGITS.map(function (d) {
      probe.textContent = d;
      return probe.getBoundingClientRect().width;
    });

    probe.remove();
    return widths;
  }

  /* Šířka vysázeného čísla, ne jeho boxu. */
  function textWidth(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().width;
  }

  function report() {
    var table = document.querySelector('[data-tn-table]');
    var out = document.querySelector('[data-tn-num]');
    if (!table || !out) return;

    var w = digitWidths(table);
    var min = Math.min.apply(null, w), max = Math.max.apply(null, w);
    var spread = max - min;

    /* Rozptyl šířek celých čísel — to je ta viditelná věc: všechna mají
       šest míst, takže rozdíl dělají výhradně číslice. */
    var rows = [];
    table.querySelectorAll('.tn-num').forEach(function (n) { rows.push(textWidth(n)); });
    var rmin = Math.min.apply(null, rows), rmax = Math.max.apply(null, rows);
    var jitter = rmax - rmin > 0.3;

    out.innerHTML = 'šířky číslic 0–9: '
      + (spread > 0.3 ? min.toFixed(2) + ' … ' + max.toFixed(2) : min.toFixed(2)) + ' px · '
      + '<strong>' + (jitter
        ? 'řádky se liší až o ' + (rmax - rmin).toFixed(1) + ' px'
        : 'všechny řádky shodné') + '</strong>';
    out.dataset.tnJitter = String(jitter);
  }

  /* Zabralo slashed-zero a oldstyle-nums, nebo se deklarace tiše
     ignorovala? Porovnáme s kontrolním vzorkem. */
  function checkExtras() {
    var ref = document.querySelector('[data-tn-ref]');
    if (!ref) return;
    var base = ref.getBoundingClientRect().width;

    var probes = document.querySelectorAll('[data-tn-probe]');
    var states = document.querySelectorAll('[data-tn-state]');

    for (var i = 0; i < probes.length; i++) {
      var same = Math.abs(probes[i].getBoundingClientRect().width - base) < 0.3;
      if (!states[i]) continue;
      /* Shodná šířka sama nedokazuje, že se nic nestalo — jen že se
         nezměnily metriky. Proto to formulujeme opatrně. */
      states[i].textContent = same
        ? 'šířka se nezměnila — font tuhle sadu nemá'
        : 'jiná šířka — font tuhle sadu má';
      states[i].dataset.tnNone = String(same);
    }
  }


  /* ── Rozteč mřížky
     Šířka číslice v tabulární sadě, vyjádřená jako násobek em — pak
     platí i v jiné velikosti písma. */
  function setAdvance() {
    var host = document.querySelector('[data-tn-table]');
    if (!host) return;
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;'
      + 'font-variant-numeric:tabular-nums';
    probe.textContent = '0';
    host.appendChild(probe);
    var size = parseFloat(getComputedStyle(host).fontSize);
    var adv = probe.getBoundingClientRect().width / size;
    probe.remove();
    document.documentElement.style.setProperty('--tn-adv', adv.toFixed(4) + 'em');
  }

  /* ── Živý součet
     Číslo roste jako běžný přepočet a s každou změnou se v proporcionální
     sadě mění jeho šířka. Pravý okraj drží, takže cestuje ten levý —
     a přesně tu cestu měříme. */
  var FIGURE_SPACE = '\u2007';
  var START = 1000000;

  var live = document.querySelector('[data-tn-live]');
  var travels = document.querySelectorAll('[data-tn-travel]');
  var runBtn = document.querySelector('[data-tn-run]');
  var stepBtn = document.querySelector('[data-tn-step]');
  var resetBtn = document.querySelector('[data-tn-reset]');

  var value = START;
  var timer = null;
  var seen = {};

  function mode() {
    return document.documentElement.getAttribute('data-tn-mode') || 'normal';
  }

  function group(n) {
    return String(n).replace(/\B(?=(\d{3})+$)/g, FIGURE_SPACE);
  }

  function paint() {
    if (!live) return;
    live.textContent = group(value);

    var m = mode();
    if (!seen[m]) seen[m] = { min: Infinity, max: -Infinity };
    var w = textWidth(live);
    if (w < seen[m].min) seen[m].min = w;
    if (w > seen[m].max) seen[m].max = w;

    for (var i = 0; i < travels.length; i++) {
      var key = travels[i].getAttribute('data-tn-travel');
      var rec = seen[key];
      var travel = rec ? rec.max - rec.min : 0;
      var label = key === 'tabular' ? 'tabular-nums' : 'normal';
      travels[i].textContent = label + ' ' + travel.toFixed(1).replace('.', ',') + ' px';
      travels[i].dataset.tnOn = String(key === m);
      travels[i].dataset.tnJump = String(travel > 0.5);
    }
  }

  function step() {
    /* Přírůstek mění i vyšší řády, ať se hýbe celé číslo. */
    value += 1 + Math.floor(Math.random() * 90000);
    if (value > 9999999) value = START;
    paint();
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    runBtn.textContent = 'Spustit';
    runBtn.setAttribute('aria-pressed', 'false');
  }

  if (runBtn) {
    runBtn.setAttribute('aria-pressed', 'false');
    runBtn.addEventListener('click', function () {
      if (timer) return stop();
      timer = setInterval(step, 600);
      runBtn.textContent = 'Zastavit';
      runBtn.setAttribute('aria-pressed', 'true');
    });
  }

  if (stepBtn) stepBtn.addEventListener('click', step);

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      value = START;
      seen = {};
      paint();
    });
  }

  /* ── Přepínač režimu
     Píše se na kořen dokumentu, takže jedna deklarace přepne tabulku
     i živý součet. Obě lišty drží stejný stav. */
  var setters = document.querySelectorAll('[data-tn-set]');

  function syncButtons(m) {
    for (var i = 0; i < setters.length; i++) {
      setters[i].setAttribute('aria-pressed',
        String(setters[i].getAttribute('data-tn-set') === m));
    }
    var out = document.querySelector('[data-tn-current]');
    if (out) out.textContent = m === 'tabular' ? 'tabular-nums' : 'normal';
  }

  for (var b = 0; b < setters.length; b++) {
    setters[b].addEventListener('click', function () {
      var m = this.getAttribute('data-tn-set');
      document.documentElement.setAttribute('data-tn-mode', m);
      syncButtons(m);
      report();
      paint();
    });
  }

  function refresh() {
    setAdvance();
    syncButtons(mode());
    report();
    checkExtras();
    paint();
  }

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
