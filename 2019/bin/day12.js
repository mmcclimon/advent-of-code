const lcm = (a, b) => {
  const gcd = function gcd (m, n) {
    if (n === 0) return m;
    return gcd(n, m % n);
  };

  return Math.abs(a * b) / gcd(a, b);
};

const Moon = class {
  constructor (x, y, z) {
    this.initialPos = [x, y, z];

    this.posX = x;
    this.posY = y;
    this.posZ = z;

    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;
    this.period = null;
  }

  reset () {
    [this.posX, this.posY, this.posZ] = this.initialPos;
    [this.velX, this.velY, this.velZ] = [0, 0, 0];
  }

  move () {
    this.posX += this.velX;
    this.posY += this.velY;
    this.posZ += this.velZ;
  }

  totalEnergy () {
    return this.potentialEnergy * this.kineticEnergy;
  }

  get potentialEnergy () {
    return Math.abs(this.posX) + Math.abs(this.posY) + Math.abs(this.posZ);
  }

  get kineticEnergy () {
    return Math.abs(this.velX) + Math.abs(this.velY) + Math.abs(this.velZ);
  }

  asString () {
    return `pos=<x=${this.posX}, y=${this.posY}, z=${this.posZ}>, vel=<x=${this.velX}, y=${this.velY}, z=${this.velZ}>`;
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
    const seenX = new Set();
    const seenY = new Set();
    const seenZ = new Set();
    let foundX = false;
    let foundY = false;
    let foundZ = false;

    while (true) {
      const s = this.steps;
      this._step();

      // add all xs, ys, and zs
      const xk = this.moons.map(m => [m.posX, m.velX]).join(',');
      const yk = this.moons.map(m => [m.posY, m.velY]).join(',');
      const zk = this.moons.map(m => [m.posZ, m.velZ]).join(',');

      if (!foundX && seenX.has(xk)) { foundX = s }
      if (!foundY && seenY.has(yk)) { foundY = s }
      if (!foundZ && seenZ.has(zk)) { foundZ = s }

      if (foundX && foundY && foundZ) {
        return [foundX, foundY, foundZ];
      }

      seenX.add(xk);
      seenY.add(yk);
      seenZ.add(zk);
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
    ['X', 'Y', 'Z'].forEach(axis => {
      if (a['pos' + axis] > b['pos' + axis]) {
        a['vel' + axis]--;
        b['vel' + axis]++;
      } else if (a['pos' + axis] < b['pos' + axis]) {
        a['vel' + axis]++;
        b['vel' + axis]--;
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
