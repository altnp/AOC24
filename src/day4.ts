import * as fs from 'fs/promises';

function findXMAS(input: string[][]) {
  let rows = input.length;
  let columns = input[0].length;

  function searchHorizontal(r: number, c: number) {
    let count = 0;
    if (c + 3 < columns) {
      if (input[r][c + 1] === 'M' && input[r][c + 2] === 'A' && input[r][c + 3] === 'S') {
        count++;
      }
    }

    if (c - 3 >= 0) {
      if (input[r][c - 1] === 'M' && input[r][c - 2] === 'A' && input[r][c - 3] === 'S') {
        count++;
      }
    }

    return count;
  }

  function searchVertical(r: number, c: number) {
    let count = 0;
    if (r + 3 < rows) {
      if (input[r + 1][c] === 'M' && input[r + 2][c] === 'A' && input[r + 3][c] === 'S') {
        count++;
      }
    }

    if (r - 3 >= 0) {
      if (input[r - 1][c] === 'M' && input[r - 2][c] === 'A' && input[r - 3][c] === 'S') {
        count++;
      }
    }

    return count;
  }

  function searchDiaginal(r: number, c: number) {
    let count = 0;
    if (r + 3 < rows && c + 3 < columns) {
      if (
        input[r + 1][c + 1] === 'M' &&
        input[r + 2][c + 2] === 'A' &&
        input[r + 3][c + 3] === 'S'
      ) {
        count++;
      }
    }

    if (r + 3 < rows && c - 3 >= 0) {
      if (
        input[r + 1][c - 1] === 'M' &&
        input[r + 2][c - 2] === 'A' &&
        input[r + 3][c - 3] === 'S'
      ) {
        count++;
      }
    }

    if (r - 3 >= 0 && c + 3 < columns) {
      if (
        input[r - 1][c + 1] === 'M' &&
        input[r - 2][c + 2] === 'A' &&
        input[r - 3][c + 3] === 'S'
      ) {
        count++;
      }
    }

    if (r - 3 >= 0 && c - 3 >= 0) {
      if (
        input[r - 1][c - 1] === 'M' &&
        input[r - 2][c - 2] === 'A' &&
        input[r - 3][c - 3] === 'S'
      ) {
        count++;
      }
    }

    return count;
  }

  let count = 0;
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[r].length; c++) {
      if (input[r][c] === 'X') {
        count += searchHorizontal(r, c);
        count += searchVertical(r, c);
        count += searchDiaginal(r, c);
      }
    }
  }

  return count;
}

function findX_MAS(input: string[][]) {
  let count = 0;
  for (let r = 1; r < input.length - 1; r++) {
    for (let c = 1; c < input[r].length - 1; c++) {
      if (input[r][c] === 'A') {
        let mas_dlr = input[r - 1][c - 1] === 'M' && input[r + 1][c + 1] === 'S';
        let sam_dlr = input[r - 1][c - 1] === 'S' && input[r + 1][c + 1] === 'M';
        let mas_ulr = input[r + 1][c - 1] === 'M' && input[r - 1][c + 1] === 'S';
        let sam_ulr = input[r + 1][c - 1] === 'S' && input[r - 1][c + 1] === 'M';

        if ((mas_dlr || sam_dlr) && (mas_ulr || sam_ulr)) count++;
      }
    }
  }

  return count;
}

async function loadInput(filename: string) {
  const data = await fs.readFile(filename, 'utf-8');
  let input: string[][] = [];
  for (let line of data.trim().split('\n')) {
    let chars: string[] = [];
    for (let c of line) {
      chars.push(c);
    }
    input.push(chars);
  }
  return input;
}

async function main() {
  let input = await loadInput('input/day4');
  console.log(findX_MAS(input));
}

export { loadInput, findXMAS, findX_MAS, main };
