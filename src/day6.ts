import * as fs from 'fs/promises';

enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

let directionMap: Record<string, Direction> = {
  '^': Direction.Up,
  '>': Direction.Right,
  v: Direction.Down,
  '<': Direction.Left,
};

function nextDirection(direction: Direction): Direction {
  return (direction + 1) % 4;
}

async function loadInput(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf-8')).trim();
  let lines = data.split('\n');

  return lines.map((line) => [...line]);
}

function findTravelDistance(map: string[][]) {
  let visited = new Set<string>();
  let totalRows = map.length;
  let totalColumns = map[0].length;
  let { objectsByRow, objectsByColumn, start } = parseMap(map);

  let exited = false;
  let pos = start;
  while (!exited) {
    let [row, column, direction] = pos;
    let nextPos = [row, column, direction];
    switch (direction) {
      case Direction.Up:
        {
          let nextObject = objectsByColumn
            .get(column)!
            .filter((v) => v < row)
            .reduce((max, v) => (v > max ? v : max), -1);

          if (nextObject === -1) exited = true;
          nextPos = [nextObject + 1, column, nextDirection(direction)];

          let visitedRow = row;
          while (visitedRow > nextObject) {
            visited.add(`${visitedRow},${column}`);
            visitedRow--;
          }
        }
        break;
      case Direction.Right:
        {
          let nextObject = objectsByRow
            .get(row)!
            .filter((v) => v > column)
            .reduce((max, v) => (v < max ? v : max), totalColumns + 1);

          if (nextObject === totalColumns + 1) exited = true;
          nextPos = [row, nextObject - 1, nextDirection(direction)];

          let visitedColumn = column;
          while (visitedColumn < nextObject) {
            visited.add(`${row},${visitedColumn}`);
            visitedColumn++;
          }
        }
        break;
      case Direction.Down:
        {
          let nextObject = objectsByColumn
            .get(column)!
            .filter((v) => v > row)
            .reduce((max, v) => (v < max ? v : max), totalRows + 1);

          if (nextObject === totalRows + 1) exited = true;
          nextPos = [nextObject - 1, column, nextDirection(direction)];

          let visitedRow = row;
          while (visitedRow < nextObject) {
            visited.add(`${visitedRow},${column}`);
            visitedRow++;
          }
        }
        break;
      case Direction.Left:
        {
          let nextObject = objectsByRow
            .get(row)!
            .filter((v) => v < column)
            .reduce((max, v) => (v > max ? v : max), -1);

          if (nextObject === -1) exited = true;
          nextPos = [row, nextObject + 1, nextDirection(direction)];

          let visitedColumn = column;
          while (visitedColumn > nextObject) {
            visited.add(`${row},${visitedColumn}`);
            visitedColumn--;
          }
        }
        break;
    }

    pos = nextPos;
  }

  return visited.size - 1;
}

function findLoops(map: string[][]) {
  let totalRows = map.length;
  let totalColumns = map[0].length;
  let loops = 0;
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalColumns; c++) {
      if (map[r][c] === '.') {
        map[r][c] = '#';
        if (!exits(map)) {
          loops++;
        }
        map[r][c] = '.';
      }
    }
  }

  return loops;
}

function exits(map: string[][]) {
  let visited = new Set<string>();
  let totalRows = map.length;
  let totalColumns = map[0].length;
  let { objectsByRow, objectsByColumn, start } = parseMap(map);

  let exited = false;
  let pos = start;
  while (!exited) {
    let [row, column, direction] = pos;
    let nextPos = [row, column, direction];
    switch (direction) {
      case Direction.Up:
        {
          let nextObject = objectsByColumn
            .get(column)!
            .filter((v) => v < row)
            .reduce((max, v) => (v > max ? v : max), -1);

          if (nextObject === -1) return true;
          nextPos = [nextObject + 1, column, nextDirection(direction)];
        }
        break;
      case Direction.Right:
        {
          let nextObject = objectsByRow
            .get(row)!
            .filter((v) => v > column)
            .reduce((max, v) => (v < max ? v : max), totalColumns + 1);

          if (nextObject === totalColumns + 1) return true;
          nextPos = [row, nextObject - 1, nextDirection(direction)];
        }
        break;
      case Direction.Down:
        {
          let nextObject = objectsByColumn
            .get(column)!
            .filter((v) => v > row)
            .reduce((max, v) => (v < max ? v : max), totalRows + 1);

          if (nextObject === totalRows + 1) return true;
          nextPos = [nextObject - 1, column, nextDirection(direction)];
        }
        break;
      case Direction.Left:
        {
          let nextObject = objectsByRow
            .get(row)!
            .filter((v) => v < column)
            .reduce((max, v) => (v > max ? v : max), -1);

          if (nextObject === -1) return true;
          nextPos = [row, nextObject + 1, nextDirection(direction)];
        }
        break;
    }

    if (visited.has(nextPos.toString())) return false;
    visited.add(nextPos.toString());

    pos = nextPos;
  }

  return true;
}

function parseMap(map: string[][]) {
  let objectsByRow = new Map<number, number[]>();
  let objectsByColumn = new Map<number, number[]>();

  let start = [0, 0, Direction.Up];
  for (let r = 0; r < map.length; r++) {
    objectsByRow.set(r, []);
  }
  for (let c = 0; c < map[0].length; c++) {
    objectsByColumn.set(c, []);
  }

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === '#') {
        objectsByRow.set(r, [...(objectsByRow.get(r) ?? []), c]);
        objectsByColumn.set(c, [...(objectsByColumn.get(c) ?? []), r]);
      }

      let direction = directionMap[map[r][c]];
      if (direction != undefined) {
        start = [r, c, direction];
      }
    }
  }

  return { objectsByRow, objectsByColumn, start };
}

async function main() {
  let input = await loadInput('input/day6.example');
  let distance = findLoops(input);

  console.log(distance);
}

export { loadInput, findTravelDistance, parseMap, Direction, main, findLoops };
