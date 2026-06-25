import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Shared Spectro syntax highlight — covers HTML, CSS, and embedded JS.
// basicSetup registers defaultHighlightStyle with { fallback: true }, so these
// take precedence for every tag listed here.
//
// MONOCHROMATICKÝ MOTIV (ladí s tématem):
//   • neutrální inkoust  --text-primary    → props, hodnoty, identifikátory, obsah
//   • tlumené            --text-secondary  → komentáře, interpunkce, operátory, struktura
//   • amber akcent       --text-brand-primary    → selektory, at-rules, klíčová slova
//   • sage akcent        --text-brand-secondary  → literály (string/number/unit/color/bool)
//   • červená            --text-red        → jen skutečné chyby (a !important)
export const spectroSyntax = syntaxHighlighting(HighlightStyle.define([

  // ── Komentáře — tlumené, recedují ──────────────────────────────────────────
  { tag: tags.lineComment,                       color: 'var(--text-secondary)', fontStyle: 'italic' },
  { tag: tags.blockComment,                      color: 'var(--text-secondary)', fontStyle: 'italic' },

  // ── Inkoust (default) — hodnoty, identifikátory, obsah ─────────────────────
  { tag: tags.content,                           color: 'var(--text-primary)' },   // plain text
  { tag: tags.atom,                              color: 'var(--text-primary)' },   // CSS value keywords (flex, auto, bold…)
  { tag: tags.self,                              color: 'var(--text-primary)' },   // this

  // ── Tlumené identifikátory — props recedují, hodnoty zůstanou inkoustové ────
  { tag: tags.propertyName,                      color: 'var(--text-secondary)' },         // CSS property (display, padding…)
  { tag: tags.variableName,                      color: 'var(--text-brand-secondary-variant)' }, // --custom-props / JS vars
  { tag: tags.function(tags.variableName),       color: 'var(--text-primary)' },   // var(), clamp(), repeat()…
  { tag: tags.function(tags.propertyName),       color: 'var(--text-primary)' },
  { tag: tags.operatorKeyword,                   color: 'var(--text-primary)' },   // typeof instanceof / CSS fn calls
  { tag: tags.tagName,                           color: 'var(--text-primary)' },
  { tag: tags.standard(tags.tagName),            color: 'var(--text-primary)' },
  { tag: tags.attributeName,                     color: 'var(--text-primary)' },
  { tag: tags.typeName,                          color: 'var(--text-primary)' },

  // ── Amber akcent — selektory, at-rules, klíčová slova (strukturní záměr) ────
  { tag: tags.className,                         color: 'var(--text-brand-primary)' },   // .selector
  { tag: tags.constant(tags.className),          color: 'var(--text-brand-primary)' },   // :pseudo-class
  { tag: tags.labelName,                         color: 'var(--text-brand-primary)' },   // #id / keyframe names
  { tag: tags.definitionKeyword,                 color: 'var(--text-brand-primary)' },   // @media / const let var
  { tag: tags.keyword,                           color: 'var(--text-brand-primary)' },   // new with debugger
  { tag: tags.controlKeyword,                    color: 'var(--text-brand-primary)' },   // if for while return…
  { tag: tags.moduleKeyword,                     color: 'var(--text-brand-primary)' },   // import export from

  // ── Sage akcent — literály ──────────────────────────────────────────────────
  { tag: tags.string,                            color: 'var(--text-brand-secondary)' },
  { tag: tags.special(tags.string),              color: 'var(--text-brand-secondary)' }, // template literals
  { tag: tags.regexp,                            color: 'var(--text-brand-secondary)' },
  { tag: tags.attributeValue,                    color: 'var(--text-brand-secondary)' },
  { tag: tags.number,                            color: 'var(--text-brand-secondary)' },
  { tag: tags.unit,                              color: 'var(--text-brand-secondary)' },
  { tag: tags.color,                             color: 'var(--text-brand-secondary)' }, // #hex colors
  { tag: tags.bool,                              color: 'var(--text-brand-secondary)' },
  { tag: tags.null,                              color: 'var(--text-brand-secondary)' },
  { tag: tags.character,                         color: 'var(--text-brand-secondary)' }, // &amp; &#123;
  { tag: tags.escape,                            color: 'var(--text-brand-secondary)' }, // \n, \u…

  // ── Tlumené — struktura, interpunkce, operátory (recedují) ──────────────────
  { tag: tags.documentMeta,                      color: 'var(--text-secondary)' }, // <!DOCTYPE>
  { tag: tags.processingInstruction,             color: 'var(--text-secondary)' }, // <?...?>
  { tag: tags.angleBracket,                      color: 'var(--text-secondary)' }, // < > </ />
  { tag: tags.definitionOperator,                color: 'var(--text-secondary)' }, // = (attrs) + : (CSS)
  { tag: tags.punctuation,                       color: 'var(--text-secondary)' },
  { tag: tags.separator,                         color: 'var(--text-secondary)' },
  { tag: tags.paren,                             color: 'var(--text-secondary)' },
  { tag: tags.squareBracket,                     color: 'var(--text-secondary)' },
  { tag: tags.brace,                             color: 'var(--text-secondary)' },
  { tag: tags.derefOperator,                     color: 'var(--text-secondary)' },
  { tag: tags.compareOperator,                   color: 'var(--text-secondary)' },
  { tag: tags.logicOperator,                     color: 'var(--text-secondary)' },
  { tag: tags.arithmeticOperator,                color: 'var(--text-secondary)' },
  { tag: tags.bitwiseOperator,                   color: 'var(--text-secondary)' },
  { tag: tags.updateOperator,                    color: 'var(--text-secondary)' },
  { tag: tags.meta,                              color: 'var(--text-secondary)' }, // @ decorator

  // ── Chyby / důraz ───────────────────────────────────────────────────────────
  { tag: tags.modifier,                          color: 'var(--text-brand-primary)', fontWeight: 'bold' }, // !important / get set async
  { tag: tags.invalid,                           color: 'var(--text-red)' },       // mismatched tags
]));
