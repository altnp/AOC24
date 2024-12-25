import { generateKeySync } from 'crypto';
import * as fs from 'fs/promises';

class InvalidOutputError extends Error {
  expected: string;
  actual: string;

  constructor(message: string, expected: string, actual: string) {
    super(message);
    this.expected = expected;
    this.actual = actual;
    this.name = 'InvalidOutputError';
  }
}

enum Operator {
  And = 'AND',
  Or = 'OR',
  Xor = 'XOR',
}

type Gate = {
  operator: Operator;
  input1: string;
  input2: string;
  output: string;
};

function getOpFunction(operator: Operator) {
  switch (operator) {
    case Operator.And:
      return (a: boolean, b: boolean) => a && b;
    case Operator.Or:
      return (a: boolean, b: boolean) => a || b;
    case Operator.Xor:
      return (a: boolean, b: boolean) => (a && !b) || (!a && b);
  }

  throw 'Invalid operator';
}

async function loadData(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');
  let lines = data
    .trim()
    .split('\n')
    .map((l) => l.trim());

  let wires = new Map<string, boolean>();
  let wiresEnd = -1;
  for (let [i, line] of lines.entries()) {
    if (line === '') {
      wiresEnd = i;
      break;
    }

    let lineParts = line.split(': ');

    wires.set(lineParts[0]!, lineParts[1]! === '1');
  }

  lines = lines.slice(wiresEnd + 1);
  let gates: Gate[] = [];
  for (let line of lines) {
    let [gate, output] = line.split(' -> ')!;

    let [input1, operator, input2] = gate.split(' ');
    if (wires.has(input1) && wires.has(input2)) {
      gates.unshift({ operator: operator as Operator, input1, input2, output });
    } else {
      gates.push({ operator: operator as Operator, input1, input2, output });
    }
  }

  return { wires, gates };
}

function calcOutput(wires: Map<string, boolean>, gates: Gate[]) {
  let gateQueue = [...gates];
  let wireMap = new Map<string, boolean>(wires);

  let zqueue = new Set<string>(
    gateQueue.filter((g) => g.output.startsWith('z')).map((g) => g.output)
  );

  let zMaxIndex = gateQueue.reduce((v, g, i) => {
    if (g.output.startsWith('z')) {
      let value = parseInt(g.output.replace('z', ''));
      if (value > v) {
        return value;
      }
    }
    return v;
  }, -1);

  let result: boolean[] = new Array(zMaxIndex + 1);

  while (zqueue.size > 0 && gateQueue.length > 0) {
    let gate = gateQueue.shift()!;

    if (wireMap.has(gate.input1) && wireMap.has(gate.input2)) {
      let input1value = wireMap.get(gate.input1)!;
      let input2value = wireMap.get(gate.input2)!;

      let outputValue = getOpFunction(gate.operator)(input1value, input2value);
      wireMap.set(gate.output, outputValue);

      if (gate.output.startsWith('z')) {
        zqueue.delete(gate.output);
        let index = parseInt(gate.output.replace('z', ''));
        result[index] = outputValue;
      }
      continue;
    }

    gateQueue.push(gate);
  }

  result.reverse();
  return { value: booleanArrayToInt(result), bits: result };
}

function booleanArrayToInt(boolArray: boolean[]): number {
  let result = 0;
  for (let i = boolArray.length - 1; i >= 0; i--) {
    if (boolArray[i]) {
      result += Math.pow(2, boolArray.length - 1 - i);
    }
  }
  return result;
}

function hasGate(gate: Gate, gates: Gate[]) {
  let canidates = gates.filter(
    (g) =>
      (g.input1 === gate.input1 || g.input1 === gate.input2) &&
      (g.input2 === gate.input1 || g.input2 === gate.input2) &&
      g.operator === gate.operator
  );

  if (canidates.length === 0)
    throw `Missing ${gate.operator} for ${gate.input1}, ${gate.input2}`;

  if (canidates.length > 1)
    throw "Too many canidates, this shouldn't happen...";

  let canidate = canidates[0];
  if (gate.output) {
    if (canidate.output != gate.output)
      throw new InvalidOutputError(
        `Invalid output for gate: ${gate.input1} ${gate.operator} ${gate.input2} -> ${canidate.output}, expected: ${gate.operator}`,
        gate.output,
        canidate.output
      );
  }

  return canidate.output;
}

