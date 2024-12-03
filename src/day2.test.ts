import { countSafeDampenedReports, countSafeReports, loadInput } from './day2';

describe('day2', () => {
  test('loadInput', async () => {
    expect(await loadInput('input/day2.example')).toStrictEqual([
      [7, 6, 4, 2, 1],
      [1, 2, 7, 8, 9],
      [9, 7, 6, 2, 1],
      [1, 3, 2, 4, 5],
      [8, 6, 4, 4, 1],
      [1, 3, 6, 7, 9],
    ]);
  });

  test('countSafeReportsExample', async () => {
    let input = await loadInput('input/day2.example');
    let result = countSafeReports(input);
    expect(result).toBe(2);
  });

  test('countSafeReportsDuplicate', async () => {
    let result = countSafeReports([[9, 10, 12, 13, 13]]);
    expect(result).toBe(0);
  });

  test('countSafeDapenedReportsExample', async () => {
    let input = await loadInput('input/day2.example');
    let result = countSafeDampenedReports(input);
    expect(result).toBe(4);
  });

  test('countSafeDapenedReportsInvalidIndex1', async () => {
    let result = countSafeDampenedReports([[5, 6, 4, 3, 2, 1]]);
    expect(result).toBe(1);
  });

  test('countSafeDapenedReportsInvalidIndex0', async () => {
    let result = countSafeDampenedReports([[6, 4, 5, 6, 7, 8]]);
    expect(result).toBe(1);
  });

  test('countSafeDapenedReportsInvalidIndex3', async () => {
    let result = countSafeDampenedReports([[1, 2, 3, 10, 4, 5]]);
    expect(result).toBe(1);
  });

  test('countSafeDapenedReportsInvalidIndex2', async () => {
    let result = countSafeDampenedReports([[1, 3, 2, 4, 5]]);
    expect(result).toBe(1);
  });
});
