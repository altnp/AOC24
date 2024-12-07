import * as fs from 'fs/promises';

type Equation = {
  operands: number[];
  total: number;
};

async function loadInput(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');

  let equations = [];
  for (let line of data.split('\n')) {
    line = line.trim();
    if (line) {
      let [_, total, operands] = line.trim().match(/(\d+): ([\d ]+)/)!;
      equations.push({
        total: parseInt(total),
        operands: operands
          .trim()
          .split(' ')
          .map((o) => parseInt(o)),
      });
    }
  }
  return equations;
}

function isValidEquation(equation: Equation) {
  function dfs(index: number, total: number): boolean {
    if (total > equation.total) return false;
    if (index == equation.operands.length && total == equation.total)
      return true;
    if (index == equation.operands.length) return false;

    let operand = equation.operands[index];

    return dfs(index + 1, total + operand) || dfs(index + 1, total * operand);
  }

  return dfs(1, equation.operands[0]);
}

let totalCalibrationResults = (equations: Equation[]) =>
  equations.reduce((p, c) => p + (isValidEquation(c) ? c.total : 0), 0);

function isValidEquationPart2(equation: Equation) {
  function dfs(index: number, total: number): boolean {
    if (total > equation.total) return false;
    if (index == equation.operands.length && total == equation.total)
      return true;
    if (index == equation.operands.length) return false;

    let operand = equation.operands[index];

    return (
      dfs(index + 1, total + operand) ||
      dfs(index + 1, total * operand) ||
      dfs(index + 1, parseInt(`${total}${operand}`))
    );
  }

  return dfs(1, equation.operands[0]);
}

let totalCalibrationResultsPart2 = (equations: Equation[]) =>
  equations.reduce((p, c) => p + (isValidEquationPart2(c) ? c.total : 0), 0);

async function main() {
  let input = await loadInput('input/day7');
  console.log(totalCalibrationResults(input));
}

export {
  loadInput,
  isValidEquation,
  totalCalibrationResults,
  isValidEquationPart2,
  totalCalibrationResultsPart2,
  main,
};
