export interface ToastMsg {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

export function ToastStack({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed right-4 bottom-5 z-50 flex flex-col gap-1.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2 text-xs shadow-lg ${
            t.type === 'success' ? 'border-l-[3px] border-l-[var(--good)]' : t.type === 'error' ? 'border-l-[3px] border-l-[var(--danger)]' : ''
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
