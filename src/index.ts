import { loadData, printMap } from './day14';
import readline from 'readline/promises';

async function main() {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let robots = await loadData('input/day14');
  for (let i = 5000; i < 10000; i = i + 10) {
    console.log(`${i} - ${i + 9}`);
    printMap(robots, 101, 103, i, 10);
    console.log('--------------------');
    console.log('\n');
    await rl.question('press <enter> to continue');
    await sleep(75);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
