const utils = require('../lib/advent-utils.js');
const { IntCode } = require('../lib/intcode.js');
const { Grid } = require('../lib/grid.js');

const Movements = { NORTH: 1, SOUTH: 2, WEST: 3, EAST: 4 };
const Status = { WALL: 0, OPEN: 1, FOUND: 2 };

const Droid = class {
  constructor (cpu) {
    this.cpu = cpu;
    this.map = new Grid();
    this.x = 0;
    this.y = 0;
    this.history = [];

    const cell = this.map.addCell(this.x, this.y, Status.OPEN);
    this.history.push(cell);
  }

  coordsFor (dir) {
    let [toX, toY] = [this.x, this.y];
    switch (dir) {
      case Movements.NORTH: toY++; break;
      case Movements.SOUTH: toY--; break;
      case Movements.EAST: toX++; break;
      case Movements.WEST: toX--; break;
    }

    return [toX, toY];
  };

  _tryMovement (dir) {
    cpu.input(dir);
    const [status] = cpu.runForNOutputs(1, true);

    const [toX, toY] = this.coordsFor(dir);
    this.map.addCell(toX, toY, status);

    // console.log(`got status ${status} for ${toX},${toY}`);

    let didMove = false;

    switch (status) {
      case Status.WALL:
        break;

      case Status.FOUND:
        console.log('got it!');
        // fall through

      case Status.OPEN:
        this.x = toX;
        this.y = toY;
        didMove = true;
        break;
    }

    return didMove;
  }

  moveOneStep () {
    let done = false;
    let dir = Movements.NORTH;
    while (!done) {
      done = this._tryMovement(dir);
      dir++;
    }
  }
};

const part1 = cpu => {
  const droid = new Droid(cpu);
  for (const _ of utils.range(50)) {
    droid.moveOneStep();
  }

  droid.map.draw();

  /*
  let [x, y] = [0, 0];
  let status = 0;
  let input = Movements.NORTH;

  grid.addCell(0, 0, Status.OPEN);


  // try all four positions

  /*
  // walls we've tried this time out
  let loops = 0;
  while (status !== Status.FOUND && loops++ < 79) {
    const [toX, toY] = prospectiveCoords(input);

    cpu.input(input);
    tried.push(input);
    [status] = cpu.runForNOutputs(1, true);
    console.log(`running with input ${input}, got ${status} from (${x},${y})`);

    seen.set([toX, toY].join(','), status);
    switch (status) {
      case Status.WALL:
        // never backtracks
        console.log(tried);
        // if (loops === 79) console.log(seen);
        do { rotate() } while (seen.has(prospectiveCoords(input).join(',')) && tried.length < 4);
        break;

      case Status.OPEN:
      case Status.FOUND:
        console.log(`  stepping to ${toX},${toY}`);
        [x, y] = [toX, toY];
        tried = [];
        break;
    }
  }
  */
};

const [line] = utils.fileLines('input/day15.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`part 1: ${part1(cpu)}`);
