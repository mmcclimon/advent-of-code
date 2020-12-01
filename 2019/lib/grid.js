const utils = require('../lib/advent-utils.js');

const DefaultCell = class {
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
};

const Grid = class {
  constructor (cellClass = DefaultCell) {
    this._cells = new Map();
    this.minX = +Infinity;
    this.maxX = -Infinity;
    this.minY = +Infinity;
    this.maxY = -Infinity;
    this._cellClass = cellClass;
  };

  _key (x, y) {
    return [x, y].join(',');
  }

  addCell (x, y, content) {
    const c = new this._cellClass(x, y, content, this);
    this._cells.set(c.key, c);

    if (x > this.maxX) this.maxX = x;
    if (x < this.minX) this.minX = x;
    if (y > this.maxY) this.maxY = y;
    if (y < this.minY) this.minY = y;

    return c;
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
      const thisRow = [];

      for (const x of utils.range(this.minX, this.maxX + 1)) {
        const c = this.cellAt(x, y);
        thisRow.push(c ? c.content : ' ');
      }

      g.push(thisRow);
    }

    return g;
  }

  draw () {
    this.asArray().forEach(row => console.log(row.join('')));
  }
};

exports.DefaultCell = DefaultCell;
exports.Grid = Grid;
