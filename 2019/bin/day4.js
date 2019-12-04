const { range } = require('../lib/advent-utils.js');

const START = 172851;
const END = 675869;

const isSorted = function isSorted (arr) {
  return arr.length <= 1  ? true
       : arr[0] <= arr[1] ? isSorted(arr.slice(1))
       : false;
};

// this returns 1/0 rather than true/false to make it easier to sum
const checkPass = passnum => {
  const digits = String(passnum).split('').map(n => +n);

  if (!isSorted(digits)) { return [0, 0] }

  const repeatCounts = new Map();
  digits.forEach(d => repeatCounts.set(d, (repeatCounts.get(d) || 0) + 1));

  const counts = Array.from(repeatCounts.values());
  return [counts.some(c => c > 1), counts.some(c => c === 2)].map(bool => Number(bool));
};

const [sum1, sum2] = Array.from(range(START, END + 1)).reduce(
  (acc, val) => checkPass(val).map((res, i) => res + acc[i]),
  [0, 0],
);

console.log(`part 1: ${sum1}`);
console.log(`part 2: ${sum2}`);
