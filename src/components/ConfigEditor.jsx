import { useWorkflowStore } from '../store/workflowStore.js';

export default function ConfigEditor() {
  const rawConfig = useWorkflowStore((state) => state.rawConfig);
  const setRawConfig = useWorkflowStore((state) => state.setRawConfig);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Update the workflow JSON and the graph will rerender instantly. This editor also validates config structure.
      </p>
      <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-3 shadow-sm shadow-slate-900/20">
        <textarea
          className="min-h-[300px] w-full resize-none bg-transparent px-4 py-4 text-sm text-slate-100 outline-none"
          value={rawConfig}
          onChange={(event) => setRawConfig(event.target.value)}
        />
      </div>
    </div>
  );
}
