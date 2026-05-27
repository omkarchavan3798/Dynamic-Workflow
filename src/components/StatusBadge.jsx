const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  skipped: 'bg-slate-100 text-slate-600',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.skipped}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}
