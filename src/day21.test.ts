import {
  findShortestPaths,
  findRecursiveInput,
  numPad,
  createKeyPads,
} from './day21';

describe('day21', () => {
  test('findPath', () => {
    let result = findShortestPaths(
      numPad,
      new Map<string, string[][]>(),
      { x: 2, y: 3 },
      { x: 1, y: 1 }
    );
    expect(result[0].length).toBe(2);
  });

  test('findInvalidPath', () => {
    let result = findShortestPaths(
      numPad,
      new Map<string, string[][]>(),
      { x: 2, y: 3 },
      { x: 0, y: 3 }
    );
    expect(result.length).toBe(0);
  });

  test('findEmptyPath', () => {
    let result = findShortestPaths(
      numPad,
      new Map<string, string[][]>(),
      { x: 1, y: 1 },
      { x: 1, y: 1 }
    );
    expect(result.length).toBe(1);
  });

  test('findRecursiveInput', () => {
    let keyPads = createKeyPads(1);
    let result = findRecursiveInput(keyPads, '029A'.split(''));
    expect(result).toBe(68);
    result = findRecursiveInput(keyPads, '980A'.split(''));
    expect(result).toBe(60);
    result = findRecursiveInput(keyPads, '179A'.split(''));
    expect(result).toBe(68);
    result = findRecursiveInput(keyPads, '456A'.split(''));
    expect(result).toBe(64);
    result = findRecursiveInput(keyPads, '379A'.split(''));
    expect(result).toBe(64);
  });

  test('part1', () => {
    let keyPads = createKeyPads(1);
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

    let x = 593 * 74 + 508 * 72 + 386 * 68 + 459 * 64 + 246 * 70;
  });
});
