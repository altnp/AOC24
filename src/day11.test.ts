import { loadData, observe, observeWithMemo } from './day11';

describe('day11', () => {
  test('loadInput', async () => {
    let input = await loadData('input/day11.example');
    expect(input).toStrictEqual([125, 17]);
  });

  test('example1', async () => {
    let input = await loadData('input/day11.example');
    let stoneCount = observe(input, 6);
    expect(stoneCount).toBe(22);
  });

  test('example1_b', async () => {
    let input = await loadData('input/day11.example');
    let stoneCount = observe(input, 25);
    expect(stoneCount).toBe(55312);
  });

  test('part1', async () => {
    let input = await loadData('input/day11');
    let stoneCount = observe(input, 25);
    expect(stoneCount).toBe(189092);
  });

  test('part2', async () => {
    let input = await loadData('input/day11');
    let stoneCount = observeWithMemo(input, 75);
    expect(stoneCount).toBe(224869647102559);
  });
});
