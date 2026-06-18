# Instrukce pro Claude Code – Modern CSS Demos

## Co stavíme

Repozitář s CSS demy pro školící cyklus **Modern CSS** (8 sessions, červen 2026 – březen 2027).

Každé demo je samostatná složka s `index.html` – otevíratelná přímo ve StackBlitz přes GitHub URL. Sdílený design systém **Spectro** je dostupný všem demům přes raw GitHub URL.

---

## Architektura repozitáře

```
modern-css-demos/
├── shared/
│   ├── spectro-theme.css     ← dodaný soubor, font cesty přepsány (viz níže)
│   ├── demo-base.css         ← wrapper layout pro každé demo
│   └── fonts/
│       ├── ia-writer-quattro.woff2
│       ├── departure-mono.woff2
│       └── ia-writer-mono.woff2
├── s1/
│   ├── d1/
│   │   └── index.html
│   ├── d2/
│   │   └── index.html
│   └── ...
├── s2/
│   └── d1/
│       └── index.html
├── ... (s3–s8 stejná struktura)
├── index.html                ← přehled všech sessions a dem
└── README.md                 ← seznam StackBlitz odkazů
```

---

## Proč jsDelivr CDN

StackBlitz otevře `s1/d1` jako **kořen projektu** – nic nad touto složkou nevidí. Relativní cesta `../../shared/` proto nefunguje.

jsDelivr funguje všude – StackBlitz, GitHub Pages, VS Code Live Server – a na rozdíl od raw GitHub URL správně posílá CORS hlavičky a kešuje soubory:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@COMMIT_HASH/shared/spectro-theme.css">
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@COMMIT_HASH/shared/demo-base.css">
```

**`COMMIT_HASH`** se při každém commitu do `shared/` automaticky aktualizuje přes CI (`chore: pin shared CSS CDN` commity). Ruční změna není potřeba.

---

## Spectro design systém – konfigurace

Dodaný Spectro theme má tuto konfiguraci (ze `spectro-seed.json`):

| Parametr | Hodnota |
|----------|---------|
| Brand primary | `#6104f9` (electric violet) |
| Brand secondary | `#ff062f` (torch red) |
| Font main | **iA Writer Quattro** (`ia-writer-quattro.woff2`) |
| Font headings | **Departure Mono** (`departure-mono.woff2`) |
| Font monospace | **iA Writer Mono** (`ia-writer-mono.woff2`) |
| Font base size | 15px |
| Scale ratio | 1.2 |
| Contrast level | A (WCAG 2.1) |

### Font cesty v spectro-theme.css

Fonty jsou uloženy v `shared/fonts/` a v `spectro-theme.css` jsou odkazovány přes jsDelivr CDN (stejný COMMIT_HASH jako sdílené CSS). CI je udržuje aktuální automaticky.

---

## demo-base.css

Sdílený wrapper pro všechna CSS dema (`shared/demo-base.css`). Výhradně Spectro tokeny – žádné hardcoded hodnoty.

---

## Šablona pro každé demo (index.html)

Každé demo má vedle `index.html` vlastní `style.css` (demo-specifické styly) a `script.js` (interaktivita, pokud je potřeba).

```html
<!DOCTYPE html>
<html lang="cs" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Název dema] – Modern CSS S[N]</title>

  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@COMMIT_HASH/shared/spectro-theme.css">
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@COMMIT_HASH/shared/demo-base.css">
  <script defer
    src="https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@COMMIT_HASH/shared/demo-highlight.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <button class="theme-toggle"
    onclick="document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'">
    Toggle theme
  </button>

  <div class="demo-header">
    <div class="demo-session">S[N] – [Název session]</div>
    <h1 class="demo-title">[Název dema]</h1>
    <span class="demo-feature">
      <span class="demo-feature__kw">feature-a</span>
      <span class="demo-feature__sep">·</span>
      <span class="demo-feature__kw">feature-b</span>
    </span>
  </div>

  <div class="demo-stage">

    <div class="demo-section">
      <h2 class="demo-section__title">Popis sekce</h2>
      <div class="demo-section__example">
        <!-- živé demo -->
      </div>
    </div>

  </div>

  <!-- volitelně — referenční CSS pod demem.
       Delší kód rozděl na pojmenované sekce (.demo-code__section).
       shared/demo-highlight.js obarví syntaxi (Spectro tokeny) automaticky. -->
  <div class="demo-code">
    <div class="demo-code__section">
      <h2 class="demo-code__title">Název sekce</h2>
      <pre tabindex="0"><code class="language-css">/* relevantní CSS kód */</code></pre>
    </div>
    <!-- další .demo-code__section dle potřeby -->
  </div>

  <script src="script.js"></script>
</body>
</html>
```

