'use strict';
const { range } = require('../lib/advent-utils.js');

const MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
};

const OpCode = class {
  constructor (codeval, func) {
    this.code = codeval;
    this.func = func;
    this.numArgs = func.length - 1; // account for modes as last one
    this.compiled = this.compile();
  };

  // We want to encapsulate the data-slicing and arg-passing, so we'll munge
  // this into a 0-ary function that wraps this.func and calls the it with the
  // list of arguments it expects.
  compile () {
    const basefunc = this.func;
    const offset = this.numArgs + 1;

    return function (modes) {
      const pointerBefore = this.pointer;

      const funcArgs = this.data.slice(this.pointer + 1, this.pointer + offset);
      funcArgs.push(modes);
      basefunc.apply(this, funcArgs);

      // do not bump pointer if instruction moved it.
      if (this.pointer === pointerBefore) {
        this.pointer += offset;
      }
    };
  }
};

const defaultOpcodes = [
  // addition
  new OpCode(1, function (x, y, retpos, modes) {
    const xval = this._resolveValue(x, modes[0]);
    const yval = this._resolveValue(y, modes[1]);
    this.data[retpos] = xval + yval;
  }),

  // multiplication
  new OpCode(2, function (x, y, retpos, modes) {
    const xval = this._resolveValue(x, modes[0]);
    const yval = this._resolveValue(y, modes[1]);
    this.data[retpos] = xval * yval;
  }),

  // input
  new OpCode(3, function (pos, modes) {
    this.data[pos] = this.inputs.shift();
  }),

  // output
  new OpCode(4, function (pos, modes) {
    this.outputs.push(this.data[pos]);
  }),

  // jump-if-true
  new OpCode(5, function (c, v, modes) {
    const cond = this._resolveValue(c, modes[0]);
    const val = this._resolveValue(v, modes[1]);
    if (cond !== 0) {
      this.pointer = val;
    }
  }),

  // jump-if-false
  new OpCode(6, function (c, v, modes) {
    const cond = this._resolveValue(c, modes[0]);
    const val = this._resolveValue(v, modes[1]);
    if (cond === 0) {
      this.pointer = val;
    }
  }),

  // less-than
  new OpCode(7, function (x, y, pos, modes) {
    const xval = this._resolveValue(x, modes[0]);
    const yval = this._resolveValue(y, modes[1]);
    this.data[pos] = xval < yval ? 1 : 0;
  }),

  // equals
  new OpCode(8, function (x, y, pos, modes) {
    const xval = this._resolveValue(x, modes[0]);
    const yval = this._resolveValue(y, modes[1]);
    this.data[pos] = xval === yval ? 1 : 0;
  }),

  // halt
  new OpCode(99, function (modes) {
    this.isRunning = false;
  }),
];

exports.OpCode = OpCode;

exports.IntCode = class {
  constructor (memory, { opcodes, addDefaultOpcodes }) {
    this.memory = memory;
    this.isRunning = false;
    this.opcodes = opcodes !== undefined ? opcodes : new Map();
    this.pointer = 0;
    this.inputs = [];
    this.outputs = [];

    if (addDefaultOpcodes) {
      defaultOpcodes.forEach(op => this.addOpcode(op));
    }
  }

  addOpcode (op, func, force = false) {
    if (this.opcodes.has(op.code) && !force) {
      throw new Error(`cannot clobber opcode ${op.code}`);
    }

    this.opcodes.set(op.code, op);
  }

  runWithInputs (inputs) {
    this.isRunning = true;
    this.pointer = 0;
    this.inputs = inputs;
    this.outputs = [];

    this.data = this.memory.slice();

    while (this.isRunning) {
      const instruction = this.data[this.pointer];
      const [func, modes] = this._resolveInstruction(instruction);
      func.call(this, modes);
    }

    this.data = undefined;
    return this.outputs;
  }

  // 1002 should compile to 2, [0, 1])
  _resolveInstruction (instruction) {
    const s = String(instruction);

    const opcode = s.slice(-2);
    const op = this.opcodes.get(Number(opcode));
    if (!op) { throw new Error(`uh oh: unknown opcode ${opcode} processing instruction ${s}!`) }

    const modes = s.slice(0, -2).split('').reverse().map(n => Number(n));

    // fill with zeros
    if (modes.length < op.numArgs) {
      for (const _ of range(op.numArgs - modes.length)) {
        modes.push(0);
      }
    }

    return [op.compiled, modes];
  }

  _resolveValue (val, mode) {
    if (mode === MODES.POSITION) {
      return this.data[val];
    }

    if (mode === MODES.IMMEDIATE) {
      return val;
    }
  }
};
