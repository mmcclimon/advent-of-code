const { IntCode } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');

const MultiCore = class {
  constructor (mem, numCores) {
    this.isRunning = false;
    this.cpus = [];
    this.numCores = numCores;

    for (const i of utils.range(numCores)) {
      this.cpus.push(new IntCode(mem));
    }
  }

  runWithInput (input, states) {
    this.isRunning = true;
    let loopCount = 0;

    while (this.isRunning) {
      for (const [idx, cpu] of this.cpus.entries()) {
        const inputs = loopCount === 0 ? [states[idx], input] : [input];
        input = cpu.runWithInputs(inputs, false, true);
      }

      loopCount++;

      if (!this.cpus[this.numCores - 1].isRunning) {
        this.isRunning = false;
      }
    }

    return this.cpus[this.numCores - 1].lastOutput();
  }
};

const computeMaxThrust = mem => {
  const cpu = new IntCode(mem);

  let max = 0;
  for (const perm of utils.permutations([0, 1, 2, 3, 4])) {
    let input = 0;
    for (const setting of perm) {
      input = cpu.runWithInputs([setting, input]);
    }

    max = Math.max(max, input);
  };

  return max;
};

const computeFeedbackThrust = mem => {
  let max = 0;
  utils.permutations([5, 6, 7, 8, 9]).forEach(perm => {
    const cpu = new MultiCore(mem, 5);
    const out = cpu.runWithInput(0, perm);
    max = Math.max(max, out);
  });

  return max;
};

const [line] = utils.fileLines('input/day7.txt');
const mem = line.split(',').map(n => Number(n));

console.log(`part 1: ${computeMaxThrust(mem)}`);
console.log(`part 2: ${computeFeedbackThrust(mem)}`);
