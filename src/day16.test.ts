import { findPath, findSteps, loadData } from './day16';

describe('day16', () => {
  test('loadData', async () => {
    let { map, start, end } = await loadData('input/day16.example');
    expect(start).toStrictEqual({ x: 1, y: 13 });
    expect(end).toStrictEqual({ x: 13, y: 1 });
    expect(map[0]).toStrictEqual(Array(15).fill('#'));
    expect(map[14]).toStrictEqual(Array(15).fill('#'));
    expect(map.length).toBe(15);
  });

  test('example', async () => {
    let { map, start, end } = await loadData('input/day16.example');
    let result = findPath(map, start, end);
    expect(result).toBe(7036);
  });

  test('part1', async () => {
    let { map, start, end } = await loadData('input/day16');
    let result = findPath(map, start, end);
    expect(result).toBe(105496);
  });

  test('part2', async () => {
    let { map, start, end } = await loadData('input/day16');
    let result = findSteps(map, start, end);
    expect(result).toBe(524);
  });
});
