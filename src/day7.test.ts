import {
  isValidEquation,
  isValidEquationPart2,
  loadInput,
  totalCalibrationResults,
  totalCalibrationResultsPart2,
} from './day7';

describe('day7', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day7.example');
    expect(input[0].total).toBe(190);
    expect(input[0].operands).toStrictEqual([10, 19]);

    expect(input[8].total).toBe(292);
    expect(input[8].operands).toStrictEqual([11, 6, 16, 20]);
  });

  test('example', async () => {
    let input = await loadInput('input/day7.example');
    let result = totalCalibrationResults(input);

    expect(result).toBe(3749);
  });

  test('isValidEquation', async () => {
    let input = await loadInput('input/day7.example');
    let result = isValidEquation(input[1]);

    expect(result).toBe(true);
  });

  test('day7part1', async () => {
    let input = await loadInput('input/day7');
    let result = totalCalibrationResults(input);

    expect(result).toBe(4122618559853);
  });

  test('isValidEquationPart2', async () => {
    let input = await loadInput('input/day7.example');
    let result = isValidEquationPart2(input[3]);

    expect(result).toBe(true);
  });

  test('examplePart2', async () => {
    let input = await loadInput('input/day7.example');
    let result = totalCalibrationResultsPart2(input);

    expect(result).toBe(11387);
  });

  test('day7part1', async () => {
    let input = await loadInput('input/day7');
    let result = totalCalibrationResultsPart2(input);

    expect(result).toBe(227615740238334);
  });
});
