import {
  Direction,
  loadData,
  runSequence,
  runWideSequence,
  wideMove,
} from './day15';

describe('day15', () => {
  test('loadData', async () => {
    let { map, moves } = await loadData('input/day15.example');
    expect(map).toStrictEqual([
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', '.', 'O', '.', '.', 'O', '.', 'O', '#'],
      ['#', '.', '.', '.', '.', '.', '.', 'O', '.', '#'],
      ['#', '.', 'O', 'O', '.', '.', 'O', '.', 'O', '#'],
      ['#', '.', '.', 'O', '@', '.', '.', 'O', '.', '#'],
      ['#', 'O', '#', '.', '.', 'O', '.', '.', '.', '#'],
      ['#', 'O', '.', '.', 'O', '.', '.', 'O', '.', '#'],
      ['#', '.', 'O', 'O', '.', 'O', '.', 'O', 'O', '#'],
      ['#', '.', '.', '.', '.', 'O', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ]);

    expect(moves[0]).toBe('<');
    expect(moves[moves.length - 1]).toBe('^');
    expect(moves.length).toBe(700);
  });

  test('example2', async () => {
    let { map, moves } = await loadData('input/day15.example2');
    let sum = runSequence(map, moves);
    expect(sum).toBe(2028);
  });

  test('example1', async () => {
    let { map, moves } = await loadData('input/day15.example');
    let sum = runSequence(map, moves);
    expect(sum).toBe(10092);
  });

  test('part1', async () => {
    let { map, moves } = await loadData('input/day15');
    let sum = runSequence(map, moves);
    expect(sum).toBe(1511865);
  });

  test('example1part2', async () => {
    let { map, moves } = await loadData('input/day15.example');
    let sum = runWideSequence(map, moves);
    expect(sum).toBe(9021);
  });

  test('example3', async () => {
    let { map, moves } = await loadData('input/day15.example3');
    let sum = runWideSequence(map, moves);
    expect(sum).toBe(618);
  });

  test('wideMove', () => {
    let map = [
      ['#', '#', '#', '#', '#', '#'],
      ['#', '.', '.', '@', '.', '#'],
      ['#', '.', '[', ']', '.', '#'],
      ['#', '.', '.', '[', ']', '#'],
      ['#', '#', '.', '[', ']', '#'],
      ['#', '.', '[', ']', '.', '#'],
      ['#', '.', '#', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '#', '#'],
    ];

    let result = wideMove(map, { x: 3, y: 1 }, Direction.Down);
  });

  test('part2', async () => {
    let { map, moves } = await loadData('input/day15');
    let sum = runWideSequence(map, moves);
    expect(sum).toBe(1519991);
  });
});
