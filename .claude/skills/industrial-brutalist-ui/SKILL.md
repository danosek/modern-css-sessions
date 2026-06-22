---
name: industrial-brutalist-ui
description: Our house UI language for Modern CSS Sessions — a Tactical Telemetry & CRT Terminal aesthetic built on top of the Spectro design system. Rigid modular grids, zero corner rounding, extreme type-scale contrast, monospace telemetry, analog degradation. Every font and colour comes from Spectro tokens (catalogued in DESIGN.md), never hardcoded.
---

# Industrial Brutalist UI — Tactical Telemetry on Spectro

This is the design language we built together for **Modern CSS Sessions**. We took the
**Spectro** design system and themed it in the style of **Tactical Telemetry & CRT
Terminal** — the look of classified databases, legacy mainframes and aerospace HUDs. This
file is the playbook we follow whenever we build or extend a screen in the project (the
index, the demo wrapper, the editor): it describes *how* we compose Spectro into that look.

Two rules sit above everything else:

1. **Every colour, font and dimension is a Spectro token.** No hardcoded hex, no font
   names, no magic numbers. The complete token catalogue — palette, surfaces, text, fonts,
   spacing, borders — lives in [`DESIGN.md`](../../../DESIGN.md) at the repo root, generated
   from our theme in `src/spectro/`. This skill never re-states token values; it only says
   how to combine them.
2. **Zero corner rounding.** Our Spectro theme ships every radius token at `0` (`--radius`,
   `--radius-subtle`, `--radius-strong`, `--radius-extreme` are all `0px`). Corners are hard
   90°. Never reintroduce `border-radius`. (`--radius-circle` exists only for a true dot/pill
   and we essentially never use it.)

## 1. The aesthetic — Tactical Telemetry & CRT Terminal

A single, committed look derived from classified military databases, legacy mainframes and
aerospace Heads-Up Displays. Characteristics:

- High-density, tabular presentation of information.
- Dominance of monospaced typography; structural headers in the heavy mono display face.
- Technical framing devices — ASCII brackets, crosshairs, directional markers.
- Hard-lined compartmentalisation: razor-thin grid rules, no soft edges, no shadows.
- Optional simulated hardware limits — phosphor glow, scanlines, low bit-depth grain.

**Theme-aware, not two designs.** We keep Spectro's automatic theme (`data-theme` follows
`prefers-color-scheme` plus a manual toggle). The *same* Tactical Telemetry interface renders
on a light substrate (paper-grade neutrals) and a dark substrate (deactivated-CRT neutrals);
the Spectro tokens flip via `light-dark()`. There is one aesthetic — never branch the markup
per theme, never hardcode a substrate.

## 2. Typographic architecture

Typography is the primary structural and decorative infrastructure; imagery is secondary.
All families come from Spectro font-stack tokens — never import or name a font directly.

| Role | Spectro token | Font in our theme |
|------|---------------|-------------------|
| Macro / structural headers | `var(--font-stack-headings)` | Departure Mono (heavy mono display) |
| Micro / data & telemetry | `var(--font-stack-monospace)` | iA Writer Mono |
| Body / running copy | `var(--font-stack-main)` | iA Writer Quattro |
| Textural disruption | `var(--font-stack-decorative)` | Departure Mono (decorative axis) |

### Macro-typography (structural headers)
- `font-family: var(--font-stack-headings);`
- Scale: massive, fluid — `clamp()` only, e.g. `clamp(2.5rem, 10vw, 7rem)`.
- Tracking: tight, often negative (`-0.02em` to `-0.06em`) so glyphs fuse into blocks.
- Leading: compressed (`0.82`–`0.95`). Casing: exclusively uppercase.

### Micro-typography (data & telemetry)
- `font-family: var(--font-stack-monospace);`
- Scale: fixed and small — prefer `var(--font-size-xs)` / `var(--font-size-s)`.
- Tracking: generous (`0.06em`–`0.12em`) to read as a terminal matrix.
- Casing: uppercase. Used for all metadata, navigation, unit IDs, section labels.

### Textural disruption
- `font-family: var(--font-stack-decorative);` — used exceedingly sparingly, and only with
  post-processing (halftone / 1-bit dithering). If degradation doesn't earn its place, omit it.

