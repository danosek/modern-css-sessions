// split-demos.mjs — rozdělí multi-section demo (topic) na samostatná dema.
//
// Z `s<sess>/t<N>/index.html` (více `.demo-section`) vytvoří
// `s<sess>/t<N>/<slug>/{index.html,style.css,script.js}` — jedna sekce = jedno demo.
// (t = topic; každý topic je složka, uvnitř jednotlivá dema.)
//
//   • index.html: čistý boilerplate scaffold + JEDEN .demo-section blok
//     (+ volitelně přiřazené .demo-code__section bloky)
//   • style.css:  jen pravidla, jejichž selektor odkazuje na třídu/id přítomné
//     v HTML sekce; vždy se nechají bare element / :root / * selektory
//   • script.js:  stub (JS se kurátorsky doplní — viz interaktivní t1/t8)
//
// Konfigurace je v MANIFEST níže. Spuštění: `node scripts/split-demos.mjs [topicKey]`
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ── Manifest ────────────────────────────────────────────────────────────────
// Pořadí `sections` musí odpovídat pořadí .demo-section ve zdrojovém index.html.
// `code` = indexy .demo-code__section bloků (0-based) k přiložení (volitelné).
const SESSION = 'S1 – Foundations Refresh';
const MANIFEST = {
  's1/t1': {
    session: SESSION,
    sections: [
      { slug: 'sizing-values', title: 'Intrinsic sizing — hodnoty', feature: ['min-content', 'max-content', 'fit-content'] },
      { slug: 'sizing-layout', title: 'Intrinsic sizing v layoutu', feature: ['max-content', '1fr'] },
    ],
  },
  's1/t2': {
    session: SESSION,
    sections: [
      { slug: 'clamp-fluid', title: 'clamp() — fluid typografie', feature: ['clamp()'] },
      { slug: 'min-width',   title: 'min() — šířka kontejneru',   feature: ['min()'], code: [1] },
      { slug: 'max-min',     title: 'max() — garantované minimum', feature: ['max()'], code: [2] },
      { slug: 'clamp-card',  title: 'clamp() — responsivní karta', feature: ['clamp()'], code: [0] },
      { slug: 'type-scale',  title: 'clamp() — fluid type scale',  feature: ['clamp()'], code: [4] },
    ],
  },
  's1/t3': {
    session: SESSION,
    sections: [
      { slug: 'physical-vs-logical', title: 'Fyzické vs. logické vlastnosti', feature: ['inline-size', 'block-size'], code: [0, 4] },
      { slug: 'mapping',      title: 'Physical → Logical mapping', feature: ['margin-inline', 'padding-block'], code: [1, 2] },
      { slug: 'inset',        title: 'Zkratka inset',              feature: ['inset'], code: [3] },
      { slug: 'writing-mode', title: 'Logické vlastnosti a writing-mode', feature: ['writing-mode'], code: [5] },
    ],
  },
  's1/t4': {
    session: SESSION,
    sections: [
      { slug: 'live-nav',          title: 'Živá ukázka — nesting navigace', feature: ['nesting', '&'] },
      { slug: 'flat-vs-nested',    title: 'Základní nesting — flat vs. nested', feature: ['&'], code: [0] },
      { slug: 'state-pseudo',      title: 'State a pseudo — &:hover, &:focus-visible', feature: ['&:hover'] },
      { slug: 'without-ampersand', title: 'Nesting bez &', feature: ['nesting'] },
      { slug: 'nested-media',      title: '@media uvnitř pravidla', feature: ['@media'] },
    ],
  },
  's1/t5': {
    session: SESSION,
    sections: [
      { slug: 'live-cascade', title: 'Živá ukázka — pořadí vrstev vs. specificita', feature: ['@layer'] },
      { slug: 'layer-order',  title: 'Hlavní princip — pořadí bije specificitu', feature: ['@layer'] },
      { slug: 'examples',     title: '@layer — praktické příklady', feature: ['@layer'] },
    ],
  },
  's1/t6': {
    session: SESSION,
    sections: [
      { slug: 'live-checklist', title: 'Živá ukázka — :has(input:checked)', feature: [':has()'] },
      { slug: 'examples',       title: ':has() — praktické příklady', feature: [':has()'] },
      { slug: 'is-where',       title: ':is() a :where() — skupinové selektory', feature: [':is()', ':where()'] },
    ],
  },
  's1/t7': {
    session: SESSION,
    sections: [
      { slug: 'live-resize',    title: 'Živá ukázka — resize kontejneru', feature: ['container queries'], code: [0] },
      { slug: 'three-contexts', title: 'Stejná komponenta ve 3 kontextech', feature: ['@container'] },
      { slug: 'range-queries',  title: 'Range container queries', feature: ['@container'], code: [1] },
    ],
  },
  's1/t8': {
    session: SESSION,
    sections: [
      { slug: 'live-cards',  title: 'Živá ukázka — subgrid řádky karet', feature: ['subgrid'], code: [0] },
      { slug: 'form-fields', title: 'Subgrid pro formulářová pole', feature: ['subgrid'] },
      { slug: 'editorial',   title: 'Editoriální layout — subgrid', feature: ['subgrid'], code: [1] },
    ],
  },
};

const CDN = 'https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@8bdcd54618e303afb4511464c5e647306399406e/shared';

