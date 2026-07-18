export interface ToastMsg {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

export function ToastStack({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-xs border-2 bg-[var(--paper)] px-4 py-2.5 [font-family:var(--font-body)] text-[12px] shadow-lg ${
            t.type === 'success'
              ? 'border-[var(--good)] text-[var(--good)]'
              : t.type === 'error'
                ? 'border-[var(--danger)] text-[var(--danger)]'
                : 'border-[var(--rule)] text-[var(--ink)]'
          }`}
        >
          <span className="mr-1.5 [font-family:var(--font-kicker)] text-[9px] font-bold tracking-wide uppercase">Notice —</span>
          {t.text}
        </div>
      ))}
    </div>
  );
}
