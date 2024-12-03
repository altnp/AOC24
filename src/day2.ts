import * as fs from 'fs/promises';

function countSafeReports(reports: number[][]) {
  let count = 0;

  for (let report of reports) {
    let increasing = report[1]! > report[0]!;
    let safe = true;
    for (let i = 1; i < report.length; i++) {
      safe = isSafeLevelChange(report[i - 1], report[i], increasing);
      if (!safe) {
        break;
      }
    }

    if (safe) {
      console.log(report);
      count++;
    }
  }

  return count;
}

function countSafeDampenedReports(reports: number[][]) {
  let count = 0;

  for (let report of reports) {
    let safe = isSafeReport(report);
    if (safe) {
      count++;
    } else {
      for (let i = 0; i < report.length && !safe; i++) {
        safe = isSafeReport(report.slice(0, i).concat(report.slice(i + 1)));
        if (safe) count++;
      }
    }
  }

  return count;
}

function isSafeReport(report: number[]) {
  let increasing = report[1]! > report[0]!;
  let safe = true;
  for (let i = 1; i < report.length; i++) {
    safe = isSafeLevelChange(report[i - 1], report[i], increasing);
    if (!safe) {
      break;
    }
  }
  return safe;
}

function isSafeLevelChange(l1: number, l2: number, increasing: boolean) {
  let diff = l2 - l1;
  if (increasing !== diff > 0) return false;
  if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;
  return true;
}

async function loadInput(filename: string): Promise<number[][]> {
  const result: number[][] = [];

  const data = await fs.readFile(filename, 'utf-8');
  for (let line of data.split(/\n/)) {
    let match = line.match(/\d+/g);
    if (match) {
      result.push(match.map(Number));
    }
  }

  return result;
}

async function main() {
  const input = await loadInput('input/day2');
  console.log(countSafeDampenedReports(input));
}

export { loadInput, countSafeReports, countSafeDampenedReports, main };