---

## Přehledová stránka (root index.html)

Hlavní `index.html` v kořeni repozitáře. Načítá stejné sdílené soubory. Grid karet – každá session = karta, uvnitř seznam dem s StackBlitz odkazy. Vizuálně odliš 120min sessions (S4, S6) od 90min.

---

## README.md

```markdown
# Modern CSS Demos

| Session | Demo | StackBlitz |
|---------|------|------------|
| S1 – Foundations Refresh | D1 – Intrinsic sizing | [Otevřít](https://stackblitz.com/github/danosek/modern-css-sessions/tree/main/s1/d1) |
| S1 – Foundations Refresh | D2 – Comparison functions | [Otevřít](https://stackblitz.com/github/danosek/modern-css-sessions/tree/main/s1/d2) |
...
```

---

## Sessions a dema

Začni prázdnými demy – správná šablona, placeholder obsah. Dema plníme postupně.

### S1 – Foundations Refresh (30. 6. 2026 / 90 min)
- `d1` – Intrinsic sizing (`min-content`, `max-content`, `fit-content()`)
- `d2` – Comparison functions (`clamp()`, `min()`, `max()`) – fluid hodnoty
- `d3` – Logical Properties (`margin-inline`, `padding-block`, `inset`)
- `d4` – CSS Nesting (`&`) – nativní vnoření bez preprocesoru
- `d5` – `@layer` – cascade management
- `d6` – `:has()` · `:is()` · `:where()` – parent & grouping selectors
- `d7` – Container Queries
- `d8` – Subgrid
- `d9` – `reading-flow`

### S2 – Colors & Typography (srpen 2026 / 90 min)
- `d1` – `oklch()` vs HSL – vizuální porovnání
- `d2` – `color-mix()` a relative color syntax
- `d3` – `light-dark()` – dark mode
- `d4` – `text-wrap: balance` a `pretty`
- `d5` – `color-scheme` · `prefers-color-scheme` – dark mode na úrovni prohlížeče
- `d6` – `text-box-trim`

### S3 – Sizing, Layout & Shapes (září 2026 / 90 min)
- `d1` – `interpolate-size` – animace na `height: auto`
- `d2` – `field-sizing: content`
- `d3` – Gap decorations
- `d4` – `shape()` funkce

### S4 – Anchor Positioning + Popover / Dialog / Invokers (říjen 2026 / 120 min)
- `d1` – Anchor positioning – základy
- `d2` – `position-try-fallbacks` + flip šipky
- `d3` – Popover API (`auto`, `manual`, `hint`)
- `d4` – Invoker commands – dialog bez JS
- `d5` – `@starting-style` entry animace

### S5 – Customizable Select & Form UX (listopad 2026 / 90 min)
- `d1` – `appearance: base-select` + `::picker(select)`
- `d2` – `<selectedcontent>` + HTML v options
- `d3` – `:user-valid` / `:user-invalid`
- `d4` – `:focus-visible` · `:focus-within` – přístupný focus

### S6 – Scroll Universe (leden 2027 / 120 min)
- `d1` – `scroll()` timeline – progress bar
- `d2` – `view()` timeline – reveal on scroll
- `d3` – Nativní carousel (`::scroll-button`, `::scroll-marker`)
- `d4` – `scroll-target-group` – scroll-spy
- `d5` – `container-type: scroll-state`
- `d6` – `sibling-index()` – staggered animace

### S7 – View Transitions (únor 2027 / 90 min)
- `d1` – Same-document View Transitions
- `d2` – Cross-document View Transitions
- `d3` – Shared element animace

### S8 – CSS as a Programming Language (březen 2027 / 90 min)
- `d1` – `@property` – typed custom properties
- `d2` – Advanced `attr()` – typed values
- `d3` – `@scope`
- `d4` – `if()` a `@function`

---

## Pravidla pro všechna dema

- Výhradně Spectro tokeny – žádné hardcoded barvy ani rozměry
- CSS demo kód patří do `<style>` tagu – žádné inline styly
- `data-theme="light"` výchozí, theme toggle vždy přítomen
- Každé demo je soběstačný soubor – závislosti jen přes raw GitHub URL
- Referenční kód v `.demo-code` rozděl na `.demo-code__section` (s `.demo-code__title`), pokud má víc logických částí; `<code>` označ `class="language-css"`. Syntaxi obarví `shared/demo-highlight.js` (žádné ruční `<span>` v kódu)

---

*Připraveno z Claude.ai – navazuje na `modern-css-osnovy.md`*
