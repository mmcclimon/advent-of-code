const { IntCode } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');

const [line] = utils.fileLines('input/day9.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`part 1: ${cpu.runWithInputs([1])}`);
console.log(`part 2: ${cpu.runWithInputs([2])}`);
