const utils = require('../lib/advent-utils.js');
const { IntCode } = require('../lib/intcode.js');

utils.addArrayMagic();

const part1 = cpu => {
  const grid = [];
  for (const y of utils.range(50)) {
    grid[y] = [];
    for (const x of utils.range(50)) {
      cpu.reset();
      cpu.input(x, y);
      const [affected] = cpu.runForNOutputs(1, true);
      grid[y][x] = affected ? '#' : '.';
    }
  }

  grid.forEach(row => console.log(row.join('')));
  return grid.reduce((acc, row) => acc + row.count('#'), 0);
};

const part2 = (cpu, size) => {
  let found = false;

  // x,y is the NW corner; check SW, NE, and SE corners, which is sufficient
  // to determine the square.
  const checkSquare = (x, y) => {
    const corners = [
      [x, y + size - 1],             // sw
      [x + size - 1, y],             // ne
      [x + size - 1, y + size - 1],  // se
    ];

    for (const [checkX, checkY] of corners) {
      cpu.reset();
      cpu.input(checkX, checkY);

      const [got] = cpu.runForNOutputs(1);
      if (!got) return false;
    }

    return true;
  };

  OUTER: for (const y of utils.range(10000)) {
    let seenThisRow = false;

    INNER: for (const x of utils.range(10000)) {
      cpu.reset();
      cpu.input(x, y);
      const [affected] = cpu.runForNOutputs(1);

      if (affected === 0 && seenThisRow) break INNER;
      if (affected === 0 && !seenThisRow) continue INNER;

      seenThisRow = true;

      const ok = checkSquare(x, y);
      if (ok) {
        found = [x, y];
        break OUTER; // done!
      }
    }
  }

  return found[0] * 10000 + found[1];
};

const [line] = utils.fileLines('input/day19.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`part 1: ${part1(cpu)}`);
console.log(`part 2: ${part2(cpu, 100)}`);
