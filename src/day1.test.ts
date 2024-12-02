import { compareLists, compareListsSimilarity, loadInput } from './day1';

describe('day1', () => {
  test('loadInput', async () => {
    expect(await loadInput('input/day1.example')).toStrictEqual([
      [3, 4, 2, 1, 3, 3],
      [4, 3, 5, 3, 9, 3],
    ]);
  });

  test('compareListsExample', async () => {
    let input = await loadInput('input/day1.example');
    let result = await compareLists(input[0], input[1]);
    expect(result).toBe(11);
  });

  test('compareListsSimilarityExample', async () => {
    let input = await loadInput('input/day1.example');
    let result = await compareListsSimilarity(input[0], input[1]);
    expect(result).toBe(31);
  });
});
