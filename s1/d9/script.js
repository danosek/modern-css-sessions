// ── Hlavní rf-grid — toggle reading-flow ─────────────────────────────────

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

// ── Kanban board — toggle reading-flow ───────────────────────────────────

const kanbanBoard   = document.getElementById('kanban-board');
const kanbanInfo    = document.getElementById('kanban-info');
const kanbanLabel   = document.getElementById('kanban-label');
const kanbanBtnDom  = document.getElementById('kanban-btn-dom');
const kanbanBtnVis  = document.getElementById('kanban-btn-visual');

kanbanBtnDom.addEventListener('click', () => {
  kanbanBoard.classList.remove('use-reading-flow');
  kanbanBtnDom.setAttribute('aria-pressed', 'true');
  kanbanBtnVis.setAttribute('aria-pressed', 'false');
  kanbanLabel.textContent = 'Tab pořadí = DOM pořadí → skáče přes sloupce (T1→D1→X1→T2→D2→X2→T3→D3→X3):';
  kanbanInfo.textContent = 'Tab = DOM pořadí: skáče po řádcích (TODO→DOING→DONE→TODO→…)';
});

kanbanBtnVis.addEventListener('click', () => {
  kanbanBoard.classList.add('use-reading-flow');
  kanbanBtnVis.setAttribute('aria-pressed', 'true');
  kanbanBtnDom.setAttribute('aria-pressed', 'false');
  kanbanLabel.textContent = 'Tab pořadí = vizuální grid pořadí → plynule po řádcích (T1→D1→X1→T2→D2→X2→T3→D3→X3):';
  kanbanInfo.textContent = 'Tab = grid-order: vizuální pořadí (řádek po řádku, zleva doprava)';
});

// Focus indikátor pro kanban karty
const kanbanCards = kanbanBoard.querySelectorAll('.kanban-card');
kanbanCards.forEach(card => {
  card.addEventListener('focus', () => {
    kanbanCards.forEach(c => c.classList.remove('is-focused'));
    card.classList.add('is-focused');
    const isVisual = kanbanBoard.classList.contains('use-reading-flow');
    const order    = isVisual ? card.dataset.visual : card.dataset.dom;
    const title    = card.textContent.trim();
    kanbanInfo.textContent = `Fokus: „${title}" — ${isVisual ? 'vizuální' : 'DOM'} pořadí: ${order}`;
  });

  card.addEventListener('blur', () => {
    card.classList.remove('is-focused');
  });

  card.addEventListener('click', () => {
    card.focus();
  });
});
