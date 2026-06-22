---
name: Spectro
version: 26.2.1
description: >
  Spectro je komponentový design systém pro enterprise webové aplikace. 
  Cílem je konzistentní, přístupné a tematizovatelné rozhraní, které podporuje 
  světlé i tmavé téma a umožňuje flexibilní brandování pomocí seed parametrů.
  Seed projektu modern-css-sessions: brandPrimary=goldenrod (#dc8f09), brandSecondary=sage (#789b81),
  surfaceBrand=secondary, surfaceIntensity=2, radiusIntensity=0 (nulové zaoblení rohů),
  statusSuccess=lime, statusWarning=yellow, statusError=red, statusInformation=aqua,
  contrastLevel=a, fontFamilyMain=ia-writer-quattro, fontFamilyHeadings=departure-mono,
  fontFamilyMonospace=ia-writer-mono, fontFamilyDecorative=departure-mono, fontBaseSize=15px, scaleRatio=1.2.

colors:
  palette:
    dixie:
      10:  { $type: color, $value: "oklch(95% 0.15 71)" }
      20:  { $type: color, $value: "oklch(89% 0.15 71)" }
      30:  { $type: color, $value: "oklch(84% 0.15 71)" }
      40:  { $type: color, $value: "oklch(80% 0.15 71)" }
      50:  { $type: color, $value: "oklch(73% 0.13 71)" }
      60:  { $type: color, $value: "oklch(71.2% 0.152 71)", $description: "Brand primary base — goldenrod #dc8f09" }
      70:  { $type: color, $value: "oklch(54% 0.15 71)" }
      80:  { $type: color, $value: "oklch(48% 0.15 71)" }
      90:  { $type: color, $value: "oklch(40% 0.15 71)" }
      100: { $type: color, $value: "oklch(30% 0.15 71)" }
    oxley:
      60: { $type: color, $value: "oklch(65.6% 0.055 153)", $description: "Brand secondary base — sage #789b81" }
    lime:
      60: { $type: color, $value: "oklch(74% 0.16 128)", $description: "Status success base" }
    yellow:
      60: { $type: color, $value: "oklch(90% 0.18 99)", $description: "Status warning base" }
    red:
      60: { $type: color, $value: "oklch(51% 0.22 28)", $description: "Status error base" }
    aqua:
      60: { $type: color, $value: "oklch(76% 0.18 205)", $description: "Status information base" }

  brand:
    primary:
      $type: color
      $value: "light-dark(oklch(59.2% 0.152 71), oklch(73% 0.13 71))"
      $description: "Dominantní barva aplikace — tlačítka, checkboxy, aktivní stavy. Goldenrod (#dc8f09)."
    secondary:
      $type: color
      $value: "light-dark(oklch(57.6% 0.055 153), oklch(69% 0.05 153))"
      $description: "Doplňující barva — navigace, záložky. Sage (#789b81)."

  status:
    success:
      $type: color
      $value: "light-dark(oklch(57% 0.16 128), oklch(75% 0.14 128))"
      $description: "Úspěšné stavy. Lime."
    warning:
      $type: color
      $value: "light-dark(oklch(58% 0.18 99), oklch(91% 0.16 99))"
      $description: "Varování. Yellow."
    error:
      $type: color
      $value: "light-dark(oklch(51% 0.22 28), oklch(69% 0.2 28))"
      $description: "Chyby a kritické stavy. Red."
    information:
      $type: color
      $value: "light-dark(oklch(57% 0.18 205), oklch(77% 0.16 205))"
      $description: "Neutrální oznámení. Aqua."

  surface:
    base:
      $type: color
      $value: "light-dark(oklch(90% 0.01024 152.61), oklch(4% 0.01842 152.61))"
      $description: "Základní pozadí dokumentu/stránky."
    baseVariant:
      $type: color
      $value: "light-dark(oklch(100% 0 152.61), oklch(0% 0 152.61))"
      $description: "Varianta základního pozadí — čisté bílé/černé."
    main:
      $type: color
      $value: "light-dark(oklch(98% 0.00419 152.61), oklch(24% 0.00962 152.61))"
      $description: "Základní povrch elementu (karty, panely)."
    mainDim:
      $type: color
      $value: "light-dark(oklch(96% 0.00819 152.61), oklch(20% 0.01566 152.61))"
      $description: "Tlumený element — mírně temnější než main."
    mainVariant:
      $type: color
      $value: "light-dark(oklch(94% 0.0128 152.61), oklch(32% 0.02167 152.61))"
      $description: "Varianta elementu se zvýšenou saturací."
    mainBright:
      $type: color
      $value: "light-dark(oklch(100% 0.00819 152.61), oklch(34% 0.01566 152.61))"
      $description: "Výrazný element — světlejší alternativa."
    control:
      $type: color
      $value: "light-dark(oklch(100% 0.00655 152.61), oklch(34% 0.01331 152.61))"
      $description: "Povrch ovládacích prvků (inputy, selecty, buttony)."
    controlVariant:
      $type: color
      $value: "light-dark(oklch(100% 0.00655 152.61), oklch(20% 0.01331 152.61))"
      $description: "Varianta ovládacího prvku — tmavší podklad."
    front:
      $type: color
      $value: "light-dark(oklch(100% 0.00819 152.61), oklch(30% 0.01566 152.61))"
      $description: "Popředí pop-upů, dropdownů, tooltipů."

  text:
    primary:
      $type: color
      $value: "light-dark(oklch(2% 0 152.61), oklch(98% 0 152.61))"
      $description: "Primární text. Kontrast > 4,5:1."
    primaryVariant:
      $type: color
      $value: "light-dark(oklch(35% 0 152.61), oklch(85% 0 152.61))"
      $description: "Varianta primárního textu. Kontrast > 3:1."
    secondary:
      $type: color
      $value: "light-dark(oklch(49% 0 152.61), oklch(77% 0 152.61))"
      $description: "Méně důležitý text. Kontrast > 4,5:1."
    secondaryVariant:
      $type: color
      $value: "light-dark(oklch(58% 0 152.61), oklch(66% 0 152.61))"
      $description: "Varianta sekundárního textu. Kontrast > 3:1."
    disabled:
      $type: color
      $value: "light-dark(oklch(69% 0 152.61), oklch(56% 0 152.61))"
      $description: "Neaktivní prvky."
    brandPrimary:
      $type: color
      $value: "light-dark(oklch(59.2% 0.152 71), oklch(73% 0.13 71))"
      $description: "Primární brand barva textu. Goldenrod (#dc8f09)."
    brandSecondary:
      $type: color
      $value: "light-dark(oklch(57.6% 0.055 153), oklch(69% 0.05 153))"
      $description: "Sekundární brand barva textu. Sage (#789b81)."
    statusError:
      $type: color
      $value: "light-dark(oklch(51% 0.22 28), oklch(69% 0.2 28))"
    statusWarning:
      $type: color
      $value: "light-dark(oklch(58% 0.18 99), oklch(91% 0.16 99))"
    statusSuccess:
      $type: color
      $value: "light-dark(oklch(57% 0.16 128), oklch(75% 0.14 128))"
    statusInformation:
      $type: color
      $value: "light-dark(oklch(57% 0.18 205), oklch(77% 0.16 205))"
    rightsRequired:
      $type: color
      $value: "light-dark(oklch(57% 0.16 99), oklch(79% 0.14 99))"
      $description: "Povinné pole. Yellow."
    rightsPostponedRequired:
      $type: color
      $value: "light-dark(oklch(57.6% 0.055 153), oklch(69% 0.05 153))"
      $description: "Odloženě povinné. Sage (brand secondary)."
    rightsRecommended:
      $type: color
      $value: "light-dark(oklch(50% 0.18 205), oklch(74% 0.16 205))"
      $description: "Doporučeno. Aqua."

  overlay:
    subtle:
      $type: color
      $value: "light-dark(oklch(20% 0.1 152.61 / 0.2), oklch(80% 0.03 152.61 / 0.15))"
    default:
      $type: color
      $value: "light-dark(oklch(20% 0.1 152.61 / 0.4), oklch(80% 0.03 152.61 / 0.3))"
    strong:
      $type: color
      $value: "light-dark(oklch(20% 0.1 152.61 / 0.6), oklch(80% 0.03 152.61 / 0.5))"

typography:
  fontFamily:
    main:
      $type: fontFamily
      $value: ["ia-writer-quattro:main", "system-ui", "sans-serif"]
      $description: >
        Hlavní font pro veškerý běžný obsah. iA Writer Quattro (SIL OFL, iA Inc.).
        Variabilní osa: SPCG=0. Tloušťka výchozí: 400.
    headings:
      $type: fontFamily
      $value: ["departure-mono:headings", "monospace"]
      $description: >
        Font pro nadpisy H1–H6 a Subhead. Departure Mono (SIL OFL, Helena Zhang).
        Tloušťka výchozí: 700.
    monospace:
      $type: fontFamily
      $value: ["ia-writer-mono:monospace", "monospace"]
      $description: "Font pevné šířky pro kód a technicky laděné prvky. iA Writer Mono (SIL OFL, iA Inc.)."
    decorative:
      $type: fontFamily
      $value: ["departure-mono:decorative", "monospace"]
      $description: "Dekorativní font pro texturní akcenty (Tactical Telemetry). Departure Mono (decorative axis)."

  fontSize:
    xs:    { $type: dimension, $value: "12px" }
    s:     { $type: dimension, $value: "13px" }
    base:  { $type: dimension, $value: "15px", $description: "Výchozí velikost. fontBaseSize=15." }
    l:     { $type: dimension, $value: "18px" }
    xl:    { $type: dimension, $value: "22px" }
    xxl:   { $type: dimension, $value: "26px" }
    xxxl:  { $type: dimension, $value: "31px" }
    xxxxl: { $type: dimension, $value: "37px" }

  fontWeight:
    main:
      thin:    { $type: fontWeight, $value: 200, $description: "Jen pro velké nadpisy." }
      light:   { $type: fontWeight, $value: 300 }
      regular: { $type: fontWeight, $value: 400, $description: "Výchozí." }
      medium:  { $type: fontWeight, $value: 500 }
      bold:    { $type: fontWeight, $value: 700 }
    headings:
      thin:    { $type: fontWeight, $value: 500, $description: "Jen pro velké nadpisy." }
      light:   { $type: fontWeight, $value: 600 }
      regular: { $type: fontWeight, $value: 700, $description: "Výchozí." }
      medium:  { $type: fontWeight, $value: 800 }
      bold:    { $type: fontWeight, $value: 1000 }
    monospace:
      regular: { $type: fontWeight, $value: 400 }
      medium:  { $type: fontWeight, $value: 500 }
      bold:    { $type: fontWeight, $value: 700 }

spacing:
  half: { $type: dimension, $value: "4px",  $description: "--base-h" }
  1x:   { $type: dimension, $value: "8px",  $description: "--base" }
  1_5x: { $type: dimension, $value: "12px", $description: "--base-1h" }
  2x:   { $type: dimension, $value: "16px", $description: "--base-2" }
  2_5x: { $type: dimension, $value: "20px", $description: "--base-2h" }
  3x:   { $type: dimension, $value: "24px", $description: "--base-3" }
  4x:   { $type: dimension, $value: "32px", $description: "--base-4" }
  5x:   { $type: dimension, $value: "40px", $description: "--base-5" }
  6x:   { $type: dimension, $value: "48px", $description: "--base-6" }
  7x:   { $type: dimension, $value: "56px", $description: "--base-7" }
  8x:   { $type: dimension, $value: "64px", $description: "--base-8" }
  9x:   { $type: dimension, $value: "72px", $description: "--base-9" }
  10x:  { $type: dimension, $value: "80px", $description: "--base-10" }

borderRadius:
  subtle:  { $type: dimension, $value: "0px",     $description: "--radius-subtle (radiusIntensity=0)" }
  default: { $type: dimension, $value: "0px",     $description: "--radius — nulové zaoblení rohů" }
  strong:  { $type: dimension, $value: "0px",     $description: "--radius-strong" }
  extreme: { $type: dimension, $value: "0px",     $description: "--radius-extreme" }
  circle:  { $type: dimension, $value: "10000px", $description: "--radius-circle — jen pro skutečný dot/pill" }

border:
  minimal:
    $type: color
    $value: "light-dark(oklch(20% 0.1 152.61 / 0.04), oklch(80% 0.03 152.61 / 0.08))"
    $description: "--border-minimal — sotva viditelná linka"
  subtle:
    $type: color
    $value: "light-dark(oklch(20% 0.1 152.61 / 0.1), oklch(80% 0.03 152.61 / 0.12))"
    $description: "--border-subtle — jemná linka"
  default:
    $type: color
    $value: "light-dark(oklch(20% 0.1 152.61 / 0.2), oklch(80% 0.03 152.61 / 0.24))"
    $description: "--border — výchozí ohraničení"
  strong:
    $type: color
    $value: "light-dark(oklch(20% 0.1 152.61 / 0.3), oklch(80% 0.03 152.61 / 0.32))"
    $description: "--border-strong — výraznější linka pro inputy"
  contrast:
    $type: color
    $value: "light-dark(oklch(20% 0.1 152.61 / 0.5), oklch(80% 0.03 152.61 / 0.54))"
    $description: "--border-contrast — velmi výrazná linka"
  shiny:
    $type: color
    $value: "light-dark(oklch(100% 0 152.61 / 0.36), oklch(100% 0 152.61 / 0.08))"
    $description: "--border-shiny — odlesk na kartách, listech, widgetech"
  variant:
    $type: color
    $value: "light-dark(oklch(20% 0.1 152.61 / 0.2), oklch(20% 0.03 152.61 / 0.9))"
    $description: "--border-variant — vždy tmavá linka (i v tmavém tématu)"

shadow:
  elevationSubtle:
    $type: shadow
    $value: "0 1px 1px light-dark(oklch(0.1 0.04 152.61 / 0.06), oklch(0 0.04 152.61 / 0.06)), 0 1px 2px light-dark(oklch(0.1 0.04 152.61 / 0.04), oklch(0 0.04 152.61 / 0.04))"
    $description: "--elevation-subtle — stisklé tlačítko"
  elevation:
    $type: shadow
    $value: "0 1px 2px light-dark(oklch(0.1 0.04 152.61 / 0.1), oklch(0 0.04 152.61 / 0.1)), 0 3px 5px -1px light-dark(oklch(0.1 0.04 152.61 / 0.08), oklch(0 0.04 152.61 / 0.08))"
    $description: "--elevation — tlačítka, widgety, karty"
  elevationStrong:
    $type: shadow
    $value: "0 8px 24px light-dark(oklch(0.1 0.04 152.61 / 0.16), oklch(0 0.04 152.61 / 0.16)), 0 8px 24px -3px light-dark(oklch(0.1 0.04 152.61 / 0.28), oklch(0 0.04 152.61 / 0.28))"
    $description: "--elevation-strong — dropdown, popup, toast"
  elevationExtreme:
    $type: shadow
    $value: "0 20px 48px light-dark(oklch(0.1 0.04 152.61 / 0.2), oklch(0 0.04 152.61 / 0.2)), 0 20px 48px -5px light-dark(oklch(0.1 0.04 152.61 / 0.32), oklch(0 0.04 152.61 / 0.32))"
    $description: "--elevation-extreme — výhradně pro dialog"
  embossment:
    $type: shadow
    $value: "inset 0 2px 3px -1px light-dark(oklch(0.1 0.04 152.61 / 0.1), oklch(0 0.04 152.61 / 0.1))"
    $description: "--embossment — reliéf pro textová pole"

coloredSurfaces:
  paletteMapping:
    $description: >
      Mapování emphasis → index palety platí pro všech 20 barev.
      Token surface: --surface-[color]-[emphasis] = light-dark(var(--[color]-[lightIdx]), var(--[color]-[darkIdx])).
      Token text: --text-[type]-on-surface-[color]-[emphasis].
    minimal:  { light: 10,  dark: 100 }
    subtle:   { light: 20,  dark: 90  }
    moderate: { light: 40,  dark: 70  }
    strong:   { light: 60,  dark: 50  }
    contrast: { light: 90,  dark: 20  }
    main:     { light: 30,  dark: 100 }

---

# Spectro Design System

## Overview

Spectro je enterprise design systém pro webové aplikace. Vizuální jazyk je čistý, funkční a profesionální — bez zbytečné dekorace. Cílem je efektivita práce uživatele, nikoliv vizuální atraktivita pro vlastní účely.

Systém je navržen tak, aby:
- Fungoval konzistentně ve světlém i tmavém tématu.
- Byl tematizovatelný přes seed parametry (barvy, typografie, kontrast, zaoblení) bez zásahů do komponent.
- Splňoval kontrastní požadavky WCAG 2.1 A napříč tématy.
- Pracoval s variabilními fonty pro maximální flexibilitu bez přidávání dalších fontových souborů.

Aplikace postavené na Spectru cílí primárně na power users v B2B prostředí, kde je klíčová hustota informací, přehlednost a konzistentní chování UI.

**Seed projektu modern-css-sessions:**
- `brandPrimary` = goldenrod (`#dc8f09`, `oklch(71.2% 0.152 71)`) → paleta `dixie`
- `brandSecondary` = sage (`#789b81`, `oklch(65.6% 0.055 153)`) → paleta `oxley`
- `surfaceBrand` = secondary, `surfaceIntensity` = 2
- `radiusIntensity` = 0 — **nulové zaoblení rohů** (všechny `--radius*` = 0)
- `statusSuccess` = lime, `statusWarning` = yellow, `statusError` = red, `statusInformation` = aqua
- `fontFamilyMain` = ia-writer-quattro
- `fontFamilyHeadings` = departure-mono
- `fontFamilyMonospace` = ia-writer-mono
- `fontFamilyDecorative` = departure-mono
- `fontBaseSize` = 15px, `scaleRatio` = 1.2
- `contrastLevel` = a (WCAG 2.1)

## Colors

### Paleta

Spectro používá **OKLCH** barevný prostor (`oklch(L C H)`), který zajišťuje perceptuálně konzistentní světlost napříč barvami. To umožňuje generovat kontrastní páry bez ručního dopočítávání.

Každá barva palety má 10 odstínů (`--[color]-10` až `--[color]-100`):
- **10–40**: světlé odstíny (světlá pozadí) — L 80–95 %
- **50–60**: střed — základ pro generování; `60` je základní barva, `50` méně saturovaná varianta pro tmavé téma
- **70–100**: tmavé odstíny (tmavá pozadí) — L 30–54 %

Napříč barvami platí: stejný index = stejná perceptuální světlost (výjimka: Silver, Black).

**Paleta nesmí být používána přímo v komponentách.** Slouží jako referenční vrstva pro sémantické tokeny.

CSS proměnné: `--[color]-[10-100]`, např. `--dixie-60: oklch(71.2% 0.152 71)`, `--oxley-60: oklch(65.6% 0.055 153)`.

Dostupné barvy a jejich OKLCH hue:
| Barva | Hue | Barva | Hue |
|-------|-----|-------|-----|
| Pink | 0 | Yellow | 99 |
| Fuchsia | 325 | Amber | 82 |
| Deep Purple | 298 | Orange | 62 |
| Navy | 266 | Deep Orange | 45 |
| Blue | 250 | Red | 28 |
| Light Blue | 230 | Brown | 50 |
| Aqua | 205 | Gray | 0 (C=0) |
| Teal | 175 | Silver | 0 (C=0) |
| Green | 146 | Black | 0 (C=0) |
| Light Green | 135 | Dixie (goldenrod) | 71 |
| Lime | 128 | Oxley (sage) | 153 |

### Funkční barvy

**Brand** — identita produktu (konfigurováno v seed):
- Primární (goldenrod): `--brand-primary-*` aliasuje `--dixie-*`
- Sekundární (sage): `--brand-secondary-*` aliasuje `--oxley-*`

**Status** — výsledky akcí a systémové zprávy:
- `success` → lime (`oklch(74% 0.16 128)`)
- `warning` → yellow (`oklch(90% 0.18 99)`)
- `error` → red (`oklch(51% 0.22 28)`)
- `information` → aqua (`oklch(76% 0.18 205)`)

Nepoužívejte `--red-*`/`--lime-*` přímo pro status — vždy `--status-error-*`/`--status-success-*`.

**Práva** — povinnosti ve formulářích:
- `rights-required` → yellow
- `rights-postponed-required` → oxley
- `rights-recommended` → aqua

### Povrchy (Surfaces)

Povrchy jsou sémantické tokeny pro pozadí komponent. Každý barevný povrch má úrovně důrazu:

| Důraz | Popis | Příklad tokenu |
|-------|-------|----------------|
| `minimal` | Nenápadné pozadí, lehký nádech barvy | `--surface-dixie-minimal` |
| `subtle` | Nízká, ale patrná vizuální přítomnost | `--surface-dixie-subtle` |
| `moderate` | Normovaný jas a chroma napříč barvami | `--surface-dixie-moderate` |
| `strong` | Výrazné prvky, zachovaný jas barvy | `--surface-dixie-strong` |
| `contrast` | Maximální kontrast, invertuje vztah světlé/tmavé | `--surface-dixie-contrast` |
| `main` | Kombinace moderate + main | `--surface-dixie-main` |

Každý povrch má varianty: `default`, `-hover`, `-active`, `-disabled`.

Ke každému barevnému povrchu patří odpovídající tokeny textu:
- `--text-primary-on-surface-[color]-[emphasis]`
- `--text-secondary-on-surface-[color]-[emphasis]`
- `--text-disabled-on-surface-[color]-[emphasis]`

**Neutrální povrchy** (výchozí barva dokumentu a komponent):

| Token | Light | Dark |
|-------|-------|------|
| `--surface-base` | `oklch(90% 0.01024 152.61)` | `oklch(4% 0.01842 152.61)` |
| `--surface-base-variant` | `oklch(100% 0 152.61)` | `oklch(0% 0 152.61)` |
| `--surface-main` | `oklch(98% 0.00419 152.61)` | `oklch(24% 0.00962 152.61)` |
| `--surface-main-dim` | `oklch(96% 0.00819 152.61)` | `oklch(20% 0.01566 152.61)` |
| `--surface-main-variant` | `oklch(94% 0.0128 152.61)` | `oklch(32% 0.02167 152.61)` |
| `--surface-main-bright` | `oklch(100% 0.00819 152.61)` | `oklch(34% 0.01566 152.61)` |
| `--surface-front` | `oklch(100% 0.00819 152.61)` | `oklch(30% 0.01566 152.61)` |
| `--surface-control` | `oklch(100% 0.00655 152.61)` | `oklch(34% 0.01331 152.61)` |
| `--surface-control-variant` | `oklch(100% 0.00655 152.61)` | `oklch(20% 0.01331 152.61)` |

Všechny neutrální povrchy mají průsvitnou (translucent) variantu pro glass efekty: `--surface-[name]-translucent`.

### Barvy textu

Barvy textu jsou určeny výhradně pro neutrální povrchy. Na barevných površích vždy použijte `--text-*-on-surface-[color]-[emphasis]`.

| Token | Light | Dark | Kontrast |
|-------|-------|------|----------|
| `--text-primary` | `oklch(2% 0 152.61)` | `oklch(98% 0 152.61)` | > 4,5:1 |
| `--text-primary-variant` | `oklch(35% 0 152.61)` | `oklch(85% 0 152.61)` | > 3:1 |
| `--text-secondary` | `oklch(49% 0 152.61)` | `oklch(77% 0 152.61)` | > 4,5:1 |
| `--text-secondary-variant` | `oklch(58% 0 152.61)` | `oklch(66% 0 152.61)` | > 3:1 |
| `--text-disabled` | `oklch(69% 0 152.61)` | `oklch(56% 0 152.61)` | — |

`-variant` smíte použít jen pro ikony, tučný text > 19 px nebo běžný text > 24 px.

## Typography

Spectro pracuje se třemi typy písem:

| Typ | Font (tento projekt) | Výchozí tloušťka | CSS proměnná |
|-----|---------------------|------------------|-------------|
| Hlavní | iA Writer Quattro (`SPCG=0`) | 400 | `--font-stack-main` |
| Nadpisy | Departure Mono | 700 | `--font-stack-headings` |
| Pevná šířka | iA Writer Mono (`SPCG=0`) | 400 | `--font-stack-monospace` |

Všechny tři fonty jsou SIL OFL a jsou součástí repozitáře v `shared/fonts/`.

### Typografická škála

Základ: 15 px, poměr 1.2.

| Stupeň | Velikost | Typ fontu | CSS token |
|--------|----------|-----------|-----------|
| Footnote | `--font-size-xs` = **12 px** | Main | |
| Caption | `--font-size-s` = **13 px** | Main | |
| Body | `--font-size-base` = **15 px** | Main | |
| Button | `--font-size-base` = **15 px** | Main | |
| Code | `--font-size-base` = **15 px** | Monospace | |
| Subhead | `--font-size-l` = **18 px** | Main | |
| H6 | `--font-size-l` = **18 px** | Headings | |
| H5 | `--font-size-xl` = **22 px** | Headings | |
| H4 | `--font-size-xxl` = **26 px** | Headings | |
| H3 | `--font-size-xxxl` = **31 px** | Headings | |
| H2 | `--font-size-xxxxl` = **37 px** | Headings | |
| H1 | `--font-size-xxxxl` = **37 px**+ | Headings | |

Nikdy nepoužívejte přímé hodnoty `font-size` — vždy `--font-size-*` token.

### Tloušťky fontů

| Varianta | Main | Headings | Monospace | Popis |
|----------|------|----------|-----------|-------|
| Thin | 200 | 500 | 200 | Jen pro velké nadpisy |
| Light | 300 | 600 | 300 | Jen pro velké nadpisy |
| Regular | **400** | **700** | **400** | Výchozí |
| Medium | 500 | 800 | 500 | Mírné zvýraznění |
| Bold | 700 | 1000 | 700 | Velké zvýraznění |

CSS proměnné: `--font-weight-[type]-[variant]`, např. `--font-weight-headings-bold: 1000`.

## Layout & Spacing

Základní jednotka je **8 px** (`--base`). Všechny `margin`, `padding`, `gap` a rozměry prvků musí být násobky tohoto základu.

| Proměnná | Hodnota |
|----------|---------|
| `--base-h` | 4 px |
| `--base` | 8 px |
| `--base-1h` | 12 px |
| `--base-2` | 16 px |
| `--base-2h` | 20 px |
| `--base-3` | 24 px |
| `--base-4` | 32 px |
| `--base-5` | 40 px |
| `--base-6` | 48 px |
| `--base-7` | 56 px |
| `--base-8` | 64 px |
| `--base-9` | 72 px |
| `--base-10` | 80 px |

## Border Radius

| Proměnná | Hodnota | Použití |
|----------|---------|---------|
| `--radius-subtle` | 0 | radiusIntensity=0 — nulové zaoblení |
| `--radius` | 0 | Výchozí — hard 90° rohy |
| `--radius-strong` | 0 | Karty, panely, modaly |
| `--radius-extreme` | 0 | Nejvyšší stupeň |
| `--radius-circle` | 10 000 px | Jen pro skutečný dot/pill |

## Borders

Ohraničení jsou semi-transparentní a přizpůsobují se tématu přes `light-dark()`.

| Proměnná | Light (opacity) | Dark (opacity) |
|----------|----------------|----------------|
| `--border-minimal` | `oklch(20% 0.1 152.61 / 0.04)` | `oklch(80% 0.03 152.61 / 0.08)` |
| `--border-subtle` | `oklch(20% 0.1 152.61 / 0.1)` | `oklch(80% 0.03 152.61 / 0.12)` |
| `--border` | `oklch(20% 0.1 152.61 / 0.2)` | `oklch(80% 0.03 152.61 / 0.24)` |
| `--border-strong` | `oklch(20% 0.1 152.61 / 0.3)` | `oklch(80% 0.03 152.61 / 0.32)` |
| `--border-contrast` | `oklch(20% 0.1 152.61 / 0.5)` | `oklch(80% 0.03 152.61 / 0.54)` |
| `--border-shiny` | `oklch(100% 0 152.61 / 0.36)` | `oklch(100% 0 152.61 / 0.08)` |
| `--border-variant` | `oklch(20% 0.1 152.61 / 0.2)` | `oklch(20% 0.03 152.61 / 0.9)` |

Pro tmavá pozadí ve světlém tématu použijte `--border-*-inverted` varianty (hodnoty jsou prohozené).

## Shadows & Elevation

Stíny jsou semi-transparentní a reagují na téma:

| Proměnná | Box-shadow definice | Použití |
|----------|--------------------|----|
| `--elevation-subtle` | `0 1px 1px …/0.06, 0 1px 2px …/0.04` | Stisklé tlačítko |
| `--elevation` | `0 1px 2px …/0.1, 0 3px 5px -1px …/0.08` | Tlačítka, widgety, karty |
| `--elevation-strong` | `0 8px 24px …/0.16, 0 8px 24px -3px …/0.28` | Dropdown, popup, toast |
| `--elevation-extreme` | `0 20px 48px …/0.2, 0 20px 48px -5px …/0.32` | Dialog (nejvyšší vrstva) |
| `--embossment` | `inset 0 2px 3px -1px …/0.1` | Reliéf pro textová pole |

Barva stínů: `light-dark(oklch(0.1 0.04 152.61 / α), oklch(0 0.04 152.61 / α))` — v světlém tématu tmavě modrá, v tmavém černá.

Záře (`--glow-[color]`): `0 4px 6px color/0.24, 0 4px 6px -2px color/0.4`. Silná varianta (`-strong`): `0 8px 24px …`.

Interaktivní prvky: při stisknutí přechází `--elevation` → `--elevation-subtle`.

## Theming

Spectro podporuje **světlé** a **tmavé** téma. Přepínání řídí atribut `data-theme` (ne `@media prefers-color-scheme`). Tokeny jsou implementovány přes CSS funkci `light-dark()`.

```css
:root,
[data-theme$="light"]:where(:not(:root)),
:where(:root[data-theme$="dark"] [data-theme="inverted"]) {
    color-scheme: light;
}

:root[data-theme$="dark"],
[data-theme$="dark"]:where(:not(:root)),
:where(:root[data-theme$="light"] [data-theme="inverted"]) {
    color-scheme: dark;
}
```

Podporované hodnoty `data-theme`: `light`, `dark`, `inverted`.

**Kritické pravidlo:** Každá komponenta musí definovat vlastní barevné CSS proměnné přímo — nesmí se spoléhat na kaskádu z `<html>`. Jinak nebude fungovat pevné nebo invertované téma na komponentě.

## Design Tokens

Tokeny jsou dvouvrstvé:

**Globální tokeny** — konkrétní hodnoty (barva, radius, velikost). Nikdy nepoužívejte přímo v komponentách. Příklad: `--dixie-60: oklch(71.2% 0.152 71)`, `--base: 8px`, `--radius: 0`.

**Sémantické tokeny** — nesou význam, odkazují na globální tokeny nebo na jiné sémantické tokeny. Tyto používejte v komponentách. Příklad: `--surface-brand-primary-strong`, `--text-primary`, `--elevation`.

Řetězec odkazu: komponenta → sémantický token → globální token → OKLCH hodnota.

Nikdy nepřeskakujte vrstvy kvůli "rychlé opravě".
