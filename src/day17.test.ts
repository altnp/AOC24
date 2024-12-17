import { reverseProgram, runProgram } from './day17';

describe('day17', () => {
  test('example', () => {
    let a = 729;
    let b = 0;
    let c = 0;
    let program = [0, 1, 5, 4, 3, 0];
    let result = runProgram(a, b, c, program);
    expect(result.join(',')).toBe('4,6,3,5,6,3,5,2,1,0');
  });

  test('part1', () => {
    let a = 59590048;
    let b = 0;
    let c = 0;
    let program = [2, 4, 1, 5, 7, 5, 0, 3, 1, 6, 4, 3, 5, 5, 3, 0];
    let result = runProgram(a, b, c, program);
    expect(result.join(',')).toBe('6,5,7,4,5,7,3,1,0');
  });

  test('example2', () => {
    let a = 32768;
    let b = 0;
    let c = 0;
    let program = [0, 3, 5, 4, 3, 0];

    a = reverseProgram(a, b, c, program);

    expect(a).toBe(117440);
  });

  test('part2', () => {
    let a = 59590048;
    let b = 0;
    let c = 0;
    let program = [2, 4, 1, 5, 7, 5, 0, 3, 1, 6, 4, 3, 5, 5, 3, 0];

    a = reverseProgram(a, b, c, program);

    expect(a).toBe(105875099912602);
  });
});
