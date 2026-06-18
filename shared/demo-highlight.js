/* demo-highlight.js — lehký CSS syntax highlighter pro .demo-code bloky.
 *
 * Žádná externí závislost. Tokenizuje CSS v `.demo-code code` a obaluje tokeny
 * do <span class="tok-*">, které jsou v shared/demo-base.css namapované na
 * Spectro --text-* tokeny — stejné barevné schéma jako editor (spectroHighlight.js).
 *
 * Načítá se v každém demu přes stejné jsDelivr CDN jako sdílené CSS; CI hash
 * automaticky pinuje (viz .github/workflows/purge-cdn.yml). */
(function () {
  'use strict';

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function span(cls, text) {
    return '<span class="tok-' + cls + '">' + escapeHtml(text) + '</span>';
  }

  var isIdent = function (c) { return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9' || c === '-' || c === '_'; };
  var isDigit = function (c) { return c >= '0' && c <= '9'; };
  var isSelStart = function (c) { return '.#&*[>+~'.indexOf(c) !== -1; };

  /* Tokenizuje CSS string na zvýrazněné (a HTML-escapované) HTML. */
  function highlightCss(src) {
    var out = '';
    var i = 0;
    var N = src.length;
    var depth = 0;            // zanoření do { }
    var mode = 'stmt';        // 'stmt' (rozhoduje se) | 'selector' | 'after-name' | 'value' | 'atrule'

    while (i < N) {
      var c = src[i];

      // bílé znaky — projdou beze změny
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f') {
        out += c; i++; continue;
      }

      // komentáře (v jakémkoli režimu)
      if (c === '/' && src[i + 1] === '*') {
        var ce = src.indexOf('*/', i + 2);
        ce = ce === -1 ? N : ce + 2;
        out += span('comment', src.slice(i, ce));
        i = ce; continue;
      }

      // řetězce
      if (c === '"' || c === "'") {
        var j = i + 1;
        while (j < N && src[j] !== c) { if (src[j] === '\\') j++; j++; }
        j = j < N ? j + 1 : N;
        out += span('string', src.slice(i, j));
        i = j; continue;
      }

      // strukturální znaky
      if (c === '{') { out += span('punct', '{'); depth++; mode = 'stmt'; i++; continue; }
      if (c === '}') { out += span('punct', '}'); if (depth > 0) depth--; mode = 'stmt'; i++; continue; }
      if (c === ';') { out += span('punct', ';'); mode = 'stmt'; i++; continue; }

      // at-rule (@media, @layer, @supports…)
      if (c === '@') {
        var ae = i + 1;
        while (ae < N && isIdent(src[ae])) ae++;
        out += span('atrule', src.slice(i, ae));
        mode = 'atrule';
        i = ae; continue;
      }

      // rozhodnutí o typu příkazu
      if (mode === 'stmt') {
        if (isSelStart(c) || depth === 0) {
          mode = 'selector';            // propadne do selektorové větve níže
        } else if (isIdent(c)) {
          var pe = i;
          while (pe < N && isIdent(src[pe])) pe++;
          var word = src.slice(i, pe);
          out += span(word.indexOf('--') === 0 ? 'var' : 'prop', word);
          i = pe; mode = 'after-name'; continue;
        } else {
          out += span('punct', escapeHtml(c)); i++; continue;
        }
      }

      // za názvem property očekáváme ':'
      if (mode === 'after-name') {
        if (c === ':') { out += span('punct', ':'); mode = 'value'; i++; continue; }
        out += span('punct', c); i++; continue;
      }

      // selektor / prelude at-rule
      if (mode === 'selector' || mode === 'atrule') {
        if (c === '.') {
          var de = i + 1; while (de < N && isIdent(src[de])) de++;
          out += span('punct', '.') + span('selector', src.slice(i + 1, de));
          i = de; continue;
        }
        if (c === '#') {
          var ie = i + 1; while (ie < N && isIdent(src[ie])) ie++;
          out += span('punct', '#') + span('idsel', src.slice(i + 1, ie));
          i = ie; continue;
        }
        if (c === ':') {
          var co = i; while (co < N && src[co] === ':') co++;
          var pse = co; while (pse < N && isIdent(src[pse])) pse++;
          out += span('punct', src.slice(i, co));
          if (pse > co) out += span('pseudo', src.slice(co, pse));   // jen neprázdné pseudo
          i = pse; continue;
        }
        // čísla v preludiu @media / @container, např. (min-width: 400px)
        if (mode === 'atrule' && (isDigit(c) || (c === '.' && isDigit(src[i + 1])))) {
          var an = i; while (an < N && (isDigit(src[an]) || src[an] === '.')) an++;
          out += span('num', src.slice(i, an));
          if (src[an] === '%') { out += span('unit', '%'); an++; }
          else { var au = an; while (au < N && /[A-Za-z]/.test(src[au])) au++; if (au > an) { out += span('unit', src.slice(an, au)); an = au; } }
          i = an; continue;
        }
        if (isIdent(c)) {
          var se = i; while (se < N && isIdent(src[se])) se++;
          out += span(mode === 'atrule' ? 'value' : 'selector', src.slice(i, se));
          i = se; continue;
        }
        out += span('punct', c); i++; continue;
      }

      // hodnota deklarace
      if (mode === 'value') {
        if (c === '!') {
          var be = i + 1; while (be < N && /[A-Za-z]/.test(src[be])) be++;
          out += span('important', src.slice(i, be));
          i = be; continue;
        }
        if (c === '#') {
          var he = i + 1; while (he < N && /[0-9A-Fa-f]/.test(src[he])) he++;
          out += span('color', src.slice(i, he));
          i = he; continue;
        }
        if (c === '-' && src[i + 1] === '-') {
          var ve = i; while (ve < N && isIdent(src[ve])) ve++;
          out += span('var', src.slice(i, ve));
          i = ve; continue;
        }
        var numStart = isDigit(c)
          || (c === '.' && isDigit(src[i + 1]))
          || ((c === '-' || c === '+') && (isDigit(src[i + 1]) || (src[i + 1] === '.' && isDigit(src[i + 2]))));
        if (numStart) {
          var ne = i;
          if (src[ne] === '-' || src[ne] === '+') ne++;
          while (ne < N && (isDigit(src[ne]) || src[ne] === '.')) ne++;
          out += span('num', src.slice(i, ne));
          if (src[ne] === '%') { out += span('unit', '%'); ne++; }
          else {
            var ue = ne; while (ue < N && /[A-Za-z]/.test(src[ue])) ue++;
            if (ue > ne) { out += span('unit', src.slice(ne, ue)); ne = ue; }
          }
          i = ne; continue;
        }
        if (isIdent(c)) {
          var ke = i; while (ke < N && isIdent(src[ke])) ke++;
          out += span(src[ke] === '(' ? 'fn' : 'value', src.slice(i, ke));
          i = ke; continue;
        }
        out += span('punct', escapeHtml(c)); i++; continue;
      }

      // pojistka
      out += span('punct', escapeHtml(c)); i++;
    }

    return out;
  }

  function run() {
    var blocks = document.querySelectorAll('.demo-code code');
    for (var k = 0; k < blocks.length; k++) {
      var code = blocks[k];
      if (code.getAttribute('data-highlighted') === 'true') continue;
      if (code.className.indexOf('language-none') !== -1) continue;
      code.innerHTML = highlightCss(code.textContent);
      code.setAttribute('data-highlighted', 'true');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
