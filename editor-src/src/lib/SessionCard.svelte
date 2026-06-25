<script>
  import DemoItem from './DemoItem.svelte';

  let { session } = $props();
</script>

<section class="session" class:session--future={session.future}>
  <header class="session__head">
    <span class="session__no">{session.number}</span>
    <span class="session__sep">::</span>
    <h2 class="session__title">{session.title}</h2>
    <span class="session__dur">
      {session.future ? '[ PENDING ]' : (session.duration ? '[ ' + session.duration + ' MIN ]' : '')}
    </span>
  </header>

  {#if session.topics}
    <div class="topics-matrix">
      {#each session.topics as topic}
        <div class="topic" class:topic--future={session.future}>
          <h3 class="topic__name">
            <span class="topic__mark">{session.future ? '//' : '>>'}</span>
            <span class="topic__label">{topic.name}</span>
          </h3>
          {#if topic.demos}
            <ul class="topic__demos">
              {#each topic.demos as demo}
                <DemoItem sessionId={session.id} topicId={topic.id} {demo} disabled={session.future} />
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  /* Session = blueprint kompartment: padding + rožkové značky (L-brackety)
     ve všech 4 rozích (skill §5). 8 background vrstev (2 linky/roh) složených
     přes --corners, aby šlo future hatch jen přidat jako další vrstvu.
     Barva rohů přes --c (amber aktivní / secondary future). */
  .session {
    --corner: 12px;
    --c: var(--text-brand-primary);
    --corners:
      linear-gradient(var(--c) 0 0) left top / var(--corner) 1px no-repeat,
      linear-gradient(var(--c) 0 0) left top / 1px var(--corner) no-repeat,
      linear-gradient(var(--c) 0 0) right top / var(--corner) 1px no-repeat,
      linear-gradient(var(--c) 0 0) right top / 1px var(--corner) no-repeat,
      linear-gradient(var(--c) 0 0) left bottom / var(--corner) 1px no-repeat,
      linear-gradient(var(--c) 0 0) left bottom / 1px var(--corner) no-repeat,
      linear-gradient(var(--c) 0 0) right bottom / var(--corner) 1px no-repeat,
      linear-gradient(var(--c) 0 0) right bottom / 1px var(--corner) no-repeat;
    display: flex;
    flex-direction: column;
    gap: var(--base-3);
    padding: var(--base-4);
    background: var(--corners);
  }

  /* Future (pending) — rohy ztlumené + diagonální šrafa (classified) */
  .session--future {
    --c: var(--text-secondary);
    background:
      var(--corners),
      repeating-linear-gradient(45deg,
        color-mix(in oklch, var(--text-primary) 8%, transparent) 0 1px,
        transparent 1px 8px);
  }

  /* ── Hlavička session — pruh s číslem, názvem a délkou ───────── */
  .session__head {
    display: flex;
    align-items: baseline;
    gap: var(--base-2);
  }
  .session__no {
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-xxl);
    line-height: 1;
    color: var(--text-brand-primary);
  }
  .session--future .session__no { color: var(--text-secondary); }

  /* CSS-nativní separátor mezi číslem a názvem (skill §5) */
  .session__sep {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-l);
    color: var(--text-secondary);
  }

  .session__title {
    font-family: var(--font-stack-headings);
    font-weight: var(--font-weight-headings-regular);
    font-size: var(--font-size-xl);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--text-primary);
  }
  .session--future .session__title { color: var(--text-secondary); }

  .session__dur {
    margin-left: auto;
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-brand-secondary);   /* sage = aktivní/live session */
    white-space: nowrap;
  }
  .session--future .session__dur { color: var(--text-secondary); }   /* pending = šedá */

  /* ── Matrix topiců — deterministická blueprint mřížka ───────────
     Pevný počet sloupců (1 / 2 / 4) → topicy se zarovnají napříč všemi
     sekcemi. Bez rámečků: oddělení nese gap + podtržení názvu topicu. */
  .topics-matrix {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--base-3) var(--base-4);
    align-items: start;
  }
  @media (min-width: 40rem) { .topics-matrix { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 64rem) { .topics-matrix { grid-template-columns: repeat(4, 1fr); } }

  .topic {
    display: flex;
    flex-direction: column;
    gap: var(--base);
  }

  /* Topic = hlavička skupiny. Bez podtržení; stejná mřížka jako demo řádky,
     takže marker (>> / //) lícuje s indexem dema a název s názvem dema. */
  .topic__name {
    display: grid;
    grid-template-columns: var(--base-3) 1fr;
    gap: var(--base);
    align-items: baseline;
    padding-left: var(--base);
    margin: 0;
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    font-weight: normal;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-brand-primary);
  }
  .topic__mark { color: var(--text-brand-primary); }
  .topic--future .topic__name,
  .topic--future .topic__mark { color: var(--text-secondary); }

  .topic__demos {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
