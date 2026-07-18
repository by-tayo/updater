import { useCallback, useEffect, useState } from 'react';
import { Masthead } from './components/Masthead';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ArticleList } from './components/ArticleList';
import { ReportsView } from './components/ReportsView';
import { CategoryChart } from './components/CategoryChart';
import { ToastStack, type ToastMsg } from './components/Toast';
import { api } from './api';
import type { Article, Category } from './types';

export default function App() {
  const [view, setView] = useState<'articles' | 'reports'>('articles');
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [statusCount, setStatusCount] = useState(0);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const toast = useCallback((text: string, type: ToastMsg['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const loadCategories = useCallback(() => {
    api.categories().then((d) => setCategories(d.categories));
  }, []);

  const loadArticles = useCallback(() => {
    setLoadingArticles(true);
    api
      .articles({ category: activeCategory, search: searchTerm, unreadOnly })
      .then((d) => {
        setArticles(d.articles);
        setStatusCount(d.count);
        setLoadingArticles(false);
      });
  }, [activeCategory, searchTerm, unreadOnly]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (view === 'articles') loadArticles();
  }, [view, loadArticles]);

  async function markRead(id: number, read: boolean) {
    await api.markRead(id, read);
    loadArticles();
    loadCategories();
  }

  async function doFetch() {
    setFetching(true);
    try {
      const d = await api.fetchNow();
      toast(
        `Fetched ${d.sources_fetched} source(s): ${d.total_new} new article(s)${d.sources_failed ? `, ${d.sources_failed} failed` : ''}`,
        d.sources_failed ? 'error' : 'success',
      );
      loadCategories();
      loadArticles();
    } catch (e) {
      toast('Fetch failed: ' + (e as Error).message, 'error');
    }
    setFetching(false);
  }

  async function doReport() {
    try {
      const d = await api.generateReport(1);
      toast(`Report saved: ${d.filename}`, 'success');
      setReportsRefreshKey((k) => k + 1);
      setView('reports');
    } catch (e) {
      toast('Report generation failed: ' + (e as Error).message, 'error');
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <Masthead />
      <Topbar
        view={view}
        onView={setView}
        search={search}
        onSearch={setSearch}
        onSearchSubmit={() => setSearchTerm(search)}
        unreadOnly={unreadOnly}
        onUnreadOnly={setUnreadOnly}
        onFetch={doFetch}
        fetching={fetching}
        onReport={doReport}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(k) => {
            setActiveCategory(k);
            setView('articles');
          }}
        />
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {view === 'articles' ? (
            <div className="flex flex-col gap-5">
              {!activeCategory && categories.length > 0 && (
                <div className="max-w-2xl">
                  <CategoryChart categories={categories} />
                </div>
              )}
              {loadingArticles ? (
                <div className="flex h-[40vh] items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--rule-light)] border-t-[var(--accent)]" />
                </div>
              ) : (
                <ArticleList articles={articles} onMarkRead={markRead} />
              )}
            </div>
          ) : (
            <ReportsView refreshKey={reportsRefreshKey} />
          )}
        </main>
      </div>
      <footer className="border-t border-[var(--rule-light)] bg-[var(--paper)] px-6 py-1.5 [font-family:var(--font-kicker)] text-[10px] text-[var(--ink-muted)] uppercase tracking-wide">
        {view === 'articles' ? `${statusCount} ${statusCount === 1 ? 'story' : 'stories'} on file` : ''}
      </footer>
      <ToastStack toasts={toasts} />
    </div>
  );
}
