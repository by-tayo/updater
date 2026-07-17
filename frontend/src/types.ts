export interface Article {
  id: number;
  url: string;
  title: string;
  source: string;
  category: string;
  published_at: string | null;
  fetched_at: string;
  snippet: string | null;
  summary: string | null;
  read: number;
}

export interface Category {
  key: string;
  label: string;
  total: number;
  unread: number;
}

export interface ReportMeta {
  name: string;
  modified: number;
}

export interface FetchResult {
  source: string;
  ok: boolean;
  error: string | null;
  new: number;
  seen: number;
}

export interface FetchResponse {
  total_new: number;
  sources_fetched: number;
  sources_failed: number;
  results: FetchResult[];
}
