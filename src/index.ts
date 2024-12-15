import { stdout } from 'process';
import { loadData, Obj, Pair, wideMove, widenMap } from './day15';
import * as readline from 'readline/promises';

async function main() {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let { map, moves } = await loadData('input/day15');
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

  for (let i = 0; i < moves.length; i++) {
    let m = moves[i];

    let copy = copyMap(map);
    robotPos = wideMove(map, robotPos, m);

    if (validate(map).length > 0) {
      printMap(copy);
      console.log(m);
      printMap(map);
      break;
    }
  }
}

function validate(map: string[][]) {
  for (let r = 0; r < map.length; r++) {
    let row = map[r];
    let pc = '';
    for (let i = 0; i < row.length; i++) {
      let c = row[i];
      if (c === '[' && pc === '[') {
        return [r, i];
      }

      if (c === ']' && pc === ']') {
        return [r, i];
      }

      pc = c;
    }
  }

  return [];
}

function copyMap(array: string[][]): string[][] {
  return array.map((row) => [...row]);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printMap(map: string[][]) {
  // stdout.write('\x1b[H');
  for (const row of map) {
    stdout.write(row.join('') + '\n');
  }
}

main();
