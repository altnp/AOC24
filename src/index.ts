import { stdout } from 'process';
import { findInvalidAdders, loadData } from './day24';

async function main() {
  let { gates } = await loadData('input/day24');
  findInvalidAdders(gates);
}

main();
