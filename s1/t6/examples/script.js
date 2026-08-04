
// Nav: click any link to move .is-active
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

// :has() karta — obrázek se přidává a odebírá z DOM. Ve stylech není nic
// stavového: o vzhledu rozhoduje jen to, jestli uvnitř leží .card__img.
const hasCard    = document.getElementById('has-card');
const imgToggle  = document.getElementById('img-toggle');
const hasReadout = document.getElementById('has-readout');
const cardImg    = hasCard.querySelector('.card__img');

function renderCard() {
  const present = !!hasCard.querySelector('.card__img');
  imgToggle.textContent = present ? '>> Odeber obrázek z DOM' : '>> Vlož obrázek do DOM';
  imgToggle.setAttribute('aria-pressed', String(present));
  hasReadout.textContent = present
    ? '.card:has(.card__img) → platí'
    : '.card:not(:has(.card__img)) → platí';
}

imgToggle.addEventListener('click', () => {
  const present = hasCard.querySelector('.card__img');
  if (present) present.remove();
  else hasCard.prepend(cardImg);
  renderCard();
});

renderCard();
