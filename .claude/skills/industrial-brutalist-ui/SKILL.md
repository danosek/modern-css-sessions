---
name: industrial-brutalist-ui
description: Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. Fonts and colors are sourced exclusively from the Spectro design system (tokens), never hardcoded. For data-heavy dashboards, portfolios, or editorial sites that need to feel like declassified blueprints.
---

# SKILL: Industrial Brutalism & Tactical Telemetry UI

## 1. Skill Meta
**Name:** Industrial Brutalism & Tactical Telemetry Interface Engineering
**Description:** Advanced proficiency in architecting web interfaces that synthesize mid-century Swiss Typographic design, industrial manufacturing manuals, and retro-futuristic aerospace/military terminal interfaces. This discipline requires absolute mastery over rigid modular grids, extreme typographic scale contrast, purely utilitarian color palettes, and the programmatic simulation of analog degradation (halftones, CRT scanlines, bitmap dithering). The objective is to construct digital environments that project raw functionality, mechanical precision, and high data density, deliberately discarding conventional consumer UI patterns.

> **SPECTRO BINDING (overrides the original skill).** This project ships the **Spectro** design system (`shared/spectro-theme.css`, `shared/demo-base.css`). All typography and color in this skill MUST be expressed through Spectro CSS custom properties — never hardcoded hex values, font names, or magic sizes. Spectro tokens are theme-aware via `light-dark()`, so the light/dark substrate is selected with `data-theme` on the root and the *same* tokens resolve correctly. The repo rule stands: *výhradně Spectro tokeny — žádné hardcoded barvy ani rozměry.*

## 2. Visual Archetypes
The design system operates by merging two distinct but highly compatible visual paradigms. **This project keeps Spectro's automatic theme** — `data-theme` follows `prefers-color-scheme` plus a manual toggle — so the SAME interface renders as *Swiss Industrial Print* in light mode and *Tactical Telemetry* in dark mode. These are the two faces of one theme-aware system: they are never mixed *within a single rendering* (the substrate switches the whole coherent archetype at once), but you always build **both** faces with the same theme-aware Spectro tokens. Do not hardcode a single substrate, and do not ask which archetype to use — support both via the tokens.

### 2.1 Swiss Industrial Print  →  `data-theme="light"`
Derived from 1960s corporate identity systems and heavy machinery blueprints.
*   **Characteristics:** High-contrast light substrate (`--surface-base` resolves to unbleached paper). Reliance on monolithic, heavy display typography. Unforgiving structural grids outlined by visible dividing lines (`--border`). Aggressive, asymmetric use of negative space punctuated by oversized, viewport-bleeding numerals or letterforms. Heavy use of a single hazard accent for alerts/highlights.

### 2.2 Tactical Telemetry & CRT Terminal  →  `data-theme="dark"`
Derived from classified military databases, legacy mainframes, and aerospace Heads-Up Displays (HUDs).
*   **Characteristics:** Dark substrate (`--surface-base` resolves to a deactivated-CRT near-black, never pure `#000`). High-density tabular data presentation. Absolute dominance of monospaced typography. Integration of technical framing devices (ASCII brackets, crosshairs). Application of simulated hardware limitations (phosphor glow, scanlines, low bit-depth rendering).

## 3. Typographic Architecture
Typography is the primary structural and decorative infrastructure. Imagery is secondary. The system demands extreme variance in scale, weight, and spacing. **All font families come from Spectro font-stack tokens — do not import or name fonts directly.**

| Role | Spectro token | Spectro font |
|------|---------------|--------------|
| Macro / structural headers | `var(--font-stack-headings)` | Departure Mono (heavy mono display) |
| Micro / data & telemetry | `var(--font-stack-monospace)` | iA Writer Mono |
| Body / running copy | `var(--font-stack-main)` | iA Writer Quattro |
| Textural disruption | `var(--font-stack-decorative)` | Departure Mono / serif fallback |

### 3.1 Macro-Typography (Structural Headers)
*   **Family:** `font-family: var(--font-stack-headings);` (Departure Mono — its fixed-width pixel grotesque already reads as machined block lettering).
*   **Implementation Parameters:**
    *   **Scale:** Massive, fluid — `clamp()` only (e.g. `clamp(4rem, 10vw, 15rem)`), ideally anchored to Spectro size tokens where practical.
    *   **Tracking:** Extremely tight, often negative (`-0.03em` to `-0.06em`) so glyphs fuse into solid architectural blocks.
    *   **Leading:** Highly compressed (`0.85` to `0.95`).
    *   **Casing:** Exclusively uppercase.

### 3.2 Micro-Typography (Data & Telemetry)
*   **Family:** `font-family: var(--font-stack-monospace);` (iA Writer Mono).
*   **Implementation Parameters:**
    *   **Scale:** Fixed and small — prefer `var(--font-size-xs)` / `var(--font-size-s)`.
    *   **Tracking:** Generous (`0.05em` to `0.1em`) to simulate terminal matrices.
    *   **Leading:** Standard to tight (`1.2` to `1.4`).
    *   **Casing:** Exclusively uppercase. All metadata, navigation, unit IDs, coordinates.

