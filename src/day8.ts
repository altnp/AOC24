import * as fs from 'fs/promises';

type Antenna = { x: number; y: number };
type AntiNode = { x: number; y: number };

function calcDistance(a: Antenna, b: Antenna) {
  return [Math.abs(a.x) - Math.abs(b.x), Math.abs(a.y) - Math.abs(b.y)];
}

async function loadInput(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');

  let map = data
    .trim()
    .split('\n')
    .map((l) => l.split(''));

  return map;
}

function buildAntennaMap(input: string[][]) {
  let map = new Map<string, Antenna[]>();
  input.forEach((l, y) => {
    l.forEach((c, x) => {
      if (c !== '.') {
        if (map.has(c)) {
          map.get(c)!.push({ x, y });
        } else {
          map.set(c, [{ x, y }]);
        }
      }
    });
  });
  return map;
}

function countAntiNodes(input: string[][]) {
  let height = input.length;
  let width = input[0].length;
  let map = buildAntennaMap(input);

  let validAntiNodes = new Set<string>();
  for (let [_, antennas] of map) {
    let antiNodes = findAntiNodes(antennas);
    antiNodes = antiNodes.filter((n) => isInbounds(n, width, height));
    antiNodes.forEach((n) => validAntiNodes.add(`${n.x},${n.y}`));
  }

  return validAntiNodes.size;
}

function findAntiNodes(antennas: Antenna[]) {
  let antiNodes = [];
  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      let a = antennas[i];
      let b = antennas[j];
      let [dx, dy] = calcDistance(a, b);
      antiNodes.push({ x: a.x + dx, y: a.y + dy });
      antiNodes.push({ x: b.x - dx, y: b.y - dy });
    }
  }
  return antiNodes;
}

function findAntiNodesPart2(
  antennas: Antenna[],
  width: number,
  height: number
) {
  let antiNodes = [];
  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      let a = antennas[i];
      let b = antennas[j];
      let [dx, dy] = calcDistance(a, b);

      let newAntiNode = { x: a.x, y: a.y };
      while (isInbounds(newAntiNode, width, height)) {
        antiNodes.push(newAntiNode);
        newAntiNode = { x: newAntiNode.x + dx, y: newAntiNode.y + dy };
      }

      newAntiNode = { x: b.x, y: b.y };
      while (isInbounds(newAntiNode, width, height)) {
        antiNodes.push(newAntiNode);
        newAntiNode = { x: newAntiNode.x - dx, y: newAntiNode.y - dy };
      }
    }
  }
  return antiNodes;
}

function countAntiNodesPart2(input: string[][]) {
  let height = input.length;
  let width = input[0].length;
  let map = buildAntennaMap(input);

  let validAntiNodes = new Set<string>();
  for (let [_, antennas] of map) {
    let antiNodes = findAntiNodesPart2(antennas, width, height);
    antiNodes.forEach((n) => validAntiNodes.add(`${n.x},${n.y}`));
  }

  return validAntiNodes.size;
}

function isInbounds(antiNode: AntiNode, width: number, height: number) {
  return (
    antiNode.x >= 0 &&
    antiNode.x < width &&
    antiNode.y >= 0 &&
    antiNode.y < height
  );
}

export { loadInput, buildAntennaMap, countAntiNodes, countAntiNodesPart2 };
