import { findMaxPrice, loadData, nextSecret } from './day22';

describe('day22', () => {
  test('loadData', async () => {
    let data = await loadData('input/day22.example');
    expect(data[0]).toBe(1);
    expect(data[1]).toBe(10);
    expect(data[2]).toBe(100);
    expect(data[3]).toBe(2024);
  });

  test('nextSecret', () => {
    let result = nextSecret(123);
    expect(result.secret).toBe(15887950);

    result = nextSecret(15887950);
    expect(result.secret).toBe(16495136);

    result = nextSecret(7753432);
    expect(result.secret).toBe(5908254);
  });

  test('example', async () => {
    let data = await loadData('input/day22.example');
    let sum = 0;
    for (let secret of data) {
      for (let i = 0; i < 2000; i++) {
        ({ secret } = nextSecret(secret));
      }
      sum += secret;
    }

    expect(sum).toBe(37327623);
  });

  test('part1', async () => {
    let data = await loadData('input/day22');
    let sum = 0;
    for (let secret of data) {
      for (let i = 0; i < 2000; i++) {
        ({ secret } = nextSecret(secret));
      }
      sum += secret;
    }

    expect(sum).toBe(19877757850);
  });

  test('example2', () => {
    let total = findMaxPrice([1, 2, 3, 2024]);
    expect(total).toBe(23);
  });

  test('part2', async () => {
    let data = await loadData('input/day22');
    let total = findMaxPrice(data);
    expect(total).toBe(2399);
  });
});
