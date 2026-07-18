export function Masthead() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border-b-[7px] border-double border-[var(--rule)] bg-[var(--paper)] px-6 pt-5 pb-3 text-center">
      <div className="mb-1 [font-family:var(--font-kicker)] text-[10.5px] tracking-[0.28em] text-[var(--ink-muted)] uppercase">
        Daily Digest &middot; Security &middot; Cloud &middot; AI &middot; Markets
      </div>
      <h1 className="[font-family:var(--font-display)] text-5xl leading-none font-black tracking-tight text-[var(--ink)]">
        The Updater
      </h1>
      <div className="mt-2 flex items-center justify-center gap-2 [font-family:var(--font-kicker)] text-[11px] tracking-widest text-[var(--ink-secondary)] uppercase">
        <span>{dateStr}</span>
        <span className="text-[var(--ink-muted)]">&bull;</span>
        <span>Est. 2026</span>
      </div>
    </div>
  );
}
