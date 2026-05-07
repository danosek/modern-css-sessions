const rfGrid  = document.getElementById('rf-grid');
const rfInfo  = document.getElementById('rf-info');
const rfLabel = document.getElementById('rf-label');
const btnDom    = document.getElementById('btn-dom');
const btnVisual = document.getElementById('btn-visual');

// Toggle reading-flow mode
btnDom.addEventListener('click', () => {
  rfGrid.classList.remove('use-reading-flow');
  btnDom.setAttribute('aria-pressed', 'true');
  btnVisual.setAttribute('aria-pressed', 'false');
  rfLabel.textContent = 'Živá ukázka — zmáčkni Tab a sleduj pořadí focusu (DOM pořadí = A→B→C→D→E→F):';
  rfInfo.textContent = 'Tab pořadí = DOM pořadí: A→B→C→D→E→F (skáče vizuálně)';
});

btnVisual.addEventListener('click', () => {
  rfGrid.classList.add('use-reading-flow');
  btnVisual.setAttribute('aria-pressed', 'true');
  btnDom.setAttribute('aria-pressed', 'false');
  rfLabel.textContent = 'Živá ukázka — zmáčkni Tab a sleduj pořadí focusu (vizuální pořadí = D→B→F→A→C→E):';
  rfInfo.textContent = 'Tab pořadí = vizuální pořadí: D→B→F→A→C→E (zleva doprava, shora dolů)';
});

// Focus indicator
const items = rfGrid.querySelectorAll('.rf-item');
items.forEach(item => {
  item.addEventListener('focus', () => {
    items.forEach(i => i.classList.remove('is-focused'));
    item.classList.add('is-focused');
    const isVisual = rfGrid.classList.contains('use-reading-flow');
    const order = isVisual ? item.dataset.visual : item.dataset.dom;
    const label = item.textContent.trim();
    rfInfo.textContent = `Fokus na: ${label} — ${isVisual ? 'vizuální' : 'DOM'} pořadí: ${order}`;
  });

  item.addEventListener('blur', () => {
    item.classList.remove('is-focused');
  });

  item.addEventListener('click', () => {
    item.focus();
  });
});
