<script>
  import DemoItem from './DemoItem.svelte';

  let { session } = $props();
</script>

<div class="session-card" class:session-card--future={session.future}>
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
        <DemoItem sessionId={session.id} {demo} disabled={session.future} />
      {/each}
    </ul>
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

  .session-card--future {
    opacity: 0.45;
  }

  .session-card__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--base);
  }

  .session-card__number {
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-base);
    color: var(--surface-brand-primary-strong);
  }

  .session-card__duration {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    padding: 2px var(--base);
    border-radius: var(--radius-subtle);
    background: var(--surface-brand-primary-minimal);
    color: var(--text-secondary);
    border: 1px solid var(--surface-brand-primary-subtle);
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
    border-top: 3px solid transparent;
    border-image: linear-gradient(
      to right,
      var(--surface-brand-secondary-strong),
      var(--surface-brand-primary-strong) 60%,
      transparent
    ) 1;
    padding-top: var(--base-2);
  }
</style>
