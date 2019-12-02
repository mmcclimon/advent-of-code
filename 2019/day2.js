'use strict';

// let data = [1,9,10,3,2,3,11,0,99,30,40,50];

// real data
const mem = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,6,19,2,19,6,23,1,23,5,27,1,9,27,31,
             1,31,10,35,2,35,9,39,1,5,39,43,2,43,9,47,1,5,47,51,2,51,13,55,1,55,10,
             59,1,59,10,63,2,9,63,67,1,67,5,71,2,13,71,75,1,75,10,79,1,79,6,83,2,13,
             83,87,1,87,6,91,1,6,91,95,1,10,95,99,2,99,6,103,1,103,5,107,2,6,107,111,
             1,10,111,115,1,115,5,119,2,6,119,123,1,123,5,127,2,127,6,131,1,131,5,
             135,1,2,135,139,1,139,13,0,99,2,0,14,0];

OUTER: for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
        let running = true;
        let pointer = 0;

        let data = mem.slice();
        data[1] = noun;
        data[2] = verb;

        while (running) {
            const opcode = data[pointer];

            if (opcode === 99) {
                running = false;
                break;
            } else if (opcode === 1) {   // addition
                let [xpos, ypos, retpos] = data.slice(pointer + 1, pointer + 4);
                data[retpos] = data[xpos] + data[ypos];
                pointer += 4;
            } else if (opcode === 2) {
                let [xpos, ypos, retpos] = data.slice(pointer + 1, pointer + 4);
                data[retpos] = data[xpos] * data[ypos];
                pointer += 4;
            } else {
                console.error('uh oh');
            }
        }

        if (data[0] == 19690720) {
            // done!
            console.log(`noun: ${noun}, verb: ${verb}`);
            console.log('answer: ' + (100 * noun + verb));
            break OUTER;
        }
    }
}

// console.log(data);
