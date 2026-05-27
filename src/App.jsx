import ConfigEditor from './components/ConfigEditor.jsx';
import InputForm from './components/InputForm.jsx';
import WorkflowGraph from './components/WorkflowGraph.jsx';
import ApprovalPanel from './components/ApprovalPanel.jsx';
import { useWorkflowStore } from './store/workflowStore.js';

function App() {
  const workflowName = useWorkflowStore((state) => state.parsedConfig.workflow);
  const configError = useWorkflowStore((state) => state.configError);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dynamic Workflow Engine</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Config-driven approval workflows
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            Render workflows from JSON, evaluate rules at runtime, and visualize approval state with React Flow.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Workflow Configuration</h2>
                  <p className="mt-1 text-sm text-slate-500">Live JSON editor updates graph without refresh.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  {workflowName}
                </span>
              </div>

              <ConfigEditor />
              {configError && <p className="mt-3 text-sm text-red-600">{configError}</p>}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Input Data</h2>
                <p className="mt-1 text-sm text-slate-500">Change inputs and the workflow reevaluates instantly.</p>
              </div>
              <InputForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Workflow Graph</h2>
                <p className="mt-1 text-sm text-slate-500">Inspect approval nodes in a clean, linear workflow diagram.</p>
              </div>
              <WorkflowGraph />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Execution Panel</h2>
                <p className="mt-1 text-sm text-slate-500">Approve or reject the current pending step.</p>
              </div>
              <ApprovalPanel />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
