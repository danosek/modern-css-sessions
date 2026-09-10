/* oklch() vs hsl() — picker tří zápisů, měření jasu a hledání stropu chroma.
 *
 * Skript barvy nevymýšlí: převádí jednu vybranou barvu mezi zápisy, čte
 * perceptuální jas z vykresleného pixelu a strop chroma hledá půlením
 * intervalu, dokud se požadovaná sytost ještě trefí. Všechna čísla v demu
 * tedy pocházejí z prohlížeče, ne z tabulky. */
(function () {
  'use strict';

  var probe = document.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  var ctx = probe.getContext('2d', { willReadFrequently: true });

  function toRgb(color) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255];
  }

  function lin(v) {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  /* sRGB → OKLCH. Vrací L v procentech, C a H tak, jak je bere CSS. */
  function toOklch(color) {
    var c = toRgb(color).map(lin);
    var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2]);
    var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2]);
    var s = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2]);
    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    var h = Math.atan2(B, A) * 180 / Math.PI;
    if (h < 0) h += 360;
    return { L: L * 100, C: Math.hypot(A, B), H: h };
  }

  function toHsl(color) {
    var c = toRgb(color);
    var mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]);
    var d = mx - mn, h = 0;
    if (d) {
      h = mx === c[0] ? ((c[1] - c[2]) / d + (c[1] < c[2] ? 6 : 0))
        : mx === c[1] ? ((c[2] - c[0]) / d + 2)
        : ((c[0] - c[1]) / d + 4);
      h *= 60;
    }
    var l = (mx + mn) / 2;
    return { h: h, s: (d ? d / (1 - Math.abs(2 * l - 1)) : 0) * 100, l: l * 100 };
  }

  function toHex(color) {
    return '#' + toRgb(color).map(function (v) {
      return ('0' + Math.round(v * 255).toString(16)).slice(-2);
    }).join('');
  }

  /* ── Picker a tři zápisy */

  var input = document.getElementById('hv-color');
  var codes = document.querySelectorAll('[data-hv-code]');
  var swatches = document.querySelectorAll('[data-hv-swatch]');
  var cans = document.querySelectorAll('[data-hv-can]');

  function writeNotations() {
    if (!input) return;
    var src = input.value;
    var hsl = toHsl(src);
    var ok = toOklch(src);

    var text = {
      hex: toHex(src),
      hsl: 'hsl(' + hsl.h.toFixed(0) + ' ' + hsl.s.toFixed(0) + '% ' + hsl.l.toFixed(0) + '%)',
      oklch: 'oklch(' + ok.L.toFixed(1) + '% ' + ok.C.toFixed(3) + ' ' + ok.H.toFixed(0) + ')'
    };
    /* Zesvětlení o deset bodů — v obou spočítatelných zápisech. */
    var lifted = {
      hsl: 'hsl(' + hsl.h.toFixed(0) + ' ' + hsl.s.toFixed(0) + '% '
        + Math.min(100, hsl.l + 10).toFixed(0) + '%)',
      oklch: 'oklch(' + Math.min(100, ok.L + 10).toFixed(1) + '% '
        + ok.C.toFixed(3) + ' ' + ok.H.toFixed(0) + ')'
    };

    for (var i = 0; i < codes.length; i++) {
      codes[i].textContent = text[codes[i].getAttribute('data-hv-code')];
    }
    for (var j = 0; j < swatches.length; j++) {
      swatches[j].style.setProperty('--hv-fill', src);
    }
    for (var k = 0; k < cans.length; k++) {
      var key = cans[k].getAttribute('data-hv-can');
      cans[k].textContent = 'zesvětlit o 10 → ' + lifted[key];
      cans[k].style.setProperty('--hv-fill', lifted[key]);
    }
  }

  if (input) input.addEventListener('input', writeNotations);

  document.querySelectorAll('[data-hv-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      input.value = btn.getAttribute('data-hv-preset');
      writeNotations();
    });
  });

  var rnd = document.querySelector('[data-hv-random]');
  if (rnd) {
    rnd.addEventListener('click', function () {
      /* Náhoda z hue, ne z bajtů — jinak vyjde většinou kalná barva. */
      var h = Math.floor(Math.random() * 360);
      input.value = toHex('oklch(65% 0.14 ' + h + ')');
      writeNotations();
    });
  }

  /* ── Kruh hue: dvanáct odstínů ve dvou zápisech */

  var sweeps = document.querySelectorAll('[data-hv-sweep]');

  function measureSweeps() {
    for (var i = 0; i < sweeps.length; i++) {
      var chips = sweeps[i].querySelectorAll('.hv-chip');
      var seen = [];

      for (var j = 0; j < chips.length; j++) {
        chips[j].style.setProperty('--hv-h', chips[j].getAttribute('data-hv-h'));
        var fillEl = chips[j].querySelector('.hv-chip__fill');
        var L = toOklch(getComputedStyle(fillEl).backgroundColor).L;
        seen.push(L);
        var out = chips[j].querySelector('[data-hv-l]');
        if (out) out.textContent = 'jas ' + L.toFixed(0);
      }

      var min = Math.min.apply(null, seen), max = Math.max.apply(null, seen);
      var spread = sweeps[i].parentNode.querySelector('[data-hv-spread]');
      if (spread) {
        spread.textContent = min.toFixed(0) + ' … ' + max.toFixed(0)
          + '  (rozdíl ' + (max - min).toFixed(0) + ' bodů)';
      }
    }
  }


  /* ── Kam padne hsl nula v oklch */

  function measureZero() {
    var out = document.querySelector('[data-hv-real]');
    var cell = document.querySelector('.hv-zero__cell--hsl');
    if (!out || !cell) return;
    out.textContent = toOklch(getComputedStyle(cell).backgroundColor).H.toFixed(0);
  }

  /* ── Strop chroma: půlení intervalu */

  var gh = document.getElementById('hv-gh');
  var gl = document.getElementById('hv-gl');
  var gc = document.getElementById('hv-gc');

  /* Největší C, u kterého se skutečná sytost ještě trefí požadovanou.
     Nad stropem prohlížeč barvu namapuje dovnitř gamutu, takže se
     výsledek přestane hýbat. */
  function ceiling(L, H) {
    var lo = 0, hi = 0.45;
    for (var i = 0; i < 22; i++) {
      var mid = (lo + hi) / 2;
      var got = toOklch('oklch(' + L + '% ' + mid.toFixed(4) + ' ' + H + ')').C;
      if (got >= mid - 0.002) lo = mid; else hi = mid;
    }
    return lo;
  }

  var bars = document.querySelectorAll('[data-hv-bar]');

  function measureGamut() {
    if (!gh || !gl || !gc) return;
    var H = +gh.value, L = +gl.value, C = +gc.value;
    var max = ceiling(L, H);
    var root = document.documentElement.style;

    root.setProperty('--hv-gh', H);
    root.setProperty('--hv-gl', L + '%');
    root.setProperty('--hv-gc', C);
    root.setProperty('--hv-gmax', max.toFixed(4));

    document.querySelector('[data-hv-gh]').textContent = H;
    document.querySelector('[data-hv-gl]').textContent = L + '%';
    document.querySelector('[data-hv-gc]').textContent = C.toFixed(3);

    var asked = document.querySelector('[data-hv-asked]');
    var clipped = C > max + 0.003;
    if (asked) {
      asked.textContent = 'požádáno C ' + C.toFixed(3)
        + (clipped ? ' — za stropem, prohlížeč ořezal' : ' — vejde se');
      asked.dataset.hvClipped = String(clipped);
    }
    var maxOut = document.querySelector('[data-hv-max]');
    if (maxOut) maxOut.textContent = 'strop pro hue ' + H + ' při L ' + L + '% je C ' + max.toFixed(3);

    /* Profil stropu napříč dvanácti hue při téže lightness. Výška se
       počítá z pevného stropu osy, ne z nejvyššího sloupečku — jinak
       by nejvyšší vždycky sahal až nahoru a pokles by nebyl vidět. */
    var ymax = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--hv-ymax')) || 0.35;
    var vals = [];
    for (var i = 0; i < bars.length; i++) vals.push(ceiling(L, +bars[i].getAttribute('data-hv-bar')));
    for (var j = 0; j < bars.length; j++) {
      var hue = +bars[j].getAttribute('data-hv-bar');
      bars[j].style.blockSize = Math.min(100, vals[j] / ymax * 100) + '%';
      bars[j].style.setProperty('--hv-fill', 'oklch(' + L + '% ' + vals[j].toFixed(3) + ' ' + hue + ')');
      bars[j].dataset.hvOn = String(Math.abs(hue - H) < 15);
      bars[j].title = 'hue ' + hue + ' → C ' + vals[j].toFixed(3);
    }
  }

  [gh, gl, gc].forEach(function (el) {
    if (el) el.addEventListener('input', measureGamut);
  });

  function refresh() {
    writeNotations();
    measureSweeps();
    measureZero();
    measureGamut();
  }

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
