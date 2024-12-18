import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import * as fs from 'fs/promises';

type Pair = { x: number; y: number };
type PathPart = { distance: number; current: Pair; path: Pair[] };

async function loadData(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf8')).trim();
  let pairs = [];

  for (let line of data.split('\n').map((d) => d.trim())) {
    let [, x, y] = line.match(/(\d+),(\d+)/)!;

    pairs.push({ x: parseInt(x), y: parseInt(y) });
  }

  return pairs;
}

function findPath(corruptions: Pair[], xBounds: number, yBounds: number) {
  let start = { x: 0, y: 0 };
  let end = { x: xBounds - 1, y: yBounds - 1 };

  let corruptionsSet = new Set<string>(corruptions.map((c) => `${c.x}:${c.y}`));
  let searchQueue = new MinPriorityQueue<PathPart>((p) => p.distance);
  let visited = new Map<string, number>();
  let minSteps = -1;
  let minPath: Pair[] = [];

  function canVisit(point: Pair) {
    return (
      point.x >= 0 &&
      point.x < xBounds &&
      point.y >= 0 &&
      point.y < yBounds &&
      !corruptionsSet.has(`${point.x}:${point.y}`)
    );
  }

  function traverse({ distance: distance, current: { x, y }, path }: PathPart) {
    if (minSteps > 0) {
      return;
    }

    let key = `${x}:${y}`;
    if (visited.has(key) && visited.get(key)! <= distance) {
      return;
    }
    visited.set(key, distance);

    if (x === end.x && y === end.y) {
      minSteps = distance;
      minPath = path;
      return;
    }

    let directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    for (let direction of directions) {
      let next = { x: x + direction.x, y: y + direction.y };
      if (canVisit(next)) {
        searchQueue.enqueue({
          distance: distance + 1,
          current: next,
          path: [...path, next],
        });
      }
    }
  }

  searchQueue.enqueue({ distance: 0, current: start, path: [] });
  while (!searchQueue.isEmpty()) {
    let next = searchQueue.dequeue();
    traverse(next);
  }

  return minPath;
}

function findLastEscape(corruptions: Pair[], xBounds: number, yBounds: number) {
  let getKey = (p: Pair) => `${p.x}:${p.y}`;

  let currentPath = new Set<string>(
    findPath([], xBounds, yBounds).map((p) => getKey(p))
  );

  for (let i = 0; i < corruptions.length; i++) {
    if (currentPath.has(getKey(corruptions[i]))) {
      currentPath = new Set<string>(
        findPath(corruptions.slice(0, i + 1), xBounds, yBounds).map((p) =>
          getKey(p)
        )
      );

      if (currentPath.size === 0) {
        return corruptions[i];
      }
    }
  }

  return corruptions[corruptions.length - 1];
}

export { loadData, findPath, findLastEscape };
