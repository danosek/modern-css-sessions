<script>
  import DemoItem from './DemoItem.svelte';

  let { session } = $props();
</script>

<section class="cell" class:cell--future={session.future}>
  <div class="cell__head">
    <span class="cell__no">{session.number}</span>
    <span class="cell__dur">{session.future ? '[ PENDING ]' : (session.duration ? session.duration + ' MIN' : '')}</span>
  </div>
  <h2 class="cell__title">{session.title}</h2>
  {#if session.demos}
    <ul class="cell__demos">
      {#each session.demos as demo}
        <DemoItem sessionId={session.id} {demo} disabled={session.future} />
      {/each}
    </ul>
  {/if}
</section>

<style>
  .cell {
    background: var(--surface-main);
    padding: var(--base-3);
    display: flex;
    flex-direction: column;
    gap: var(--base-2);
  }

  /* Budoucí sessions: diagonální šrafa (classified/pending) místo opacity */
  .cell--future {
    background:
      repeating-linear-gradient(
        45deg,
        transparent 0,
        transparent 7px,
        color-mix(in oklch, var(--text-primary) 6%, transparent) 7px,
        color-mix(in oklch, var(--text-primary) 6%, transparent) 8px
      ),
      var(--surface-main);
    color: var(--text-secondary);
  }

  .cell__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--base);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cell__no {
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-xl);
    line-height: 1;
    color: var(--text-brand-primary);
  }
  .cell--future .cell__no { color: var(--text-secondary); }

  .cell__dur { color: var(--text-secondary); }

  .cell__title {
    font-family: var(--font-stack-headings);
    font-weight: var(--font-weight-headings-regular);
    font-size: var(--font-size-xl);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.95;
    color: var(--text-primary);
    margin-bottom: var(--base);
  }
  .cell--future .cell__title { color: var(--text-secondary); }

  .cell__demos {
    list-style: none;
    margin: 0;
    margin-top: auto;
    padding: 0;
    border-top: 2px solid var(--text-primary);
  }
  .cell--future .cell__demos { border-top-color: var(--text-secondary); }
</style>
