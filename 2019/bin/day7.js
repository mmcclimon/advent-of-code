const { MultiCore } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');

const _compute = (mem, range, method) => {
  let max = 0;

  utils.permutations(range).forEach(perm => {
    const cpu = new MultiCore(mem, perm);
    const out = MultiCore.prototype[method].call(cpu, 0);
    max = Math.max(max, out);
  });

  return max;
}

const maxThrust = mem => _compute(mem, [0,1,2,3,4], 'runSingleLoop');
const feedbackThrust = mem => _compute(mem, [5,6,7,8,9], 'runFeedbackLoop');

const [line] = utils.fileLines('input/day7.txt');
const mem = line.split(',').map(n => Number(n));

console.log(`part 1: ${maxThrust(mem)}`);
console.log(`part 2: ${feedbackThrust(mem)}`);
