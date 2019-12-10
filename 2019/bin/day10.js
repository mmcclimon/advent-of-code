const utils = require('../lib/advent-utils.js');

const genMap = raw => {
  const map = new Map();

  for (const [y, row] of raw.entries()) {
    for (const [x, el] of row.split('').entries()) {
      if (el === '#') {
        const coords = [x, y];
        map.set(coords.join(','), {
          coords: coords,
          dists: new Map(),
        });
      }
    }
  }

  return map;
};

const countAsteroids = (astMap, start) => {
  // Calculate angle to every asteroid; we want the number of unique angles.
  // While we're here, calculate the distance and store the distance from this
  // to the other in the asteroid's state, which makes the other bit easier to
  // compute later.
  const seen = new Set();
  for (const [k, asteroid] of astMap.entries()) {
    if (asteroid === start) continue;

    const [x, y] = asteroid.coords;
    const adj = x - start.coords[0];
    const opp = y - start.coords[1];

    const dist = Math.sqrt(Math.pow(opp, 2) + Math.pow(adj, 2)); // pythag

    let angle = Math.atan2(opp, adj) / (Math.PI / 180); // angle in degrees
    angle = angle < 0 ? angle + 360 : angle; // map to 0-360
    angle = (angle + 90) % 360; // rotate so 0 is vertical

    start.dists.set(k, { angle: angle, dist: dist, coords: asteroid.coords });
    seen.add(angle);
  }

  return seen.size;
};

const part1 = (raw) => {
  const astMap = genMap(raw);
  let max = 0;
  let maxAst;

  for (const asteroid of astMap.values()) {
    const numSeen = countAsteroids(astMap, asteroid);
    if (numSeen > max) {
      max = numSeen;
      maxAst = asteroid;
    }
  }

  return [max, maxAst];
};

const part2 = (start) => {
  // order by angle, then dist
  const dists = Array.from(start.dists.values());
  dists.sort((a, b) => {
    if (a.angle < b.angle) return -1;
    if (a.angle > b.angle) return 1;

    if (a.dist < b.dist) return -1;
    if (a.dist > b.dist) return 1;

    return 0;
  });

  // run the thing
  const destroyed = [];
  const s = new Set();
  let lastAngle = null;

  for (const asteroid of dists.values()) {
    const coords = asteroid.coords;

    // skip asteroids we've already hit and ones that just became visible
    if (s.has(coords)) continue;
    if (asteroid.angle === lastAngle) continue;

    s.add(coords);
    destroyed.push(coords);
    lastAngle = asteroid.angle;
  }

  const target = destroyed[199];
  return target[0] * 100 + target[1];
};

const raw = utils.fileLines('input/day10.txt');
const [dist1, ast1] = part1(raw);
console.log(`part 1: ${dist1}`);
console.log(`part 2: ${part2(ast1)}`);
