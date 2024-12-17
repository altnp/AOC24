function runProgram(a: number, b: number, c: number, program: number[]) {
  let pointer = 0;
  let output: number[] = [];
  let states = new Set<string>();

  function executeOperation() {
    let opcode = program[pointer];
    let operand = program[pointer + 1];

    let key = `${a}:${b}:${c}:${pointer}`;
    if (states.has(key)) {
      throw Error('Loop detected');
    }
    states.add(key);

    switch (opcode) {
      case 0:
        a = Math.floor(a / Math.pow(2, getComboOp(operand)));
        break;
      case 1:
        b = (b ^ operand) >>> 0;

        break;
      case 2:
        b = getComboOp(operand) % 8;
        break;
      case 3:
        if (a !== 0) {
          pointer = operand;
          return;
        }
        break;
      case 4:
        b = (b ^ c) >>> 0;
        break;
      case 5:
        output.push(getComboOp(operand) % 8);
        break;
      case 6:
        b = Math.floor(a / Math.pow(2, getComboOp(operand)));
        break;
      case 7:
        c = Math.floor(a / Math.pow(2, getComboOp(operand)));
        break;
    }

    pointer += 2;
  }

  function getComboOp(operand: number) {
    switch (operand) {
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return a;
      case 5:
        return b;
      case 6:
        return c;
      default:
        throw Error(`Invalid combo operand ${operand}`);
    }
  }

  while (pointer < program.length) {
    executeOperation();
  }

  return output;
}

function reverseProgram(a: number, b: number, c: number, program: number[]) {
  a = Math.pow(8, program.length - 1);

  let result = runProgram(a, b, c, program);

  let digitToMatch = program.length;
  while (digitToMatch > 0) {
    digitToMatch = digitToMatch - 1;

    let increment = Math.pow(8, digitToMatch);

    program.slice(digitToMatch);
    while (!match(program, result, digitToMatch)) {
      a += increment;
      result = runProgram(a, b, c, program);
    }
  }

  function match(program: number[], result: number[], digitToMatch: number) {
    let pmatch = program.slice(digitToMatch);
    let rmatch = result.slice(digitToMatch);

    for (let [i, e] of pmatch.entries()) {
      if (rmatch[i] != e) {
        return false;
      }
    }

    return true;
  }

  return a;
}

export { runProgram, reverseProgram };
