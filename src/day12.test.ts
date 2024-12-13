import {
  findRegion,
  loadData,
  PlotMap,
  totalFencePrice,
  totalFencePriceWithDiscount,
} from './day12';

describe('day12', () => {
  test('loadData', async () => {
    let data = await loadData('input/day12.example');
    expect(data).toStrictEqual([
      ['A', 'A', 'A', 'A'],
      ['B', 'B', 'C', 'D'],
      ['B', 'B', 'C', 'C'],
      ['E', 'E', 'E', 'C'],
    ]);
  });

  test('findRegion', async () => {
    let data = await loadData('input/day12.example');
    let plotMap = new PlotMap(data);

    let aRegion = findRegion({ x: 0, y: 0 }, new PlotMap(data));
    let bRegion = findRegion({ x: 0, y: 1 }, new PlotMap(data));
    let dRegion = findRegion({ x: 3, y: 1 }, new PlotMap(data));
    let cRegion = findRegion({ x: 2, y: 1 }, new PlotMap(data));

    expect(aRegion.identifier).toBe('A');
    expect(aRegion.plots).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ]);
    expect(aRegion.perimeter).toBe(10);
    expect(aRegion.sides()).toBe(4);

    expect(bRegion.identifier).toBe('B');
    expect(bRegion.plots).toStrictEqual([
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
    ]);
    expect(bRegion.perimeter).toBe(8);
    expect(bRegion.sides()).toBe(4);

    expect(cRegion.identifier).toBe('C');
    expect(cRegion.plots).toStrictEqual([
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ]);
    expect(cRegion.perimeter).toBe(10);
    expect(cRegion.sides()).toBe(8);
  });

  test('example1', async () => {
    let data = await loadData('input/day12.example');
    let fencePrice = totalFencePrice(new PlotMap(data));
    expect(fencePrice).toBe(140);
  });

  test('example2', async () => {
    let data = await loadData('input/day12.example2');
    let fencePrice = totalFencePrice(new PlotMap(data));
    expect(fencePrice).toBe(772);
  });

  test('example3', async () => {
    let data = await loadData('input/day12.example3');
    let fencePrice = totalFencePrice(new PlotMap(data));
    expect(fencePrice).toBe(1930);
  });

  test('part1', async () => {
    let data = await loadData('input/day12');
    let fencePrice = totalFencePrice(new PlotMap(data));
    expect(fencePrice).toBe(1449902);
  });

  test('example1part2', async () => {
    let data = await loadData('input/day12.example');
    let fencePrice = totalFencePriceWithDiscount(new PlotMap(data));
    expect(fencePrice).toBe(80);
  });

  test('example2part2', async () => {
    let data = await loadData('input/day12.example2');
    let fencePrice = totalFencePriceWithDiscount(new PlotMap(data));
    expect(fencePrice).toBe(436);
  });

  test('example4part2', async () => {
    let data = await loadData('input/day12.example4');
    let fencePrice = totalFencePriceWithDiscount(new PlotMap(data));
    expect(fencePrice).toBe(236);
  });

  test('example5part2', async () => {
    let data = await loadData('input/day12.example5');
    let fencePrice = totalFencePriceWithDiscount(new PlotMap(data));
    expect(fencePrice).toBe(368);
  });

  test('part2', async () => {
    let data = await loadData('input/day12');
    let fencePrice = totalFencePriceWithDiscount(new PlotMap(data));
    expect(fencePrice).toBe(908042);
  });
});
