import { loadData, nonOverlapping } from './day25';

describe('day25', () => {
  test('loadData', async () => {
    let data = await loadData('input/day25.example');
    expect(data.locks.length).toBe(2);
    expect(data.keys.length).toBe(3);
  });

  test('example1', async () => {
    let data = await loadData('input/day25.example');
    let valid = nonOverlapping(data.keys, data.locks);

    expect(valid.length).toBe(3);
  });

  test('part1', async () => {
    let data = await loadData('input/day25');
    let valid = nonOverlapping(data.keys, data.locks);

    expect(valid.length).toBe(3);
  });
});
