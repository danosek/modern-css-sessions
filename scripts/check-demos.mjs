// check-demos.mjs — hlídá, že manifest dashboardu, složky dem a šablona sedí.
//
// V repu jsou tři zdroje, které se snadno rozejdou: `IndexApp.svelte` (data
// dashboardu), složky `s<N>/t<M>/<slug>/` a `instructions.md`. Tenhle skript
// kontroluje první dvě strojově, ať se na rozjetí nepřijde až na projektoru.
//
// Kontroluje:
//   • každé demo z manifestu má složku a všechny tři soubory
//   • název dema je shodný na třech místech, která jde ověřit z kódu
//     (manifest, <title>, <h1>, hlavička style.css — viz §Pojmenování dem)
//   • šablona: theme toggle, .demo-subtitle, feature chip, demo-highlight.js
//   • názvy dem jsou unikátní napříč session (v tabech editoru se nerozliší)
//   • na disku nezůstal neregistrovaný orphan mimo známé výjimky
//   • komentáře v style.css se vejdou do šířky panelu (~46 znaků)
//   • každé var(--x) odkazuje na proměnnou, která opravdu existuje
//
// Spuštění: npm run check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Orphany, o kterých víme a které nechceme opravovat teď. Klíč je cesta,
// hodnota důvod — ať je z výpisu poznat, že to není zapomenutá práce.
const KNOWN_ORPHANS = {
  's1/d9': 'reading-flow — ze staré ploché struktury, vědomě mimo dashboard',
  's5/d4': ':focus-visible — placeholder, migruje se se stavbou S5',
};

// Hlavička style.css nese název dema, takže se limitu šířky nepodřizuje.
const COMMENT_LIMIT = 46;

/** Custom properties definované ve sdílených souborech — proti nim se ověřuje
 *  každé var(--x) v demech. Nedefinovaná proměnná zneplatní celou deklaraci
 *  („invalid at computed-value time"), takže vlastnost tiše spadne na zděděnou
 *  hodnotu: žádná chyba v konzoli, jen špatný render. */
const SHARED_TOKENS = new Set(
  ['shared/spectro-theme.css', 'shared/demo-base.css']
    .flatMap((f) => [...fs.readFileSync(path.join(repoRoot, f), 'utf8')
      .matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1]))
);

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

const decode = (s) => s
  .replaceAll('&amp;', '&').replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>').replaceAll('&quot;', '"');

/** Vytáhne pole `sessions` z manifestu dashboardu. */
function readManifest() {
  const src = fs.readFileSync(
    path.join(repoRoot, 'editor-src/src/IndexApp.svelte'), 'utf8');
  const from = src.indexOf('const sessions = [');
  const to = src.indexOf('\n  ];', from);
  if (from < 0 || to < 0) throw new Error('pole `sessions` v IndexApp.svelte nenalezeno');
  return eval(src.slice(from + 'const sessions = '.length, to + 4));
}

const sessions = readManifest();
const registered = new Set();

