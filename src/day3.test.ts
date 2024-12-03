import { executeValidConditionalInstructions, executeValidInstructions, loadInput } from './day3';

describe('day3', () => {
  test('loadInput', async () => {
    expect(await loadInput('input/day3.example')).toBe(
      'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))'
    );
  });

  test('example', async () => {
    let input = await loadInput('input/day3.example');
    let result = executeValidInstructions(input);
    expect(result).toBe(161);
  });

  test('examplePart2', async () => {
    let input = await loadInput('input/day3.example2');
    let result = executeValidConditionalInstructions(input);
    expect(result).toBe(48);
  });
});
