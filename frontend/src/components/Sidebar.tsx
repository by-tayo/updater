import type { Category } from '../types';

interface Props {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (key: string | null) => void;
}

export function Sidebar({ categories, activeCategory, onSelectCategory }: Props) {
  const allTotal = categories.reduce((s, c) => s + c.total, 0);
  const allUnread = categories.reduce((s, c) => s + c.unread, 0);

  return (
    <nav className="w-60 shrink-0 overflow-y-auto border-r border-[var(--rule-light)] bg-[var(--paper)] px-5 py-5">
      <div className="mb-2 border-b-2 border-[var(--rule)] pb-1.5 [font-family:var(--font-kicker)] text-[11px] font-bold tracking-[0.2em] text-[var(--ink)] uppercase">
        Inside This Edition
      </div>
      <SectionRow label="All Sections" total={allTotal} unread={allUnread} active={!activeCategory} onClick={() => onSelectCategory(null)} />
      {categories.map((c) => (
        <SectionRow
          key={c.key}
          label={c.label}
          total={c.total}
          unread={c.unread}
          active={activeCategory === c.key}
          onClick={() => onSelectCategory(c.key)}
        />
      ))}
    </nav>
  );
}

function SectionRow({
  label,
  total,
  unread,
  active,
  onClick,
}: {
  label: string;
  total: number;
  unread: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-baseline justify-between gap-2 border-b border-dotted border-[var(--rule-light)] py-2 [font-family:var(--font-body)] text-[13.5px] transition-colors ${
        active ? 'font-bold text-[var(--accent)]' : 'text-[var(--ink)] hover:text-[var(--accent)]'
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="flex shrink-0 items-baseline gap-1.5 [font-family:var(--font-kicker)] text-[10.5px] text-[var(--ink-muted)] tabular-nums">
        {unread > 0 && <span className="font-semibold text-[var(--accent)]">{unread} new</span>}
        <span>({total})</span>
      </span>
    </div>
  );
}
