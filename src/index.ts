import { runProgram } from './day17';

let program = [2, 4, 1, 5, 7, 5, 0, 3, 1, 6, 4, 3, 5, 5, 3, 0];
let a = Math.pow(8, program.length - 1);
let b = 0;
let c = 0;
let result = runProgram(a, b, c, program);

let digitToMatch = program.length;
while (digitToMatch > 0) {
  digitToMatch = digitToMatch - 1;

  console.log(`Matching ${digitToMatch}`);
  let increment = Math.pow(8, digitToMatch);

  program.slice(digitToMatch);
  while (!match(program, result, digitToMatch)) {
    console.log(`${a}+${increment}(8^${digitToMatch})`);
    console.log(a + increment);
    a += increment;
    result = runProgram(a, b, c, program);
    console.log(result.join(','));
    console.log('');
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
