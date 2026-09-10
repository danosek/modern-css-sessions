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
| `…/editor/?demo=s1/t2/min-width` | CSS editor + preview | `editor-src/` (HMR) |
| `…/demos/…`, `…/shared/…` | Statické soubory dem | `s*/t*/*/`, `shared/` |

Co se sleduje a živě promítá do náhledu:

- **`editor-src/`** — Svelte editor i landing (Vite HMR).
- **`s*/t*/*/`** — `index.html` / `style.css` / `script.js` jednotlivých dem.
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

### Kontrola dem

```bash
npm run check
```

Ověří, že manifest dashboardu ([`IndexApp.svelte`](editor-src/src/IndexApp.svelte)),
složky `s*/t*/*/` a šablona dema sedí — každé registrované demo má své tři soubory,
název je shodný v `<title>`, `<h1>` i v hlavičce `style.css`, na disku nezůstal
neregistrovaný orphan, komentáře v CSS se vejdou do šířky editoru a **každé
`var(--x)` odkazuje na proměnnou, která opravdu existuje**. To poslední je
záludné: nedefinovaná custom property zneplatní celou deklaraci, takže vlastnost
tiše spadne na zděděnou hodnotu — bez chyby v konzoli. Stejný skript běží v CI
před buildem, takže rozjeté zdroje pravdy neprojdou do deploje.

## Přehled dem

Hierarchie je **Session → Topic → Demo**; složka dema je `s<N>/t<M>/<slug>/`.
Úplný seznam s názvy dem je v [`editor-src/src/IndexApp.svelte`](editor-src/src/IndexApp.svelte)
— to je zdroj pravdy pro dashboard a nevypisuje se tu podruhé, aby se to nerozešlo.

| Session | Topiců | Dem | Stav |
|---------|-------:|----:|------|
| S1 – Foundations Refresh | 8 | 24 | hotovo |
| S2 – Colors & Typography | 8 | 18 | dema založená, plní se |
| S3 – Sizing, Layout & Shapes | 4 | — | plán |
| S4 – Anchor Positioning + Popover | 3 | — | plán |
| S5 – Customizable Select & Form UX | 4 | — | plán |
| S6 – Scroll Universe | 4 | — | plán |
| S7 – View Transitions | 3 | — | plán |
| S8 – CSS as a Programming Language | 5 | — | plán |

Jednotlivé demo se otevírá takto (příklad `s1/t2/min-width`):

- **live** — `https://danosek.github.io/modern-css-sessions/s1/t2/min-width/`
- **editor** — `https://danosek.github.io/modern-css-sessions/editor/?demo=s1/t2/min-width`
- **StackBlitz** — `https://stackblitz.com/github/danosek/modern-css-sessions/tree/main/s1/t2/min-width`

## Architektura

```
modern-css-sessions/
├── shared/
│   ├── spectro-theme.css   ← Spectro design systém (font URL → jsDelivr CDN)
│   ├── demo-base.css       ← sdílený wrapper layout pro dema
│   ├── demo-highlight.js   ← zvýrazňovač syntaxe + .fn-readout
│   └── fonts/
│       ├── ia-writer-quattro.woff2
│       ├── departure-mono.woff2
│       └── ia-writer-mono.woff2
├── s1/
│   ├── t1/                 ← topic
│   │   ├── sizing-values/  ← demo (slug, ne dN)
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   └── script.js
│   │   └── sizing-layout/
│   └── t2/ … t8/
├── s2/ … s8/               ← stejná struktura
├── scripts/check-demos.mjs ← npm run check
├── editor-src/             ← zdroj editoru a landing (Vite + Svelte 5)
├── index.html              ← přehled sessions (build artefakt)
└── README.md
```

## Sdílené CSS

Každé demo načítá sdílené soubory přes jsDelivr CDN (správný MIME typ, funguje
ve StackBlitz i GitHub Pages). `@main` níže je jen ilustrace — v demech je
místo něj konkrétní commit SHA, který po každé změně v `shared/` přepíše CI
([`purge-cdn.yml`](.github/workflows/purge-cdn.yml)), ručně se needituje:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@main/shared/spectro-theme.css">
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@main/shared/demo-base.css">
```

## Design systém

Spectro 26.2.2 — seed: `brandPrimary=#dc8f09` (goldenrod, paleta `dixie`), `brandSecondary=#789b81` (sage, paleta `oxley`), `surfaceBrand=secondary`, `surfaceIntensity=2`, `radiusIntensity=0`, `contrastLevel=a`, `fontFamilyMain=ia-writer-quattro`, `fontFamilyHeadings=departure-mono`, `fontFamilyMonospace=ia-writer-mono`, `fontBaseSize=15px`, `scaleRatio=1.2`.

Úplný katalog tokenů je v [`DESIGN.md`](DESIGN.md); zdroj systému (seed, mixiny, dokumentace) leží v gitignorovaném `src/spectro/`.
