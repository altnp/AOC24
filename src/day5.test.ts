import {
  fixUpdate,
  loadInput,
  sumInvalidUpdates,
  sumValidUpdates,
} from './day5';

describe('day5', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day5.example');

    expect(input.orderingRules).toStrictEqual([
      [47, 53],
      [97, 13],
      [97, 61],
      [97, 47],
      [75, 29],
      [61, 13],
      [75, 53],
      [29, 13],
      [97, 29],
      [53, 29],
      [61, 53],
      [97, 53],
      [61, 29],
      [47, 13],
      [75, 47],
      [97, 75],
      [47, 61],
      [75, 61],
      [47, 29],
      [75, 13],
      [53, 13],
    ]);

    expect(input.updates).toStrictEqual([
      [75, 47, 61, 53, 29],
      [97, 61, 53, 29, 13],
      [75, 29, 13],
      [75, 97, 47, 61, 53],
      [61, 13, 29],
      [97, 13, 75, 29, 47],
    ]);
  });

  test('example', async () => {
    let input = await loadInput('input/day5.example');
    let result = sumValidUpdates(input);

    expect(result).toBe(143);
  });

  test('examplePart2', async () => {
    let input = await loadInput('input/day5.example');
    let result = sumInvalidUpdates(input);

    expect(result).toBe(123);
  });

  test('fixUpdate', () => {
    let fixed = fixUpdate(
      new Map<number, number[]>([
        [4, [1, 5]],
        [3, [4]],
      ]),
      [9, 10, 1, 11, 4, 3]
    );

    expect(fixed).toStrictEqual([9, 10, 11, 3, 4, 1]);
  });
});
