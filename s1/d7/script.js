// Style Container Queries — přepínání --variant custom property
// JS nastavuje CSS custom property na .theme-card elementu;
// @container style() v CSS na to automaticky reaguje.

document.querySelectorAll('.variant-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cardId  = btn.dataset.card;
    const variant = btn.dataset.variant;
    const card    = document.getElementById(cardId);
    if (!card) return;

    // Nastav custom property na kontejneru
    card.style.setProperty('--variant', variant);

    // Aktualizuj label (pro edukační účely)
    const label = card.querySelector('.theme-card__variant-label');
    if (label) label.textContent = `--variant: ${variant}`;

    // Aktualizuj aria-pressed v rámci dané karty
    card.querySelectorAll('.variant-btn').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.variant === variant ? 'true' : 'false');
    });
  });
});
