<script>
  import SessionCard from './lib/SessionCard.svelte';

  // Hierarchie: Session → Topic → Demo. Aktivní topic má `demos` (každé = složka
  // s<sess>/<topicId>/<slug>); future sessions mají topicy bez dem (placeholder).
  const sessions = [
    {
      id: 's1', number: 'S1', title: 'Foundations Refresh', duration: 90,
      topics: [
        { id: 't1', name: 'Intrinsic Sizing', demos: [
          { slug: 'sizing-values', index: 'D1', name: 'auto · min · max · fit-content' },
          { slug: 'sizing-layout', index: 'D2', name: 'v layoutu (grid · centrování)' },
        ] },
        { id: 't2', name: 'clamp() · min() · max()', demos: [
          { slug: 'clamp-fluid', index: 'D1', name: 'clamp() — fluid typografie' },
          { slug: 'min-width',   index: 'D2', name: 'min() — šířka kontejneru' },
          { slug: 'max-min',     index: 'D3', name: 'max() · min() — řízené centrování' },
          { slug: 'clamp-card',  index: 'D4', name: 'clamp() — responsivní karta' },
          { slug: 'type-scale',  index: 'D5', name: 'clamp() — fluid type scale' },
        ] },
        { id: 't3', name: 'Logical Properties', demos: [
          { slug: 'physical-vs-logical', index: 'D1', name: 'fyzické vs. logické' },
          { slug: 'mapping',      index: 'D2', name: 'physical → logical mapping' },
          { slug: 'inset',        index: 'D3', name: 'zkratka inset' },
          { slug: 'writing-mode', index: 'D4', name: 'writing-mode' },
        ] },
        { id: 't4', name: 'CSS Nesting', demos: [
          { slug: 'live-nav',          index: 'D1', name: 'živá ukázka — navigace' },
          { slug: 'flat-vs-nested',    index: 'D2', name: 'flat vs. nested' },
          { slug: 'state-pseudo',      index: 'D3', name: '&:hover · &:focus-visible' },
          { slug: 'without-ampersand', index: 'D4', name: 'nesting bez &' },
          { slug: 'nested-media',      index: 'D5', name: '@media uvnitř pravidla' },
        ] },
        { id: 't5', name: '@layer', demos: [
          { slug: 'live-cascade', index: 'D1', name: 'živá ukázka — pořadí vs. specificita' },
          { slug: 'layer-order',  index: 'D2', name: 'pořadí bije specificitu' },
          { slug: 'examples',     index: 'D3', name: 'praktické příklady' },
        ] },
        { id: 't6', name: ':has() · :is() · :where()', demos: [
          { slug: 'live-checklist', index: 'D1', name: ':has(input:checked)' },
          { slug: 'examples',       index: 'D2', name: 'praktické příklady' },
          { slug: 'is-where',       index: 'D3', name: ':is() · :where()' },
        ] },
        { id: 't7', name: 'Container Queries', demos: [
          { slug: 'live-resize',    index: 'D1', name: 'živá ukázka — resize' },
          { slug: 'three-contexts', index: 'D2', name: '3 kontexty' },
          { slug: 'range-queries',  index: 'D3', name: 'range syntax' },
        ] },
        { id: 't8', name: 'Subgrid', demos: [
          { slug: 'live-cards',  index: 'D1', name: 'řádky karet' },
          { slug: 'form-fields', index: 'D2', name: 'formulářová pole' },
          { slug: 'editorial',   index: 'D3', name: 'editoriální layout' },
        ] },
      ],
    },
    {
      id: 's2', number: 'S2', title: 'Colors & Typography', duration: 90, future: true,
      topics: [
        { id: 't1', name: 'oklch()' }, { id: 't2', name: 'color-mix()' },
        { id: 't3', name: 'light-dark()' }, { id: 't4', name: 'text-wrap' },
        { id: 't5', name: 'color-scheme · prefers-color-scheme' },
      ],
    },
    {
      id: 's3', number: 'S3', title: 'Sizing, Layout & Shapes', duration: 90, future: true,
      topics: [
        { id: 't1', name: 'interpolate-size' }, { id: 't2', name: 'field-sizing' },
        { id: 't3', name: 'Gap Decorations' }, { id: 't4', name: 'shape()' },
      ],
    },
    {
      id: 's4', number: 'S4', title: 'Anchor Positioning + Popover', duration: 90, future: true,
      topics: [
        { id: 't1', name: 'Anchor Positioning' }, { id: 't2', name: 'Popover API' },
        { id: 't3', name: 'Invoker Commands' },
      ],
    },
    {
      id: 's5', number: 'S5', title: 'Customizable Select & Form UX', duration: 90, future: true,
      topics: [
        { id: 't1', name: 'appearance: base-select' }, { id: 't2', name: 'selectedcontent' },
        { id: 't3', name: ':user-valid' }, { id: 't4', name: ':focus-visible · :focus-within' },
      ],
    },
    {
      id: 's6', number: 'S6', title: 'Scroll Universe', duration: 90, future: true,
      topics: [
        { id: 't1', name: 'scroll()' }, { id: 't2', name: 'view()' },
        { id: 't3', name: 'Carousel' }, { id: 't4', name: 'scroll-state' },
      ],
    },
    {
      id: 's7', number: 'S7', title: 'View Transitions', duration: 90, future: true,
      topics: [
        { id: 't1', name: 'Same-document' }, { id: 't2', name: 'Cross-document' },
        { id: 't3', name: 'Shared Element' },
      ],
    },
    {
      id: 's8', number: 'S8', title: 'CSS as a Programming Language', duration: 90, future: true,
      topics: [
        { id: 't1', name: '@property' }, { id: 't2', name: 'attr()' },
        { id: 't3', name: '@scope' }, { id: 't4', name: 'if()' }, { id: 't5', name: '@function' },
      ],
    },
  ];

  const demoCount = sessions.reduce(
    (n, s) => n + (s.topics?.reduce((m, t) => m + (t.demos?.length ?? 0), 0) ?? 0), 0);
  const liveCount = sessions.filter((s) => !s.future).length;
  const topicCount = sessions.reduce((n, s) => n + (s.topics?.length ?? 0), 0);
  const activeSession = sessions.find(s => !s.future);

  let theme = $state(document.documentElement.dataset.theme ?? 'light');
  $effect(() => { document.documentElement.dataset.theme = theme; });
