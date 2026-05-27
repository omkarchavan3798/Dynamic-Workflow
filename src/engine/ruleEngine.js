const comparatorOperators = ['===', '!==', '>=', '<=', '>', '<'];
const operatorRegex = /^(===|!==|>=|<=|&&|\|\||>|<|\(|\))$/;

function tokenize(expression) {
  const tokenPattern = /\s*(\d+\.\d+|\d+|===|!==|>=|<=|&&|\|\||[()<>]|===|!==|==|!=|[a-zA-Z_][a-zA-Z0-9_]*|"[^"]*"|'[^']*')\s*/g;
  const tokens = [];
  let match;

  while ((match = tokenPattern.exec(expression)) !== null) {
    tokens.push(match[1]);
  }

  return tokens;
}

function parseLiteral(token) {
  if (/^\d+\.\d+$/.test(token)) return Number(token);
  if (/^\d+$/.test(token)) return Number(token);
  if (/^".*"$/.test(token) || /^'.*'$/.test(token)) {
    return token.slice(1, -1);
  }

  return token;
}

function parseComparison(tokens) {
  if (!tokens.length) return null;

  if (tokens[0] === '(') {
    tokens.shift();
    const node = parseExpression(tokens);
    if (tokens[0] === ')') {
      tokens.shift();
    }
    return node;
  }

  const left = tokens.shift();
  const operator = tokens.shift();

  if (!left || !operator || !comparatorOperators.includes(operator)) {
    throw new Error('Invalid comparison expression.');
  }

  const right = tokens.shift();

  if (right === undefined) {
    throw new Error('Comparison requires a right-hand value.');
  }

  return {
    type: 'comparison',
    operator,
    left,
    right: parseLiteral(right),
  };
}

function parseTerm(tokens) {
  const node = parseComparison(tokens);
  return node;
}

function parseAnd(tokens) {
  let node = parseTerm(tokens);

  while (tokens[0] === '&&') {
    tokens.shift();
    node = {
      type: 'logical',
      operator: '&&',
      left: node,
      right: parseTerm(tokens),
    };
  }

  return node;
}

function parseExpression(tokens) {
  let node = parseAnd(tokens);

  while (tokens[0] === '||') {
    tokens.shift();
    node = {
      type: 'logical',
      operator: '||',
      left: node,
      right: parseAnd(tokens),
    };
  }

  return node;
}

function resolveValue(reference, runtimeData) {
  if (reference in runtimeData) {
    return runtimeData[reference];
  }

  return reference;
}

function evaluateNode(node, runtimeData) {
  if (!node || !node.type) {
    return false;
  }

  if (node.type === 'comparison') {
    const leftValue = resolveValue(node.left, runtimeData);
    const rightValue = node.right;

    switch (node.operator) {
      case '===':
        return leftValue === rightValue;
      case '!==':
        return leftValue !== rightValue;
      case '>=':
        return Number(leftValue) >= Number(rightValue);
      case '<=':
        return Number(leftValue) <= Number(rightValue);
      case '>':
        return Number(leftValue) > Number(rightValue);
      case '<':
        return Number(leftValue) < Number(rightValue);
      default:
        return false;
    }
  }

  if (node.type === 'logical') {
    const left = evaluateNode(node.left, runtimeData);
    const right = evaluateNode(node.right, runtimeData);

    if (node.operator === '&&') {
      return left && right;
    }

    if (node.operator === '||') {
      return left || right;
    }
  }

  return false;
}

export function evaluateCondition(expression, runtimeData) {
  if (typeof expression !== 'string' || !expression.trim()) {
    return false;
  }

  const tokens = tokenize(expression);

  if (!tokens.length) {
    return false;
  }

  const ast = parseExpression(tokens);
  return evaluateNode(ast, runtimeData);
}

export function evaluateStep(step, runtimeData) {
  if (!step.conditions || step.conditions.length === 0) {
    return true;
  }

  return step.conditions.every((condition) => evaluateCondition(condition, runtimeData));
}
