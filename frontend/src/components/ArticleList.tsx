import type { Article } from '../types';
import { Inbox } from 'lucide-react';

export function ArticleList({ articles, onMarkRead }: { articles: Article[]; onMarkRead: (id: number, read: boolean) => void }) {
  if (!articles.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-[var(--ink-muted)]">
        <Inbox size={36} className="opacity-40" />
        <div className="[font-family:var(--font-body)] text-sm italic">
          No stories yet. Click <span className="not-italic font-semibold text-[var(--ink)]">Fetch Latest</span> to pull today's news.
        </div>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-10 md:columns-2 xl:columns-3 [column-rule:1px_solid_var(--rule-light)]">
      {articles.map((a) => (
        <article key={a.id} className={`mb-6 break-inside-avoid border-b border-[var(--rule-light)] pb-5 ${a.read ? 'opacity-50' : ''}`}>
          <div className="mb-1 [font-family:var(--font-kicker)] text-[10px] font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
            {a.category}
          </div>
          <a
            href={a.url}
            target="_blank"
            rel="noopener"
            onClick={() => onMarkRead(a.id, true)}
            className="[font-family:var(--font-display)] text-[19px] leading-snug font-bold text-[var(--ink)] hover:underline"
          >
            {a.title}
          </a>
          <div className="mt-1.5 [font-family:var(--font-body)] text-[11px] text-[var(--ink-muted)] italic">
            {a.source}
            {a.published_at ? ` — ${new Date(a.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
          </div>
          {(a.summary || a.snippet) && (
            <p className="mt-2 [font-family:var(--font-body)] text-[13.5px] leading-relaxed text-[var(--ink-secondary)]">
              {a.summary || a.snippet}
            </p>
          )}
          <button
            onClick={() => onMarkRead(a.id, !a.read)}
            className="mt-2 [font-family:var(--font-kicker)] text-[10px] font-semibold tracking-wide text-[var(--ink-muted)] uppercase hover:text-[var(--accent)]"
          >
            {a.read ? 'Mark Unread' : 'Mark as Read'}
          </button>
        </article>
      ))}
    </div>
  );
}
