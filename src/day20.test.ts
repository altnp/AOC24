import { findAllCheatPaths, findShortestValidRoute, loadData } from './day20';

describe('day20', () => {
  test('loadData', async () => {
    let data = await loadData('input/day20.example');
    expect(data.start).toStrictEqual({ x: 1, y: 3 });
    expect(data.end).toStrictEqual({ x: 5, y: 7 });
  });

  test('findShortestPath', async () => {
    let data = await loadData('input/day20.example');
    let result = findShortestValidRoute(data.map, data.start, data.end);

    expect(result.length).toBe(84);
  });

  test('findAllPathsAllCheats', async () => {
    let data = await loadData('input/day20.example');
    let result = findAllCheatPaths(data.map, data.start, data.end, 1, 2);

    expect(result).toBe(44);
  });

  test('findAllPathsCheatsGTE20', async () => {
    let data = await loadData('input/day20.example');
    let result = findAllCheatPaths(data.map, data.start, data.end, 20, 2);

    expect(result).toBe(5);
  });

  test('part1findShorted', async () => {
    let data = await loadData('input/day20');
    let result = findShortestValidRoute(data.map, data.start, data.end);

    expect(result.length).toBe(9324);
  });

  test('part1', async () => {
    let data = await loadData('input/day20');
    let result = findAllCheatPaths(data.map, data.start, data.end, 100, 2);

    expect(result).toBe(1346);
  });

  test('findAllPathsCheatsGTE50part2', async () => {
    let data = await loadData('input/day20.example');
    let result = findAllCheatPaths(data.map, data.start, data.end, 50, 20);

    expect(result).toBe(285);
  });

  test('part2', async () => {
    let data = await loadData('input/day20');
    let result = findAllCheatPaths(data.map, data.start, data.end, 100, 20);

    expect(result).toBe(985482);
  });
});
