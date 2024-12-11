import * as fs from 'fs/promises';
import { deflateSync } from 'zlib';

type point = { x: number; y: number };

async function loadInput(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf-8')).trim().split('\n');
  return data.map((r) => [...r].map((n) => parseInt(n)));
}

function findTrails(start: point, topographicMap: number[][]) {
  let height = topographicMap.length;
  let width = topographicMap[0].length;
  let trails: point[][] = [];

  function dfs({ x, y }: point, visited: point[]) {
    if (visited.filter((v) => v.x == x && v.y == y).length > 0) {
      return;
    }

    if (
      visited.length > 0 &&
      topographicMap[y][x] !==
        topographicMap[visited[visited.length - 1].y][
          visited[visited.length - 1].x
        ] +
          1
    ) {
      return;
    }

    if (topographicMap[y][x] === 9) {
      visited.push({ x, y });
      trails.push([...visited]);
      visited.pop();
      return;
    }

    visited.push({ x, y });
    if (x + 1 < width) dfs({ x: x + 1, y: y }, visited);
    if (x - 1 >= 0) dfs({ x: x - 1, y: y }, visited);
    if (y + 1 < height) dfs({ x: x, y: y + 1 }, visited);
    if (y - 1 >= 0) dfs({ x: x, y: y - 1 }, visited);
    visited.pop();
  }

  dfs(start, []);
  return trails;
}

function findTrailsWithMemo(
  start: point,
  topographicMap: number[][],
  memo: Map<string, point[][]>
) {
  let height = topographicMap.length;
  let width = topographicMap[0].length;

  function dfs({ x, y }: point, visited: point[]) {
    if (visited.filter((v) => v.x == x && v.y == y).length > 0) {
      return [];
    }

    if (
      visited.length > 0 &&
      topographicMap[y][x] !==
        topographicMap[visited[visited.length - 1].y][
          visited[visited.length - 1].x
        ] +
          1
    ) {
      return [];
    }

    if (topographicMap[y][x] === 9) {
      return [[{ x, y }]];
    }

    let key = `${x},${y}'}`;
    if (memo.has(key)) {
      return [...memo.get(key)!.map((r) => [...r])];
    }

    let results: point[][] = [];
    visited.push({ x, y });

    if (x + 1 < width) {
      dfs({ x: x + 1, y: y }, visited).forEach((r) => {
        results.push(r);
      });
    }
    if (x - 1 >= 0) {
      dfs({ x: x - 1, y: y }, visited).forEach((r) => {
        results.push(r);
      });
    }
    if (y + 1 < height) {
      dfs({ x: x, y: y + 1 }, visited).forEach((r) => {
        results.push(r);
      });
    }
    if (y - 1 >= 0) {
      dfs({ x: x, y: y - 1 }, visited).forEach((r) => {
        results.push(r);
      });
    }
    results.forEach((r) => r.unshift({ x, y }));
    memo.set(key, [...results.map((r) => [...r])]);
    visited.pop();
    return results;
  }

  return dfs(start, []);
}

function sumTrailScore(topographicMap: number[][]) {
  let sum = 0;
  let memo = new Map<string, point[][]>();
  for (let y = 0; y < topographicMap.length; y++) {
    for (let x = 0; x < topographicMap[y].length; x++) {
      if (topographicMap[y][x] === 0) {
        let trails = findTrailsWithMemo({ x, y }, topographicMap, memo);
        // let trails = findTrails({ x, y }, topographicMap);
        const trailHeadScore = Array.from(
          new Set(trails.map((t) => JSON.stringify(t[t.length - 1]))),
          (coord) => JSON.parse(coord)
        ).length;

        sum += trailHeadScore;
      }
    }
  }

  return sum;
}

function sumTrailRating(topographicMap: number[][]) {
  let sum = 0;

  let memo = new Map<string, point[][]>();
  for (let y = 0; y < topographicMap.length; y++) {
    for (let x = 0; x < topographicMap[y].length; x++) {
      if (topographicMap[y][x] === 0) {
        let trails = findTrailsWithMemo({ x, y }, topographicMap, memo);
        // let trails = findTrails({ x, y }, topographicMap);

        sum += trails.length;
      }
    }
  }

  return sum;
}

export { loadInput, findTrails, sumTrailScore, sumTrailRating };
