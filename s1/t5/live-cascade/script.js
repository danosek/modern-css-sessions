// Prohoď pořadí vrstev. Soutěžící pravidla jsou ve style.css a nikdo je nemění —
// tlačítko přepisuje JEDINÝ řádek: @layer statement v <style id="lab-order">.
// Prohlížeč si po přepsání musí pořadí vrstev přepočítat, a to udělá jen když
// hlavní sheet zaregistruje své vrstvy znovu — proto ho vyměníme za jeho klon.

const order   = document.getElementById('lab-order');
const toggle  = document.getElementById('lab-toggle');
const readout = document.getElementById('lab-readout');
const rules = {
  components: document.querySelector('.lab-rule[data-rule="components"]'),
  utilities:  document.querySelector('.lab-rule[data-rule="utilities"]'),
};

// Hlavní sheet dema: samostatně je to <link href="style.css">, v editoru ho
// preview nahrazuje <style> na stejném místě — bereme tedy poslední styl v head.
function demoSheet() {
  const all = [...document.querySelectorAll('head link[rel="stylesheet"], head style')];
  return all.filter(el => el !== order).pop();
}

let utilitiesLast = true; // výchozí: @layer components, utilities;

function apply(reregister = true) {
  const seq = utilitiesLast ? 'components, utilities' : 'utilities, components';
  order.textContent = `@layer ${seq};`;

  if (reregister) {
    const sheet = demoSheet();
    if (sheet) sheet.replaceWith(sheet.cloneNode(true));
  }

  const winner = utilitiesLast ? 'utilities' : 'components';
  const loser  = utilitiesLast ? 'components' : 'utilities';
  rules[winner].dataset.active = 'win';
  rules[loser].dataset.active = 'lose';
  rules[winner].querySelector('[data-verdict]').textContent = '>> vyhrává — je v pozdější vrstvě';
  rules[loser].querySelector('[data-verdict]').textContent = '// prohrává';

  toggle.setAttribute('aria-pressed', String(utilitiesLast));
  readout.textContent = '@layer ' + seq + ';';
}

toggle.addEventListener('click', () => { utilitiesLast = !utilitiesLast; apply(); });

// Při načtení statement už odpovídá výchozímu stavu — jen doplníme popisky.
apply(false);
