# Modern CSS Demos

Interaktivní CSS dema ke školícímu cyklu **Modern CSS** (Tesco SW, červen 2026 – březen 2027).

Každé demo je samostatný `index.html` otevíratelný přes StackBlitz nebo GitHub Pages.

## Přehled dem

| Session | Demo | Live | StackBlitz |
|---------|------|------|------------|
| S1 – Foundations Refresh | D1 – Intrinsic sizing | [↗ live](https://danosek.github.io/modern-css-demos/s1/d1/) | [⚡ Otevřít](https://stackblitz.com/github/danosek/modern-css-demos/tree/main/s1/d1) |

## Architektura

```
modern-css-demos/
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

Každé demo načítá sdílené soubory přes raw GitHub URL (funguje ve StackBlitz i GitHub Pages):

```html
<link rel="stylesheet"
  href="https://raw.githubusercontent.com/danosek/modern-css-demos/main/shared/spectro-theme.css">
<link rel="stylesheet"
  href="https://raw.githubusercontent.com/danosek/modern-css-demos/main/shared/demo-base.css">
```

## Design systém

Spectro 26.2.1 — seed: `brandPrimary=electricviolet`, `brandSecondary=torchred`, `fontFamilyMain=ia-writer-quattro`, `fontFamilyHeadings=departure-mono`, `fontFamilyMonospace=ia-writer-mono`, `fontBaseSize=15px`.
