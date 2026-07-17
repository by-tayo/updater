import { useEffect, useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
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
          className="mb-3 flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs hover:border-[var(--accent)]"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-6 font-mono text-[12.5px] leading-7 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
        <FileText size={40} className="opacity-40" />
        <div>
          No reports yet. Click <span className="text-[var(--text-secondary)]">Generate Report</span>.
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-lg flex-col gap-1.5">
      {reports.map((r) => (
        <div
          key={r.name}
          onClick={() => setOpenReport(r.name)}
          className="flex cursor-pointer items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface-1)] px-3.5 py-2.5 text-sm hover:border-[var(--accent)]"
        >
          <span>{r.name}</span>
          <span className="text-[11px] text-[var(--text-muted)]">{new Date(r.modified * 1000).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
    </div>
  );
}
