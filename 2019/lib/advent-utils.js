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
