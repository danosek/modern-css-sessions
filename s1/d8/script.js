// ── Produktové karty — toggle subgrid ────────────────────────────────────

const grid   = document.getElementById('products-grid');
const btnOff = document.getElementById('btn-off');
const btnOn  = document.getElementById('btn-on');
const label  = document.getElementById('subgrid-label');

btnOff.addEventListener('click', () => {
  grid.classList.remove('use-subgrid');
  btnOff.setAttribute('aria-pressed', 'true');
  btnOn.setAttribute('aria-pressed', 'false');
  label.textContent = 'Živá ukázka — bez subgrid: každá karta používá vlastní flex layout, výšky řádků nejsou zarovnány:';
});

btnOn.addEventListener('click', () => {
  grid.classList.add('use-subgrid');
  btnOn.setAttribute('aria-pressed', 'true');
  btnOff.setAttribute('aria-pressed', 'false');
  label.textContent = 'Živá ukázka — subgrid zarovná řádky napříč kartami:';
});

// ── Editoriální layout — toggle subgrid ──────────────────────────────────

const editGrid   = document.getElementById('editorial-grid');
const editBtnOff = document.getElementById('edit-btn-off');
const editBtnOn  = document.getElementById('edit-btn-on');
const editLabel  = document.getElementById('editorial-label');

editBtnOff.addEventListener('click', () => {
  editGrid.classList.remove('use-subgrid');
  editBtnOff.setAttribute('aria-pressed', 'true');
  editBtnOn.setAttribute('aria-pressed', 'false');
  editLabel.textContent = 'Živá ukázka — bez subgrid: CTA tlačítka nejsou zarovnána (každá karta má vlastní flex layout):';
});

editBtnOn.addEventListener('click', () => {
  editGrid.classList.add('use-subgrid');
  editBtnOn.setAttribute('aria-pressed', 'true');
  editBtnOff.setAttribute('aria-pressed', 'false');
  editLabel.textContent = 'Živá ukázka — subgrid zarovná 4 zóny (obrázek / nadpis / perex / CTA) napříč kartami:';
});
