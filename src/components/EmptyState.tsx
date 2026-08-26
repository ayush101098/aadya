export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span aria-hidden className="text-2xl opacity-50">
        🍺
      </span>
      <p className="font-display text-lg text-ink-900">{title}</p>
      {hint && <p className="max-w-md text-sm text-ink-500">{hint}</p>}
      {action}
    </div>
  );
}
