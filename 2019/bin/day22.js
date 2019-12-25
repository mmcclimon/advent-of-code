const utils = require('../lib/advent-utils.js');

const dealIntoNewStack = deck => deck.reverse();

const cutN = (deck, n) => {
  Array.from(utils.range(Math.abs(n))).forEach(() => {
    if (n >= 0) deck.push(deck.shift());
    else deck.unshift(deck.pop());
  });
};

const dealWithInc = (deck, n) => {
  const tmp = deck.slice();
  let idx = 0;
  while (tmp.length > 0) {
    deck[idx] = tmp.shift();
    idx = (idx + n) % deck.length;
  }
};

const doShuffle = (size, lines) => {
  const deck = Array.from(utils.range(size));
  let m;

  for (const line of lines) {
    if (line === 'deal into new stack') {
      dealIntoNewStack(deck);
    } else if (m = line.match(/^cut (-?\d+)/)) {
      cutN(deck, Number(m[1]));
    } else if (m = line.match(/^deal with increment (\d+)/)) {
      dealWithInc(deck, Number(m[1]));
    } else {
      throw new Error(`wat: ${line}`);
    }
  }

  return deck;
};

const part1 = lines => {
  const d = doShuffle(10007, lines);
  return d.findIndex(el => el === 2019);
};

const part2 = lines => {
  const d = doShuffle(119315717514047, lines);
};

const lines = utils.fileLines('input/day22.txt');
console.log(part1(lines));
console.log(part2(lines));
