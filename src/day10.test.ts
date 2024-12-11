import { findTrails, loadInput, sumTrailRating, sumTrailScore } from './day10';

describe('day10', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day10.example');
    expect(input).toStrictEqual([
      [8, 9, 0, 1, 0, 1, 2, 3],
      [7, 8, 1, 2, 1, 8, 7, 4],
      [8, 7, 4, 3, 0, 9, 6, 5],
      [9, 6, 5, 4, 9, 8, 7, 4],
      [4, 5, 6, 7, 8, 9, 0, 3],
      [3, 2, 0, 1, 9, 0, 1, 2],
      [0, 1, 3, 2, 9, 8, 0, 1],
      [1, 0, 4, 5, 6, 7, 3, 2],
    ]);
  });

  test('example', async () => {
    let input = await loadInput('input/day10.example');
    let score = sumTrailScore(input);
    expect(score).toBe(36);
  });

  test('example2', async () => {
    let input = await loadInput('input/day10.example');
    let score = sumTrailRating(input);
    expect(score).toBe(81);
  });

  test('sumTrailScore', async () => {
    let input = await loadInput('input/day10');
    let score = sumTrailScore(input);
    expect(score).toBe(816);
  });

  test('sumTrailRating', async () => {
    let input = await loadInput('input/day10');
    let score = sumTrailRating(input);
    expect(score).toBe(1960);
  });
});
