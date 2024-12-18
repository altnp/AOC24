import { loadData, findPath, findLastEscape } from './day18';

describe('day18', () => {
  test('loadData', async () => {
    let data = await loadData('input/day18.example');
    expect(data[0]).toStrictEqual({ x: 5, y: 4 });
    expect(data[data.length - 1]).toStrictEqual({ x: 2, y: 0 });
  });

  test('example', async () => {
    let data = await loadData('input/day18.example');
    data = data.slice(0, 12);
    let result = findPath(data, 7, 7);
    expect(result.length).toBe(22);
  });

  test('part1', async () => {
    let data = await loadData('input/day18');
    data = data.slice(0, 1024);
    let result = findPath(data, 71, 71);
    expect(result.length).toBe(374);
  });

  test('examplepart2', async () => {
    let data = await loadData('input/day18.example');
    let result = findLastEscape(data, 7, 7);
    expect(result).toStrictEqual({ x: 6, y: 1 });
  });

  test('part2', async () => {
    let data = await loadData('input/day18');
    let result = findLastEscape(data, 71, 71);
    expect(result).toStrictEqual({ x: 30, y: 12 });
  });
});
