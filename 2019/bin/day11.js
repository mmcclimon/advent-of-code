const { IntCode } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');

const Directions = { NORTH: 'N', EAST: 'E', SOUTH: 'S', WEST: 'W' };

const runProg = (cpu, input) => {
  cpu.reset();
  const seen = new Map();
  let facing = Directions.NORTH;
  let [x, y] = [0, 0];

  seen.set('0,0', input);

  do {
    const key = [x, y].join(',');
    const colorOn = seen.get(key) || 0;

    // silly
    cpu.input(colorOn);
    const color = cpu.run(true);
    const turn = cpu.run(true); // 0 = left, 1 = right

    seen.set(key, color);

    // turn.
    switch (facing) {
      case Directions.NORTH:
        facing = turn ? Directions.EAST : Directions.WEST;
        break;
      case Directions.SOUTH:
        facing = turn ? Directions.WEST : Directions.EAST;
        break;
      case Directions.EAST:
        facing = turn ? Directions.SOUTH : Directions.NORTH;
        break;
      case Directions.WEST:
        facing = turn ? Directions.NORTH : Directions.SOUTH;
        break;
    }

    // step.
    switch (facing) {
      case Directions.NORTH: y--; break;
      case Directions.SOUTH: y++; break;
      case Directions.EAST: x++; break;
      case Directions.WEST: x--; break;
    }
  } while (cpu.isRunning);

  return seen;
};

const part1 = cpu => runProg(cpu, 0).size;

const part2 = cpu => {
  const graph = runProg(cpu, 1);

  for (const y of utils.range(0, 7)) {
    console.log(Array.from(utils.range(0, 60)).map(
      x => graph.get([x, y].join(',')) ? '█' : ' ',
    ).join(''));
  }
};

const [line] = utils.fileLines('input/day11.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`Part 1: ${part1(cpu)}`);
console.log('Part 2:\n');
part2(cpu);
