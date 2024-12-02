import * as fs from 'fs/promises';

function compareLists(first: number[], second: number[]): number {
  first.sort((x, y) => x - y);
  second.sort((x, y) => x - y);

  let sum = 0;
  for (let i = 0; i < first.length; i++) {
    sum += Math.abs(second[i] - first[i]);
  }

  return sum;
}

function compareListsSimilarity(first: number[], second: number[]): number {
  let occurrences = new Map<number, number>();
  for (let i = 0; i < second.length; i++) {
    let key = second[i];
    occurrences.set(key, (occurrences.get(key) || 0) + 1);
  }

  let sum = 0;
  for (let i = 0; i < first.length; i++) {
    if (occurrences.has(first[i])) {
      sum += first[i] * occurrences.get(first[i])!;
    }
  }

  return sum;
}

async function loadInput(filename: string): Promise<[number[], number[]]> {
  const result: [a: number[], b: number[]] = [[], []];

  const data = await fs.readFile(filename, 'utf-8');
  for (let line of data.split(/\n/)) {
    let match = /(\d+)\s+(\d+)/.exec(line);
    if (match) {
      result[0].push(parseInt(match[1]));
      result[1].push(parseInt(match[2]));
    }
  }

  return result;
}

async function main() {
  let input = await loadInput('input/day1');
  console.log(compareListsSimilarity(input[0], input[1]));
}

export { compareLists, compareListsSimilarity, loadInput, main };