function removeGate(output: string, gates: Gate[]) {
  const remainingGates = gates.filter((g) => g.output !== output);

  gates.length = 0;
  gates.push(...remainingGates);
}

function swapOutput(a: string, b: string, gates: Gate[], swaps: string[]) {
  let ga = gates.filter((g) => g.output === a)![0];
  let gb = gates.filter((g) => g.output === b)![0];
  ga.output = b;
  gb.output = a;

  swaps.push(a);
  swaps.push(b);
  console.log(`Swapping ${a} ${b}`);
}

function hasValidHalfAdder(gates: Gate[]) {
  hasGate(
    {
      input1: 'x00',
      input2: 'y00',
      operator: Operator.Xor,
      output: 'z00',
    },
    gates
  );

  let carry = hasGate(
    {
      input1: 'x00',
      input2: 'y00',
      operator: Operator.And,
      output: '',
    },
    gates
  );

  return carry;
}

function hasValidFullAdder(
  index: number,
  cwire: string,
  gates: Gate[],
  swaps: string[]
) {
  let i = index.toString().padStart(2, '0');
  let xwire = `x${i}`;
  let ywire = `y${i}`;
  let zwire = `z${i}`;

  let rp1 = '';
  try {
    rp1 = hasGate(
      {
        input1: xwire,
        input2: ywire,
        operator: Operator.Xor,
        output: '',
      },
      gates
    );
  } catch (ex) {
    throw ex;
  }

  let cp1 = '';
  try {
    cp1 = hasGate(
      {
        input1: xwire,
        input2: ywire,
        operator: Operator.And,
        output: '',
      },
      gates
    );
  } catch (ex) {
    throw ex;
  }

  try {
    hasGate(
      {
        input1: rp1,
        input2: cwire,
        operator: Operator.Xor,
        output: zwire,
      },
      gates
    );
  } catch (ex) {
    if (ex instanceof InvalidOutputError) {
      swapOutput(ex.actual, ex.expected, gates, swaps);

      if (cp1 === zwire) {
        cp1 = ex.actual;
      }

      if (rp1 === zwire) {
        rp1 = ex.actual;
      }
    } else {
      let gate = gates.filter((g) => g.output === zwire)![0];
      if (gate.input1 !== rp1 && gate.input2 !== rp1) {
        let toSwap = [gate.input1, gate.input2].filter((w) => w != cwire)![0];
        swapOutput(toSwap, rp1, gates, swaps);
        if (cp1 === toSwap) {
          cp1 = rp1;
        }

        rp1 = toSwap;
      }

      if (gate.input1 !== cwire && gate.input2 !== cwire) {
        let toSwap = [gate.input1, gate.input2].filter((w) => w != rp1)![0];
        swapOutput(toSwap, cwire, gates, swaps);
        if (cp1 === toSwap) {
          cp1 = cwire;
        }

        cwire = toSwap;
      }
    }
  }

  let cp2 = '';
  try {
    cp2 = hasGate(
      {
        input1: cwire,
        input2: rp1,
        operator: Operator.And,
        output: '',
      },
      gates
    );
  } catch (ex) {
    throw ex;
  }

  let carry = '';
  try {
    carry = hasGate(
      {
        input1: cp1,
        input2: cp2,
        operator: Operator.Or,
        output: '',
      },
      gates
    );
  } catch (ex) {
    throw ex;
  }

  return carry;
}

function findInvalidAdders(gates: Gate[]) {
  let zMaxIndex = gates.reduce((v, g, i) => {
    if (g.output.startsWith('z')) {
      let value = parseInt(g.output.replace('z', ''));
      if (value > v) {
        return value;
      }
    }
    return v;
  }, -1);

  let swaps: string[] = [];

  let carry = '';
  carry = hasValidHalfAdder(gates);

  for (let i = 1; i <= zMaxIndex - 1; i++) {
    carry = hasValidFullAdder(i, carry, gates, swaps);
  }

  return swaps.sort();
}

export { loadData, calcOutput, findInvalidAdders, hasValidHalfAdder, Operator };
