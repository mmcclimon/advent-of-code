const utils = require('../lib/advent-utils.js');
const { IntCode } = require('../lib/intcode.js');
const { Grid, DefaultCell } = require('../lib/grid.js');

const MazeCell = class extends DefaultCell {
  isIntersection () {
    return this.content === '#' &&
      this.neighbors.filter(c => c.content !== '.').length === 4;
  }
};

const gridFromString = s => {
  const grid = new Grid(MazeCell);

  for (const [y, line] of s.split('\n').entries()) {
    for (const [x, char] of line.split('').entries()) {
      if (typeof char === 'undefined') continue;
      grid.addCell(x, y, char);
    }
  }

  return grid;
};

const part1 = mem => {
  const cpu = new IntCode(mem);
  cpu.run();

  const s = String.fromCharCode(...cpu.outputs);
  const grid = gridFromString(s);

  return Array.from(grid.cells)
    .filter(cell => cell.isIntersection())
    .reduce((acc, cell) => acc + cell.x * cell.y, 0);
};

const part2 = mem => {
  mem[0] = 2;
  const cpu = new IntCode(mem);

  const genInstruction = s => (s + '\n').split('').map(s => s.charCodeAt(0));

  // done by hand
  const mvmt = 'A,B,A,B,C,A,C,A,C,B';
  const fnA = 'R,12,L,8,L,4,L,4';
  const fnB = 'L,8,R,6,L,6';
  const fnC = 'L,8,L,4,R,12,L,6,L,4';
  const wantVideo = 'n';

  [mvmt, fnA, fnB, fnC, wantVideo].forEach(inst => {
    cpu.input(...genInstruction(inst));
  });

  const output = cpu.run();
  return output;
};

const [line] = utils.fileLines('input/day17.txt');
const mem = line.split(',').map(n => Number(n));

console.log(`part 1: ${part1(mem)}`);
console.log(`part 2: ${part2(mem)}`);
