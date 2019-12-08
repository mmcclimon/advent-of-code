'use strict';
const utils = require('../lib/advent-utils.js');

const splitLayers = (s, size) => {
  const [w, h] = size;
  return s.split('').map(n => Number(n)).partition(w * h);
};

const partOne = (s, size) => {
  const layers = splitLayers(s, size);
  let minCount = Infinity;
  let minLayer = null;

  layers.forEach(layer => {
    const count = layer.count(0);
    if (count < minCount) {
      [minCount, minLayer] = [count, layer];
    }
  });

  return minLayer.count(1) * minLayer.count(2);
};

const partTwo = (s, size) => {
  const [w, h] = size;
  const layers = splitLayers(s, size).map(layer => layer.partition(w));
  const img = Array.from(utils.range(h)).map(() => []);

  // for every pixel, take the first non-transparent one.
  for (const x of utils.range(h)) {
    for (const y of utils.range(w)) {
      for (const layer of layers) {
        const px = layer[x][y];
        if (px !== 2) {
          img[x][y] = px;
          break;
        }
      }
    }
  }

  // output
  return img.map(row => row.map(d => d === 0 ? ' ' : '█').join('')).join('\n');
};

utils.addArrayMagic();

const [line] = utils.fileLines('input/day8.txt');
console.log(partOne(line, [25, 6]));
console.log(partTwo(line, [25, 6]));