### 3.3 Textural Contrast (Artistic Disruption)
*   **Family:** `font-family: var(--font-stack-decorative);` — used exceedingly sparingly. Spectro has no high-contrast serif, so achieve "textural juxtaposition" through post-processing (halftone, 1-bit dithering) rather than relying on serif vector contrast. If decorative degradation does not earn its place, omit it.

## 4. Color System
The color architecture is uncompromising. Gradients, soft drop shadows, and modern translucency are strictly prohibited. **Every color is a Spectro token.** Because Spectro tokens are theme-aware, you do not maintain two palettes — you set the substrate once via `data-theme` and reuse the same role tokens.

**CRITICAL: This project renders BOTH substrates automatically** (`data-theme` from `prefers-color-scheme` + manual toggle): light = Swiss Print, dark = Tactical Telemetry. Use only the theme-aware Spectro role tokens below so a single set of rules produces both faces — never hardcode a substrate, and never mix both within one rendering.

### Role → Spectro token mapping
| Role | Spectro token(s) |
|------|------------------|
| Primary substrate / page | `var(--surface-base)` |
| Compartment / panel fills | `var(--surface-main)`, `var(--surface-main-dim)`, `var(--surface-main-variant)` |
| Primary foreground (ink / phosphor) | `var(--text-primary)` |
| Secondary / metadata text | `var(--text-secondary)` |
| Structural dividers & frames | `var(--border)`, `var(--border-shiny)` |
| **Hazard accent (the ONE accent)** | `var(--status-error)` / `var(--text-red)` for true hazard red, **or** the project brand accent `var(--text-brand-secondary)` / `var(--surface-brand-secondary-strong)`. Pick one and use it for strike-throughs, vital highlights, thick structural rules. |
| Optional single terminal-green readout (dark only) | `var(--text-green)` — exactly one element, never general text |

*   **No translucency hacks:** where overlay is needed, prefer `color-mix(in oklch, var(--…) X%, transparent)` over raw `rgba()`, so the result still tracks the theme.
*   **Accent discipline:** the original aesthetic uses a single aviation red. With Spectro's current brand palette (amber primary / sage secondary) the faithful "hazard red" lives in the status tokens (`--status-error` / `--text-red`). Commit to ONE accent token for the whole interface.

## 5. Layout and Spatial Engineering
The layout must appear mathematically engineered. It rejects conventional web padding in favor of visible compartmentalization.

*   **The Blueprint Grid:** Strict adherence to CSS Grid architectures. Elements do not float; they are anchored precisely to grid tracks and intersections.
*   **Visible Compartmentalization:** Extensive use of solid borders (`1px`/`2px solid var(--border)`) to delineate zones. Horizontal rules (`<hr>`) frequently span the full container width to segregate operational units.
*   **Bimodal Density:** Layouts oscillate between extreme data density (tightly packed monospace metadata) and vast expanses of calculated negative space framing macro-typography.
*   **Geometry:** Absolute rejection of rounded corners. Force `border-radius: 0` everywhere (Spectro's `radiusIntensity` is 0 here, but state it explicitly) to enforce mechanical rigidity. Spacing should use Spectro spacing tokens (`--base`, `--base-2`…`--page-pad`) rather than arbitrary px.

## 6. UI Components and Symbology
Standard web UI conventions are replaced with utilitarian, industrial graphic elements.

*   **Syntax Decoration:** ASCII characters frame data points.
    *   *Framing:* `[ DELIVERY SYSTEMS ]`, `< RE-IND >`
    *   *Directional:* `>>>`, `///`, `\\\\`
*   **Industrial Markers:** Registration (`®`), copyright (`©`), trademark (`™`) symbols as structural geometric elements, not legal text.
*   **Technical Assets:** Crosshairs (`+`) at grid intersections, repeating vertical lines (barcodes), thick horizontal warning stripes, and randomized string data (`REV 2.6`, `UNIT / D-01`) to simulate active mechanical processes.

## 7. Textural and Post-Processing Effects
To prevent a purely digital look, simulated analog degradation is engineered via CSS and SVG filters. Use Spectro tokens inside `color-mix()` for any tinting so effects stay theme-correct.

*   **Halftone and 1-Bit Dithering:** Continuous-tone images / large decorative type → dot-matrix patterns, via `mix-blend-mode: multiply` overlays + SVG radial dot patterns.
*   **CRT Scanlines (dark substrate):** `repeating-linear-gradient` simulating electron-beam sweeps, e.g. `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--text-primary) 6%, transparent) 2px 4px)`.
*   **Mechanical Noise:** A global low-opacity SVG static/noise filter on the DOM root for a unified physical grain in both substrates.

## 8. Web Engineering Directives
1.  **Grid Determinism:** `display: grid; gap: 1px;` with contrasting parent/child surface tokens (`--border` parent, `--surface-base`/`--surface-main` children) to generate razor-thin dividing lines without per-side border declarations.
2.  **Semantic Rigidity:** Build the DOM with precise semantic tags (`<data>`, `<samp>`, `<kbd>`, `<output>`, `<dl>`) reflecting the technical nature of the telemetry.
3.  **Typography Clamping:** `clamp()` exclusively for macro-typography so massive text scales aggressively while keeping structural integrity across viewports.
4.  **Spectro Source-of-Truth:** Never introduce hardcoded colors, font names, or arbitrary dimensions. Every value resolves to a Spectro token; switch substrate via `data-theme` only.
