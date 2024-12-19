import {
  findPossibleDesignItterations,
  findPossibleDesigns,
  loadData,
} from './day19';

describe('day19', () => {
  test('loadData', async () => {
    let data = await loadData('input/day19.example');
    expect(data.patterns).toStrictEqual([
      'r',
      'wr',
      'b',
      'g',
      'bwu',
      'rb',
      'gb',
      'br',
    ]);

    expect(data.designs).toStrictEqual([
      'brwrr',
      'bggr',
      'gbbr',
      'rrbgbr',
      'ubwu',
      'bwurrg',
      'brgr',
      'bbrgwb',
    ]);
  });

  test('example', async () => {
    let data = await loadData('input/day19.example');
    let result = findPossibleDesigns(data.patterns, data.designs);
    expect(result).toBe(6);
  });

  test('part1', async () => {
    let data = await loadData('input/day19');
    let result = findPossibleDesigns(data.patterns, data.designs);
    expect(result).toBe(304);
  });

  test('examplepart2', async () => {
    let data = await loadData('input/day19.example');
    let result = findPossibleDesignItterations(data.patterns, data.designs);
    expect(result).toBe(16);
  });

  test('part2', async () => {
    let data = await loadData('input/day19');
    let result = findPossibleDesignItterations(data.patterns, data.designs);
    expect(result).toBe(705756472327497);
  });
});
