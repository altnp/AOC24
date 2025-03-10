import * as fs from 'fs/promises';

async function loadData(fileName: string) {
  let data = (await fs.readFile(fileName, 'utf-8')).trim();

  let lines = data.split('\n').map((l) => l.trim());

  let patterns = lines[0].split(',').map((p) => p.trim());

  return { patterns, designs: lines.slice(2) };
}

function findPossibleDesigns(patterns: string[], designs: string[]) {
  patterns = patterns.sort((a, b) => b.length - a.length);
  let possibleDesigns = new Set<string>();
  let impossibleDesigns = new Set<string>();

  function isDesignPossible(desgin: string, wip: string) {
    if (possibleDesigns.has(desgin)) {
      return true;
    }

    if (impossibleDesigns.has(desgin)) {
      return false;
    }

    if (desgin === wip) {
      return true;
    }

    if (!desgin.startsWith(wip)) {
      return false;
    }

    let d = desgin.slice(wip.length);
    for (let p of patterns) {
      if (isDesignPossible(d, p)) {
        possibleDesigns.add(d);
        return true;
      }
    }

    impossibleDesigns.add(d);
    return false;
  }

  let possible = 0;
  designs.forEach((d) => {
    if (isDesignPossible(d, '')) {
      possible++;
    }
  });

  return possible;
}

function findPossibleDesignItterations(patterns: string[], designs: string[]) {
  patterns = patterns.sort((a, b) => b.length - a.length);
  let cache = new Map<string, number>();

  function possibleItterations(desgin: string, wip: string) {
    if (desgin === wip) {
      return 1;
    }

    if (!desgin.startsWith(wip)) {
      return 0;
    }

    let d = desgin.slice(wip.length);
    if (cache.has(d)) {
      return cache.get(d)!;
    }

    let results = 0;
    for (let p of patterns) {
      results += possibleItterations(d, p);
    }

    cache.set(d, results);

    return results;
  }

  let possible = 0;
  designs.forEach((d) => {
    possible += possibleItterations(d, '');
  });

  return possible;
}

export { loadData, findPossibleDesigns, findPossibleDesignItterations };
