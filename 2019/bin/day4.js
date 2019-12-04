const isSorted = function isSorted (arr) {
  return arr.length <= 1  ? true
       : arr[0] <= arr[1] ? isSorted(arr.slice(1))
       : false;
};

const isValid = passnum => {
  const digits = String(passnum).split('').map(n => +n);

  if (!isSorted(digits)) { return [false, false] }

  const repeatCounts = new Map();
  digits.forEach(d => repeatCounts.set(d, (repeatCounts.get(d) || 0) + 1));

  const counts = Array.from(repeatCounts.values());
  return [counts.some(c => c > 1), counts.some(c => c === 2)];
};

let [sum1, sum2] = [0, 0];

for (let i = 172851; i <= 675869; i++) {
  const [ok1, ok2] = isValid(i);
  sum1 += ok1 ? 1 : 0;
  sum2 += ok2 ? 1 : 0;
}

console.log(`part 1: ${sum1}`);
console.log(`part 2: ${sum2}`);
