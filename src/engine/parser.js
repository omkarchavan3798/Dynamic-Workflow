export function validateWorkflowConfig(config) {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Workflow config must be a JSON object.');
  }

  if (typeof config.workflow !== 'string' || !config.workflow.trim()) {
    throw new Error('Workflow config must include a non-empty workflow name.');
  }

  if (!Array.isArray(config.steps)) {
    throw new Error('Workflow config must include a steps array.');
  }

  const validatedSteps = config.steps.map((step, index) => {
    if (typeof step !== 'object' || step === null) {
      throw new Error(`Step ${index + 1} must be an object.`);
    }

    if (typeof step.id !== 'number') {
      throw new Error(`Step ${index + 1} must include a numeric id.`);
    }

    if (typeof step.role !== 'string' || !step.role.trim()) {
      throw new Error(`Step ${index + 1} must include a valid role.`);
    }

    if (step.conditions !== undefined && !Array.isArray(step.conditions)) {
      throw new Error(`Step ${index + 1} conditions must be an array.`);
    }

    return {
      ...step,
      role: step.role.trim(),
      conditions: step.conditions ? step.conditions.map(String) : [],
    };
  });

  return {
    workflow: config.workflow.trim(),
    steps: validatedSteps,
  };
}

export function parseWorkflowConfig(rawText) {
  let parsed;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error('Invalid JSON structure. Fix syntax and try again.');
  }

  return validateWorkflowConfig(parsed);
}
