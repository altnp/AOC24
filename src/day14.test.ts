import { loadData, quadrantSafetyScore, Robot } from './day14';

describe('day14', () => {
  test('loadData', async () => {
    let data = await loadData('input/day14.example');
    expect(data[0]).toStrictEqual(new Robot(0, 4, 3, -3));

    expect(data[11]).toStrictEqual(new Robot(9, 5, -3, -3));
  });

  test('advance', () => {
    let robot = new Robot(2, 4, 2, -3);
    expect(robot.advancePosition(5, 11, 7)).toStrictEqual({
      x: 1,
      y: 3,
    });
  });

  test('example', async () => {
    let data = await loadData('input/day14.example');
    let result = quadrantSafetyScore(data, 11, 7);
    expect(result).toBe(12);
  });

  test('part1', async () => {
    let data = await loadData('input/day14');
    let result = quadrantSafetyScore(data, 101, 103);
    expect(result).toBe(221142636);
  });
});
