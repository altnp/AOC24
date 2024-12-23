import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import * as fs from 'fs/promises';

type Point = { x: number; y: number };
type RoutePoint = {
  p: Point;
  length: number;
  route: Point[];
};

async function loadData(filename: string) {
  let data = await fs.readFile(filename, 'utf-8');

  let lines = data.split('\n').map((l) => l.trim());

  let map: string[][] = [];
  let start: Point = { x: -1, y: -1 };
  let end: Point = { x: -1, y: -1 };

  for (let [i, line] of lines.entries()) {
    let row = [];
    for (let [j, c] of line.split('').entries()) {
      if (c === 'S') {
        start = { x: j, y: i };
        c = '.';
      }

      if (c === 'E') {
        end = { x: j, y: i };
        c = '.';
      }

      row.push(c);
    }

    map.push(row);
  }

  return { map, start, end };
}

function getKey({ x, y }: Point) {
  return `${x}:${y}`;
}

function findShortestValidRoute(map: string[][], start: Point, end: Point) {
  const height = map.length;
  const width = map[0].length;

  const isValidMove = ({ x, y }: Point) =>
    x > 0 && x < width - 1 && y > 0 && y < height - 1 && map[y][x] === '.';

  const visited = new Map<string, number>();
  const pqueue = new MinPriorityQueue<RoutePoint>(
    (r) => r.length + Math.abs(r.p.x - end.x) + Math.abs(r.p.y - end.y)
  );
  let minLength = Number.MAX_SAFE_INTEGER;
  let minRoute: Point[] = [];

  function traverse({ p: { x, y }, length, route }: RoutePoint) {
    if (end.x === x && end.y === y) {
      if (length < minLength) {
        minLength = length;
        minRoute = route;
      }
      return;
    }

    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    for (const { dx, dy } of directions) {
      const next = { x: x + dx, y: y + dy };
      if (isValidMove(next)) {
        const nextKey = getKey(next);
        const newCost = length + 1;

        if (!visited.has(nextKey) || visited.get(nextKey)! > newCost) {
          visited.set(nextKey, newCost);
          pqueue.enqueue({
            p: next,
            length: newCost,
            route: [...route, next],
          });
        }
      }
    }
  }

  pqueue.enqueue({
    p: start,
    length: 0,
    route: [start],
  });

  while (!pqueue.isEmpty() && minLength == Number.MAX_SAFE_INTEGER) {
    let next = pqueue.dequeue();
    traverse(next);
  }

  return { length: minLength, route: minRoute };
}

function findAllCheatPaths(
  map: string[][],
  start: Point,
  end: Point,
  minImprovement: number,
  maxCheatLength: number
) {
  const isInBounds = ({ x, y }: Point) =>
    x > 0 && x < map[0].length - 1 && y > 0 && y < map.length - 1;

  const isEmpty = ({ x, y }: Point) => map[y][x] === '.';
  const { route } = findShortestValidRoute(map, start, end);

  const routeMap = new Map<string, number>();
  for (let i = 0; i < route.length; i++) {
    routeMap.set(getKey(route[i]), i);
  }

  const validCheats = new Set<string>();

  function isValidCheat({ x, y }: Point, dx: number, dy: number) {
    let cheatEnd = { x: x + dx, y: y + dy };
    if (!routeMap.has(getKey(cheatEnd))) return;

    if (
      routeMap.get(getKey({ x, y }))! + Math.abs(dx) + Math.abs(dy) <=
      routeMap.get(getKey(cheatEnd))! - minImprovement
    ) {
      validCheats.add(`${getKey({ x, y })}::${getKey(cheatEnd)}`);
    }
  }

  for (const { x, y } of route) {
    for (let len = 2; len <= maxCheatLength; len++) {
      for (let i = 0; i <= len; i++) {
        isValidCheat({ x, y }, i, len - i);
        isValidCheat({ x, y }, -i, len - i);
        isValidCheat({ x, y }, i, -len + i);
        isValidCheat({ x, y }, -i, -len + i);
      }
    }
  }

  return validCheats.size;
}

export { loadData, findShortestValidRoute, findAllCheatPaths };
