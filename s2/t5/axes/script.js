/* font-variation-settings — osy řídí dvě proměnné, čísla se měří z renderu.
 *
 * Skript nikde neopisuje rozsah osy z dokumentace. Projede hodnoty a rozsah
 * nahlásí tam, kde se vykreslený text přestane měnit. SPCG mění šířku textu,
 * takže stačí getBoundingClientRect(). Osa wght je u Quattra duplexní —
 * advance nechává na místě, takže by ji šířka nenašla. Pro ni se sonda kreslí
 * na canvas a sčítá se pokryv inkoustem; canvas umí zadat jen font-weight,
 * a ten na osu wght míří. */
(function () {
  'use strict';

  var root = document.documentElement;
  var sample = document.querySelector('.ax-sample');

  /* Měří se na vlastním skrytém prvku. Viditelný vzorek by se inline
     stylem zablokoval a slidery by s ním přestaly hýbat. */
  var probe = (function () {
    var el = document.createElement('span');
    el.textContent = 'Hamburgefonstiv 0123';
    el.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;'
      + 'font-family:' + getComputedStyle(sample).fontFamily + ';'
      + 'font-size:' + getComputedStyle(sample).fontSize;
    document.body.appendChild(el);
    return el;
  })();

  var dial = {
    wght: document.getElementById('ax-wght'),
    spcg: document.getElementById('ax-spcg')
  };

  function out(name) { return document.querySelector('[data-ax-out="' + name + '"]'); }
  function echo(name) { return document.querySelector('[data-ax-echo="' + name + '"]'); }

  function dec(x, d) { return x.toFixed(d).replace('.', ','); }
  function group(n) { return String(n).replace(/\B(?=(\d{3})+$)/g, ' '); }

  function width(el) { return Math.round(el.getBoundingClientRect().width * 100) / 100; }
  function em(el) { return width(el) / parseFloat(getComputedStyle(el).fontSize); }

  /* ── Hledání konců osy ──────────────────────────────────────────────────
     Nahrubo po deseti, pak dolaď po jedné. Konec osy je poslední hodnota,
     u které se měřená veličina ještě rovná té za hranicí rozsahu. */
  function edges(measure, lo, hi) {
    var vLo = measure(lo);
    var vHi = measure(hi);
    if (vLo === vHi) return null;

    var min = lo, max = hi, stop, v;

    for (v = lo + 10; v <= hi; v += 10) { if (measure(v) !== vLo) break; min = v; }
    stop = Math.min(min + 10, hi);
    for (v = min + 1; v <= stop; v++) { if (measure(v) !== vLo) break; min = v; }

    for (v = hi - 10; v >= lo; v -= 10) { if (measure(v) !== vHi) break; max = v; }
    stop = Math.max(max - 10, lo);
    for (v = max - 1; v >= stop; v--) { if (measure(v) !== vHi) break; max = v; }

    return min < max ? { min: min, max: max } : null;
  }

  /* Šířka skryté sondy při zadaném nastavení os. */
  function widthAt(el, settings) {
    el.style.fontVariationSettings = settings;
    return width(el);
  }

  /* Pokryv inkoustem: tentýž text nakreslený na canvas, sečtená tmavost. */
  var ink = (function () {
    var canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 60;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var stack = getComputedStyle(document.body).fontFamily;

    return function (weight) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = weight + ' 34px ' + stack;
      if (ctx.font.indexOf('34px') < 0) return NaN;
      ctx.fillStyle = '#000';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Hamburgefonstiv', 4, 44);
      var d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var sum = 0;
      for (var i = 0; i < d.length; i += 4) sum += 255 - d[i];
      return Math.round(sum / 255 * 10) / 10;
    };
  })();

  var range = { wght: null, spcg: null };

  function scan() {
    range.spcg = edges(function (v) {
      return widthAt(probe, '"SPCG" ' + v);
    }, -100, 300);

    range.wght = edges(ink, 100, 1000);

    document.querySelectorAll('[data-ax-range]').forEach(function (el) {
      var r = range[el.getAttribute('data-ax-range')];
      el.textContent = r ? r.min + ' … ' + r.max : 'neměřitelné';
    });

    var combos = document.querySelector('[data-ax-combos]');
    if (combos && range.wght && range.spcg) {
      var a = range.wght.max - range.wght.min + 1;
      var b = range.spcg.max - range.spcg.min + 1;
      combos.textContent = group(a * b) + ' (' + a + ' × ' + b + ')';
    }
  }

  /* ── Živé slidery ───────────────────────────────────────────────────────── */

  function inside(name, value) {
    var r = range[name];
    return !r || (value >= r.min && value <= r.max);
  }

  function apply() {
    ['wght', 'spcg'].forEach(function (name) {
      var value = Number(dial[name].value);
      root.style.setProperty('--ax-' + name, String(value));
      out(name).textContent = value;
      var tag = name === 'wght' ? '"wght" ' : '"SPCG" ';
      echo(name).textContent = tag + value;
      echo(name).classList.toggle('is-active', inside(name, value));
    });
    measureProbe();
  }

  /* Vzorek je blok, takže jeho box má šířku sloupce. Skutečnou šířku textu
     proto hlásíme ze skryté sondy nastavené na týž stav os. */
  function measureProbe() {
    var w = widthAt(probe, '"wght" ' + dial.wght.value + ', "SPCG" ' + dial.spcg.value);
    document.querySelector('[data-ax-probe-w]').textContent = dec(w, 2) + ' px';
  }

  /* ── Žebřík rozestupu ───────────────────────────────────────────────────── */

  function measureLadder() {
    document.querySelectorAll('[data-ax-rung]').forEach(function (row) {
      var i = em(row.querySelector('[data-ax-narrow]')) / 10;
      var m = em(row.querySelector('[data-ax-wide]')) / 10;
      row.querySelector('[data-ax-narrow-w]').textContent = dec(i, 3) + ' em';
      row.querySelector('[data-ax-wide-w]').textContent = dec(m, 3) + ' em';
      row.querySelector('[data-ax-ratio]').textContent = dec(m / i, 2) + '×';
    });
  }

  /* ── Start ──────────────────────────────────────────────────────────────── */

  document.fonts.ready.then(function () {
    scan();
    apply();
    measureLadder();

    dial.wght.addEventListener('input', apply);
    dial.spcg.addEventListener('input', apply);
  });
})();
