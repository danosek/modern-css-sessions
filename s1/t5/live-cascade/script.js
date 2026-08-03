// Prohoď pořadí vrstev — přepínání POŘADÍ @layer. Barvu tlačítka rozhoduje výhradně
// kaskáda @layer: přepsáním pořadí v inline <style> se znovu přeparsuje a tlačítko
// se přebarví. Vítězí pravidlo z pozdější vrstvy — i s nižší specificitou.

const sheet   = document.getElementById('lab-layers');
const toggle  = document.getElementById('lab-toggle');
const readout = document.getElementById('lab-readout');
const rules = {
  components: document.querySelector('.lab-rule[data-rule="components"]'),
  utilities:  document.querySelector('.lab-rule[data-rule="utilities"]'),
};

// Soutěžící pravidla jsou fixní; mění se jen pořadí v @layer statementu.
function css(order) {
  return `
    @layer ${order};
    @layer components {
      #live .lab-btn { background: var(--surface-brand-primary-strong); color: var(--text-primary-on-surface-brand-primary-strong); }
    }
    @layer utilities {
      .lab-btn { background: var(--surface-brand-secondary-strong); color: var(--text-primary-on-surface-brand-secondary-strong); }
    }`;
}

let utilitiesLast = true; // výchozí: @layer components, utilities;

function apply() {
  const order  = utilitiesLast ? 'components, utilities' : 'utilities, components';
  sheet.textContent = css(order);                 // plný reparse → jistá rekaskáda

  const winner = utilitiesLast ? 'utilities' : 'components';
  const loser  = utilitiesLast ? 'components' : 'utilities';
  rules[winner].dataset.active = 'win';
  rules[loser].dataset.active = 'lose';
  rules[winner].querySelector('[data-verdict]').textContent = '>> vyhrává — je v pozdější vrstvě';
  rules[loser].querySelector('[data-verdict]').textContent = '// prohrává';

  toggle.setAttribute('aria-pressed', String(utilitiesLast));
  readout.textContent = '@layer ' + order + ';';
}

toggle.addEventListener('click', () => { utilitiesLast = !utilitiesLast; apply(); });

apply();
