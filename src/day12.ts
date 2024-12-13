import * as fs from 'fs/promises';

async function loadData(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');
  return data
    .trim()
    .split('\n')
    .map((l) => [...l]);
}

class PlotMap {
  private map: string[][];
  private visited: boolean[][];

  constructor(map: string[][]) {
    this.map = map;
    this.visited = Array.from({ length: map.length }, () =>
      Array(map[0].length).fill(false)
    );
  }

  getPlot({ x, y }: Point) {
    return this.map[y][x];
  }

  visit({ x, y }: Point) {
    this.visited[y][x] = true;
  }

  hasVisited({ x, y }: Point) {
    return this.visited[y][x];
  }

  isInbounds({ x, y }: Point) {
    let height = this.getWidth();
    let width = this.getHeight();

    return x >= 0 && x < width && y >= 0 && y < height;
  }

  getHeight() {
    return this.map.length;
  }

  getWidth() {
    return this.map[0].length;
  }
}

type Point = { x: number; y: number };

class Region {
  identifier: string;
  plots: Point[] = [];
  private xPlots = new Map<number, number[]>();
  private yPlots = new Map<number, number[]>();
  perimeter = 0;

  private regionSet = new Set<string>();

  constructor(identifier: string) {
    this.identifier = identifier;
  }

  getArea = () => this.plots.length;

  containsPlot = (point: Point) => this.regionSet.has(`${point.x}:${point.y}`);

  addPlot({ x, y }: Point) {
    if (!this.regionSet.has(`${x}:${y}`)) {
      this.plots.push({ x, y });

      this.xPlots.set(
        x,
        this.xPlots.has(x) ? [...this.xPlots.get(x)!, y] : [y]
      );

      this.yPlots.set(
        y,
        this.yPlots.has(y) ? [...this.yPlots.get(y)!, x] : [x]
      );

      this.regionSet.add(`${x}:${y}`);
      this.perimeter += 4;

      if (this.containsPlot({ x: x - 1, y })) {
        this.perimeter -= 2;
      }
      if (this.containsPlot({ x: x + 1, y })) {
        this.perimeter -= 2;
      }
      if (this.containsPlot({ x, y: y - 1 })) {
        this.perimeter -= 2;
      }
      if (this.containsPlot({ x, y: y + 1 })) {
        this.perimeter -= 2;
      }
    }
  }

  sides() {
    let totalSides = 0;

    const column = Array.from(this.xPlots.keys()).sort((a, b) => a - b);
    let previousSides = new Set<string>();
    for (let x of column) {
      let values = this.xPlots.get(x)!.sort((a, b) => a - b);
      let sides = new Set<string>();
      sides.add('u' + values[0]);
      for (let v = 1; v < values.length; v++) {
        let value = values[v];
        let prevValue = values[v - 1];

        if (value - prevValue > 1) {
          sides.add('d' + prevValue + 1);
          sides.add('u' + value);
        }
      }
      sides.add('d' + values[values.length - 1] + 1);
      totalSides += Array.from(sides).filter(
        (s) => !previousSides.has(s)
      ).length;

      previousSides = sides;
    }

    const row = Array.from(this.yPlots.keys()).sort((a, b) => a - b);
    previousSides = new Set<string>();
    for (let y of row) {
      let values = this.yPlots.get(y)!.sort((a, b) => a - b);
      let sides = new Set<string>();
      sides.add('l' + values[0]);
      for (let v = 1; v < values.length; v++) {
        let value = values[v];
        let prevValue = values[v - 1];

        if (value - prevValue > 1) {
          sides.add('r' + prevValue + 1);
          sides.add('l' + value);
        }
      }
      sides.add('r' + values[values.length - 1] + 1);
      totalSides += Array.from(sides).filter(
        (s) => !previousSides.has(s)
      ).length;

      previousSides = sides;
    }

    return totalSides;
  }

  getPrice() {
    return this.plots.length * this.perimeter;
  }

  getDiscountedPrice() {
    let price = this.plots.length * this.sides();
    return price;
  }
}

function findRegion({ x, y }: Point, plotMap: PlotMap) {
  let identifier = plotMap.getPlot({ x, y });
  let region = new Region(identifier);

  function search({ x, y }: Point) {
    if (plotMap.getPlot({ x, y }) !== region.identifier) {
      return;
    }

    if (region.containsPlot({ x, y }) || plotMap.hasVisited({ x, y })) {
      return;
    }

    region.addPlot({ x, y });
    plotMap.visit({ x, y });

    if (plotMap.isInbounds({ x, y: y - 1 })) {
      search({ x, y: y - 1 });
    }

    if (plotMap.isInbounds({ x, y: y + 1 })) {
      search({ x, y: y + 1 });
    }

    if (plotMap.isInbounds({ x: x - 1, y })) {
      search({ x: x - 1, y });
    }

    if (plotMap.isInbounds({ x: x + 1, y })) {
      search({ x: x + 1, y });
    }

    return;
  }

  search({ x, y });
  return region;
}

function totalFencePrice(plotMap: PlotMap) {
  let regions = [];
  for (let y = 0; y < plotMap.getHeight(); y++) {
    for (let x = 0; x < plotMap.getWidth(); x++) {
      if (!plotMap.hasVisited({ x, y })) {
        regions.push(findRegion({ x, y }, plotMap));
      }
    }
  }

  return regions.reduce((p, c) => (p += c.getPrice()), 0);
}

function totalFencePriceWithDiscount(plotMap: PlotMap) {
  let regions = [];
  for (let y = 0; y < plotMap.getHeight(); y++) {
    for (let x = 0; x < plotMap.getWidth(); x++) {
      if (!plotMap.hasVisited({ x, y })) {
        regions.push(findRegion({ x, y }, plotMap));
      }
    }
  }

  return regions.reduce((p, c) => (p += c.getDiscountedPrice()), 0);
}

export {
  loadData,
  findRegion,
  totalFencePrice,
  totalFencePriceWithDiscount,
  PlotMap,
};
