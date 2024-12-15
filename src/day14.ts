import * as fs from 'fs/promises';

class Robot {
  px: number = 0;
  py: number = 0;
  vx: number = 0;
  vy: number = 0;

  constructor(px: number, py: number, vx: number, vy: number) {
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
  }

  advancePosition(seconds: number, xBounds: number, yBounds: number) {
    let x = (this.px + this.vx * seconds) % xBounds;
    let y = (this.py + this.vy * seconds) % yBounds;
    return {
      x: x > 0 ? x : (xBounds + x) % xBounds,
      y: y > 0 ? y : (yBounds + y) % yBounds,
    };
  }
}

async function loadData(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf-8')).trim();

  let robots: Robot[] = [];
  for (let line of data.split('\n').map((d) => d.trim())) {
    let matches = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
    if (matches) {
      let [, px, py, vx, vy] = matches;
      robots.push(
        new Robot(parseInt(px), parseInt(py), parseInt(vx), parseInt(vy))
      );
    }
  }

  return robots;
}

function quadrantSafetyScore(
  robots: Robot[],
  xBounds: number,
  yBounds: number
) {
  let q1Score = 0;
  let q2Score = 0;
  let q3Score = 0;
  let q4Score = 0;

  let hSplit = Math.floor(xBounds / 2);
  let vSplit = Math.floor(yBounds / 2);
  let map = new Map<string, number>();
  for (let robot of robots) {
    let { x, y } = robot.advancePosition(100, xBounds, yBounds);
    map.set(`${x},${y}`, map.has(`${x},${y}`) ? map.get(`${x},${y}`)! + 1 : 1);
    if (x < hSplit && y < vSplit) q1Score++;
    if (x > hSplit && y < vSplit) q2Score++;
    if (x < hSplit && y > vSplit) q3Score++;
    if (x > hSplit && y > vSplit) q4Score++;
  }

  return q1Score * q2Score * q3Score * q4Score;
}

function printMap(
  robots: Robot[],
  xBounds: number,
  yBounds: number,
  seconds: number,
  parallel: number
) {
  let set = [];
  for (let i = 0; i < parallel; i++) {
    let map: string[][] = Array.from({ length: yBounds }, () =>
      Array(xBounds).fill(' ')
    );
    for (let robot of robots) {
      let { x, y } = robot.advancePosition(seconds + i, xBounds, yBounds);
      map[y][x] = 'X';
    }

    set.push(map);
  }

  let lines = set[0].length;

  for (let l = 0; l < lines; l++) {
    for (let map of set) {
      for (let char of map[l]) {
        process.stdout.write(char);
      }
      process.stdout.write(' | ');
    }
    process.stdout.write('\n');
  }
}

export { loadData, quadrantSafetyScore, printMap, Robot };
