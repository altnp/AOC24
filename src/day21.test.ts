import exp from 'constants';
import {
  findShortestPaths,
  findRecursiveInput,
  numPad,
  createKeyPads,
  numPadMap,
} from './day21';

describe('day21', () => {
  test('findPath', () => {
    let result = findShortestPaths(
      numPad,
      new Map<string, string[]>(),
      { x: 2, y: 3 },
      { x: 1, y: 1 }
    );
    expect(result.length).toBe(2);
  });

  test('findInvalidPath', () => {
    let result = findShortestPaths(
      numPad,
      new Map<string, string[]>(),
      { x: 2, y: 3 },
      { x: 0, y: 3 }
    );
    expect(result.length).toBe(0);
  });

  test('findEmptyPath', () => {
    let result = findShortestPaths(
      numPad,
      new Map<string, string[]>(),
      { x: 1, y: 1 },
      { x: 1, y: 1 }
    );
    expect(result.length).toBe(1);
  });

  test('findRecursiveInput', () => {
    let keyPads = createKeyPads(2);
    let sum = 0;
    let result = findRecursiveInput(keyPads, '029A'.split(''));
    expect(result).toBe(68);
    sum += 29 * result;
    result = findRecursiveInput(keyPads, '980A'.split(''));
    expect(result).toBe(60);
    sum += 980 * result;
    result = findRecursiveInput(keyPads, '179A'.split(''));
    expect(result).toBe(68);
    sum += 179 * result;
    result = findRecursiveInput(keyPads, '456A'.split(''));
    expect(result).toBe(64);
    sum += 456 * result;
    result = findRecursiveInput(keyPads, '379A'.split(''));
    expect(result).toBe(64);
    sum += 379 * result;

    expect(sum).toBe(126384);
  });

  test('part1', () => {
    let keyPads = createKeyPads(2);
    let result = findRecursiveInput(keyPads, '593A'.split(''));
    expect(result).toBe(74);
    result = findRecursiveInput(keyPads, '508A'.split(''));
    expect(result).toBe(72);
    result = findRecursiveInput(keyPads, '386A'.split(''));
    expect(result).toBe(68);
    result = findRecursiveInput(keyPads, '459A'.split(''));
    expect(result).toBe(74);
    result = findRecursiveInput(keyPads, '246A'.split(''));
    expect(result).toBe(70);

    expect(593 * 74 + 508 * 72 + 386 * 68 + 459 * 74 + 246 * 70).toBe(157892);
  });

  test('part2', () => {
    let sum = 0;
    let keyPads = createKeyPads(25);
    let result = findRecursiveInput(keyPads, '593A'.split(''));
    expect(result).toBe(93831469524);
    sum += 593 * result;
    result = findRecursiveInput(keyPads, '508A'.split(''));
    expect(result).toBe(86475783012);
    sum += 508 * result;
    result = findRecursiveInput(keyPads, '386A'.split(''));
    expect(result).toBe(86475783008);
    sum += 386 * result;
    result = findRecursiveInput(keyPads, '459A'.split(''));
    expect(result).toBe(90594397580);
    sum += 459 * result;
    result = findRecursiveInput(keyPads, '246A'.split(''));
    expect(result).toBe(91387668326);
    sum += 246 * result;

    expect(sum).toBeLessThan(223951999210460);
    expect(sum).toBe(197015606336332);
  });
});
