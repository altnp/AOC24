import {
  buildAntennaMap,
  countAntiNodes,
  countAntiNodesPart2,
  loadInput,
} from './day8';

describe('day8', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day8.example');
    expect(input[0]).toStrictEqual([
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
    ]);

    expect(input[1]).toStrictEqual([
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
      '0',
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
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
    ]);
  });

  test('buildAntennaMap', async () => {
    let input = await loadInput('input/day8.example');
    let map = buildAntennaMap(input);

    expect(map.get('0')![0]).toStrictEqual({ x: 8, y: 1 });
    expect(map.get('A')![map.get('A')!.length - 1]).toStrictEqual({
      x: 9,
      y: 9,
    });
  });

  test('example', async () => {
    let input = await loadInput('input/day8.example');
    let count = countAntiNodes(input);
    expect(count).toBe(14);
  });

  test('examplepart2', async () => {
    let input = await loadInput('input/day8.example');
    let count = countAntiNodesPart2(input);
    expect(count).toBe(34);
  });

  test('part1', async () => {
    let input = await loadInput('input/day8');
    let count = countAntiNodes(input);
    expect(count).toBe(390);
  });

  test('part2', async () => {
    let input = await loadInput('input/day8');
    let count = countAntiNodesPart2(input);
    expect(count).toBe(1246);
  });
});
