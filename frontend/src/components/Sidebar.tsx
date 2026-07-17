import { Newspaper, FileText } from 'lucide-react';
import type { Category } from '../types';
import { categoryColorVar } from '../categoryColors';

interface Props {
  view: 'articles' | 'reports';
  onView: (v: 'articles' | 'reports') => void;
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (key: string | null) => void;
}

export function Sidebar({ view, onView, categories, activeCategory, onSelectCategory }: Props) {
  const allTotal = categories.reduce((s, c) => s + c.total, 0);
  const allUnread = categories.reduce((s, c) => s + c.unread, 0);

  return (
    <nav className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--surface-1)] py-3">
      <div className="mb-1 px-4 text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">View</div>
      <ViewItem icon={<Newspaper size={15} />} label="Articles" active={view === 'articles'} onClick={() => onView('articles')} />
      <ViewItem icon={<FileText size={15} />} label="Reports" active={view === 'reports'} onClick={() => onView('reports')} />

      <div className="mx-4 my-2.5 h-px bg-[var(--border)]" />

      <div className="mb-1 px-4 text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">Categories</div>
      <CatItem
        label="All"
        total={allTotal}
        unread={allUnread}
        active={!activeCategory}
        onClick={() => onSelectCategory(null)}
      />
      {categories.map((c) => (
        <CatItem
          key={c.key}
          label={c.label}
          total={c.total}
          unread={c.unread}
          active={activeCategory === c.key}
          color={categoryColorVar(c.key)}
          onClick={() => onSelectCategory(c.key)}
        />
      ))}
    </nav>
  );
}

function ViewItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`mx-1.5 flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
        active ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function CatItem({
  label,
  total,
  unread,
  active,
  color,
  onClick,
}: {
  label: string;
  total: number;
  unread: number;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`mx-1.5 flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
        active ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        {color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />}
        {label}
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {unread > 0 && (
          <span className="min-w-[18px] rounded-full bg-[var(--accent)] px-1.5 text-center text-[10px] leading-4 text-white">
            {unread}
          </span>
        )}
        <span className="text-[11px] text-[var(--text-muted)]">{total}</span>
      </span>
    </div>
  );
}
