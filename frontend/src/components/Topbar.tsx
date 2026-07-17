import { Search, RefreshCw, FileText, Circle } from 'lucide-react';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onSearchSubmit: () => void;
  unreadOnly: boolean;
  onUnreadOnly: (v: boolean) => void;
  onFetch: () => void;
  fetching: boolean;
  onReport: () => void;
}

export function Topbar({ search, onSearch, onSearchSubmit, unreadOnly, onUnreadOnly, onFetch, fetching, onReport }: Props) {
  return (
    <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-2.5">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <Circle size={9} className="fill-[var(--accent)] text-[var(--accent)]" />
        Updater
      </div>

      <div className="flex max-w-90 flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5">
        <Search size={14} className="text-[var(--text-muted)]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
          placeholder="Search articles…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--text-secondary)] select-none">
        <input type="checkbox" checked={unreadOnly} onChange={(e) => onUnreadOnly(e.target.checked)} />
        Unread only
      </label>

      <button
        onClick={onFetch}
        disabled={fetching}
        className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
      >
        <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
        {fetching ? 'Fetching…' : 'Fetch Now'}
      </button>

      <button
        onClick={onReport}
        className="flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-ink)] transition-opacity hover:opacity-90"
      >
        <FileText size={13} />
        Generate Report
      </button>
    </header>
  );
}
