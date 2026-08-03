# Instrukce pro Claude Code – Modern CSS Demos

## Co stavíme

Repozitář s CSS demy pro školící cyklus **Modern CSS** (8 sessions, červen 2026 – březen 2027).

Každé demo je samostatná složka s `index.html` – otevíratelná přímo ve StackBlitz přes GitHub URL. Sdílený design systém **Spectro** je dostupný všem demům přes raw GitHub URL.

---

## Architektura repozitáře

Hierarchie je **Session → Topic → Demo**. Topic je jen kontejner a seskupení v dashboardu (nemá vlastní stránku); jedno demo = jedna sekce, jedna myšlenka.

```
modern-css-sessions/
├── shared/
│   ├── spectro-theme.css     ← dodaný soubor, font cesty přepsány (viz níže)
│   ├── demo-base.css         ← wrapper layout pro každé demo
│   ├── demo-highlight.js     ← zvýrazňovač syntaxe pro .demo-code
│   └── fonts/
│       ├── ia-writer-quattro.woff2
│       ├── departure-mono.woff2
│       └── ia-writer-mono.woff2
├── s1/
│   ├── t1/                   ← topic
│   │   ├── sizing-values/    ← demo (slug, ne dN)
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   └── script.js
│   │   └── sizing-layout/
│   └── t2/ … t8/
├── s2/ … s8/                 ← stejná struktura
├── editor-src/               ← zdroj editoru a landing page (Vite + Svelte 5)
│   └── src/IndexApp.svelte   ← DATA dashboardu: sessions, topicy, názvy dem
├── index.html                ← landing (buildí CI, needitovat ručně)
└── README.md
```

**Cesty jsou load-bearing** – slug složky je součástí URL editoru (`editor/?demo=s1/t2/min-width`) i StackBlitz odkazů. Přejmenovat lze zobrazovaný **název** dema; složku ne.

---

## Proč jsDelivr CDN

StackBlitz otevře složku dema (např. `s1/t2/min-width`) jako **kořen projektu** – nic nad touto složkou nevidí. Relativní cesta `../../../shared/` proto nefunguje.

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
    <p class="demo-subtitle">[Jedna věta: co uvidím / co mám udělat]</p>
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

Hlavní `index.html` v kořeni repozitáře. **Needituj ho ručně** – je to build artefakt; zdroj je `editor-src/index-page.html` + `editor-src/src/IndexApp.svelte` a CI ho při deploji přestaví (`npm run build:index`). Grid karet – každá session = karta, uvnitř topicy a pod nimi dema. Vizuálně odliš 120min sessions (S4, S6) od 90min.

---

## README.md

```markdown
# Modern CSS Demos

| Session | Topic | Demo | StackBlitz |
|---------|-------|------|------------|
| S1 – Foundations Refresh | t1 Intrinsic Sizing | D1 – min-content · max-content · fit-content | [Otevřít](https://stackblitz.com/github/danosek/modern-css-sessions/tree/main/s1/t1/sizing-values) |
| S1 – Foundations Refresh | t1 Intrinsic Sizing | D2 – V gridu · centrování | [Otevřít](https://stackblitz.com/github/danosek/modern-css-sessions/tree/main/s1/t1/sizing-layout) |
...
```

---

## Pojmenování dem

Název dema **je ta věc, kterou demo izoluje** – ne popis toho, co se stane. Účastník má z názvu v dashboardu poznat, co uvidí, a najít demo zpětně podle featury.

