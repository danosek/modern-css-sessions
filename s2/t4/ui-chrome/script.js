/* accent-color · caret-color · ::selection — přepínač akcentu.
 *
 * Skript nesahá na jednotlivé prvky. Přepíše jedinou proměnnou
 * --uc-accent na :root a o zbytek se postará dědičnost: accent-color
 * je dědičná vlastnost, takže se změna propíše do checkboxu, radia,
 * rangu i progressu naráz. To je celá pointa. */
(function () {
  'use strict';

  var BRAND = 'var(--text-brand-primary)';

  var out = document.querySelector('[data-uc-out]');
  var random = document.querySelector('[data-uc-random]');
  var reset = document.querySelector('[data-uc-reset]');

  function apply(value, label) {
    document.documentElement.style.setProperty('--uc-accent', value);
    if (out) out.textContent = label;
  }

  if (random) {
    random.addEventListener('click', function () {
      /* Náhoda z hue, ne z bajtů — jinak vyjde většinou kalná barva,
         na které by se accent-color špatně posuzoval. */
      var h = Math.floor(Math.random() * 360);
      var color = 'oklch(60% 0.16 ' + h + ')';
      apply(color, color);
    });
  }

  if (reset) {
    reset.addEventListener('click', function () {
      apply(BRAND, BRAND);
    });
  }

  apply(BRAND, BRAND);
})();
