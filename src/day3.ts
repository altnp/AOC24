import * as fs from 'fs/promises';

async function loadInput(filename: string) {
  const data = await fs.readFile(filename, 'utf-8');
  return data.trim();
}

function executeValidInstructions(input: string) {
  let total = 0;

  let matches = input.match(/mul\(\d{1,3},\d{1,3}\)/g);
  if (!matches) return 0;

  for (let match of matches) {
    let digits = match.match(/mul\((\d{1,3}),(\d{1,3})\)/);
    if (!digits) continue;
    total += parseInt(digits[1]) * parseInt(digits[2]);
  }

  return total;
}

function executeValidConditionalInstructions(input: string) {
  let total = 0;

  let matches = input.match(/(?:mul\(\d{1,3},\d{1,3}\))|(?:do\(\))|(?:don't\(\))/g);
  if (!matches) return 0;

  let enabled = true;
  for (let match of matches) {
    if (match.startsWith('do()')) {
      enabled = true;
      continue;
    }

    if (match.startsWith("don't()")) {
      enabled = false;
      continue;
    }

    if (enabled) {
      let digits = match.match(/mul\((\d{1,3}),(\d{1,3})\)/);
      if (!digits) continue;
      total += parseInt(digits[1]) * parseInt(digits[2]);
    }
  }

  return total;
}

async function main() {
  let input = await loadInput('input/day3');
  console.log(executeValidConditionalInstructions(input));
}

export { loadInput, executeValidInstructions, executeValidConditionalInstructions, main };
