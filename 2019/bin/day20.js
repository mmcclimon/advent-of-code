const utils = require('../lib/advent-utils.js');

const parseMaze = raw => {
  const grid = [];
  for (const [i, line] of raw.replace(/^\n|\n$/g, '').split('\n').entries()) {
    grid[i] = [];
    for (const [j, char] of line.split('').entries()) {
      grid[i][j] = char === ' ' ? '' : char;
    }
  }

  const outers = findOuters(grid);
  const inners = findInners(grid);

  console.log(outers);
  console.log(inners);
};

// walk around the outer bit of the grid, looking for doors.
const findOuters = grid => {
  const found = new Map();
  const uc = RegExp('[A-Z]');

  // top row
  for (const i of grid[0].keys()) {
    if (uc.test(grid[0][i])) {
      found.set(grid[0][i] + grid[1][i], [2, i]);
    }
  }

  // left edge
  for (const i of utils.range(grid.length)) {
    if (uc.test(grid[i][0])) {
      found.set(grid[i][0] + grid[i][1], [i, 2]);
    }
  }

  // bottom row
  const bottom = grid.length - 1;
  for (const i of grid[bottom].keys()) {
    if (uc.test(grid[bottom][i])) {
      found.set(grid[bottom][i] + grid[bottom - 1][i], [bottom - 2, i]);
    }
  }

  // right edge is tedious, because all the rows might not be same length
  for (const [i, row] of grid.entries()) {
    const last = row.length - 1;
    if (uc.test(row[last])) {
      const k = grid[i][last - 1] + grid[i][last];
      if (k.length === 1) continue; // silly

      found.set(k, [i, last - 2]);
    }
  }

  return found;
};

const findInners = grid => {
  const found = new Map();
  const uc = RegExp('[A-Z]');

  // find the first point in the NW that isn't a hash or dot, and start from
  // there.
  let startX = null;
  let startY = null;
  for (let dist = 2; true; dist++) {
    if (grid[dist][dist] === '') {
      startX = dist;
      startY = dist;
      break;
    }
  }

  // top row
  for (const i of utils.range(startX, grid[startX].length - 2)) {
    if (uc.test(grid[startY][i])) {
      found.set(grid[startY][i] + grid[startY + 1][i], [startY - 1, i]);
    }
  }

  // left edge
  for (const i of utils.range(startY, grid.length - 2)) {
    if (uc.test(grid[i][startX])) {
      found.set(grid[i][startX] + grid[i][startX], [i, startX - 1]);
    }
  }

  // find bottom left of center
  for (let bot = grid.length - 3, left = 2; bot >= 0; bot--, left++) {
    if (grid[bot][left] === '') {
      startY = bot;
      break;
    }
  }

  // bottom row
  for (const i of utils.range(startX, grid[startY].length - 2)) {
    if (uc.test(grid[startY][i])) {
      found.set(grid[startY - 1][i] + grid[startY][i], [startY + 1, i]);
    }
  }

  /*
  // right edge is tedious, because all the rows might not be same length
  for (const [i, row] of grid.entries()) {
    const last = row.length - 1;
    if (uc.test(row[last])) {
      const k = grid[i][last - 1] + grid[i][last];
      if (k.length === 1) continue; // silly

      found.set(k, [i, last - 2]);
    }
  }
  */

  return found;
};

const maze = `
         A
         A
  #######.#########
  #######.........#
  #######.#######.#
  #######.#######.#
  #######.#######.#
  #####  B    ###.#
BC...##  C    ###.#
  ##.##       ###.#JQ
  ##...DE  F  ###.#
  #####    G  ###.#
  #########.#####.#
DE..#######...###.#
  #.#########.###.#
FG..#########.....#
  ###########.#####
             Z
             Z
`;

parseMaze(maze);
