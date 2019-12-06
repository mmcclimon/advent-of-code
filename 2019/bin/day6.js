const utils = require('../lib/advent-utils.js');

const pathToCom = (graph, v) => {
  let cur = v;
  const path = [];
  while (cur !== 'COM') {
    cur = graph.get(cur);
    path.push(cur);
  }

  return path;
};

const countOrbits = graph => {
  let total = 0;

  for (const planet of graph.keys()) {
    total += pathToCom(graph, planet).length;
  }

  return total;
};

const distToSanta = graph => {
  const youpath = pathToCom(graph, 'YOU');
  const sanpath = pathToCom(graph, 'SAN');

  const sanset = new Map(
    Array.from(sanpath.entries()).map(a => [a[1], a[0]]),
  );

  for (const [i, planet] of youpath.entries()) {
    if (sanset.has(planet)) {
      // console.log(`found ancestor ${planet} at ${i}`);
      return i + sanset.get(planet);
    }
  }
};

// const orbits = ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L', 'K)YOU', 'I)SAN'];
const orbits = utils.fileLines('input/day6.txt');

const graph = new Map();

for (const orbit of orbits) {
  const [center, orb] = orbit.split(')');
  graph.set(orb, center);
}

console.log(countOrbits(graph));
console.log(distToSanta(graph));
