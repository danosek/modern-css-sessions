<script>
  let { sessionId, topicId, demo, disabled = false } = $props();
</script>

<li class="row">
  {#if disabled}
    <span class="row__cell row__disabled">
      <span class="row__idx">{demo.index}</span>
      <span class="row__name">{demo.name}</span>
    </span>
  {:else}
    <a class="row__cell row__link" href="editor/?demo={sessionId}/{topicId}/{demo.slug}">
      <span class="row__idx">{demo.index}</span>
      <span class="row__name">{demo.name}</span>
    </a>
  {/if}
</li>

<style>
  .row {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    /* Bez uppercase — názvy jsou case-sensitive CSS termíny (oklch(), :has(),
       appearance: base-select). Zobrazujeme je v korektním tvaru z dat.
       Bez linek — řádky odděluje jen padding + hover invert (declutter). */
    letter-spacing: 0.04em;
  }

  /* Index + název; index sloupec --base-3 lícuje s topic markerem (>>/// ) */
  .row__cell {
    display: grid;
    grid-template-columns: var(--base-3) 1fr;
    align-items: baseline;
    gap: var(--base);
    padding: var(--base-h) var(--base);
  }

  .row__link {
    text-decoration: none;
    color: var(--text-primary);
  }
  .row__link:hover {
    background: var(--text-primary);
    color: var(--surface-base);
  }

  .row__idx { color: var(--text-brand-secondary); }   /* sage = demo (vs amber topic/session) */
  .row__link:hover .row__idx { color: var(--surface-base); }

  .row__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row__disabled {
    color: var(--text-secondary);
    cursor: not-allowed;
  }
  .row__disabled .row__idx { color: var(--text-secondary); }
</style>
