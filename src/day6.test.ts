import {
  Direction,
  findLoops,
  findTravelDistance,
  loadInput,
  parseMap,
} from './day6';

describe('day6', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day6.example');
    expect(input[0]).toStrictEqual([
      '.',
      '.',
      '.',
      '.',
      '#',
      '.',
      '.',
      '.',
      '.',
      '.',
    ]);
    expect(input[input.length - 1]).toStrictEqual([
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '#',
      '.',
      '.',
      '.',
    ]);
  });

  test('example', async () => {
    let input = await loadInput('input/day6.example');
    let result = findTravelDistance(input);

    expect(result).toBe(41);
  });

  test('examplePart2', async () => {
    let input = await loadInput('input/day6.example');
    let result = findLoops(input);

    expect(result).toBe(6);
  });

  test('part1', async () => {
    let input = await loadInput('input/day6');
    let result = findTravelDistance(input);

    expect(result).toBe(4515);
  });

  test('part2', async () => {
    let input = await loadInput('input/day6');
    let result = findLoops(input);

    expect(result).toBe(1309);
  });

  test('parseMap', () => {
    let map = [
      ['.', '.', '.'],
      ['#', '.', '.'],
      ['.', '^', '.'],
      ['.', '.', '#'],
    ];

    let { objectsByRow, objectsByColumn, start } = parseMap(map);
    expect(start).toStrictEqual([2, 1, Direction.Up]);
  });

  test('paseMapPart1', async () => {
    let map = await loadInput('input/day6');
    let { objectsByRow, objectsByColumn, start } = parseMap(map);
  });
});
