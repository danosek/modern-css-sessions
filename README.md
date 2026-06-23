# Modern CSS Demos

Interaktivní CSS dema ke školícímu cyklu **Modern CSS** (Tesco SW, červen 2026 – březen 2027).

Každé demo je samostatný `index.html` otevíratelný přes StackBlitz nebo GitHub Pages.

## Lokální vývoj

```bash
npm run setup   # jednorázově: nainstaluje závislosti (editor-src/)
npm run dev     # spustí dev server s watch nad vším
```

`npm run dev` spustí **jeden** Vite dev server s živým watchem nad celým projektem:

| URL | Co | Watch |
|-----|----|----|
| `http://localhost:5173/` | Přehled sessions (landing) | `editor-src/` (HMR) |
| `…/editor/?demo=s1/d1` | CSS editor + preview | `editor-src/` (HMR) |
| `…/demos/…`, `…/shared/…` | Statické soubory dem | `s*/d*/`, `shared/` |

Co se sleduje a živě promítá do náhledu:

- **`editor-src/`** — Svelte editor i landing (Vite HMR).
- **`s*/d*/`** — `index.html` / `style.css` / `script.js` jednotlivých dem.
- **`shared/`** — `demo-base.css`, `spectro-theme.css`, `demo-highlight.js`.
- **`src/spectro/`** — zdroj design systému (lokální, gitignored). Úprava
  `spectro-theme.css` se automaticky publikuje do `shared/spectro-theme.css`
  (font URL se přepíšou na jsDelivr CDN). Ruční sync: `npm run sync:theme`.

### Build & nasazení

```bash
npm run build         # editor → editor/ + landing → index.html + index-assets/
npm run build:editor  # jen editor (to staví i CI deploy na GitHub Pages)
npm run build:index   # jen landing (commitni index.html + index-assets/)
```

> Root `package.json` je jen orchestrátor (bez závislostí). Aplikace, závislosti
> i Vite konfigurace žijí v `editor-src/`.

## Přehled dem

| Session | Demo | Live | StackBlitz |
|---------|------|------|------------|
| S1 – Foundations Refresh | D1 – Intrinsic sizing | [↗ live](https://danosek.github.io/modern-css-sessions/s1/d1/) | [⚡ Otevřít](https://stackblitz.com/github/danosek/modern-css-sessions/tree/main/s1/d1) |

## Architektura

```
modern-css-sessions/
├── shared/
│   ├── spectro-theme.css   ← Spectro design systém (font paths → raw GitHub URL)
│   ├── demo-base.css       ← sdílený wrapper layout pro dema
│   └── fonts/
│       ├── ia-writer-quattro.woff2
│       ├── departure-mono.woff2
│       └── ia-writer-mono.woff2
├── s1/
│   └── d1/
│       └── index.html      ← Intrinsic sizing
├── index.html              ← přehled sessions
└── README.md
```

## Sdílené CSS

Každé demo načítá sdílené soubory přes jsDelivr CDN (správný MIME typ, funguje ve StackBlitz i GitHub Pages):

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@main/shared/spectro-theme.css">
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@main/shared/demo-base.css">
```

## Design systém

Spectro 26.2.1 — seed: `brandPrimary=electricviolet`, `brandSecondary=torchred`, `fontFamilyMain=ia-writer-quattro`, `fontFamilyHeadings=departure-mono`, `fontFamilyMonospace=ia-writer-mono`, `fontBaseSize=15px`.
