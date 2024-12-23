import * as fs from 'fs/promises';

async function loadData(fileName: string) {
  let pairs: [string, string][] = [];
  let data = await fs.readFile(fileName, 'utf-8');
  for (let pair of data.split('\n').map((l) => l.trim())) {
    let match = pair.match(`([a-z][a-z])-([a-z][a-z])`);

    if (match) {
      pairs.push([match[1], match[2]]);
    }
  }

  return pairs;
}

function findTripplets(networkPairs: [string, string][]) {
  let pairs = new Set<string>();
  let networkMap = new Map<string, string[]>();
  for (let [a, b] of networkPairs) {
    pairs.add(`${a},${b}`);
    pairs.add(`${b},${a}`);

    let key = a < b ? a : b;
    let value = a < b ? b : a;
    if (!networkMap.has(key)) {
      networkMap.set(key, []);
    }
    var connectedNodes = networkMap.get(key)!;
    connectedNodes.push(value);
  }

  let tripples: [string, string, string][] = [];
  for (let [key, values] of networkMap) {
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        let b = values[i];
        let c = values[j];

        if (
          pairs.has(`${b},${c}`) &&
          (key.startsWith('t') || b.startsWith('t') || c.startsWith('t'))
        ) {
          tripples.push([key, b, c]);
        }
      }
    }
  }

  return tripples;
}

function findLan(networkPairs: [string, string][]) {
  let pairs = new Set<string>();
  let networkMap = new Map<string, string[]>();
  for (let [a, b] of networkPairs) {
    pairs.add(`${a},${b}`);
    pairs.add(`${b},${a}`);

    let key = a < b ? a : b;
    let value = a < b ? b : a;
    if (!networkMap.has(key)) {
      networkMap.set(key, []);
    }
    var connectedNodes = networkMap.get(key)!;
    connectedNodes.push(value);
  }

  let largestLanSize = 0;
  let largesLanNodes: string[] = [];

  for (let [key, values] of networkMap) {
    let lanSize = 0;
    let lanNodes = new Set<string>();

    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        let a = key;
        let b = values[i];
        let c = values[j];

        if (pairs.has(`${b},${c}`)) {
          lanSize++;
          lanNodes.add(a);
          lanNodes.add(b);
          lanNodes.add(c);
        }
      }
    }

    if (lanSize > largestLanSize) {
      largestLanSize = lanSize;
      largesLanNodes = Array.from(lanNodes).sort();
    }
  }

  return largesLanNodes;
}

export { loadData, findTripplets, findLan };
