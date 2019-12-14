const { IntCode } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');
utils.addArrayMagic();

const Tiles = { EMPTY: 0, WALL: 1, BLOCK: 2, PADDLE: 3, BALL: 4 };
Object.freeze(Tiles);

const Game = class {
  constructor (mem) {
    this.cpu = new IntCode(mem);
    this.ball = { x: -1, y: -1 };
    this.paddle = { x: -1, y: -1 };
    this.score = null;
    this.grid = [];

    // generate initial grid
    do { this.runStep() } while (this.score === null);
  }

  numBlocks () {
    return this.grid
      .map(row => row.count(Tiles.BLOCK))
      .reduce((acc, count) => acc + count);
  }

  simulate () {
    do { this.runStep() } while (this.cpu.isRunning);
    return this;
  }

  runStep () {
    const [x, y, out] = this.cpu.runForNOutputs(3, true);

    if (x === -1) {
      this.score = out;
    } else {
      // special case first time around
      if (typeof this.grid[y] === 'undefined') { this.grid[y] = [] }

      this.grid[y][x] = out;

      switch (out) {
        case Tiles.PADDLE: this.paddle = { x: x, y: y }; break;
        case Tiles.BALL:   this.ball =   { x: x, y: y }; break;
        default: // nothing
      }
    }

    if (this.cpu.isPaused) {
      /* eslint-disable indent */
      const dir = this.ball.x < this.paddle.x ? -1
                : this.ball.x > this.paddle.x ? 1
                : 0;
      /* eslint-enable indent */

      this.cpu.input(dir);
    }
  }

  draw () {
    console.log(`SCORE: ${this.score}`);
    for (const [y, row] of this.grid.entries()) {
      const out = [];
      for (const [x, tile] of row.entries()) {
        let char;
        switch (tile) {
          case Tiles.EMPTY:  char = ' '; break;
          case Tiles.BLOCK:  char = '▒'; break;
          case Tiles.PADDLE: char = '━'; break;
          case Tiles.BALL:   char = '•'; break;
          case Tiles.WALL:
          /* eslint-disable indent */
            char = y === 0 && x === 0              ? '┌'
                 : y === 0 && x === row.length - 1 ? '┐'
                 : x === 0 || x === row.length - 1 ? '│'
                 : y === 0                         ? '─'
                 : '?';
          /* eslint-enable indent */
            break;
        }

        out.push(char);
      }

      console.log(out.join(''));
    }
  }
};

const [line] = utils.fileLines('input/day13.txt');
const mem = line.split(',').map(n => Number(n));
mem[0] = 2;

const game = new Game(mem);

console.log(`part 1: ${game.numBlocks()}`);
console.log(`part 2: ${game.simulate().score}`);
