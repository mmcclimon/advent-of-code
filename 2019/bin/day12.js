const AXES = ['x', 'y', 'z'];

const lcm = (a, b) => {
  const gcd = function gcd (m, n) {
    if (n === 0) return m;
    return gcd(n, m % n);
  };

  return Math.abs(a * b) / gcd(a, b);
};

const Moon = class {
  constructor (x, y, z) {
    this.initialPos = { x: x, y: y, z: z };
    this.pos = { x: x, y: y, z: z };
    this.vel = { x: 0, y: 0, z: 0 };
  }

  reset () {
    AXES.forEach(axis => {
      this.pos[axis] = this.initialPos[axis];
      this.vel[axis] = 0;
    });
  }

  move () {
    AXES.forEach(axis => { this.pos[axis] += this.vel[axis] });
  }

  totalEnergy () {
    return this.potentialEnergy * this.kineticEnergy;
  }

  get potentialEnergy () {
    return AXES.reduce((acc, axis) => acc + Math.abs(this.pos[axis]), 0);
  }

  get kineticEnergy () {
    return AXES.reduce((acc, axis) => acc + Math.abs(this.vel[axis]), 0);
  }
};

const System = class {
  constructor (...moons) {
    this.moons = moons;
    this.steps = 0;
  }

  reset () {
    this.steps = 0;
    this.moons.forEach(m => m.reset());
  }

  totalEnergy () {
    return this.moons.reduce((acc, moon) => acc + moon.totalEnergy(), 0);
  }

  step (n = 1) {
    for (let i = 0; i < n; i++) {
      this._step();
    }

    return this;
  }

  findPeriods () {
    const seen = { x: new Set(), y: new Set(), z: new Set() };
    const found = { x: false, y: false, z: false };

    while (true) {
      const thisStep = this.steps;
      this._step();

      AXES.forEach(axis => {
        const key = this.moons.map(m => [m.pos[axis], m.vel[axis]]).join(',');

        if (!found[axis] && seen[axis].has(key)) {
          // hey neat, a repeat! that's the period for this axis.
          found[axis] = thisStep;
        }

        seen[axis].add(key);
      });

      if (found.x && found.y && found.z) {
        return Object.values(found);
      }
    }
  }

  _step () {
    // gravity
    this._compareMoons(this.moons[0], this.moons[1]);
    this._compareMoons(this.moons[0], this.moons[2]);
    this._compareMoons(this.moons[0], this.moons[3]);
    this._compareMoons(this.moons[1], this.moons[2]);
    this._compareMoons(this.moons[1], this.moons[3]);
    this._compareMoons(this.moons[2], this.moons[3]);

    // velocity
    this.moons.forEach(m => m.move());

    this.steps++;
  }

  _compareMoons (a, b) {
    AXES.forEach(axis => {
      if (a.pos[axis] > b.pos[axis]) {
        a.vel[axis]--;
        b.vel[axis]++;
      } else if (a.pos[axis] < b.pos[axis]) {
        a.vel[axis]++;
        b.vel[axis]--;
      }
    });
  }
};

const part1 = system => {
  system.reset();
  system.step(1000);
  return system.totalEnergy();
};

const part2 = system => {
  system.reset();
  return system.findPeriods().reduce((acc, p) => lcm(acc, p), 1);
};

const i = new Moon(-15, 1, 4);
const e = new Moon(1, -10, -8);
const g = new Moon(-5, 4, 9);
const c = new Moon(4, 6, -2);

const system = new System(i, e, g, c);

console.log(part1(system));
console.log(part2(system));
