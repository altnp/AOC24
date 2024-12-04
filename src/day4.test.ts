import { findX_MAS, findXMAS, loadInput } from './day4';

describe('day4', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day4.example');
    expect(input[0]).toStrictEqual(['M', 'M', 'M', 'S', 'X', 'X', 'M', 'A', 'S', 'M']);
  });

  test('findXMASexample', async () => {
    let input = await loadInput('input/day4.example');
    let result = findXMAS(input);
    expect(result).toBe(18);
  });

  test('findXMASexample', async () => {
    let input = await loadInput('input/day4.example');
    let result = findX_MAS(input);
    expect(result).toBe(9);
  });
});
