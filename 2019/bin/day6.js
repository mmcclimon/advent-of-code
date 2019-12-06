const utils = require('../lib/advent-utils.js');

const pathToCom = (graph, v) => {
  const path = [];

  let cur = v;
  while (cur !== 'COM') {
    cur = graph.get(cur);
    path.push(cur);
  }

  return path;
};

const countOrbits = graph => {
  return Array.from(graph.keys()).reduce(
    (acc, planet) => acc + pathToCom(graph, planet).length,
    0,
  );
};

// compute the paths to the root, the look for the earliest common ancestor
const distToSanta = graph => {
  const youpath = pathToCom(graph, 'YOU');
  const sanpath = pathToCom(graph, 'SAN');

  const sandist = new Map();
  sanpath.forEach((val, idx) => sandist.set(val, idx));

  for (const [i, planet] of youpath.entries()) {
    if (sandist.has(planet)) {
      return i + sandist.get(planet);
    }
  }
};

const orbits = utils.fileLines('input/day6.txt');

// We store the graph as a map of child => parent, which works because the
// graph is both acyclic and directed; this makes walking back to the root
// very easy.
const graph = new Map();
orbits.forEach(orbit => {
  const [center, orb] = orbit.split(')');
  graph.set(orb, center);
});

console.log(`part 1: ${countOrbits(graph)}`);
console.log(`part 2: ${distToSanta(graph)}`);
