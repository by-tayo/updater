import { Search } from 'lucide-react';

interface Props {
  view: 'articles' | 'reports';
  onView: (v: 'articles' | 'reports') => void;
  search: string;
  onSearch: (v: string) => void;
  onSearchSubmit: () => void;
  unreadOnly: boolean;
  onUnreadOnly: (v: boolean) => void;
  onFetch: () => void;
  fetching: boolean;
  onReport: () => void;
}

export function Topbar({
  view,
  onView,
  search,
  onSearch,
  onSearchSubmit,
  unreadOnly,
  onUnreadOnly,
  onFetch,
  fetching,
  onReport,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-[var(--rule-light)] bg-[var(--paper)] px-6 py-2.5">
      <nav className="flex items-center gap-4 [font-family:var(--font-kicker)] text-[12px] font-semibold tracking-[0.1em] uppercase">
        <TabButton label="Front Page" active={view === 'articles'} onClick={() => onView('articles')} />
        <TabButton label="Archive" active={view === 'reports'} onClick={() => onView('reports')} />
      </nav>

      <div className="flex max-w-sm flex-1 items-center gap-2 border-b border-[var(--ink-muted)] px-1 py-1">
        <Search size={13} className="shrink-0 text-[var(--ink-muted)]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
          placeholder="Search the archive…"
          className="w-full bg-transparent [font-family:var(--font-body)] text-sm text-[var(--ink)] italic outline-none placeholder:text-[var(--ink-muted)]"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-1.5 [font-family:var(--font-kicker)] text-[11px] tracking-wide text-[var(--ink-secondary)] uppercase select-none">
        <input type="checkbox" checked={unreadOnly} onChange={(e) => onUnreadOnly(e.target.checked)} />
        Unread only
      </label>

      <button
        onClick={onFetch}
        disabled={fetching}
        className="border border-[var(--rule)] px-3 py-1.5 [font-family:var(--font-kicker)] text-[11px] font-semibold tracking-wide text-[var(--ink)] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] disabled:opacity-50"
      >
        {fetching ? 'Fetching…' : 'Fetch Latest'}
      </button>

      <button
        onClick={onReport}
        className="bg-[var(--accent)] px-3 py-1.5 [font-family:var(--font-kicker)] text-[11px] font-semibold tracking-wide text-[var(--accent-ink)] uppercase transition-opacity hover:opacity-85"
      >
        Print Digest
      </button>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 pb-0.5 transition-colors ${
        active ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink)]'
      }`}
    >
      {label}
    </button>
  );
}
