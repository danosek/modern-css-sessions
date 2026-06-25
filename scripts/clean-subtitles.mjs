// One-off codemod: odstraní z .demo-subtitle vedoucí segmenty, které duplikují
// .demo-title (např. "clamp() — Fluid typografie — …" → "…"). Když po ořezu
// nic nezbude (subtitle == title), .demo-subtitle se odstraní úplně.
//
// Spuštění: node scripts/clean-subtitles.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const s1 = path.join(repoRoot, 's1');

const files = [];
for (const topic of fs.readdirSync(s1)) {
  if (!/^t\d+$/.test(topic)) continue;
  for (const entry of fs.readdirSync(path.join(s1, topic))) {
    const idx = path.join(s1, topic, entry, 'index.html');
    if (fs.existsSync(idx)) files.push(idx);
  }
}

const norm = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

let cleaned = 0, removed = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  const tEl = html.match(/<h1 class="demo-title">([\s\S]*?)<\/h1>/);
  const sEl = html.match(/[ \t]*<p class="demo-subtitle">([\s\S]*?)<\/p>\r?\n?/);
  if (!tEl || !sEl) continue;

  const titleN = norm(tEl[1]).toLowerCase();
  const segs = sEl[1].split(/\s+—\s+/);              // dělení na em-dash
  let i = 0;
  while (i < segs.length) {
    const segN = norm(segs[i]).toLowerCase();
    if (segN && titleN.includes(segN)) i++;          // segment je v title → zahoď
    else break;
  }
  let rest = segs.slice(i).join(' — ').trim();
  if (rest) rest = rest.charAt(0).toUpperCase() + rest.slice(1);

  if (!rest) {
    html = html.replace(sEl[0], '');                 // celý subtitle pryč (čistá duplicita)
    removed++;
    console.log(`✗ ${path.relative(repoRoot, f)}  (subtitle = title → odstraněn)`);
  } else if (rest !== sEl[1].trim()) {
    html = html.replace(sEl[0], sEl[0].replace(sEl[1], rest));
    cleaned++;
    console.log(`✓ ${path.relative(repoRoot, f)}  →  „${rest.slice(0, 60)}${rest.length > 60 ? '…' : ''}"`);
  } else {
    continue;                                        // beze změny
  }
  fs.writeFileSync(f, html);
}
console.log(`\n${cleaned} ořezáno, ${removed} odstraněno.`);
