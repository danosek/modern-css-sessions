// Živý readout — šířka kontejneru a právě aktivní breakpoint. Samotný layout
// karty řídí čistě CSS (@container); JS jen ukazuje divákovi, co se děje.

const cqContainer = document.querySelector('.cq-container');
const cqWidth     = document.getElementById('cq-width');
const cqBp        = document.getElementById('cq-bp');

new ResizeObserver(entries => {
  const w = Math.round(entries[0].contentRect.width);
  cqWidth.textContent = w + ' px';
  cqBp.textContent =
    w >= 560 ? '@container (min-width: 560px) → wide'  :
    w >= 400 ? '@container (min-width: 400px) → grid'  :
               'pod 400 px → výchozí stack';
}).observe(cqContainer);
