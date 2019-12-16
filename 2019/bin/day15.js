const utils = require('../lib/advent-utils.js');
const { IntCode } = require('../lib/intcode.js');

const Movements = { NORTH: 1, SOUTH: 2, WEST: 3, EAST: 4 };
const Status = { WALL: 0, OPEN: 1, FOUND: 2 };

const part1 = cpu => {
  const seen = new Map();
  let [x, y] = [0, 0];
  let status = 0;
  let input = Movements.NORTH;

  seen.set('0,0', Status.OPEN);

  // prefer a direction we haven't seen...
  const rotate = () => {
    let b = input;
    input++;
    if (input === 5) input = 1;
    // console.log(` rotate: before ${b}, now ${input}`);
  };

  const prospectiveCoords = input => {
    let [toX, toY] = [x, y];
    switch (input) {
      case Movements.NORTH: toY++; break;
      case Movements.SOUTH: toY--; break;
      case Movements.EAST: toX++; break;
      case Movements.WEST: toX--; break;
    }

    return [toX, toY];
  };

  // walls we've tried this time out
  let tried = [];

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

  return Math.abs(x) + Math.abs(y);
};

const [line] = utils.fileLines('input/day15.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`part 1: ${part1(cpu)}`);
