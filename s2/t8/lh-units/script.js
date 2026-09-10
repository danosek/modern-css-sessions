/* lh · rlh — slider řádkování a měření svislého paddingu.
 *
 * CSS drží jedinou proměnnou --lh-line, ze které si všechny tři sloupce
 * berou line-height. Skript čte vypočtený padding, takže je vidět, který
 * odstup se s řádkováním posune a který zůstane. */
(function () {
  'use strict';

  var range = document.getElementById('lh-range');
  var out = document.querySelector('[data-lh-out]');
  var cards = document.querySelectorAll('[data-lh-measure]');
  var nums = document.querySelectorAll('[data-lh-num]');

  function refresh() {
    if (range) {
      document.documentElement.style.setProperty('--lh-line', range.value);
      if (out) out.textContent = Number(range.value).toFixed(1);
    }

    for (var i = 0; i < cards.length; i++) {
      var cs = getComputedStyle(cards[i]);
      var num = nums[i];
      if (!num) continue;

      num.innerHTML = 'padding <strong>' + cs.paddingTop + '</strong>'
        + ' · řádek ' + parseFloat(cs.lineHeight).toFixed(1) + ' px';
    }
  }

  if (range) range.addEventListener('input', refresh);

  refresh();

  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