</script>

<button class="theme-toggle" onclick={() => theme = theme === 'dark' ? 'light' : 'dark'}>
  [ {theme === 'dark' ? 'LIGHT' : 'DARK'} ]
</button>

<header class="masthead">
  <div class="masthead__ident">
    <span>[ TESCO SW ]</span>
    <span class="mut">CSS · TRN · 2026</span>
    <span class="masthead__period mut">ČVN 2026 — BŘE 2027</span>
  </div>

  <div class="masthead__core">
    <div class="masthead__primary">
      <h1 class="masthead__title">Modern CSS<br>Sessions</h1>
      <p class="masthead__mission"><span class="acc">&gt;&gt;&gt;</span> INTERAKTIVNÍ CSS DEMA KE ŠKOLÍCÍMU CYKLU</p>
    </div>
    <dl class="masthead__telem">
      <div class="masthead__trow">
        <dt>SESSIONS</dt>
        <dd><data value="{liveCount}">{liveCount}</data> / <data value="{sessions.length}">{sessions.length}</data></dd>
      </div>
      <div class="masthead__trow">
        <dt>TOPICS</dt>
        <dd><data value="{topicCount}">{topicCount}</data></dd>
      </div>
      <div class="masthead__trow">
        <dt>DEMOS</dt>
        <dd><data value="{demoCount}">{demoCount}</data></dd>
      </div>
      <div class="masthead__trow masthead__trow--active">
        <dt>ACTIVE</dt>
        <dd>{activeSession?.number ?? '—'}</dd>
      </div>
    </dl>
  </div>

  <div class="masthead__status">
    <span class="masthead__active-id">{activeSession?.number}</span>
    <span class="masthead__sep">::</span>
    <span class="masthead__active-title">{activeSession?.title?.toUpperCase()}</span>
    <span class="masthead__ramp" aria-hidden="true">░░▒▒▓▓██▓▓▒▒░░</span>
    <span class="masthead__live">[ STATUS :: LIVE ]</span>
  </div>
</header>

