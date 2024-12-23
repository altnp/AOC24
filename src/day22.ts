import * as fs from 'fs/promises';

async function loadData(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');
  return data.split('\n').map((s) => parseInt(s));
}

function nextSecret(secret: number) {
  let startingPrice = secret % 10;
  let x = secret;
  x *= 64;
  secret = (x ^ secret) >>> 0;
  secret = secret % 16777216;

  x = secret;
  x = Math.floor(x / 32);
  secret = (x ^ secret) >>> 0;
  secret = secret % 16777216;

  x = secret;
  x *= 2048;
  secret = (x ^ secret) >>> 0;
  secret = secret % 16777216;

  let price = secret % 10;
  return { secret, price, change: price - startingPrice };
}

function findStopSequences(secret: number) {
  let sequenceTotals = new Map<string, number>();
  let stopSequence = [];
  for (let i = 0; i < 2000; i++) {
    let price, change: number;
    ({ secret, price, change } = nextSecret(secret));

    stopSequence.push(change);
    if (stopSequence.length > 4) stopSequence.shift();

    if (sequenceTotals.has(stopSequence.toString())) continue;

    sequenceTotals.set(stopSequence.toString(), price);
  }

  return sequenceTotals;
}

function findMaxPrice(secrets: number[]) {
  let sequenceTotals = new Map<string, number>();
  for (let secret of secrets) {
    for (let [key, value] of findStopSequences(secret)) {
      if (!sequenceTotals.has(key)) {
        sequenceTotals.set(key, 0);
      }

      sequenceTotals.set(key, sequenceTotals.get(key)! + value);
    }
  }

  let max = 0;
  for (let [, value] of sequenceTotals) {
    if (value > max) max = value;
  }

  return max;
}

export { loadData, nextSecret, findMaxPrice };
