<script>
  import DemoItem from './DemoItem.svelte';

  let { session } = $props();
</script>

<div class="session-card"
  class:session-card--future={!session.demos}
  class:session-card--120min={session.duration === 120}>
  <div class="session-card__meta">
    <span class="session-card__number">{session.number}</span>
    {#if session.duration}
      <span class="session-card__duration">{session.duration} min</span>
    {/if}
  </div>
  <div class="session-card__title">{session.title}</div>
  {#if session.demos}
    <ul class="session-card__demos">
      {#each session.demos as demo}
        <DemoItem sessionId={session.id} {demo} />
      {/each}
    </ul>
  {:else if session.placeholder}
    <p class="session-card__placeholder">{session.placeholder}</p>
  {/if}
</div>

<style>
  .session-card {
    background: var(--surface-main);
    border: 1px solid var(--border);
    border-radius: var(--radius-strong);
    padding: var(--base-4);
    display: flex;
    flex-direction: column;
    gap: var(--base-3);
    box-shadow: var(--elevation);
  }

  .session-card--120min {
    border-color: var(--surface-brand-primary-moderate);
    background: var(--surface-brand-primary-minimal);
  }

  .session-card--future {
    opacity: 0.5;
  }

  .session-card__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--base);
  }

  .session-card__number {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    color: var(--text-secondary);
  }

  .session-card__duration {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    padding: 2px var(--base);
    border-radius: var(--radius-subtle);
    background: var(--surface-main-variant);
    color: var(--text-secondary);
  }

  .session-card--120min .session-card__duration {
    background: var(--surface-brand-primary-subtle);
    color: var(--text-primary-on-surface-brand-primary-subtle);
  }

  .session-card__title {
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-headings-regular);
    color: var(--text-primary);
    line-height: 1.2;
  }

  .session-card__demos {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--base-h);
    border-top: 1px solid var(--border);
    padding-top: var(--base-2);
  }

  .session-card__placeholder {
    font-size: var(--font-size-s);
    color: var(--text-secondary);
    font-style: italic;
  }
</style>
