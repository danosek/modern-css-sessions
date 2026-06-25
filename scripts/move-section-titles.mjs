// One-off codemod: přesune .demo-section__title (popis sekce) z těla dema do
// hlavičky jako .demo-subtitle a section title odstraní. V novém modelu
// (1 demo = 1 sekce) je section title redundantní s .demo-header.
//
// Spuštění: node scripts/move-section-titles.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const s1 = path.join(repoRoot, 's1');

// posbírej s1/d<N>/<slug>/index.html (vnořená dema; d9 orphan se přeskočí samo)
const files = [];
for (const topic of fs.readdirSync(s1)) {
  if (!/^t\d+$/.test(topic)) continue;
  const tdir = path.join(s1, topic);
  for (const entry of fs.readdirSync(tdir)) {
    const idx = path.join(tdir, entry, 'index.html');
    if (fs.existsSync(idx)) files.push(idx);
  }
}

let moved = 0, skipped = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  const m = html.match(/[ \t]*<h2 class="demo-section__title">([\s\S]*?)<\/h2>\r?\n?/);
  if (!m) { skipped++; continue; }

  const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  html = html.replace(m[0], '');                              // odstraň section title z těla
  html = html.replace(
    /(<h1 class="demo-title">[\s\S]*?<\/h1>)/,                 // vlož subtitle do hlavičky
    `$1\n    <p class="demo-subtitle">${text}</p>`,
  );
  fs.writeFileSync(f, html);
  moved++;
  console.log(`✓ ${path.relative(repoRoot, f)}  →  „${text.slice(0, 60)}${text.length > 60 ? '…' : ''}"`);
}
console.log(`\n${moved} přesunuto, ${skipped} bez section title (přeskočeno).`);
