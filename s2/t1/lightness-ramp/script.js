/* oklch() — osa lightness — postaví mřížku palety ze živých tokenů.
 *
 * Barvy se nikde neopisují: skript přečte computed value každého tokenu
 * --<barva>-<index>, rozebere ji na L, C, H a z toho složí jak barevnou
 * buňku, tak její šedý protějšek o témž perceptuálním jasu.
 *
 * HSL varianta je simulace: z base odstínu (60) vezme hue a saturaci
 * v HSL a znovu postaví rampu tak, že TÁŽ čísla lightness použije jako
 * HSL lightness. Pak se změří, jaký z toho vyjde perceptuální jas —
 * a to je ten rozdíl, o kterém demo mluví. */
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

  var lin = function (v) {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  /* Perceptuální jas v procentech — L z OKLCH, ne WCAG luminance. */
  function perceptualL(color) {
    var c = toRgb(color).map(lin);
    var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2]);
    var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2]);
    var s = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2]);
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s) * 100;
  }

  function rgbToHsl(color) {
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
    return { h: h, s: d ? d / (1 - Math.abs(2 * l - 1)) : 0, l: l };
  }

  var grid = document.querySelector('[data-pg-grid]');
  if (!grid) return;
  var cells = grid.querySelectorAll('.pg-cell');

  /* Token → { L, C, H }. Chrome vrací computed value jako oklch(...),
     takže se dá rozebrat přímo; kdyby ne, spadneme na měření pixelu. */
  function tokenLch(name) {
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--' + name).trim();
    var m = raw.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/);
    if (m) return { L: parseFloat(m[1]) * (raw.indexOf('%') > -1 ? 1 : 100), C: +m[2], H: +m[3], raw: raw };
    return { L: perceptualL(raw), C: null, H: null, raw: raw };
  }

  /* HSL hue a saturace každé barvy bereme z jejího base odstínu 60. */
  var hslBase = {};

  function fill() {
    var space = grid.getAttribute('data-pg-space');

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var name = cell.getAttribute('data-pg-color');
      var idx = cell.getAttribute('data-pg-idx');
      var lch = tokenLch(name + '-' + idx);

      if (!hslBase[name]) hslBase[name] = rgbToHsl(tokenLch(name + '-60').raw);

      var fillColor;
      if (space === 'hsl') {
        /* Táž čísla lightness, ale jako HSL lightness. */
        var b = hslBase[name];
        fillColor = 'hsl(' + b.h.toFixed(1) + ' ' + (b.s * 100).toFixed(1)
          + '% ' + lch.L.toFixed(1) + '%)';
      } else {
        fillColor = lch.raw;
      }

      /* Šeď o témž perceptuálním jasu — to je celý pohled „jen jas". */
      var seen = perceptualL(fillColor);
      cell.style.setProperty('--pg-fill', fillColor);
      cell.style.setProperty('--pg-grey', 'oklch(' + seen.toFixed(2) + '% 0 0)');
    }
  }

  function refresh() {
    fill();
  }

  /* Segmentované přepínače: hodnota se zapíše na mřížku jako data-atribut,
     zbytek dořeší CSS a přepočet. */
  document.querySelectorAll('[data-pg-seg]').forEach(function (seg) {
    var key = seg.getAttribute('data-pg-seg');
    seg.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-pg-val]');
      if (!btn) return;
      seg.querySelectorAll('[data-pg-val]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      grid.setAttribute('data-pg-' + key, btn.getAttribute('data-pg-val'));
      refresh();
    });
  });

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
