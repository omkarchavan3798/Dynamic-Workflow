import { MarkerType } from 'reactflow';

const NODE_SPACING = 360;
const STATUS_COLORS = {
  pending: '#fbbf24',
  approved: '#22c55e',
  rejected: '#ef4444',
  skipped: '#64748b',
};

export function buildWorkflowGraph(steps) {
  const nodes = steps.map((step, index) => ({
    id: String(step.id),
    type: 'workflowNode',
    position: { x: index * NODE_SPACING, y: 0 },
    data: {
      id: step.id,
      role: step.role,
      status: step.status,
      conditions: step.conditions,
    },
  }));

  const edges = steps.slice(1).map((step, index) => {
    const previousStep = steps[index];
    return {
      id: `edge-${previousStep.id}-${step.id}`,
      source: String(previousStep.id),
      target: String(step.id),
      type: 'smoothstep',
      animated: previousStep.status === 'approved',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        stroke: STATUS_COLORS[previousStep.status] ?? STATUS_COLORS.skipped,
      },
    };
  });

  return { nodes, edges };
}
