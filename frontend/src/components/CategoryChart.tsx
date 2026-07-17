import { useState } from 'react';
import type { Category } from '../types';
import { categoryColorVar } from '../categoryColors';

export function CategoryChart({ categories }: { categories: Category[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(1, ...categories.map((c) => c.total));

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        Articles by category
      </div>
      <div className="flex flex-col gap-2.5">
        {categories.map((c) => {
          const pct = (c.total / max) * 100;
          const color = categoryColorVar(c.key);
          const isHovered = hovered === c.key;
          return (
            <div
              key={c.key}
              className="group relative flex items-center gap-2"
              onMouseEnter={() => setHovered(c.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-28 shrink-0 truncate text-xs text-[var(--text-secondary)]">{c.label}</div>
              <div className="relative h-3.5 flex-1 bg-[var(--surface-2)]">
                <div
                  className="h-full rounded-r-[4px] transition-[width] duration-200"
                  style={{ width: `${pct}%`, background: color, maxWidth: '100%' }}
                />
              </div>
              <div className="w-10 shrink-0 text-right text-xs tabular-nums text-[var(--text-secondary)]">
                {c.total}
              </div>
              {isHovered && (
                <div
                  className="absolute -top-8 left-28 z-10 rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-xs whitespace-nowrap shadow-lg"
                  role="tooltip"
                >
                  <span style={{ color }}>●</span> {c.label}: {c.total} total, {c.unread} unread
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
