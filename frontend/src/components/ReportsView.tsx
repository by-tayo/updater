import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { api } from '../api';
import type { ReportMeta } from '../types';

export function ReportsView({ refreshKey }: { refreshKey: number }) {
  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [openReport, setOpenReport] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.reports().then((d) => {
      setReports(d.reports);
      setLoading(false);
    });
  }, [refreshKey]);

  useEffect(() => {
    if (openReport) api.report(openReport).then(setContent);
  }, [openReport]);

  if (loading) return <Spinner />;

  if (openReport) {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => setOpenReport(null)}
          className="mb-4 [font-family:var(--font-kicker)] text-[11px] font-semibold tracking-wide text-[var(--ink-secondary)] uppercase hover:text-[var(--accent)]"
        >
          &larr; Back to Archive
        </button>
        <div className="border border-[var(--rule-light)] bg-[var(--paper-2)] p-8">
          <pre className="[font-family:var(--font-body)] text-[13px] leading-7 whitespace-pre-wrap text-[var(--ink)]">{content}</pre>
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-[var(--ink-muted)]">
        <FileText size={36} className="opacity-40" />
        <div className="[font-family:var(--font-body)] text-sm italic">
          No back issues yet. Click <span className="not-italic font-semibold text-[var(--ink)]">Print Digest</span>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 border-b-2 border-[var(--rule)] pb-1.5 [font-family:var(--font-kicker)] text-[11px] font-bold tracking-[0.2em] text-[var(--ink)] uppercase">
        Back Issues
      </div>
      <div className="flex max-w-xl flex-col">
        {reports.map((r) => (
          <div
            key={r.name}
            onClick={() => setOpenReport(r.name)}
            className="flex cursor-pointer items-baseline justify-between gap-3 border-b border-dotted border-[var(--rule-light)] py-2.5 [font-family:var(--font-body)] text-sm text-[var(--ink)] hover:text-[var(--accent)]"
          >
            <span>{r.name}</span>
            <span className="shrink-0 [font-family:var(--font-kicker)] text-[10px] text-[var(--ink-muted)]">
              {new Date(r.modified * 1000).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--rule-light)] border-t-[var(--accent)]" />
    </div>
  );
}
