import * as fs from 'fs/promises';

async function loadData(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');

  let lines = data
    .trim()
    .split('\n')
    .map((l) => l.trim());
  let locks = [];
  let keys = [];

  let current = [];
  for (let line of [...lines, '']) {
    if (line === '') {
      if (current[0][0] === '#') {
        locks.push(height(current));
      } else {
        keys.push(height(current));
      }
      current = [];
      continue;
    }

    current.push([...line]);
  }

  return { locks, keys };
}

function height(schematic: string[][]) {
  let heights = [-1, -1, -1, -1, -1];
  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[0].length; j++) {
      if (schematic[i][j] === '#') heights[j]!++;
    }
  }

  return heights;
}

function compatible(key: number[], lock: number[]) {
  for (let i = 0; i < key.length; i++) {
    if (key[i] + lock[i] > 5) {
      return false;
    }
  }

  return true;
}

function nonOverlapping(keys: number[][], locks: number[][]) {
  let valid: { key: number[]; lock: number[] }[] = [];

  for (let k of keys) {
    for (let l of locks) {
      if (compatible(k, l)) {
        valid.push({ key: k, lock: l });
      }
    }
  }

  return valid;
}

export { loadData, nonOverlapping };