<main class="sessions">
  {#each sessions as session}
    <SessionCard {session} />
  {/each}
</main>

<style>
  :global(body) {
    max-width: 1600px;
    margin: 0 auto;
    padding: var(--base-3);
    background: var(--surface-main);
    color: var(--text-primary);
  }

  /* Jemné scanline/grain přes celou plochu — analogová degradace */
  :global(body)::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
    background: repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 2px,
      color-mix(in oklch, var(--text-primary) 4%, transparent) 3px,
      transparent 4px
    );
  }

  /* ── Theme toggle (utilitární přepínač) ───────────────────── */
  .theme-toggle {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 210;
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    background: var(--text-primary);
    color: var(--surface-base);
    border: none;
    border-radius: 0;
    padding: var(--base) var(--base-2);
    cursor: pointer;
    box-shadow: none;
  }
  .theme-toggle:hover { background: var(--surface-brand-primary-strong); color: var(--text-primary-on-surface-brand-primary-strong); }

  /* ── Masthead — tactical HUD panel ───────────────────────────────
     Filled panel (--surface-main-variant) + horizontal 2px bezely;
     odlišen od sessions (transparentní + rohové brackety). */
  .masthead {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: var(--base-3) var(--base-4);
    margin-bottom: var(--base-8);
    background: var(--surface-main-variant);
    border-block: 2px solid var(--text-primary);
  }

  /* Identifikační lišta: mise / jednotka / čas */
  .masthead__ident {
    display: flex;
    align-items: center;
    gap: var(--base-3);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding-bottom: var(--base-2);
    border-bottom: 1px solid var(--border);
    margin-bottom: var(--base-3);
  }
  .masthead__period { margin-left: auto; }
  .mut { color: var(--text-secondary); }
  .acc { color: var(--text-primary); }

  /* HUD jádro — makro-titulek vlevo, telemetrický panel vpravo */
  .masthead__core {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--base-6);
    align-items: end;
    margin-bottom: var(--base-3);
  }

  .masthead__primary {
    display: flex;
    flex-direction: column;
    gap: var(--base-2);
  }

  /* Makro-titulek (skill §2) */
  .masthead__title {
    font-family: var(--font-stack-headings);
    font-weight: var(--font-weight-headings-regular);
    font-size: clamp(2.5rem, 8vw, 5.5rem);
    line-height: 0.85;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--text-primary);
    margin: 0;
  }

  .masthead__mission {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    margin: 0;
  }
  .masthead__mission .acc { color: var(--text-primary); margin-right: var(--base); }

  /* Telemetrický panel — 2-sloupcový dl (dt :: dd), zarovnaný dolů */
  .masthead__telem {
    display: grid;
    grid-template-columns: auto auto;
    gap: var(--base-h) var(--base-3);
    align-content: end;
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0;
    padding: 0 0 0 var(--base-4);
    border-left: 1px solid var(--border);
  }
  .masthead__trow { display: contents; }
  .masthead__trow dt { color: var(--text-secondary); white-space: nowrap; }
  .masthead__trow dt::after { content: ' ::'; }
  .masthead__trow dd { color: var(--text-primary); margin: 0; }
  .masthead__trow--active dt,
  .masthead__trow--active dt::after { color: var(--text-brand-primary); }
  .masthead__trow--active dd { color: var(--text-brand-secondary); }

  /* Stavová lišta — aktivní session + dithering */
  .masthead__status {
    display: flex;
    align-items: center;
    gap: var(--base-2);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding-top: var(--base-2);
    border-top: 1px solid var(--border);
    color: var(--text-secondary);
  }
  .masthead__active-id { color: var(--text-brand-primary); }
  .masthead__sep { color: var(--text-secondary); }
  .masthead__active-title { color: var(--text-primary); }
  .masthead__ramp {
    margin-left: auto;
    font-family: var(--font-stack-decorative);
    letter-spacing: 0.05em;
    color: color-mix(in oklch, var(--text-brand-primary) 60%, transparent);
  }
  .masthead__live { color: var(--text-brand-secondary); }

  /* ── Sessions — vertikální stack; každá session nese vlastní matrix topiců ── */
  .sessions {
    display: flex;
    flex-direction: column;
    gap: var(--base-8);
  }

</style>
