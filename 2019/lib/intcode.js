'use strict';
const { range } = require('../lib/advent-utils.js');

const MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
};

const OpCode = class {
  constructor ({ code, func, resolve = [] }) {
    this.code = code;
    this.func = func;
    this.numArgs = func.length;

    // I don't really like this "should I resolve the thing" logic, but I'm
    // done fiddling for now.
    this._resolveIndices = new Set(resolve);
  };

  run (cpu, funcargs) {
    this.func.apply(cpu, funcargs);
  }

  shouldResolveParam (i) {
    return this._resolveIndices.has(i);
  }
};

const defaultOpcodes = [
  // addition
  new OpCode({
    code: 1,
    resolve: [0, 1],
    func: function (x, y, retpos) { this.data[retpos] = x + y },
  }),

  // multiplication
  new OpCode({
    code: 2,
    resolve: [0, 1],
    func: function (x, y, retpos) { this.data[retpos] = x * y },
  }),

  // input
  new OpCode({
    code: 3,
    func: function (pos) { this.data[pos] = this.inputs.shift() },
  }),

  // output
  new OpCode({
    code: 4,
    func: function (pos) { this.outputs.push(this.data[pos]) },
  }),

  // jump-if-true
  new OpCode({
    code: 5,
    resolve: [0, 1],
    func: function (cond, val) { this.pointer = cond !== 0 ? val : this.pointer },
  }),

  // jump-if-false
  new OpCode({
    code: 6,
    resolve: [0, 1],
    func: function (cond, val) { this.pointer = cond === 0 ? val : this.pointer },
  }),

  // less-than
  new OpCode({
    code: 7,
    resolve: [0, 1],
    func: function (x, y, pos) { this.data[pos] = x < y ? 1 : 0 },
  }),

  // equals
  new OpCode({
    code: 8,
    resolve: [0, 1],
    func: function (x, y, pos) { this.data[pos] = x === y ? 1 : 0 },
  }),

  // halt
  new OpCode({
    code: 99,
    func: function () { this.isRunning = false },
  }),
];

exports.OpCode = OpCode;

exports.IntCode = class {
  constructor (memory) {
    this.rom = memory;
    this.isRunning = false;
    this.opcodes = new Map();
    this.pointer = 0;
    this.inputs = [];
    this.outputs = [];

    defaultOpcodes.forEach(op => this.addOpcode(op));
  }

  addOpcode (op, func, force = false) {
    if (this.opcodes.has(op.code) && !force) {
      throw new Error(`cannot clobber opcode ${op.code}`);
    }

    this.opcodes.set(op.code, op);
  }

  runWithInputs (inputs, resetBefore = true, breakOnOutput = false) {
    this.isRunning = true;
    this.inputs = inputs;

    if (resetBefore || !this.data) {
      this.pointer = 0;
      this.data = this.rom.slice();
      this.outputs = [];
    }

    while (this.isRunning) {
      const outputBefore = this.outputs.length;

      const instruction = this.data[this.pointer];
      this.runInstruction(instruction);

      if (breakOnOutput && this.outputs.length > outputBefore) {
        return this.lastOutput();
      }
    }

    return this.lastOutput();
  }

  lastOutput () {
    return this.outputs[this.outputs.length - 1];
  }

  runInstruction (instruction) {
    const s = String(instruction);

    const opcode = s.slice(-2);
    const op = this.opcodes.get(Number(opcode));
    if (!op) { throw new Error(`uh oh: unknown opcode ${opcode}!`) }

    const modes = s.slice(0, -2).split('').reverse().map(n => Number(n));

    // resolve values as necessary
    const offset = op.numArgs + 1;
    const rawValues = this.data.slice(this.pointer + 1, this.pointer + offset);

    const funcArgs = rawValues.map((raw, i) => {
      return op.shouldResolveParam(i)
             ? this._resolveValue(raw, modes[i] || MODES.POSITION)
             : raw;
    });

    const pointerBefore = this.pointer;

    op.run(this, funcArgs);

    // do not bump pointer if instruction moved it.
    if (this.pointer === pointerBefore) {
      this.pointer += offset;
    }
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
