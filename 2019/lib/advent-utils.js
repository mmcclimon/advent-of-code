const fs = require('fs');
const readline = require('readline');

// synchronous, read whole files into memory and return arrays
exports.fileLines = (fn) =>
  fs.readFileSync(fn)
    .toString()
    .split('\n')
    .filter(s => s.length > 0);

exports.fileLinesInt = (fn) => exports.fileLines(fn).map(n => parseInt(n));

// async but require callbacks
exports.getLines = async (fn, cb) => {
  const rl = readline.createInterface({ input: fs.createReadStream(fn) });
  for await (const line of rl) {
    cb(line);
  }
};

exports.getLinesInt = async (filename, cb) => {
  return exports.getLines(filename, (line) => cb(parseInt(line)));
};

// python's range(); it is bananas that JS does not have this by default
exports.range = function * (x, y, z) {
  const start = arguments.length > 1 ? x : 0;
  const end   = arguments.length > 1 ? y : x;
  const step  = z || 1;
  const shouldRun = step > 0 ? i => i < end : i => i > end;

  for (let i = start; shouldRun(i); i += step) {
    yield i;
  }
};

exports.permutations = input => {
  const out = [];

  // heap's algorithm
  const gen = function gen (k, arr) {
    if (k === 1) {
      out.push(arr.slice());
      return;
    }

    gen(k - 1, arr);

    const swap = (i, j) => { [arr[i], arr[j]] = [arr[j], arr[i]] };

    for (let i = 0; i < k - 1; i++) {
      const which = k % 2 === 0 ? i : 0;
      swap(which, k - 1);
      gen(k - 1, arr);
    }
  };

  gen(input.length, input);
  return out;
};