// ── HTML extrakce: vrátí pole vnitřních blokůdle class na top-level divu ──────
// Najde `<div class="<cls>"...>` a vrátí celý vyvážený `<div>…</div>` (depth-aware).
function extractBlocks(html, cls) {
  const blocks = [];
  const open = new RegExp(`<div\\b[^>]*\\bclass="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'g');
  let m;
  while ((m = open.exec(html))) {
    const start = m.index;
    let i = open.lastIndex;
    let depth = 1;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = i;
    let t;
    while (depth > 0 && (t = tag.exec(html))) {
      depth += t[0].startsWith('</') ? -1 : 1;
      i = tag.lastIndex;
    }
    blocks.push(html.slice(start, i));
    open.lastIndex = i;
  }
  return blocks;
}

// ── CSS: rozdělí na top-level pravidla / @-bloky ──────────────────────────────
function splitCssRules(css) {
  const rules = [];
  let i = 0, n = css.length, buf = '';
  while (i < n) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') {            // komentář
      const e = css.indexOf('*/', i + 2);
      buf += css.slice(i, e === -1 ? n : e + 2);
      i = e === -1 ? n : e + 2;
      continue;
    }
    if (c === '{') {                                   // selektor { … }
      let depth = 1, j = i + 1;
      for (; j < n && depth > 0; j++) {
        if (css[j] === '{') depth++;
        else if (css[j] === '}') depth--;
      }
      rules.push({ text: (buf + css.slice(i, j)).trim(), sel: buf.trim() });
      buf = ''; i = j; continue;
    }
    if (c === ';' && !buf.trim().includes('{')) { buf += c; i++; continue; }
    buf += c; i++;
  }
  const tail = buf.trim();
  if (tail) rules.push({ text: tail, sel: tail, raw: true });
  return rules;
}

// keep pravidlo, pokud jeho selektor odkazuje na třídu/id v `tokens`,
// nebo neobsahuje žádnou .class/#id (bare element / :root / * / @-blok).
function ruleMatches(sel, tokens) {
  const refs = sel.match(/[.#][A-Za-z_][\w-]*/g);
  if (!refs) return true;
  return refs.some((r) => tokens.has(r));
}

function tokensFromHtml(html) {
  const set = new Set();
  let m;
  const cls = /class="([^"]+)"/g;
  while ((m = cls.exec(html))) m[1].split(/\s+/).forEach((c) => c && set.add('.' + c));
  const id = /\bid="([^"]+)"/g;
  while ((m = id.exec(html))) set.add('#' + m[1]);
  return set;
}

function trimCss(css, tokens) {
  return splitCssRules(css)
    .filter((r) => r.raw || r.sel.startsWith('@') || ruleMatches(r.sel, tokens))
    .map((r) => r.text)
    .join('\n\n') + '\n';
}

function featureHtml(kws) {
  return kws
    .map((k) => `<span class="demo-feature__kw">${k}</span>`)
    .join('<span class="demo-feature__sep">·</span>');
}

function scaffold({ session, title, subtitle, feature, sectionHtml, codeHtml }) {
  const codeBlock = codeHtml
    ? `\n\n  <div class="demo-code">\n${codeHtml}\n  </div>`
    : '';
  const subtitleHtml = subtitle ? `\n    <p class="demo-subtitle">${subtitle}</p>` : '';
  return `<!DOCTYPE html>
<html lang="cs" data-theme="light">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – Modern CSS S1</title>
  <link rel="stylesheet" href="${CDN}/spectro-theme.css">
  <link rel="stylesheet" href="${CDN}/demo-base.css">
  <script defer src="${CDN}/demo-highlight.js"></script>
  <link rel="stylesheet" href="style.css">
</head>

<body>

  <button class="theme-toggle" onclick="document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'">
    Toggle theme
  </button>

  <div class="demo-header">
    <div class="demo-session">${session}</div>
    <h1 class="demo-title">${title}</h1>${subtitleHtml}
    <span class="demo-feature">
      ${featureHtml(feature)}
    </span>
  </div>

  <div class="demo-stage">
${sectionHtml}
  </div>${codeBlock}

  <script src="script.js"></script>
</body>

</html>
`;
}

function run(only) {
  for (const [topic, cfg] of Object.entries(MANIFEST)) {
    if (only && only !== topic) continue;
    const dir = path.join(repoRoot, topic);
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');

    const sections = extractBlocks(html, 'demo-section');
    const codeBlocks = extractBlocks(html, 'demo-code__section');
    if (sections.length !== cfg.sections.length) {
      console.error(`✗ ${topic}: nalezeno ${sections.length} .demo-section, manifest má ${cfg.sections.length}`);
      continue;
    }

    cfg.sections.forEach((s, idx) => {
      // Popis sekce (.demo-section__title bez extra atributů) → header subtitle.
      // Funkční titulky s id (např. živý status label) se nechávají v těle.
      const tm = sections[idx].match(/[ \t]*<h2 class="demo-section__title">([\s\S]*?)<\/h2>\r?\n?/);
      const subtitle = s.subtitle ?? (tm ? tm[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');
      const cleanSection = tm ? sections[idx].replace(tm[0], '') : sections[idx];
      const sectionHtml = '    ' + cleanSection;
      const codeHtml = (s.code || []).map((ci) => '    ' + codeBlocks[ci]).join('\n');
      const tokens = tokensFromHtml(sections[idx] + (codeHtml || ''));
      const outDir = path.join(dir, s.slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'),
        scaffold({ session: cfg.session, title: s.title, subtitle, feature: s.feature, sectionHtml, codeHtml }));
      fs.writeFileSync(path.join(outDir, 'style.css'), trimCss(css, tokens));
      // JS jen pro interaktivní sekce (doplní se kurátorsky); jinak prázdné.
      const jsPath = path.join(outDir, 'script.js');
      if (!fs.existsSync(jsPath)) fs.writeFileSync(jsPath, `/* ${s.title} — bez JS (čistě CSS). */\n`);
      console.log(`✓ ${topic}/${s.slug}  (${trimCss(css, tokens).split('\n\n').length} CSS bloků)`);
    });
  }
}

run(process.argv[2]);
