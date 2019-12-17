const utils = require('../lib/advent-utils.js');
const { IntCode } = require('../lib/intcode.js');

const Grid = class {
  constructor () {
    this._cells = new Map();
    this.minX = +Infinity;
    this.maxX = -Infinity;
    this.minY = +Infinity;
    this.maxY = -Infinity;
  };

  _key (x, y) {
    return [x, y].join(',');
  }

  addCell (x, y, content) {
    const c = new Cell(x, y, content, this);
    this._cells.set(c.key, c);

    if (x > this.maxX) this.maxX = x;
    if (x < this.minX) this.minX = x;
    if (y > this.maxY) this.maxY = y;
    if (y < this.minY) this.minY = y;
  }

  cellAt (x, y) {
    return this._cells.get(this._key(x, y));
  }

  // in arbitrary order
  get cells () {
    return this._cells.values();
  }

  asArray () {
    const g = [];
    for (const y of utils.range(this.minY, this.maxY + 1)) {
      g[y] = [];
      for (const x of utils.range(this.minX, this.maxX + 1)) {
        const c = this.cellAt(x, y);
        g[y][x] = c.isIntersection() ? 'x' : c.content;
      }
    }

    return g;
  }

  draw () {
    this.asArray().forEach(row => console.log(row.join('')));
  }
};

const Cell = class {
  constructor (x, y, content, grid) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.grid = grid;
  }

  get key () {
    return [this.x, this.y].join(',');
  }

  get north () { return this.grid.cellAt(this.x, this.y - 1) }
  get south () { return this.grid.cellAt(this.x, this.y + 1) }
  get east ()  { return this.grid.cellAt(this.x + 1, this.y) }
  get west ()  { return this.grid.cellAt(this.x - 1, this.y) }

  get neighbors () {
    return [this.north, this.east, this.south, this.west]
      .filter(c => typeof c !== 'undefined');
  }

  isIntersection () {
    return this.content === '#' &&
      this.neighbors.filter(c => c.content !== '.').length === 4;
  }
};

const gridFromString = s => {
  const grid = new Grid();

  for (const [y, line] of s.split('\n').entries()) {
    for (const [x, char] of line.split('').entries()) {
      if (typeof char === 'undefined') continue;
      grid.addCell(x, y, char);
    }
  }

  return grid;
};

const part1 = cpu => {
  cpu.run();

  const s = String.fromCharCode(...cpu.outputs);
  const grid = gridFromString(s);

  return Array.from(grid.cells)
    .filter(cell => cell.isIntersection())
    .reduce((acc, cell) => acc + cell.x * cell.y, 0);
};

const [line] = utils.fileLines('input/day17.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`part 1: ${part1(cpu)}`);
