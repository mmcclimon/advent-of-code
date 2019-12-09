'use strict';
const utils = require('../lib/advent-utils.js');

const MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
  RELATIVE: 2,
};

const OpCode = class {
  constructor ({ code, func, write }) {
    this.code = code;
    this.func = func;
    this.numArgs = func.length;
    this.writeParam = write;
  };

  run (cpu, funcargs) {
    this.func.apply(cpu, funcargs);
  }

  isWriteParam (i) {
    return i === this.writeParam;
  }
};

const defaultOpcodes = [
  // addition
  new OpCode({
    code: 1,
    write: 2,
    func: function (x, y, retpos) { this.data[retpos] = x + y },
  }),

  // multiplication
  new OpCode({
    code: 2,
    write: 2,
    func: function (x, y, retpos) { this.data[retpos] = x * y },
  }),

  // input
  new OpCode({
    code: 3,
    write: 0,
    func: function (pos) { this.data[pos] = this.inputs.shift() },
  }),

  // output
  new OpCode({
    code: 4,
    func: function (val) { this.outputs.push(val) },
  }),

  // jump-if-true
  new OpCode({
    code: 5,
    func: function (cond, val) { this.pointer = cond !== 0 ? val : this.pointer },
  }),

  // jump-if-false
  new OpCode({
    code: 6,
    func: function (cond, val) { this.pointer = cond === 0 ? val : this.pointer },
  }),

  // less-than
  new OpCode({
    code: 7,
    write: 2,
    func: function (x, y, pos) { this.data[pos] = x < y ? 1 : 0 },
  }),

  // equals
  new OpCode({
    code: 8,
    write: 2,
    func: function (x, y, pos) { this.data[pos] = x === y ? 1 : 0 },
  }),

  // relative base adjustment
  new OpCode({
    code: 9,
    func: function (x) { this.relBase += x },
  }),

  // halt
  new OpCode({
    code: 99,
    func: function () { this.isRunning = false },
  }),
];

const IntCode = class {
  constructor (memory) {
    this.rom = memory;
    this.isRunning = false;
    this.opcodes = new Map();
    this.pointer = 0;
    this.relBase = 0;
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

  // TODO: clean up these extra boolean params
  runWithInputs (inputs, resetBefore = true, breakOnOutput = false) {
    this.isRunning = true;
    Array.prototype.push.apply(this.inputs, inputs);

    if (resetBefore || !this.data) {
      this.pointer = 0;
      this.relBase = 0;
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
      return this._resolveValue(raw, modes[i] || MODES.POSITION, op.isWriteParam(i), s);
    });

    const pointerBefore = this.pointer;

    op.run(this, funcArgs);

    // do not bump pointer if instruction moved it.
    if (this.pointer === pointerBefore) {
      this.pointer += offset;
    }
  }

  _resolveValue (val, mode, isWrite, inst) {
    if (mode === MODES.POSITION) {
      return isWrite ? val : (this.data[val] || 0);
    }

    if (mode === MODES.IMMEDIATE) {
      return val;
    }

    if (mode === MODES.RELATIVE) {
      const pos = this.relBase + val;
      return isWrite ? pos : (this.data[pos] || 0);
    }
  }
};

const MultiCore = class {
  constructor (mem, states) {
    this.cpus = [];

    for (const i of utils.range(states.length)) {
      const cpu = new IntCode(mem);
      cpu.inputs.push(states[i]);
      this.cpus.push(cpu);
      this.lastCpu = cpu;
    }
  }

  runSingleLoop (input) {
    this.cpus.forEach(cpu => {
      input = cpu.runWithInputs([input], false, true);
    });

    return this.lastCpu.lastOutput();
  }

  runFeedbackLoop (input) {
    do { input = this.runSingleLoop(input) } while (this.lastCpu.isRunning);
    return this.lastCpu.lastOutput();
  }
};

exports.OpCode = OpCode;
exports.IntCode = IntCode;
exports.MultiCore = MultiCore;
