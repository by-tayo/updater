import type { Article } from '../types';
import { categoryColorVar } from '../categoryColors';
import { Inbox } from 'lucide-react';

export function ArticleList({ articles, onMarkRead }: { articles: Article[]; onMarkRead: (id: number, read: boolean) => void }) {
  if (!articles.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
        <Inbox size={40} className="opacity-40" />
        <div>
          No articles yet. Click <span className="text-[var(--text-secondary)]">Fetch Now</span> to pull the latest.
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-3xl flex-col gap-2">
      {articles.map((a) => (
        <div
          key={a.id}
          className={`rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-3.5 ${a.read ? 'opacity-55' : ''}`}
          style={{ borderLeft: a.read ? undefined : `3px solid ${categoryColorVar(a.category)}` }}
        >
          <a
            href={a.url}
            target="_blank"
            rel="noopener"
            onClick={() => onMarkRead(a.id, true)}
            className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
          >
            {a.title}
          </a>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5">{a.category}</span>
            <span>{a.source}</span>
            <span>{a.published_at ? new Date(a.published_at).toLocaleString() : ''}</span>
          </div>
          {(a.summary || a.snippet) && (
            <div className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{a.summary || a.snippet}</div>
          )}
          <div className="mt-2">
            <button
              onClick={() => onMarkRead(a.id, !a.read)}
              className="rounded border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {a.read ? 'Mark unread' : 'Mark read'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
