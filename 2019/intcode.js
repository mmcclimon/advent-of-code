exports.IntCode = class {
  defaultOpcodes = new Map([
    [ 1, function () {
      let [xpos, ypos, retpos] = this.data.slice(this.pointer + 1, this.pointer + 4);
      this.data[retpos] = this.data[xpos] + this.data[ypos];
      this.pointer += 4;
    } ],

    [2, function () {
      let [xpos, ypos, retpos] = this.data.slice(this.pointer + 1, this.pointer + 4);
      this.data[retpos] = this.data[xpos] * this.data[ypos];
      this.pointer += 4;
    } ],

    [99, function () { this.isRunning = false } ],
  ]);

  constructor (memory, { opcodes, addDefaultOpcodes }) {
    this.memory = memory;
    this.isRunning = false;
    this.opcodes = opcodes !== undefined ? opcodes : new Map();
    this.pointer = 0;

    if (addDefaultOpcodes) {
      for (const [k, f] of this.defaultOpcodes.entries()) {
        if (! this.opcodes.has(k) ) {
          this.addOpcode(k, f);
        }
      }
    }
  }

  addOpcode (key, func) {
    if (this.opcodes.has(key)) {
      throw `cannot clobber opcode ${key}`;
    }

    this.opcodes.set(key, func);
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
    const func = this.opcodes.get(opcode);
    if (! func) { throw `uh oh: unknown opcode ${opcode}!` }
    return func;
  }
};
