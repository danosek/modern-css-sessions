/* linear-gradient(in oklch) — dopočítá barvu v polovině přechodu.
 *
 * Prostor interpolace je celý v CSS; skript nic nemíchá. U každého pruhu
 * přečte kolík uprostřed — ten nese color-mix() v témž prostoru, tedy
 * tutéž polovinu — a převede vykreslený pixel do OKLCH.
 *
 * Chroma je tady ta správná metrika: „šedá mrtvá zóna" znamená, že
 * chroma spadla k nule. Relativní luminance by ji neukázala, tu má
 * šedá i sytá barva stejnou. Canvas je sRGB, takže naměřená čísla jsou
 * barva, jak ji displej opravdu ukáže: co přeteče gamut, je zkrouhnuté.
 * Proto se vedle nich vypisuje i zápis, ve kterém polovinu vrací sám
 * prohlížeč — u in oklch se ta dvě čísla rozejdou. */
(function () {
  'use strict';

  var probe = document.createElement('canvas');
  probe.width = 1;
  probe.height = 1;
  var ctx = probe.getContext('2d', { willReadFrequently: true });

  /* Jakýkoli platný zápis barvy → OKLCH. Postup podle Björna Ottossona. */
  function toOklch(color) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var d = ctx.getImageData(0, 0, 1, 1).data;

    var c = [d[0] / 255, d[1] / 255, d[2] / 255].map(function (v) {
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var r = c[0], g = c[1], b = c[2];

    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

    var H = Math.atan2(B, A) * 180 / Math.PI;
    if (H < 0) H += 360;

    return { L: L * 100, C: Math.hypot(A, B), H: H };
  }

  /* Sekce se měří samostatně: 100 % pruhu je sytější z jejích krajních
     barev, takže se poloviny poměřují s párem, ze kterého vznikly. */
  var scopes = document.querySelectorAll('[data-ip-scope]');

  for (var s = 0; s < scopes.length; s++) {
    var cells = scopes[s].querySelectorAll('[data-ip-cell]');
    var read = [];
    var ref = 0;

    for (var i = 0; i < cells.length; i++) {
      var sample = cells[i].querySelector('[data-ip-sample]');
      var raw = getComputedStyle(sample).backgroundColor;
      var color = toOklch(raw);
      read.push({ cell: cells[i], raw: raw, color: color });
      if (cells[i].hasAttribute('data-ip-ref') && color.C > ref) ref = color.C;
    }

    for (var j = 0; j < read.length; j++) {
      var cell = read[j].cell;
      var mid = read[j].color;

      var outC = cell.querySelector('[data-ip-c]');
      if (outC) outC.textContent = mid.C.toFixed(3);

      var outL = cell.querySelector('[data-ip-l]');
      if (outL) outL.textContent = mid.L.toFixed(1);

      /* U šedé je hue jen šum ze zaokrouhlení, tak se nevypisuje. */
      var outH = cell.querySelector('[data-ip-h]');
      if (outH) outH.textContent = mid.C < 0.005 ? '—' : mid.H.toFixed(0);

      var outRaw = cell.querySelector('[data-ip-raw]');
      if (outRaw) outRaw.textContent = read[j].raw;

      var bar = cell.querySelector('[data-ip-bar]');
      if (bar && ref) bar.style.setProperty('--ip-c', (mid.C / ref).toFixed(3));
    }
  }
})();
