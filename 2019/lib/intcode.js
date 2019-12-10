'use strict';
const utils = require('../lib/advent-utils.js');

const MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
  RELATIVE: 2,
};

const Op = class {
  // write, if given, is the index into the argument list of the parameter
  // that is used to write data into memory
  constructor (code, func, write = null) {
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
  // add
  new Op(1, function (x, y, pos) { this.data[pos] = x + y }, 2),

  // multiply
  new Op(2, function (x, y, pos) { this.data[pos] = x * y }, 2),

  // input
  new Op(3, function (pos) { this.data[pos] = this.inputs.shift() }, 0),

  // output
  new Op(4, function (val) { this.outputs.push(val) }),

  // jump-if-true
  new Op(5, function (cond, x) { this.pointer = cond !== 0 ? x : this.pointer }),

  // jump-if-false
  new Op(6, function (cond, x) { this.pointer = cond === 0 ? x : this.pointer }),

  // less-than
  new Op(7, function (x, y, pos) { this.data[pos] = x < y ? 1 : 0 }, 2),

  // equals
  new Op(8, function (x, y, pos) { this.data[pos] = x === y ? 1 : 0 }, 2),

  // relative base adjustment
  new Op(9, function (x) { this.relBase += x }),

  // halt
  new Op(99, function () { this.isRunning = false }),
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
    this.data = null;

    defaultOpcodes.forEach(op => this.addOpcode(op));
  }

  reset () {
    this.pointer = 0;
    this.relBase = 0;
    this.data = this.rom.slice();
    this.outputs = [];
  }

  addOpcode (op, func, force = false) {
    if (this.opcodes.has(op.code) && !force) {
      throw new Error(`cannot clobber opcode ${op.code}`);
    }

    this.opcodes.set(op.code, op);
  }

  get lastOutput () {
    return this.outputs[this.outputs.length - 1];
  }

  // for day 2
  runLegacyInput (input1, input2) {
    this.reset();
    this.isRunning = true;
    this.data[1] = input1;
    this.data[2] = input2;
    this.runWithInput();
    return this.data[0];
  }

  runWithInput (input, breakOnOutput = false) {
    if (!this.isRunning) {
      this.reset();
    }

    this.inputs.push(input);
    this.isRunning = true;

    while (this.isRunning) {
      const didOutput = this.runInstruction(this.data[this.pointer]);

      if (breakOnOutput && didOutput) {
        break;
      }
    }

    return this.lastOutput;
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
      return this._resolveValue(raw, modes[i], op.isWriteParam(i));
    });

    const oldPointer = this.pointer;
    const oldOutputLen = this.outputs.length;

    op.run(this, funcArgs);

    // do not bump pointer if instruction moved it.
    if (this.pointer === oldPointer) {
      this.pointer += offset;
    }

    // return whether or not we output anything
    return this.outputs.length > oldOutputLen;
  }

  _resolveValue (val, mode = MODES.POSITION, isWrite) {
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

    states.forEach(state => {
      const cpu = new IntCode(mem);
      cpu.inputs.push(state);
      this.cpus.push(cpu);
      this.lastCpu = cpu;
    });
  }

  runSingleLoop (input) {
    this.cpus.forEach(cpu => {
      input = cpu.runWithInput(input, true);
    });

    return this.lastCpu.lastOutput;
  }

  runFeedbackLoop (input) {
    do { input = this.runSingleLoop(input) } while (this.lastCpu.isRunning);
    return this.lastCpu.lastOutput;
  }
};

exports.IntCode = IntCode;
exports.MultiCore = MultiCore;
