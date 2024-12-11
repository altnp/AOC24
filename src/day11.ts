import * as fs from 'fs/promises';

async function loadData(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf-8')).trim();

  let numbers = [];
  let matches = data.matchAll(/\d+/g);
  if (matches) {
    for (let match of matches) {
      numbers.push(parseInt(match[0]));
    }
  }

  return numbers;
}

function advance(n: number) {
  let stones = [];
  if (n == 0) {
    return [1];
  }

  let ns = n.toString();
  if (ns.length % 2 == 0) {
    let leading = ns.substring(0, ns.length / 2);
    let trailing = ns.substring(ns.length / 2);
    return [parseInt(leading), parseInt(trailing)];
  }

  return [n * 2024];
}

function observe(stones: number[], count: number) {
  for (let i = 0; i < count; i++) {
    let nextStones = [];
    for (let stone of stones) {
      nextStones.push(...advance(stone));
    }
    stones = nextStones;
  }
  return stones.length;
}

function observeWithMemo(stones: number[], count: number) {
  let memo = new Map<string, number>();
  function dfs(stone: number, count: number) {
    if (count === 0) return 1;

    let key = `${stone}:${count}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    let sum = 0;
    advance(stone).forEach((s) => {
      sum += dfs(s, count - 1);
    });
    memo.set(key, sum);
    return sum;
  }

  return stones.reduce((p, c) => p + dfs(c, count), 0);
}
export { loadData, observe, observeWithMemo };
