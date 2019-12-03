'use strict';

const utils = require('../lib/advent-utils.js');

// return a map of 'x,y': stepcount points the wire travels through
const parseLine = (line) => {
  const allPoints = new Map();
  let [x, y, steps] = [0, 0, 1];

  for (const hunk of line.split(',')) {
    const dir = hunk.substring(0, 1);
    let dist = parseInt(hunk.substring(1));

    while (dist > 0) {
      switch (dir) {
        case 'R': x++; break;
        case 'L': x--; break;
        case 'U': y++; break;
        case 'D': y--; break;
        default: throw new Error(`unknown direction ${dir}`);
      }

      const k = JSON.stringify([x, y]); // for want of a tuple...

      if (! allPoints.has(k)) {
        allPoints.set(k, steps);
      }

      dist--;
      steps++;
    }
  }

  return allPoints;
};

const findClosestIntersection = (wire1, wire2) => {
  const w1 = parseLine(wire1);
  const w2 = parseLine(wire2);

  let closest = Infinity;
  let easiest = Infinity;

  for (const point of w1.keys()) {
    if (! w2.has(point)) { continue }

    const [x, y] = JSON.parse(point); // silly

    const dist = Math.abs(x) + Math.abs(y);
    closest = dist < closest ? dist : closest;

    const resistance = w1.get(point) + w2.get(point);
    easiest = resistance < easiest ? resistance : easiest;
  }

  return [closest, easiest];
};

const tests = [
  ['R8,U5,L5,D3', 'U7,R6,D4,L4', 6, 30],
  ['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83', 159, 610],
  ['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7', 135, 410],
];

for (const t of tests) {
  const [r1, r2] = findClosestIntersection(t[0], t[1]);
  console.assert(r1 === t[2], 'part 1 is wrong');
  console.assert(r2 === t[3], 'part 2 is wrong');
}

// real data
const [w1, w2] = utils.fileLines('input/day3.txt');
const [res1, res2] = findClosestIntersection(w1, w2);
console.log(`part 1: ${res1}`);
console.log(`part 2: ${res2}`);
