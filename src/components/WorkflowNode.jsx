import StatusBadge from './StatusBadge.jsx';

export default function WorkflowNode({ data }) {
  const statusMessage = {
    pending: 'Step is ready for approval',
    approved: 'Step completed successfully',
    rejected: 'Step was rejected',
    skipped: 'Condition not met',
  };

  return (
    <div className="w-full min-h-[220px] rounded-[32px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{data.role}</h3>
          <p className="mt-1 text-sm text-slate-500">Step ID: {data.id}</p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{statusMessage[data.status] ?? 'Workflow step'}</p>

      {data.conditions?.length > 0 && (
        <div className="mt-4 space-y-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Conditions</p>
          <ul className="space-y-1">
            {data.conditions.map((condition) => (
              <li key={condition} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                {condition}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
