import create from 'zustand';
import { parseWorkflowConfig } from '../engine/parser.js';
import { computeWorkflowState } from '../engine/workflowExecutor.js';
import { buildWorkflowGraph } from '../utils/graphUtils.js';

const defaultWorkflow = {
  workflow: 'Procurement Approval',
  steps: [
    {
      id: 1,
      role: 'Manager',
      conditions: ['amount < 50000'],
    },
    {
      id: 2,
      role: 'Finance',
      conditions: ['amount >= 50000'],
    },
    {
      id: 3,
      role: 'Director',
      conditions: ['amount > 200000'],
    },
  ],
};

const persistedConfig = window.localStorage.getItem('workflow-config');
const persistedInput = window.localStorage.getItem('workflow-input');

const initialRawConfig = persistedConfig ?? JSON.stringify(defaultWorkflow, null, 2);
const initialInputData = persistedInput
  ? JSON.parse(persistedInput)
  : { amount: 45000, department: 'IT', priority: 'Medium' };

function buildState(config, inputData, history) {
  const workflowState = computeWorkflowState(config, inputData, history);
  const graphState = buildWorkflowGraph(workflowState.steps);

  return {
    ...workflowState,
    nodes: graphState.nodes,
    edges: graphState.edges,
    steps: workflowState.steps,
    selectedStepId: workflowState.pendingStep?.id ?? workflowState.steps[0]?.id ?? null,
  };
}

let initialParsedConfig = defaultWorkflow;
let initialWorkflowState = buildState(defaultWorkflow, initialInputData, {});
let initialError = null;

try {
  initialParsedConfig = parseWorkflowConfig(initialRawConfig);
  initialWorkflowState = buildState(initialParsedConfig, initialInputData, {});
} catch (error) {
  initialError = error.message;
}

export const useWorkflowStore = create((set, get) => ({
  rawConfig: initialRawConfig,
  parsedConfig: initialParsedConfig,
  configError: initialError,
  inputData: initialInputData,
  history: {},
  auditLog: [],
  ...initialWorkflowState,

  setRawConfig(rawConfig) {
    window.localStorage.setItem('workflow-config', rawConfig);

    try {
      const parsedConfig = parseWorkflowConfig(rawConfig);
      const newState = buildState(parsedConfig, get().inputData, get().history);

      set({
        rawConfig,
        parsedConfig,
        configError: null,
        ...newState,
      });
    } catch (error) {
      set({ rawConfig, configError: error.message });
    }
  },

  setInputData(inputData) {
    window.localStorage.setItem('workflow-input', JSON.stringify(inputData));

    const parsedConfig = get().parsedConfig;
    const newState = buildState(parsedConfig, inputData, get().history);

    set({
      inputData,
      ...newState,
    });
  },

  approveStep() {
    const pending = get().pendingStep;
    if (!pending) {
      return;
    }

    const history = {
      ...get().history,
      [pending.id]: 'approved',
    };

    const newState = buildState(get().parsedConfig, get().inputData, history);

    set({
      history,
      auditLog: [
        ...get().auditLog,
        {
          action: 'approved',
          step: pending.role,
          time: new Date().toISOString(),
        },
      ],
      ...newState,
    });
  },

  rejectStep() {
    const pending = get().pendingStep;
    if (!pending) {
      return;
    }

    const history = {
      ...get().history,
      [pending.id]: 'rejected',
    };

    const newState = buildState(get().parsedConfig, get().inputData, history);

    set({
      history,
      auditLog: [
        ...get().auditLog,
        {
          action: 'rejected',
          step: pending.role,
          time: new Date().toISOString(),
        },
      ],
      ...newState,
    });
  },

  resetWorkflow() {
    const history = {};
    const newState = buildState(get().parsedConfig, get().inputData, history);
    set({
      history,
      auditLog: [],
      ...newState,
    });
  },

  selectStep(stepId) {
    set({ selectedStepId: Number(stepId) });
  },
}));