- **Feature jako název.** Když demo stojí na jedné vlastnosti nebo selektoru, jmenuje se přesně tak: `inset`, `writing-mode`, `dir`, `:has(input:checked)`, `@media uvnitř pravidla`. CSS syntaxi piš doslova (vč. pomlček a závorek), zbytek česky.
- **Sdílí-li víc dem stejnou featuru, rozlišuj rolí, ne popisem výsledku:** `min() — strop šířky` vs. `max() — podlaha šířky`. Role musí být to, co si má člověk zapamatovat.
- **Žádná vata.** Ne „Zkratka…", „Základní…", „Praktické příklady", „Živá ukázka —". Interaktivitu neoznamuj v názvu; pozná se z dema. Když je demo akce, pojmenuj ji slovesem: `Prohoď pořadí vrstev`.
- **Unikátnost napříč session.** Dva stejné názvy v různých topicích (dvakrát „Praktické příklady") jsou chyba – v tabech editoru je nerozliší.
- **Název drží na čtyřech místech a musí být všude stejný:**
  1. `IndexApp.svelte` → `name` v datech dashboardu
  2. `<title>` dema → `[Název] – Modern CSS S[N]`
  3. `<h1 class="demo-title">` → přesně název
  4. hlavička `style.css` → `t<N> D<M> — <Topic> · <Název>`
- **Delší vysvětlení patří do `.demo-subtitle`,** ne do názvu – jedna věta, co uvidím nebo co mám udělat.
- Slug složky se **nepřejmenovává** (je v URL); nese ho původní zkratka, i když se název změní.

---

## Sessions a dema

Začni prázdnými demy – správná šablona, placeholder obsah. Dema plníme postupně.
Zdroj pravdy pro dashboard je `editor-src/src/IndexApp.svelte`; tenhle seznam s ním drž v souladu.

### S1 – Foundations Refresh (30. 6. 2026 / 90 min) — hotovo

#### `t1` – Intrinsic Sizing
- **D1** `sizing-values` – min-content · max-content · fit-content
- **D2** `sizing-layout` – V gridu · centrování

#### `t2` – Comparison Functions (`min()` · `max()` · `clamp()`)
- **D1** `min-width` – min() — strop šířky
- **D2** `max-width` – max() — podlaha šířky
- **D3** `max-min` – min() + max() — centrování
- **D4** `clamp-fluid` – clamp() — fluid typografie
- **D5** `clamp-card` – clamp() — responsivní karta

#### `t3` – Logical Properties
- **D1** `mapping` – Physical → Logical mapping
- **D2** `physical-vs-logical` – dir
- **D3** `writing-mode` – writing-mode
- **D4** `inset` – inset

#### `t4` – CSS Nesting
- **D1** `flat-vs-nested` – Flat vs. nested
- **D2** `nested-media` – @media uvnitř pravidla

#### `t5` – `@layer`
- **D1** `live-cascade` – Prohoď pořadí vrstev
- **D2** `layer-order` – Pořadí bije specificitu
- **D3** `examples` – Vendor CSS · revert-layer

#### `t6` – Parent & grouping selectors
- **D1** `live-checklist` – :has(input:checked)
- **D2** `examples` – :has() v praxi
- **D3** `is-where` – :is() · :where()

#### `t7` – Container Queries
- **D1** `live-resize` – Resize kontejneru
- **D2** `three-contexts` – Jedna karta, tři kontexty
- **D3** `range-queries` – Range syntaxe

#### `t8` – Subgrid
- **D1** `live-cards` – Karty — subgrid řádků
- **D2** `form-fields` – Formulář — subgrid sloupců
- **D3** `editorial` – Editoriální layout

> `s1/d9` (`reading-flow`) je orphan ze staré ploché struktury – není v dashboardu.

**Seznamy níže (S2–S8) jsou plán na úrovni topiců** – při realizaci se z každé odrážky stane složka `t<N>` s vlastními demy podle konvence výše.

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
- Styly dema patří do jeho `style.css` – žádné inline `style=""` atributy v HTML
- Hlavička `style.css` nese identitu dema: `t<N> D<M> — <Topic> · <Název>` (viz Pojmenování dem)
- `data-theme="light"` výchozí, theme toggle vždy přítomen
- Každé demo je soběstačná složka – sdílené závislosti jen přes jsDelivr CDN
- Účastníci čtou i zdrojový kód: žádný mrtvý CSS (selektory bez HTML), žádné zakomentované zbytky
- Ukázkový kód v `.demo-code` musí odpovídat tomu, co demo reálně dělá – žádné jiné hodnoty ani breakpointy
- Referenční kód v `.demo-code` rozděl na `.demo-code__section` (s `.demo-code__title`), pokud má víc logických částí; `<code>` označ `class="language-css"`. Syntaxi obarví `shared/demo-highlight.js` (žádné ruční `<span>` v kódu)

---

*Připraveno z Claude.ai – navazuje na `modern-css-osnovy.md`*
