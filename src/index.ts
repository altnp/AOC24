import { stdout } from 'process';

let map = [
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
  Array(9).fill('.'),
];

let p = { x: 4, y: 4 };
function fill(dx: number, dy: number) {
  map[p.y + dy][p.x + dx] = '#';
  print();
}

function print() {
  for (let row of map) {
    for (let c of row) {
      stdout.write(c);
    }
    stdout.write('\n');
  }
  stdout.write('\n');
}

for (let distance = 1; distance <= 3; distance++) {
  for (let offset = 0; offset <= distance; offset++) {
    fill(offset, distance - offset);
    fill(-offset, distance - offset);
    fill(offset, -distance + offset);
    fill(-offset, -distance + offset);
  }
}
