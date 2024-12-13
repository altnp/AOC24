import * as fs from 'fs/promises';

type Machine = {
  px: number;
  py: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
};

async function loadData(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf-8')).trim();

  let machines: Machine[] = [];
  let lines = data.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let [, ax, ay] = lines[i].match(/^Button A: X\+(\d+), Y\+(\d+)$/)!;
    let [, bx, by] = lines[i + 1].match(/^Button B: X\+(\d+), Y\+(\d+)$/)!;
    let [, px, py] = lines[i + 2].match(/^Prize: X=(\d+), Y=(\d+)/)!;
    machines.push({
      px: parseInt(px),
      py: parseInt(py),
      ax: parseInt(ax),
      ay: parseInt(ay),
      bx: parseInt(bx),
      by: parseInt(by),
    });
    i = i + 3;
  }

  return machines;
}

function tokenCount(machines: Machine[]) {
  let total = 0;
  for (let m of machines) {
    let { a, b } = solveMachine(m);
    if (a >= 0 && b >= 0 && Number.isInteger(a) && Number.isInteger(b)) {
      total += 3 * a + b;
    }
  }

  return total;
}

function tokenCountWithOffset(machines: Machine[]) {
  let total = 0;
  for (let m of machines) {
    m.px += 10000000000000;
    m.py += 10000000000000;
    let { a, b } = solveMachine(m);
    if (a >= 0 && b >= 0 && Number.isInteger(a) && Number.isInteger(b)) {
      total += 3 * a + b;
    }
  }

  return total;
}

function solveMachine({ px, py, ax, ay, bx, by }: Machine) {
  let determinant = ax * by - ay * bx;
  if (determinant === 0) {
    return { a: -1, b: -1 };
  }

  let aNumerator = px * by - py * bx;
  let bNumerator = ax * py - ay * px;

  let a = aNumerator / determinant;
  let b = bNumerator / determinant;

  return { a, b };
}

export { loadData, tokenCount, tokenCountWithOffset };
