import { evaluateStep } from './ruleEngine.js';

export function computeWorkflowState(config, runtimeData, history) {
  const steps = (config?.steps ?? []).map((step) => {
    const applies = evaluateStep(step, runtimeData);
    return {
      ...step,
      status: applies ? 'pending' : 'skipped',
      applies,
    };
  });

  let halted = false;
  let hasPending = false;
  let pendingStep = null;

  const resolvedSteps = steps.map((step) => {
    if (!step.applies) {
      return { ...step, status: 'skipped' };
    }

    const existingStatus = history?.[step.id];

    if (existingStatus === 'rejected') {
      halted = true;
      return { ...step, status: 'rejected' };
    }

    if (existingStatus === 'approved') {
      return { ...step, status: 'approved' };
    }

    if (halted || hasPending) {
      return { ...step, status: 'skipped' };
    }

    pendingStep = step;
    hasPending = true;
    return { ...step, status: 'pending' };
  });

  return {
    workflow: config?.workflow ?? '',
    steps: resolvedSteps,
    pendingStep,
    halted,
  };
}
