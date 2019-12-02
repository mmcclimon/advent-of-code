const OpCode = class {
  constructor (codeval, func) {
    this.code = codeval;
    this.func = func;
  };

  // We want to encapsulate the data-slicing and arg-passing, so we'll munge
  // this into a 0-ary function that wraps this.func and calls the it with the
  // list of arguments it expects.
  compile () {
    const basefunc = this.func;
    const offset = basefunc.length + 1;

    return function () {
      let funcArgs = this.data.slice(this.pointer + 1, this.pointer + offset);
      basefunc.apply(this, funcArgs)
      this.pointer += offset;
    };
  }
};

const defaultOpcodes = [
  // addition
  new OpCode(1, function (xpos, ypos, retpos) {
    this.data[retpos] = this.data[xpos] + this.data[ypos];
  }),

  // multiplication
  new OpCode(2, function (xpos, ypos, retpos) {
    this.data[retpos] = this.data[xpos] * this.data[ypos];
  }),

  // halt
  new OpCode(99, function () {
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

    if (addDefaultOpcodes) {
      defaultOpcodes.forEach(op => this.addOpcode(op));
    }
  }

  addOpcode (op, func, force = false) {
    if (this.opcodes.has(op.code) && ! force) {
      throw `cannot clobber opcode ${op.code}`;
    }

    this.opcodes.set(op.code, op.compile());
  }

  runWithInputs (input1, input2) {
    this.isRunning = true;
    this.pointer = 0;

    this.data = this.memory.slice();
    this.data[1] = input1;
    this.data[2] = input2;

    while (this.isRunning) {
        const opcode = this.data[this.pointer];
        const func = this._resolveOpcode(opcode);
        func.call(this);
    }

    const ret = this.data[0];
    this.data = undefined;
    return ret;
  }

  _resolveOpcode (opcode) {
    const op = this.opcodes.get(opcode);
    if (! op) { throw `uh oh: unknown opcode ${opcode}!` }
    return op;
  }
};