for (const session of sessions) {
  const names = new Map();

  for (const topic of session.topics ?? []) {
    for (const demo of topic.demos ?? []) {
      const id = `${session.id}/${topic.id}/${demo.slug}`;
      registered.add(id);

      if (names.has(demo.name)) {
        fail(`${session.id}: název "${demo.name}" je dvakrát `
           + `(${names.get(demo.name)}, ${topic.id}/${demo.slug})`);
      }
      names.set(demo.name, `${topic.id}/${demo.slug}`);

      const dir = path.join(repoRoot, id);
      if (!fs.existsSync(dir)) { fail(`${id}: složka chybí`); continue; }

      const missing = ['index.html', 'style.css', 'script.js']
        .filter((f) => !fs.existsSync(path.join(dir, f)));
      if (missing.length) { fail(`${id}: chybí ${missing.join(', ')}`); continue; }

      const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
      const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');

      const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
      const heading = decode(html.match(/<h1 class="demo-title">([^<]*)<\/h1>/)?.[1] ?? '');
      const header = css.match(/^\/\* (\S+) (D\d+) — (.*?) \*\//);

      const expectedTitle = `${demo.name} – Modern CSS ${session.number}`;
      if (title !== expectedTitle) fail(`${id}: <title> je "${title}"`);
      if (heading !== demo.name) fail(`${id}: <h1> je "${heading}"`);
      if (header?.[1] !== topic.id || header?.[2] !== demo.index
          || header?.[3] !== demo.name) {
        fail(`${id}: hlavička style.css je "${header?.[0] ?? '—'}", `
           + `čekám "/* ${topic.id} ${demo.index} — ${demo.name} */"`);
      }

      for (const [needle, label] of [
        ['class="theme-toggle"', 'theme toggle'],
        ['class="demo-subtitle"', '.demo-subtitle'],
        ['class="demo-feature__kw"', 'feature chip'],
        ['demo-highlight.js', 'demo-highlight.js'],
      ]) if (!html.includes(needle)) fail(`${id}: šablona postrádá ${label}`);

      // Proměnné, které si demo definuje samo (např. --ld-color), jsou v pořádku.
      const localTokens = new Set(
        [...css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1]));
      for (const source of [[css, 'style.css'], [html, 'index.html']]) {
        for (const m of source[0].matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) {
          const token = m[1];
          if (SHARED_TOKENS.has(token) || localTokens.has(token)) continue;
          const line = source[0].slice(0, m.index).split('\n').length;
          fail(`${id}/${source[1]}:${line}: var(${token}) — taková proměnná neexistuje`);
        }
      }

      // Pozor na pokračovací řádky: domácí konvence je odsadit je třemi
      // mezerami, takže nezačínají `/*` ani `*` a testem na začátek řádku
      // by propadly. Sledujeme proto, jestli jsme uvnitř blokového komentáře.
      let inComment = false;
      css.split('\n').forEach((line, i) => {
        const opens = line.includes('/*');
        const isComment = inComment || opens;
        if (opens) inComment = true;
        if (line.includes('*/')) inComment = false;
        if (i === 0 || !isComment) return;
        // [...line] počítá znaky, ne bajty — čeština je v UTF-8 vícebajtová
        // a bajtové měření hlásí fantomy.
        const width = [...line].length;
        if (width > COMMENT_LIMIT) {
          fail(`${id}/style.css:${i + 1}: komentář ${width} znaků `
             + `(limit ${COMMENT_LIMIT})`);
        }
      });
    }
  }
}

// Disk → manifest: co leží ve složkách, ale nikdo to nezaregistroval.
for (const sessionDir of fs.readdirSync(repoRoot).filter((d) => /^s\d+$/.test(d))) {
  for (const entry of fs.readdirSync(path.join(repoRoot, sessionDir))) {
    const topicPath = path.join(repoRoot, sessionDir, entry);
    if (!fs.statSync(topicPath).isDirectory()) continue;

    if (!/^t\d+$/.test(entry)) {
      const id = `${sessionDir}/${entry}`;
      if (!fs.existsSync(path.join(topicPath, 'index.html'))) continue;
      if (id in KNOWN_ORPHANS) notes.push(`${id} — ${KNOWN_ORPHANS[id]}`);
      else fail(`${id}: demo mimo strukturu t<N>/<slug>`);
      continue;
    }

    for (const slug of fs.readdirSync(topicPath)) {
      if (!fs.statSync(path.join(topicPath, slug)).isDirectory()) continue;
      const id = `${sessionDir}/${entry}/${slug}`;
      if (!registered.has(id)) fail(`${id}: složka není v manifestu dashboardu`);
    }
  }
}

const total = sessions
  .flatMap((s) => (s.topics ?? []).flatMap((t) => t.demos ?? [])).length;

for (const note of notes) console.log(`  · známý orphan: ${note}`);
for (const problem of problems) console.log(`  ✗ ${problem}`);

console.log(problems.length
  ? `\n${problems.length} ${problems.length === 1 ? 'problém' : 'problémů'} z ${total} dem`
  : `\n✓ ${total} dem, manifest i šablona sedí`);

process.exit(problems.length ? 1 : 0);
