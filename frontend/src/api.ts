import type { Article, Category, ReportMeta, FetchResponse } from './types';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  categories: () => fetch('/api/categories').then((r) => json<{ categories: Category[] }>(r)),

  articles: (params: { category?: string | null; search?: string; unreadOnly?: boolean; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params.category) qs.set('category', params.category);
    if (params.search) qs.set('search', params.search);
    if (params.unreadOnly) qs.set('unread_only', 'true');
    qs.set('limit', String(params.limit ?? 150));
    return fetch('/api/articles?' + qs).then((r) => json<{ count: number; articles: Article[] }>(r));
  },

  markRead: (id: number, read: boolean) =>
    fetch(`/api/articles/${id}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    }).then((r) => json<{ ok: boolean }>(r)),

  fetchNow: () => fetch('/api/fetch', { method: 'POST' }).then((r) => json<FetchResponse>(r)),

  generateReport: (days = 1) =>
    fetch(`/api/report?days=${days}`, { method: 'POST' }).then((r) => json<{ filename: string; content: string }>(r)),

  reports: () => fetch('/api/reports').then((r) => json<{ reports: ReportMeta[] }>(r)),

  report: (name: string) => fetch(`/api/reports/${encodeURIComponent(name)}`).then((r) => r.text()),
};
