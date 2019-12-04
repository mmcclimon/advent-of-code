const isValid = passnum => {
  const s = String(passnum);
  const digits = s.split('').map(d => Number(d));

  // const isAscending = s === s.split('').sort().join('');
  // if (!isAscending) {
  //   return false;
  // }

  let hasDouble = false;
  let hasDoubleBis = false;

  const repeatCounts = new Map();
  repeatCounts.set(digits[0], 1);

  for (let i = 1; i < digits.length; i++) {
    const [prev, cur] = digits.slice(i - 1, i + 1);
    if (cur < prev) {
      return [false, false];
    }

    if (prev === cur) {
      hasDouble = true;
    }

    repeatCounts.set(cur, (repeatCounts.get(cur) || 0) + 1);
  }

  hasDoubleBis = Array.from(repeatCounts.values()).some(c => c === 2);
  return [hasDouble, hasDoubleBis];
};

// console.log(isValid(112233));
// console.log(isValid(123444));
// console.log(isValid(111122));
// console.log(isValid(177778));

let sum1 = 0;
let sum2 = 0;
for (let i = 172851; i <= 675869; i++) {
  const [ok1, ok2] = isValid(i);
  sum1 += ok1 ? 1 : 0;
  sum2 += ok2 ? 1 : 0;

  // numValid += isValid(i) ? 1 : 0;
}

console.log(sum1, sum2);
