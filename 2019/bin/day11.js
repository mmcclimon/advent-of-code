const { IntCode } = require('../lib/intcode.js');
const utils = require('../lib/advent-utils.js');

const Directions = {
  NORTH: 0, EAST: 90, SOUTH: 180, WEST: 270, LEFT: 0, RIGHT: 1,
};

const Robot = class {
  constructor (cpu) {
    this.cpu = cpu;
    this.x = 0;
    this.y = 0;
    this.facing = 0;
    this._map = new Map();
  }

  get posKey () {
    return [this.x, this.y].join(',');
  }

  run (startColor) {
    this.cpu.reset();

    this._map.set(this.posKey, startColor);

    do {
      const colorOn = this._map.get(this.posKey) || 0;
      this.cpu.input(colorOn);

      const color = this.cpu.run(true);
      const turn = this.cpu.run(true);

      this._map.set(this.posKey, color);

      this.turn(turn);
      this.step();
    } while (this.cpu.isRunning);

    return this._map;
  }

  turn (dir) {
    this.facing += dir === Directions.RIGHT ? 90 : -90;
    this.facing = ((this.facing % 360) + 360) % 360; // silly.
  }

  step () {
    switch (this.facing) {
      case Directions.NORTH: this.y--; break;
      case Directions.SOUTH: this.y++; break;
      case Directions.EAST: this.x++; break;
      case Directions.WEST: this.x--; break;
    }
  }

  asGraph () {
    const m = this._map;
    if (m.size === 0) { throw new Error('cannot get graph of empty map') }

    // find max/min x & y
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];

    for (const k of m.keys()) {
      const [x, y] = k.split(',').map(n => Number(n));
      minX = x < minX ? x : minX;
      minY = y < minY ? x : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
    }

    const g = [];
    for (const y of utils.range(0, maxY + 1)) {
      g.push([]);
      for (const x of utils.range(0, maxX + 1)) {
        g[y][x] = m.get([x, y].join(',')) || 0;
      }
    }

    return g;
  }
};

const part1 = cpu => new Robot(cpu).run(0).size;

const part2 = cpu => {
  const r = new Robot(cpu);
  r.run(1);
  return r.asGraph().map(row => row.map(c => c ? '█' : ' ').join('')).join('\n');
};

const [line] = utils.fileLines('input/day11.txt');
const mem = line.split(',').map(n => Number(n));
const cpu = new IntCode(mem);

console.log(`Part 1: ${part1(cpu)}`);
console.log(`Part 2:\n${part2(cpu)}`);
