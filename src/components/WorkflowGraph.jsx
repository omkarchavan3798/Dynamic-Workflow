import { useWorkflowStore } from '../store/workflowStore.js';
import WorkflowNode from './WorkflowNode.jsx';

export default function WorkflowGraph() {
  const steps = useWorkflowStore((state) => state.steps);
  const selectStep = useWorkflowStore((state) => state.selectStep);

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.id} className="flex justify-center">
            <div
              className={`w-full ${step.status === 'approved' ? 'border-emerald-400 bg-emerald-50' : step.status === 'rejected' ? 'border-rose-400 bg-rose-50' : step.status === 'pending' ? 'border-amber-400 bg-amber-50' : 'border-slate-300 bg-slate-100'} rounded-[24px] p-3 shadow-sm shadow-slate-200/40 cursor-pointer max-w-[320px]`}
              onClick={() => selectStep(step.id)}
            >
              <WorkflowNode data={step} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
