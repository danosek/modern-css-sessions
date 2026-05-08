const grid = document.getElementById('products-grid');
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
