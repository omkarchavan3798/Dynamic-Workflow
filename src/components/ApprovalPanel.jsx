import StatusBadge from './StatusBadge.jsx';
import { useWorkflowStore } from '../store/workflowStore.js';

export default function ApprovalPanel() {
  const steps = useWorkflowStore((state) => state.steps);
  const pendingStep = useWorkflowStore((state) => state.pendingStep);
  const selectedStepId = useWorkflowStore((state) => state.selectedStepId);
  const approveStep = useWorkflowStore((state) => state.approveStep);
  const rejectStep = useWorkflowStore((state) => state.rejectStep);
  const resetWorkflow = useWorkflowStore((state) => state.resetWorkflow);
  const selectStep = useWorkflowStore((state) => state.selectStep);
  const auditLog = useWorkflowStore((state) => state.auditLog);

  const selectedStep = steps.find((step) => step.id === selectedStepId) ?? steps[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Active step</h3>
          {selectedStep ? (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Selected approval node</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{selectedStep.role}</p>
                </div>
                <StatusBadge status={selectedStep.status} />
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-200/50">
                <p className="text-sm text-slate-600">Step ID: {selectedStep.id}</p>
                {selectedStep.conditions?.length > 0 && (
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">Conditions</p>
                    <ul className="space-y-2">
                      {selectedStep.conditions.map((condition) => (
                        <li key={condition} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No workflow steps available.</p>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Approval actions</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={approveStep}
                disabled={!pendingStep}
                className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Approve
              </button>
              <button
                onClick={rejectStep}
                disabled={!pendingStep}
                className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Reject
              </button>
              <button
                onClick={resetWorkflow}
                className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Reset Workflow
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Current status</p>
            <p className="mt-2 text-sm text-slate-600">
              {pendingStep ? `Pending approval from ${pendingStep.role}` : 'No active pending step.'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Audit log</h3>
            <p className="text-sm text-slate-500">Track all approval actions during the session.</p>
          </div>
          <button
            type="button"
            onClick={() => selectStep(pendingStep?.id ?? selectedStep?.id)}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
          >
            Focus active step
          </button>
        </div>

        <div className="space-y-3">
          {auditLog.length > 0 ? (
            auditLog.map((entry) => (
              <div key={`${entry.step}-${entry.time}`} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-800">{entry.step}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {entry.action} • {new Date(entry.time).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No audit events yet. Perform an approval action to generate log entries.</p>
          )}
        </div>
      </div>
    </div>
  );
}
