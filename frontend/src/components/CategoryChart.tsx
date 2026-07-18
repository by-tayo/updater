import { useState } from 'react';
import type { Category } from '../types';

export function CategoryChart({ categories }: { categories: Category[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(1, ...categories.map((c) => c.total));

  return (
    <div className="border border-[var(--rule-light)] bg-[var(--paper-2)] px-5 py-4">
      <div className="mb-3 [font-family:var(--font-kicker)] text-[11px] font-bold tracking-[0.2em] text-[var(--ink-muted)] uppercase">
        Today's Coverage
      </div>
      <div className="flex flex-col gap-2">
        {categories.map((c) => {
          const pct = (c.total / max) * 100;
          const isHovered = hovered === c.key;
          return (
            <div
              key={c.key}
              className="relative flex items-center gap-3"
              onMouseEnter={() => setHovered(c.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-32 shrink-0 truncate [font-family:var(--font-body)] text-[13px] text-[var(--ink-secondary)]">
                {c.label}
              </div>
              <div className="relative h-[7px] flex-1 bg-[var(--rule-light)]">
                <div className="h-full bg-[var(--ink)]" style={{ width: `${pct}%` }} />
              </div>
              <div className="w-8 shrink-0 text-right [font-family:var(--font-kicker)] text-[11px] text-[var(--ink-muted)] tabular-nums">
                {c.total}
              </div>
              {isHovered && (
                <div
                  className="absolute -top-7 left-32 z-10 border border-[var(--rule)] bg-[var(--paper)] px-2 py-1 [font-family:var(--font-kicker)] text-[11px] whitespace-nowrap text-[var(--ink)] shadow-md"
                  role="tooltip"
                >
                  {c.label}: {c.total} total, {c.unread} unread
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
