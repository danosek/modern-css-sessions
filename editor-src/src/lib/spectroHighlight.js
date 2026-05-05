import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Shared Spectro syntax highlight style — covers HTML, CSS, and embedded JS.
// basicSetup registers defaultHighlightStyle with { fallback: true }, so these
// take precedence for every tag listed here.
export const spectroSyntax = syntaxHighlighting(HighlightStyle.define([

  // ── Comments ────────────────────────────────────────────────────────────
  { tag: tags.lineComment,                       color: 'var(--text-green)', fontStyle: 'italic' },
  { tag: tags.blockComment,                      color: 'var(--text-green)', fontStyle: 'italic' },

  // ── HTML structure ───────────────────────────────────────────────────────
  { tag: tags.documentMeta,                      color: 'var(--text-secondary)' }, // <!DOCTYPE>
  { tag: tags.processingInstruction,             color: 'var(--text-secondary)' }, // <?...?>
  { tag: tags.angleBracket,                      color: 'var(--text-secondary)' }, // < > </ />
  { tag: tags.content,                           color: 'var(--text-primary)' },   // plain text
  { tag: tags.character,                         color: 'var(--text-amber)' },     // &amp; &#123;
  { tag: tags.invalid,                           color: 'var(--text-red)' },       // mismatched tags

  // ── Tag & attribute names ────────────────────────────────────────────────
  { tag: tags.tagName,                           color: 'var(--text-blue)' },
  { tag: tags.standard(tags.tagName),            color: 'var(--text-blue-variant)' }, // JSX built-ins
  { tag: tags.attributeName,                     color: 'var(--text-teal)' },
  { tag: tags.attributeValue,                    color: 'var(--text-orange)' },

  // ── CSS (in <style> blocks or standalone editor) ─────────────────────────
  { tag: tags.propertyName,                      color: 'var(--text-teal)' },
  { tag: tags.variableName,                      color: 'var(--text-navy)' },      // --custom-props / JS vars
  { tag: tags.definitionOperator,                color: 'var(--text-secondary)' }, // = (attrs) + : (CSS)
  { tag: tags.definitionKeyword,                 color: 'var(--text-fuchsia)' },   // @media / const let var
  { tag: tags.constant(tags.className),          color: 'var(--text-blue-variant)' }, // :pseudo-class name
  { tag: tags.definitionOperator,                color: 'var(--text-secondary)' },
  { tag: tags.color,                             color: 'var(--text-pink)' },      // #hex colors
  { tag: tags.unit,                              color: 'var(--text-amber)' },

  // ── JS keywords (in <script> blocks) ────────────────────────────────────
  { tag: tags.controlKeyword,                    color: 'var(--text-fuchsia)' },   // if for while return…
  { tag: tags.moduleKeyword,                     color: 'var(--text-fuchsia)' },   // import export from
  { tag: tags.keyword,                           color: 'var(--text-fuchsia)' },   // new with debugger
  { tag: tags.operatorKeyword,                   color: 'var(--text-teal-variant)' }, // typeof instanceof / CSS fn calls
  { tag: tags.atom,                              color: 'var(--text-primary)' },   // super / CSS value keywords
  { tag: tags.bool,                              color: 'var(--text-amber)' },
  { tag: tags.null,                              color: 'var(--text-amber)' },
  { tag: tags.self,                              color: 'var(--text-amber)' },     // this

  // ── Identifiers ──────────────────────────────────────────────────────────
  { tag: tags.function(tags.variableName),       color: 'var(--text-teal-variant)' },
  { tag: tags.function(tags.propertyName),       color: 'var(--text-teal-variant)' },
  { tag: tags.className,                         color: 'var(--text-blue)' },
  { tag: tags.typeName,                          color: 'var(--text-blue-variant)' },
  { tag: tags.labelName,                         color: 'var(--text-navy)' },      // #id / keyframe names

  // ── Literals ─────────────────────────────────────────────────────────────
  { tag: tags.number,                            color: 'var(--text-amber)' },
  { tag: tags.string,                            color: 'var(--text-orange)' },
  { tag: tags.special(tags.string),              color: 'var(--text-orange)' },    // template literals
  { tag: tags.regexp,                            color: 'var(--text-orange)' },
  { tag: tags.escape,                            color: 'var(--text-amber)' },     // \n, \u…
  { tag: tags.modifier,                          color: 'var(--text-red)', fontWeight: 'bold' }, // !important / get set async

  // ── Punctuation — muted so structure recedes ─────────────────────────────
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
]));
