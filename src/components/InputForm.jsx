import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../store/workflowStore.js';

export default function InputForm() {
  const inputData = useWorkflowStore((state) => state.inputData);
  const setInputData = useWorkflowStore((state) => state.setInputData);
  const { register, reset, watch } = useForm({ defaultValues: inputData, mode: 'onChange' });

  useEffect(() => {
    reset(inputData, { keepValues: true });
  }, [inputData, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      const nextInputData = {
        amount: Number(values.amount),
        department: values.department,
        priority: values.priority,
      };

      const changed =
        nextInputData.amount !== inputData.amount ||
        nextInputData.department !== inputData.department ||
        nextInputData.priority !== inputData.priority;

      if (changed) {
        setInputData(nextInputData);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setInputData, inputData]);

  return (
    <div className="grid gap-4 sm:grid-cols-3 items-start">
      <label className="grid gap-3 rounded-[32px] border border-slate-200 bg-slate-100 p-5 shadow-sm shadow-slate-200/50 overflow-hidden">
        <span className="text-sm font-semibold text-slate-800">Amount</span>
        <input
          type="number"
          placeholder="Enter numeric value"
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          {...register('amount')}
        />
      </label>

      <label className="grid gap-3 rounded-[32px] border border-slate-200 bg-slate-100 p-5 shadow-sm shadow-slate-200/50 overflow-hidden">
        <span className="text-sm font-semibold text-slate-800">Department</span>
        <input
          placeholder="e.g. IT"
          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          {...register('department')}
        />
      </label>

      <label className="grid gap-3 rounded-[32px] border border-slate-200 bg-slate-100 p-5 shadow-sm shadow-slate-200/50 overflow-hidden">
        <span className="text-sm font-semibold text-slate-800">Priority</span>
          <select
            className="w-full min-w-[160px] rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-8 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            {...register('priority')}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
      </label>
    </div>
  );
}
