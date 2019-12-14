const util = require('util');
const utils = require('../lib/advent-utils.js');

const parseLines = lines => {
  const requirements = {};

  for (const line of lines) {
    const [input, output] = line.split(' => ');
    const components = input.split(', ');

    const req = {};
    components.forEach(c => {
      const [amt, el] = c.split(' ');
      req[el] = Number(amt);
    });

    const [amt, el] = output.split(' ');
    requirements[el] = { batchSize: Number(amt), components: req };
  }

  return requirements;
};

// for constructing proxies
const defaultzero = {
  get: function (obj, prop) { return prop in obj ? obj[prop] : 0 },
};

const neededFor = (requirements, amtNeeded, what) => {
  const totals = new Proxy({}, defaultzero);
  const extras = new Proxy({}, defaultzero);

  const haveCashableBatches = (extras) => {
    let ret = false;
    for (const [comp, amt] of Object.entries(extras)) {
      const reqForComp = requirements[comp];
      const extraBatches = Math.floor(amt / reqForComp.batchSize);
      ret = ret || extraBatches > 0;
    }
    return ret;
  };

  const _calcNeededFor = (amtNeeded, what) => {
    if (what === 'ORE') { return }

    const reqForComp = requirements[what];
    const totalBatches = Math.ceil(amtNeeded / reqForComp.batchSize);

    // how much extra will we get?
    const extra = totalBatches * reqForComp.batchSize - amtNeeded;
    extras[what] += extra;

    for (const [comp, rawAmt] of Object.entries(reqForComp.components)) {
      const need = totalBatches * rawAmt;
      totals[comp] += need;
      _calcNeededFor(need, comp);
    }
  };

  _calcNeededFor(amtNeeded, what);

  // we have a total amount of ore. We will now cash out all the extras and
  // subtract that from the total.
  let totalOre = totals.ORE;

  while (haveCashableBatches(extras)) {
    for (const [comp, amount] of Object.entries(extras)) {
      const reqForComp = requirements[comp];
      const extraBatches = Math.floor(amount / reqForComp.batchSize);
      if (!extraBatches) continue;

      if (requirements[comp].components.ORE) {
        const orePerBatch = requirements[comp].components.ORE;
        totalOre -= orePerBatch * extraBatches;
      } else {
        for (const [incomp, inamt] of Object.entries(reqForComp.components)) {
          extras[incomp] += extraBatches * inamt;
        }
      }

      extras[comp] -= (extraBatches * reqForComp.batchSize);
    }
  }

  return totalOre;
};

const part1 = req => {
  return neededFor(req, 1, 'FUEL');
};

const part2 = req => {
  // binary search.
  const trillion = 1e12;
  let best = 0;
  let l = 0;
  let r = trillion;

  while (l <= r) {
    const n = Math.floor((l + r) / 2);
    const need = neededFor(req, n, 'FUEL');

    if (need < trillion) {
      best = n;
      l = n + 1;
    } else if (need > trillion) {
      r = n - 1;
    } else {
      return n;
    }
  }

  return best;
};

const lines = utils.fileLines('input/day14.txt');
const requirements = parseLines(lines);

console.log(`part 1: ${part1(requirements)}`);
console.log(`part 2: ${part2(requirements)}`);
