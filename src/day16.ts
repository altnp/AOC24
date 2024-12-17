import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import { openAsBlob } from 'fs';
import * as fs from 'fs/promises';

enum Direction {
  North = 0,
  South = 1,
  West = 2,
  East = 3,
}

const vectors = new Map<Direction, { x: number; y: number }>([
  [Direction.North, { x: 0, y: -1 }],
  [Direction.South, { x: 0, y: 1 }],
  [Direction.West, { x: -1, y: 0 }],
  [Direction.East, { x: 1, y: 0 }],
]);

type Point = { x: number; y: number };
type Position = { point: Point; direction: Direction };

async function loadData(fileName: string) {
  let data = await (await fs.readFile(fileName, 'utf-8')).trim();

  let map = [];
  let start = { x: -1, y: -1 };
  let end = { x: -1, y: -1 };

  for (let [r, line] of data
    .split('\n')
    .map((d) => d.trim())
    .entries()) {
    let row = [];
    for (let [c, char] of Array.from(line).entries()) {
      if (char === 'S') {
        start = { x: c, y: r };
        row.push('.');
        continue;
      }

      if (char === 'E') {
        end = { x: c, y: r };
        row.push('.');
        continue;
      }

      row.push(char);
    }

    map.push(row);
  }

  return { map, start, end };
}

function findPath(map: string[][], start: Point, end: Point) {
  const pqueue = new MinPriorityQueue<{ score: number; pos: Position }>(
    (v) => v.score
  );

  const visited = new Map<string, number>();
  let minScore = Number.MAX_VALUE;

  function getKey(pos: Position) {
    return `${pos.point.x}:${pos.point.y}:${pos.direction}`;
  }

  function canMoveInto({ x, y }: Point) {
    return (
      x >= 0 &&
      x < map[0].length &&
      y >= 0 &&
      y < map.length &&
      map[y][x] != '#'
    );
  }

  function search(score: number, { x, y }: Point, direction: Direction) {
    let key = getKey({ point: { x, y }, direction });

    if (visited.has(key) && visited.get(key)! <= score) {
      return;
    }

    if (x == end.x && y == end.y) {
      if (score < minScore) {
        minScore = score;
      }
      return;
    }

    visited.set(key, score);
    let vector = vectors.get(direction)!;

    let forward = { x: x + vector.x, y: y + vector.y };
    if (canMoveInto(forward)) {
      pqueue.enqueue({ score: score + 1, pos: { point: forward, direction } });
    }

    const directions = [
      Direction.North,
      Direction.East,
      Direction.South,
      Direction.West,
    ];

    const index = directions.indexOf(direction);
    const validDirections = [
      directions[(index + 1) % directions.length],
      directions[(index - 1 + directions.length) % directions.length],
    ];

    for (let d of validDirections) {
      pqueue.enqueue({
        score: score + 1000,
        pos: { point: { x, y }, direction: d },
      });
    }

    return;
  }

  pqueue.enqueue({
    score: 0,
    pos: { point: start, direction: Direction.East },
  });

  while (!pqueue.isEmpty()) {
    const next = pqueue.dequeue();
    search(next.score, next.pos.point, next.pos.direction);
  }

  return minScore;
}

function findSteps(map: string[][], start: Point, end: Point) {
  const pqueue = new MinPriorityQueue<{
    score: number;
    steps: Point[];
    pos: Position;
  }>((v) => v.score);

  const visited = new Map<string, number>();
  let minScore = Number.MAX_VALUE;
  let onBestPath = new Set<string>();

  function getKey(pos: Position) {
    return `${pos.point.x}:${pos.point.y}:${pos.direction}`;
  }

  function canMoveInto({ x, y }: Point) {
    return (
      x >= 0 &&
      x < map[0].length &&
      y >= 0 &&
      y < map.length &&
      map[y][x] != '#'
    );
  }

  function search(
    score: number,
    steps: Point[],
    { x, y }: Point,
    direction: Direction
  ) {
    let key = getKey({ point: { x, y }, direction });

    if (visited.has(key) && visited.get(key)! < score) {
      return;
    }

    if (x == end.x && y == end.y) {
      if (score <= minScore) {
        minScore = score;
        steps.map((s) => `${s.x},${s.y}`).forEach((s) => onBestPath.add(s));
      }
      return;
    }

    visited.set(key, score);
    let vector = vectors.get(direction)!;

    let forward = { x: x + vector.x, y: y + vector.y };
    if (canMoveInto(forward)) {
      pqueue.enqueue({
        score: score + 1,
        steps: [...steps, forward],
        pos: { point: forward, direction },
      });
    }

    const directions = [
      Direction.North,
      Direction.East,
      Direction.South,
      Direction.West,
    ];

    const index = directions.indexOf(direction);
    const validDirections = [
      directions[(index + 1) % directions.length],
      directions[(index - 1 + directions.length) % directions.length],
    ];

    for (let d of validDirections) {
      pqueue.enqueue({
        score: score + 1000,
        steps,
        pos: { point: { x, y }, direction: d },
      });
    }

    return;
  }

  pqueue.enqueue({
    score: 0,
    steps: [start],
    pos: { point: start, direction: Direction.East },
  });

  while (!pqueue.isEmpty()) {
    const next = pqueue.dequeue();
    search(next.score, next.steps, next.pos.point, next.pos.direction);
  }

  return onBestPath.size;
}

export { loadData, findPath, findSteps, Point };
