/* color-mix() — vypisuje k barevným vzorkům jejich použitou hodnotu a lightness.
 *
 * V CSS je u každého vzorku jediná deklarace (background: var(--cm-…)). Skript
 * jen přečte, co z ní prohlížeč po vyhodnocení color-mix() udělal, převede to do
 * OKLab a vypíše lightness — v ní se ruční triplet a odvozený mix porovnávají.
 * Nic nepřebarvuje; při změně data-theme přepočítá výpis. */
(function () {
  'use strict';

  /* sRGB → OKLab (Björn Ottosson). Potřebujeme jen L. */
  function srgbLightness(r, g, b) {
    function lin(v) {
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    var R = lin(r), G = lin(g), B = lin(b);
    var l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    var m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    var s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  }

  function parts(s) {
    return s.replace('/', ' ').trim().split(/[\s,]+/);
  }

  function num(token, full) {
    if (!token) return 0;
    return token.slice(-1) === '%' ? parseFloat(token) / 100 * full : parseFloat(token);
  }

  /* Prohlížeč vrací barvu v tom prostoru, ve kterém ji umí zapsat — pro čísla
   * v sRGB gamutu rgb(), pro širší gamut rovnou oklab()/oklch(). */
  function lightnessOf(color) {
    var m = /^rgba?\(([^)]*)\)/.exec(color);
    if (m) {
      var c = parts(m[1]);
      return srgbLightness(num(c[0], 255) / 255, num(c[1], 255) / 255, num(c[2], 255) / 255);
    }
    m = /^color\(srgb\s+([^)]*)\)/.exec(color);
    if (m) {
      var d = parts(m[1]);
      return srgbLightness(num(d[0], 1), num(d[1], 1), num(d[2], 1));
    }
    m = /^okl(?:ab|ch)\(([^)]*)\)/.exec(color);
    if (m) return num(parts(m[1])[0], 1);
    return null;
  }

  function pct(value, unit) {
    return value === null ? '—' : value.toFixed(1).replace('.', ',') + ' ' + unit;
  }

  var panels = document.querySelectorAll('.cm-panel');
  var mids = document.querySelectorAll('[data-cm-mid]');
  var deltaOut = document.getElementById('cm-delta-out');

  function readPanel(panel) {
    var levels = [];
    var states = panel.querySelectorAll('.cm-state');
    for (var i = 0; i < states.length; i++) {
      var color = getComputedStyle(states[i].querySelector('.cm-state__swatch')).backgroundColor;
      var L = lightnessOf(color);
      levels.push(L);
      states[i].querySelector('.cm-state__l').textContent = 'L ' + pct(L === null ? null : L * 100, '%');
      states[i].querySelector('.cm-state__rgb').textContent = color;
    }
    return levels;
  }

  function refresh() {
    var left = readPanel(panels[0]);
    var right = readPanel(panels[1]);
    var names = ['klid', ':hover', ':active'];
    var out = [];
    for (var i = 1; i < names.length; i++) {
      var known = left[i] !== null && right[i] !== null;
      out.push(names[i] + ' ' + pct(known ? Math.abs(left[i] - right[i]) * 100 : null, 'pb'));
    }
    deltaOut.textContent = out.join(' · ');

    for (var j = 0; j < mids.length; j++) {
      var L = lightnessOf(getComputedStyle(mids[j]).backgroundColor);
      mids[j].closest('.cm-space__row').querySelector('.cm-space__mid').textContent =
        'L ' + pct(L === null ? null : L * 100, '%');
    }
  }

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
