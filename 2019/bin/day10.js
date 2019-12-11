const utils = require('../lib/advent-utils.js');

const AsteroidMap = class {
  constructor (raw) {
    this.map = new Map();

    for (const [y, row] of raw.entries()) {
      for (const [x, el] of row.split('').entries()) {
        if (el === '#') {
          const a = new Asteroid(x, y);
          this.map.set(a.key, a);
        }
      }
    }
  }

  [Symbol.iterator] () {
    return this.map.values();
  }
};

const Asteroid = class {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.key = x + ',' + y;
    this.dists = new Map();
    this.angles = new Map();
  }

  get coords () {
    return [this.x, this.y];
  }

  coordsRelativeTo (other) {
    return [other.x - this.x, other.y - this.y];
  }

  distanceTo (other) {
    const have = this.dists.get(other.key);
    if (have) return have;

    const [x, y] = this.coordsRelativeTo(other);
    const dist = Math.sqrt((x * x) + (y * y)); // pythagoras

    this.dists.set(other.key, dist);
    return dist;
  }

  angleTo (other) {
    const have = this.angles.get(other.key);
    if (have) return have;

    const [x, y] = this.coordsRelativeTo(other);
    let angle = Math.atan2(y, x) / (Math.PI / 180); // angle in degrees
    angle = angle < 0 ? angle + 360 : angle; // map to 0-360
    angle = (angle + 90) % 360; // rotate so 0 is vertical

    this.angles.set(other.key, angle);
    return angle;
  }
};

// Calculate angle to every asteroid; we want the number of unique angles.
const countAsteroids = (astMap, start) => {
  return new Set(
    Array.from(astMap).filter(a => a !== start).map(a => start.angleTo(a)),
  ).size;
};

const part1 = (map) => {
  return Array.from(map).reduce(
    (acc, asteroid) => {
      const num = countAsteroids(map, asteroid);
      return num > acc[0] ? [num, asteroid] : acc;
    },
    [0, null],
  );
};

const part2 = (map, start) => {
  // order by angle, then dist; store as a map to make deletion fast
  const sorted = new Map(Array.from(map).filter(a => a !== start).sort((a, b) => {
    if (start.angleTo(a) < start.angleTo(b)) return -1;
    if (start.angleTo(a) > start.angleTo(b)) return 1;

    if (start.distanceTo(a) < start.distanceTo(b)) return -1;
    if (start.distanceTo(a) > start.distanceTo(b)) return 1;

    return 0;
  }).map(a => [a.key, a]));

  // run the thing
  const destroyed = [];

  while (sorted.size > 1) {
    let lastAngle = null;
    for (const [key, asteroid] of sorted.entries()) {
      // skip asteroids that *just* became visible
      const thisAngle = start.angleTo(asteroid);
      if (thisAngle === lastAngle) continue;

      sorted.delete(key);
      destroyed.push(asteroid);
      lastAngle = thisAngle;
    }
  }

  const target = destroyed[199];
  return target.x * 100 + target.y;
};

const raw = utils.fileLines('input/day10.txt');
const map = new AsteroidMap(raw);

const [dist1, ast1] = part1(map);
console.log(`part 1: ${dist1}`);
console.log(`part 2: ${part2(map, ast1)}`);
