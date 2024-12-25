import {
  calcOutput,
  findInvalidAdders,
  hasValidHalfAdder,
  loadData,
  Operator,
} from './day24';

describe('day24', () => {
  test('loadData', async () => {
    let data = await loadData('input/day24.example2');

    expect(data.wires.get('x00')).toBe(true);
    expect(data.wires.get('x04')).toBe(false);
    expect(data.wires.get('y04')).toBe(true);

    expect(data.gates[data.gates.length - 1].operator).toBe(Operator.Or);
    expect(data.gates[data.gates.length - 1].input1).toBe('tnw');
    expect(data.gates[data.gates.length - 1].input2).toBe('pbm');
    expect(data.gates[data.gates.length - 1].output).toBe('gnj');
  });

  test('example', async () => {
    let data = await loadData('input/day24.example');
    let result = calcOutput(data.wires, data.gates);

    expect(result.value).toBe(4);
  });

  test('example2', async () => {
    let data = await loadData('input/day24.example2');
    let result = calcOutput(data.wires, data.gates);

    expect(result.value).toBe(2024);
  });

  test('part1', async () => {
    let data = await loadData('input/day24');
    let result = calcOutput(data.wires, data.gates);

    expect(result.value).toBe(41324968993486);
  });

  test('part2', async () => {
    let { gates } = await loadData('input/day24');
    let result = findInvalidAdders(gates).join(',');

    expect(result).toBe('');
  });
});