## 3. Colour

Every colour is a Spectro token; the full set is in [`DESIGN.md`](../../../DESIGN.md). Because
the tokens are theme-aware, you set the substrate once via `data-theme` and reuse the same
role tokens for both light and dark.

| Role | Spectro token(s) |
|------|------------------|
| Primary substrate / page | `var(--surface-main)` (our pages) or `var(--surface-base)` |
| Compartment / panel fills | `var(--surface-main)`, `var(--surface-main-dim)`, `var(--surface-main-variant)` |
| Primary foreground (ink / phosphor) | `var(--text-primary)` |
| Secondary / metadata text | `var(--text-secondary)` |
| Structural dividers, frames, grid lines | `var(--text-primary)` (bold rules) or `var(--border)` (hairlines) |
| **The single accent** | brand: `var(--text-brand-primary)` (text) and `var(--surface-brand-primary-strong)` (fills) |
| Genuine semantics only | `var(--status-error)` / `var(--text-red)` for errors, `!important`/invalid syntax |

- **One accent, brand-bound.** The accent is the Spectro brand (goldenrod primary), not a
  generic hazard red. Reserve red strictly for real error states and syntax semantics that
  mirror the editor's highlight — never as decoration.
- **No translucency hacks.** Where an overlay is needed, use `color-mix(in oklch, var(--…) X%,
  transparent)` so it still tracks the theme. No gradients, no soft drop shadows.

## 4. Layout & spatial engineering

- **Blueprint grid.** Strict CSS Grid. Elements anchor to tracks and intersections; nothing
  floats.
- **Razor-thin rules via gap.** `display: grid; gap: 1px/2px;` with a `--text-primary` parent
  background and `--surface-*` children yields perfect dividing lines without per-side borders.
- **Visible compartmentalisation.** Solid `1px`/`2px` borders in `--text-primary` for major
  frames, `--border` for inner subdivisions. Full-width `<hr>` to segregate units.
- **Bimodal density.** Oscillate between tight monospace metadata clusters and vast negative
  space framing macro-typography.
- **Geometry.** Hard 90° corners everywhere (`border-radius: 0`). Spacing uses Spectro spacing
  tokens (`--base`, `--base-2` … `--page-pad`), never arbitrary px.

## 5. Components & symbology

- **ASCII framing:** `[ DELIVERY SYSTEMS ]`, `< RE-IND >`; directional `>>>`, `///`, `\\\\`.
- **Industrial markers:** registration `®`, copyright `©`, trademark `™` used as geometric
  elements, not legal text. Keep these meaningful — avoid fake telemetry noise (version
  strings, fabricated unit/status IDs) that adds nothing.
- **Technical assets:** crosshairs `+` at grid intersections, repeating vertical rules
  (barcodes), thick horizontal warning stripes.

## 6. Texture & post-processing

To avoid a purely digital feel, engineer restrained analog degradation in CSS/SVG; tint with
Spectro tokens via `color-mix()` so effects stay theme-correct.

- **Scanlines:** `repeating-linear-gradient` simulating an electron-beam sweep, e.g.
  `repeating-linear-gradient(0deg, transparent 0 2px, color-mix(in oklch, var(--text-primary) 4%, transparent) 3px, transparent 4px)`.
- **Halftone / 1-bit dithering:** continuous-tone imagery or decorative type → dot-matrix via
  `mix-blend-mode` overlays + SVG radial-dot patterns.
- **Mechanical noise:** a global low-opacity grain for a unified physical texture.
- Keep texture legible — on data-dense or teaching content, dial it down or omit it.

## 7. Engineering directives

1. **Grid determinism** over multi-side borders (see §4).
2. **Semantic rigidity:** build the DOM with precise tags (`<data>`, `<samp>`, `<kbd>`,
   `<output>`, `<dl>`, real headings) reflecting the technical nature of the content.
3. **Clamp macro-typography** with `clamp()` so huge text scales without breaking layout.
4. **Spectro is the single source of truth.** Every value resolves to a token from
   [`DESIGN.md`](../../../DESIGN.md); switch substrate via `data-theme` only. Never hardcode.
