import { MinPriorityQueue } from '@datastructures-js/priority-queue';

type Pair = { x: number; y: number };

type KeyPad = {
  name: string;
  keyPad: string[][];
  currentKey: string;
  keyMap: Map<string, Pair>;
  cache: Map<string, string[][]>;
};

const numPad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['_', '0', 'A'],
];

const numPadMap = new Map<string, Pair>(
  numPad.flatMap((row, y) => row.map((char, x) => [char, { x, y }]))
);

const directionPad = [
  ['_', '^', 'A'],
  ['<', 'v', '>'],
];

const directionPadMap = new Map<string, Pair>(
  directionPad.flatMap((row, y) => row.map((char, x) => [char, { x, y }]))
);

enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

function getDelta(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case Direction.Up:
      return { dx: 0, dy: -1 };
    case Direction.Down:
      return { dx: 0, dy: 1 };
    case Direction.Left:
      return { dx: -1, dy: 0 };
    case Direction.Right:
      return { dx: 1, dy: 0 };
  }
}

function findShortestPaths(
  keyPad: string[][],
  cache: Map<string, string[][]>,
  start: Pair,
  target: Pair
) {
  let cacheKey = `${start.x},${start.y}:${target.x},${target.y}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const isValidButton = ({ x, y }: Pair) => {
    return (
      x >= 0 &&
      x < keyPad[0].length &&
      y >= 0 &&
      y < keyPad.length &&
      keyPad[y][x] != '_'
    );
  };

  const key = ({ x, y }: Pair) => `${x},${y}`;

  type Route = { route: Pair[]; directions: string[] };
  const pqueue = new MinPriorityQueue<Route>((r) => r.route.length);

  pqueue.enqueue({ route: [start], directions: [] });

  let visited = new Map<string, number>();
  let validDirections = [];

  while (!pqueue.isEmpty()) {
    let current = pqueue.dequeue();
    let { x, y } = current.route[current.route.length - 1];

    if (x == target.x && y == target.y) {
      validDirections.push(current.directions);
      continue;
    }

    for (let d of [
      Direction.Up,
      Direction.Down,
      Direction.Left,
      Direction.Right,
    ]) {
      let { dx, dy } = getDelta(d);
      let next = { x: x + dx, y: y + dy };
      let nextKey = key(next);
      if (
        (isValidButton(next) && !visited.has(nextKey)) ||
        visited.get(nextKey)! >= current.route.length + 1
      ) {
        visited.set(nextKey, current.route.length + 1);
        pqueue.enqueue({
          route: [...current.route, next],
          directions: [...current.directions, d],
        });
      }
    }
  }

  const minChanges = validDirections.reduce(
    (minChanges, direction) =>
      Math.min(
        minChanges,
        direction.reduce(
          (changes, current, index, array) =>
            index > 0 && current !== array[index - 1] ? changes + 1 : changes,
          0
        )
      ),
    Number.MAX_SAFE_INTEGER
  );

  const filteredDirections = validDirections.filter((direction) => {
    const changes = direction.reduce(
      (changes, current, index, array) =>
        index > 0 && current !== array[index - 1] ? changes + 1 : changes,
      0
    );
    return changes === minChanges;
  });

  cache.set(cacheKey, filteredDirections);
  return filteredDirections;
}

function findRecursiveInput(keyPads: KeyPad[], code: string[]) {
  function findInputs(keyPad: KeyPad, sequence: string[]) {
    if (sequence.length === 0) {
      return [[]];
    }

    let cacheKey = `${keyPad.currentKey}+${sequence.join('')}`;
    if (keyPad.cache.has(cacheKey)) {
      return keyPad.cache.get(cacheKey)!;
    }

    let targetKey = sequence.shift()!;
    let target = keyPad.keyMap.get(targetKey)!;
    let startKey = keyPad.currentKey;
    let start = keyPad.keyMap.get(keyPad.currentKey)!;

    let paths = findShortestPaths(keyPad.keyPad, keyPad.cache, start, target);

    keyPad.currentKey = targetKey;
    let subSequencePaths = findInputs(keyPad, sequence);

    let result: string[][] = [];
    subSequencePaths.forEach((sp) => {
      paths.forEach((p) => result.push([...p, 'A', ...sp]));
    });

    keyPad.cache.set(cacheKey, result);
    sequence.unshift(targetKey);
    keyPad.currentKey = startKey;
    return result;
  }

  function findInputsForAllSequences(keyPad: KeyPad, sequences: string[][]) {
    let allInputs: string[][] = [];
    let minLength = Number.MAX_SAFE_INTEGER;
    for (let sequence of sequences) {
      let seqInputs = findInputs(keyPad, sequence);
      let seqMin = Math.min(...seqInputs.map((s) => s.length));
      allInputs.push(...seqInputs);
      if (minLength > seqMin) {
        minLength = seqMin;
      }
    }

    return allInputs.filter((i) => i.length === minLength);
  }

  let sequences = [code];
  for (let [i, keyPad] of keyPads.entries()) {
    sequences = findInputsForAllSequences(keyPad, sequences);
  }

  return sequences[0].length;
}

const directionPadCache = new Map<string, string[][]>();
const createKeyPads = (roboCount: number) => [
  {
    name: 'depressurized',
    keyPad: numPad,
    currentKey: 'A',
    keyMap: numPadMap,
    cache: new Map<string, string[][]>(),
  },
  ...Array.from({ length: roboCount }, (_, i) => ({
    name: `radiation-${i + 1}`,
    keyPad: directionPad,
    currentKey: 'A',
    keyMap: directionPadMap,
    cache: directionPadCache,
  })),
  {
    name: 'freezing',
    keyPad: directionPad,
    currentKey: 'A',
    keyMap: directionPadMap,
    cache: directionPadCache,
  },
];

export {
  findShortestPaths,
  findRecursiveInput,
  createKeyPads,
  numPad,
  directionPad,
};
