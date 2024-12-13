import { loadData, tokenCount, tokenCountWithOffset } from './day13';

describe('day13', () => {
  test('loadData', async () => {
    let data = await loadData('input/day13.example');
    expect(data[0]).toStrictEqual({
      px: 8400,
      py: 5400,
      ax: 94,
      ay: 34,
      bx: 22,
      by: 67,
    });

    expect(data[3]).toStrictEqual({
      px: 18641,
      py: 10279,
      ax: 69,
      ay: 23,
      bx: 27,
      by: 71,
    });
  });

  test('example', async () => {
    let data = await loadData('input/day13.example');
    let result = tokenCount(data);

    expect(result).toBe(480);
  });

  test('part1', async () => {
    let data = await loadData('input/day13');
    let result = tokenCount(data);

    expect(result).toBe(31761);
  });

  test('part2', async () => {
    let data = await loadData('input/day13');
    let result = tokenCountWithOffset(data);

    expect(result).toBe(90798500745591);
  });
});
