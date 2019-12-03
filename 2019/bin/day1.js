'use strict';

const utils = require('../lib/advent-utils.js');

const doSum = (arr, func) => arr.reduce((acc, el) => acc + func(el), 0);
const fuelRequired = mass => Math.max(Math.floor(mass / 3) - 2, 0);
const fuelRequiredExtra = mass => {
  const fuel = fuelRequired(mass);
  return fuel === 0 ? fuel : fuel + fuelRequiredExtra(fuel);
};

// make sure it works
const tests = [14, 1969, 100756];
console.assert(doSum(tests, fuelRequired) === 34239, 'part 1 is wrong');
console.assert(doSum(tests, fuelRequiredExtra) === 51314, 'part 2 is wrong');

// do the thing
const lines = utils.fileLinesInt('input/day1.txt');
console.log('part 1: ' + doSum(lines, fuelRequired));
console.log('part 2: ' + doSum(lines, fuelRequiredExtra));
