import { findLan, findTripplets, loadData } from './day23';

describe('day23', () => {
  test('loadData', async () => {
    let data = await loadData('input/day23.example');

    expect(data[0][0]).toBe('kh');
    expect(data[0][1]).toBe('tc');

    expect(data[data.length - 1][0]).toBe('td');
    expect(data[data.length - 1][1]).toBe('yn');
  });

  test('example1', async () => {
    let data = await loadData('input/day23.example');
    let tripples = findTripplets(data);
    expect(tripples.length).toBe(7);
  });

  test('part1', async () => {
    let data = await loadData('input/day23');
    let tripples = findTripplets(data);
    expect(tripples.length).toBe(1378);
  });

  test('example2', async () => {
    let data = await loadData('input/day23.example');
    let lan = findLan(data);
    expect(lan.join(',')).toBe('co,de,ka,ta');
  });

  test('part2', async () => {
    let data = await loadData('input/day23');
    let lan = findLan(data);

    expect(lan.join(',')).toBe('bs,ey,fq,fy,he,ii,lh,ol,tc,uu,wl,xq,xv');
  });
});
