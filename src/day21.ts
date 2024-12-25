import { MinPriorityQueue } from '@datastructures-js/priority-queue';

type Pair = { x: number; y: number };

type KeyPad = {
  name: string;
  keyPad: string[][];
  currentKey: string;
  keyMap: Map<string, Pair>;
  cache: Map<string, string[]>;
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
  cache: Map<string, string[]>,
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

  let filteredDirections = validDirections.filter((direction) => {
    const changes = direction.reduce(
      (changes, current, index, array) =>
        index > 0 && current !== array[index - 1] ? changes + 1 : changes,
      0
    );
    return changes === minChanges;
  });

  // let result = filteredDirections.reduce((pv, v, i) => {
  //   if (i === 0) return v;

  //   let currentKey = directionPadMap.get(v[v.length - 1])!;
  //   let previousKey = directionPadMap.get(pv[pv.length - 1])!;

  //   let a = directionPadMap.get('A')!;
  //   let currentDelta =
  //     Math.abs(currentKey.x - a.x) + Math.abs(currentKey.y - a.y);
  //   let prevDelta =
  //     Math.abs(previousKey.x - a.x) + Math.abs(previousKey.y - a.y);

  //   return currentDelta < prevDelta ? v : pv;
  // }, []);

  let result = filteredDirections[0];
  if (filteredDirections.length > 1) {
    result = filteredDirections.filter((f) => {
      let d = [...f];

      let i = d.indexOf('<');
      if (i !== -1 && i !== 0) return false;
      d = d.filter((d) => d != '<');

      i = d.indexOf('^');
      if (i !== -1 && i !== 0) return false;
      d = d.filter((d) => d != '^');

      i = d.indexOf('v');
      if (i !== -1 && i !== 0) return false;
      d = d.filter((d) => d != 'v');

      i = d.indexOf('>');
      if (i !== -1 && i !== 0) return false;
      d = d.filter((d) => d != '>');

      return true;
    })[0];
  }

  cache.set(cacheKey, result);
  return result;
}

function findRecursiveInput(keyPads: KeyPad[], code: string[]) {
  function findInputs(keyPad: KeyPad, sequenceMap: Map<string, number>) {
    let result = new Map<string, number>();
    const mergeResult = (key: string, value: number) =>
      result.set(key, result.has(key) ? result.get(key)! + value : value);

    let sequenceQueue = [...sequenceMap.entries()];

    while (sequenceQueue.length > 0) {
      let [sequenceKey, count] = sequenceQueue.shift()!;
      let sequence = sequenceKey.split('');

      while (sequence.length > 0) {
        let targetKey = sequence.shift()!;
        let target = keyPad.keyMap.get(targetKey)!;
        let startKey = keyPad.currentKey;
        let start = keyPad.keyMap.get(keyPad.currentKey)!;

        let path = findShortestPaths(
          keyPad.keyPad,
          keyPad.cache,
          start,
          target
        );

        mergeResult([...path, 'A'].join(''), count);
        keyPad.currentKey = targetKey;
      }
    }

    return result;
  }

  let sum = 0;
  for (let d of code) {
    let sequenceMap = new Map<string, number>([[d, 1]]);
    for (let [i, keyPad] of keyPads.entries()) {
      sequenceMap = findInputs(keyPad, sequenceMap);
    }
    sum += Array.from(sequenceMap.entries()).reduce(
      (sum, [sequence, value]) => sum + value * sequence.length,
      0
    );
    keyPads[0].currentKey = d;
  }

  return sum;
}
const directionPadCache = new Map<string, string[]>();
const createKeyPads = (roboCount: number) => [
  {
    name: 'numeric',
    keyPad: numPad,
    currentKey: 'A',
    keyMap: numPadMap,
    cache: new Map<string, string[]>(),
  },
  ...Array.from({ length: roboCount }, (_, i) => ({
    name: `directional-${i + 1}`,
    keyPad: directionPad,
    currentKey: 'A',
    keyMap: directionPadMap,
    cache: directionPadCache,
  })),
];

export {
  findShortestPaths,
  findRecursiveInput,
  createKeyPads,
  numPad,
  directionPad,
  numPadMap,
};
