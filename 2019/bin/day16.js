const utils = require('../lib/advent-utils.js');
const process = require('process');

// [0,1,2,3], 2 should yield
// [0, 0, 1, 1, 2, 2, 3, 3, 0, 0, 1...]
const genPattern = function * (n) {
  const pattern = [0, 1, 0, -1];
  let pptr = 0;

  while (true) {
    for (const i of utils.range(n)) {
      yield pattern[pptr];
    }

    pptr = (pptr + 1) % pattern.length;
  };
};

const fftRound = (arr) => {
  let out = [];
  out.length = arr.length;

  for (const i of arr.keys()) {
    const pat = genPattern(i + 1);
    pat.next(); // skip first one

    const sum = arr.reduce((acc, el) => acc + (el * pat.next().value), 0);
    out[i] = Math.abs(sum % 10);
  }

  return out;
};

const fft = (nums, rounds) => {
  Array.from(utils.range(rounds)).forEach(_ => { nums = fftRound(nums) });
  return nums.join('');
};

// I stole this from the internet mostly.
const fft2 = (nums, rounds) => {
  for (const i of utils.range(nums.length - 1, -1, -1)) {
    const next = nums[i + 1] || 0;
    nums[i] = (next + nums[i]) % 10;
  }

  return nums;
};

const part1 = input => {
  let nums = input.split('').map(n => Number(n));
  return fft(nums, 100).slice(0, 8);
};

const part2 = input => {
  let nums = input.repeat(10000).split('').map(n => Number(n));
  const offset = Number(input.split('').slice(0, 7).join(''));

  // only consider the back half, for reasons
  nums = nums.slice(offset);
  Array.from(utils.range(100)).forEach(_ => nums = fft2(nums));

  return nums.slice(0, 8).join('');
};

const [input] = utils.fileLines('input/day16.txt');
console.log(`part 1: ${part1(input)}`);
console.log(`part 2: ${part2(input)}`);
