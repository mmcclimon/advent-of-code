const { IntCode } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');

const [line] = utils.fileLines('input/day5.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem, { addDefaultOpcodes: true });

const outputs = cpu.runWithInput(1);
console.log(outputs);

const outputs2 = cpu.runWithInput(5);
console.log(outputs2);
