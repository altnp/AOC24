import {
  compress,
  compressedCheckSum,
  contiguousCompress,
  contiguousCompressedCheckSum,
  loadInput,
  parseDiskMap,
} from './day9';

describe('day9', () => {
  test('loadInput', async () => {
    let input = await loadInput('input/day9.example');
    expect(input).toBe('2333133121414131402');
  });

  test('example', async () => {
    let input = await loadInput('input/day9.example');
    let { diskMap } = parseDiskMap(input);
    compress(diskMap);

    let result = compressedCheckSum(input);
    expect(result).toBe(1928);
  });

  test('part1', async () => {
    let input = await loadInput('input/day9');
    let { diskMap } = parseDiskMap(input);
    compress(diskMap);

    let result = compressedCheckSum(input);
    expect(result).toBe(6262891638328);
  });

  test('example2', async () => {
    let input = await loadInput('input/day9.example');

    let result = contiguousCompressedCheckSum(input);
    expect(result).toBe(2858);
  });

  test('part2', async () => {
    let input = await loadInput('input/day9');

    let result = contiguousCompressedCheckSum(input);
    expect(result).toBe(6287317016845);
  });
});
