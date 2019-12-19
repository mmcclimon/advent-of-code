const utils = require('../lib/advent-utils.js');

const Maze = class {
  constructor (input) {
    this.grid = [];
    this.keys = new Map();
    this.doors = new Map();
    this.person = null;

    for (const [y, row] of input.split('\n').entries()) {
      this.grid[y] = [];
      for (const [x, char] of row.split('').entries()) {
        this.grid[y][x] = char;

        if (char.match(/[A-Z]/)) {
          this.doors.set(this._key(x, y), char);
        } else if (char.match(/[a-z]/)) {
          this.keys.set(this._key(x, y), char);
        } else if (char === '@') {
          this.person = { x: x, y: y };
        }
      }
    }
  }

  _key (x, y) {
    return [x, y].join(',');
  }

  hasWallAt (x, y) {
    return this.grid[x][y] === '#';
  }

  hasKeyAt (x, y) {
    return this.keys.has(this._key(x, y));
  }

  hasDoorAt (x, y) {
    return this.doors.has(this._key(x, y));
  }

  closestKey () {
    const q = [];
    const seen = new Set();
    const found = [];

    q.push(this._key(this.person.x, this.person.y));

    while (q.length > 0) {
      const v = q.shift();
      if (this.keys.has(v)) {
        return v;
      }
    }
// procedure BFS(G,start_v):
//     let Q be a queue
//     label start_v as discovered
//     Q.enqueue(start_v)
//     while Q is not empty
//         v = Q.dequeue()
//         if v is the goal:
//             return v
//         for all edges from v to w in G.adjacentEdges(v) do
//             if w is not labeled as discovered:
//                 label w as discovered
//                 w.parent = v
//                 Q.enqueue(w) 
  }

};

const map = `
#########
#b.A.@.a#
#########
`;

const maze = new Maze(map);
console.log(maze.closestKey());
