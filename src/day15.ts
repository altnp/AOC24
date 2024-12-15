import { dir } from 'console';
import * as fs from 'fs/promises';
import { stdout } from 'process';

enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

enum Obj {
  Wall = '#',
  Box = 'O',
  LeftBox = '[',
  RightBox = ']',
  Robot = '@',
  Empty = '.',
}

type Pair = { x: number; y: number };

const vectors = new Map<Direction, Pair>([
  [Direction.Up, { x: 0, y: -1 }],
  [Direction.Down, { x: 0, y: 1 }],
  [Direction.Left, { x: -1, y: 0 }],
  [Direction.Right, { x: 1, y: 0 }],
]);

async function loadData(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf8')).trim();
  let lines = data.split('\n');
  let map = [];
  let moves: Direction[] = [];

  for (let line of lines) {
    if (line.startsWith('#')) {
      map.push([...line.trim()]);
    }

    if (line.match(/^[<>v\^]/)) {
      moves.push(...[...line].map((char) => char as Direction));
    }
  }

  return { map, moves };
}

function move(map: string[][], start: Pair, direction: Direction) {
  let vector = vectors.get(direction)!;

  function shift({ x, y }: Pair): boolean {
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
      throw Error('Out of bounds somehow...');
    }

    if (map[y][x] === Obj.Wall) {
      return false;
    }

    if (map[y][x] === Obj.Empty) {
      return true;
    }

    let next = { x: x + vector.x, y: y + vector.y };
    let canShift = shift(next);
    if (canShift) {
      map[next.y][next.x] = map[y][x];
      map[y][x] = '.';
    }

    return canShift;
  }

  if (shift(start)) {
    start = { x: start.x + vector.x, y: start.y + vector.y };
  }

  return start;
}

function runSequence(map: string[][], moves: Direction[]) {
  let robotPos: Pair | null = null;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === Obj.Robot) {
        robotPos = { x, y };
        break;
      }
    }

    if (robotPos) break;
  }
  robotPos = robotPos ?? { x: 0, y: 0 };

  for (let m of moves) {
    robotPos = move(map, robotPos, m);
  }

  let score = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === Obj.Box) {
        score += y * 100 + x;
      }
    }
  }

  return score;
}

function wideMove(map: string[][], start: Pair, direction: Direction) {
  let vector = vectors.get(direction)!;

  function shiftHorizontal({ x, y }: Pair): boolean {
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
      throw Error('Out of bounds somehow...');
    }

    if (map[y][x] === Obj.Wall) {
      return false;
    }

    if (map[y][x] === Obj.Empty) {
      return true;
    }

    let next = { x: x + vector.x, y: y + vector.y };
    let canShift = shiftHorizontal(next);
    if (canShift) {
      map[next.y][next.x] = map[y][x];
      map[y][x] = '.';
    }

    return canShift;
  }

  function getKey(p: Pair) {
    return `${p.x}:${p.y}`;
  }

  function getPair(s: string) {
    let splits = s.split(':');
    return { x: parseInt(splits[0]), y: parseInt(splits[1]) };
  }

  function shiftVertical(points: Pair[]): boolean {
    if (points.length === 0) {
      return true;
    }

    let queue = new Set<string>();
    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;

      if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
        throw Error('Out of bounds somehow...');
      }

      if (map[y][x] === Obj.Wall) {
        return false;
      }

      if (map[y][x] === Obj.Empty) {
        continue;
      }

      if (map[y][x] === Obj.RightBox) {
        let next = { x: x + vector.x - 1, y: y + vector.y };
        queue.add(getKey(next));
      }

      let next = { x: x + vector.x, y: y + vector.y };
      queue.add(getKey(next));

      if (map[y][x] === Obj.LeftBox) {
        let next = { x: x + vector.x + 1, y: y + vector.y };
        queue.add(getKey(next));
      }
    }

    let canShift = shiftVertical([...queue].map((k) => getPair(k)));

    if (canShift) {
      for (let point of [...queue].map((k) => getPair(k))) {
        map[point.y][point.x] = map[point.y - vector.y][point.x - vector.x];
        map[point.y - vector.y][point.x - vector.x] = '.';
      }
    }

    return canShift;
  }

  function shift({ x, y }: Pair) {
    if (direction === Direction.Left || direction === Direction.Right) {
      return shiftHorizontal({ x, y });
    }

    return shiftVertical([{ x, y }]);
  }

  if (shift(start)) {
    start = { x: start.x + vector.x, y: start.y + vector.y };
  }

  return start;
}

function runWideSequence(map: string[][], moves: Direction[]) {
  map = widenMap(map);
  let robotPos: Pair | null = null;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === Obj.Robot) {
        robotPos = { x, y };
        break;
      }
    }

    if (robotPos) break;
  }
  robotPos = robotPos ?? { x: 0, y: 0 };

  for (let m of moves) {
    robotPos = wideMove(map, robotPos, m);
  }

  let score = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === Obj.LeftBox) {
        score += y * 100 + x;
      }
    }
  }

  return score;
}

function widenMap(map: string[][]): string[][] {
  return map.map((row) =>
    row.flatMap((c) => {
      switch (c) {
        case '#':
          return ['#', '#'];
        case '@':
          return ['@', '.'];
        case '.':
          return ['.', '.'];
        case 'O':
          return ['[', ']'];
        default:
          return [''];
      }
    })
  );
}

export {
  loadData,
  runSequence,
  runWideSequence,
  wideMove,
  widenMap,
  Direction,
  Obj,
  Pair,
};
