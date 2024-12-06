import * as fs from 'fs/promises';

type input = { orderingRules: [number, number][]; updates: number[][] };

async function loadInput(fileName: string): Promise<input> {
  let data = (await fs.readFile(fileName, 'utf-8')).trim();
  let lines = data.split('\n');
  let orderingRules: [number, number][] = [];
  let updates: number[][] = [];

  let line = lines.shift();
  while (line) {
    let matches = line.match(/(\d+)\|(\d+)/);
    if (matches) {
      orderingRules.push([parseInt(matches[1]), parseInt(matches[2])]);
    }
    line = lines.shift();
  }

  line = lines.shift();
  while (line) {
    let numbers = line.trim().split(',');
    let update: number[] = [];
    for (let number of numbers) {
      update.push(parseInt(number));
    }
    updates.push(update);
    line = lines.shift();
  }

  return { orderingRules, updates };
}

function sumValidUpdates({ orderingRules, updates }: input) {
  let sum = 0;

  for (let update of updates) {
    if (validateUpdate(buildOrderingRules(orderingRules), update)) {
      sum += update[Math.floor(update.length / 2)];
    }
  }

  return sum;
}

function sumInvalidUpdates({ orderingRules: o, updates }: input) {
  let sum = 0;

  let orderingRules = buildOrderingRules(o);
  for (let update of updates) {
    if (!validateUpdate(orderingRules, update)) {
      update = fixUpdate(orderingRules, update);
      sum += update[Math.floor(update.length / 2)];
    }
  }

  return sum;
}

function fixUpdate(orderingRules: Map<number, number[]>, update: number[]) {
  let fixed: number[] = [];

  let inDegree = new Map<number, number>();
  let graph = new Map<number, number[]>();

  for (let page of update) {
    inDegree.set(page, 0);
    graph.set(page, []);
  }

  for (let [from, tos] of orderingRules.entries()) {
    if (update.indexOf(from) >= 0) {
      for (let to of tos) {
        if (update.indexOf(to) >= 0) {
          graph.get(from)!.push(to);
          inDegree.set(to, inDegree.get(to)! + 1);
        }
      }
    }
  }

  while (graph.size > 0) {
    for (let node of graph) {
      if (inDegree.get(node[0]) === 0) {
        fixed.push(node[0]);
        for (let targets of node[1]) {
          inDegree.set(targets, inDegree.get(targets)! - 1);
        }

        graph.delete(node[0]);
      }
    }
  }

  return fixed;
}

function buildOrderingRules(orderingRules: [number, number][]) {
  let map = new Map<number, number[]>();

  for (let rule of orderingRules) {
    if (map.has(rule[0])) {
      map.get(rule[0])!.push(rule[1]);
    } else {
      map.set(rule[0], [rule[1]]);
    }
  }

  return map;
}

function validateUpdate(
  orderingRules: Map<number, number[]>,
  update: number[]
) {
  let seen = new Set<number>();
  for (let page of update) {
    seen.add(page);
    if (orderingRules.has(page)) {
      let matchingRules = orderingRules.get(page)!;
      for (let rule of matchingRules) {
        if (seen.has(rule)) {
          return false;
        }
      }
    }
  }

  return true;
}

async function main() {
  let input = await loadInput('input/day5');
  let result = sumInvalidUpdates(input);

  console.log(result);
}

export { loadInput, sumValidUpdates, main, fixUpdate, sumInvalidUpdates };
