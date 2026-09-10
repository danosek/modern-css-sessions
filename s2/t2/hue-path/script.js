/* longer hue · shorter hue — dopočítá, kolik stupňů která cesta ujde.
 *
 * Gradient i vzorky v pásu jsou deklarované v CSS; skript žádnou barvu
 * nepočítá ani nenastavuje. Přečte vykreslený pixel každého vzorku, převede
 * ho do OKLCH a vypíše hue. Pak tutéž cestu projde po 181 krocích a sečte
 * změny hue, takže vyjde ujdená vzdálenost po kruhu. Čísla pocházejí
 * z prohlížeče, ne z literálů v CSS.
 *
 * Pixel je 8bitový, takže se odečtená hue zaokrouhluje na celé stupně. */
(function () {
  'use strict';

  var STEPS = 180;

  var probe = document.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  var ctx = probe.getContext('2d', { willReadFrequently: true });

  /* Jakýkoli platný CSS zápis barvy → vykreslený pixel [r, g, b] v sRGB. */
  function toRgb(color) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }

  /* sRGB → OKLCH hue ve stupních (Björn Ottosson, matice OKLab). */
  function hueOf(color) {
    var lin = toRgb(color).map(function (v) {
      v = v / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var l = Math.cbrt(0.4122214708 * lin[0] + 0.5363325363 * lin[1] + 0.0514459929 * lin[2]);
    var m = Math.cbrt(0.2119034982 * lin[0] + 0.6806995451 * lin[1] + 0.1073969566 * lin[2]);
    var s = Math.cbrt(0.0883024619 * lin[0] + 0.2817188376 * lin[1] + 0.6299787005 * lin[2]);
    var a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    var h = Math.atan2(b, a) * 180 / Math.PI;
    return h < 0 ? h + 360 : h;
  }

  /* Nejkratší rozdíl dvou hue — krok je vždy menší než 180°, takže se
     z posloupnosti kroků dá poskládat celková ujdená vzdálenost. */
  function step(from, to) {
    var d = to - from;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
  }

  /* Cesta pásu: metoda i krajní barvy se čtou z CSS, ne z tohohle souboru. */
  function walk(css) {
    var method = css.getPropertyValue('--hp-mix').trim();
    var from = css.getPropertyValue('--hp-from').trim();
    var to = css.getPropertyValue('--hp-to').trim();
    var total = 0;
    var prev = null;

    for (var i = 0; i <= STEPS; i++) {
      var at = i / STEPS * 100;
      var h = hueOf('color-mix(in oklch ' + method + ', '
        + from + ' ' + (100 - at) + '%, ' + to + ')');
      if (prev !== null) total += step(prev, h);
      prev = h;
    }
    return total;
  }

  function label(deg) {
    if (deg === 0) return '0° · hue stojí';
    return (deg > 0 ? '+' : '−') + Math.abs(deg) + '°'
      + (deg > 0 ? ' · hue roste' : ' · hue klesá');
  }

  var bands = document.querySelectorAll('.hp-band');

  for (var i = 0; i < bands.length; i++) {
    var fill = bands[i].querySelector('.hp-band__fill');
    var probes = bands[i].querySelectorAll('.hp-probe');
    var outs = bands[i].querySelectorAll('.hp-band__hue');

    for (var j = 0; j < probes.length; j++) {
      var h = hueOf(getComputedStyle(probes[j]).backgroundColor);
      outs[j].textContent = 'H ' + (Math.round(h) % 360);
    }

    var arc = Math.round(walk(getComputedStyle(fill)));
    bands[i].querySelector('.hp-band__arc-value').textContent = label(arc);
    bands[i].dataset.hpArc = arc;
  }

  /* Souhrn sady: kolik různých délek se mezi těmi pásy vůbec objevilo. */
  var sets = document.querySelectorAll('[data-hp-set]');

  for (var s = 0; s < sets.length; s++) {
    var lengths = [];
    var inSet = sets[s].querySelectorAll('.hp-band');

    for (var b = 0; b < inSet.length; b++) {
      var len = Math.abs(Number(inSet[b].dataset.hpArc));
      if (lengths.indexOf(len) < 0) lengths.push(len);
    }
    lengths.sort(function (x, y) { return x - y; });

    var sum = lengths.reduce(function (x, y) { return x + y; }, 0);
    var out = sets[s].parentNode.querySelector('[data-hp-total]');
    if (out) out.textContent = lengths.join('° + ') + '° = ' + sum + '°';
  }

  /* Chybný zápis: vypíše, co prohlížeč z background-image vrátí. */
  var rows = document.querySelectorAll('[data-hp-syntax] .hp-syntax__row');

  for (var r = 0; r < rows.length; r++) {
    rows[r].querySelector('.hp-syntax__out').textContent =
      getComputedStyle(rows[r].querySelector('.hp-syntax__fill')).backgroundImage;
  }
})();
