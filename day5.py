#!python

instr = [ 0, 3, 0, 1, -3]

with open('input/day5.txt') as f:
    instr = map(int, f.readlines())
    pointer = 0
    total_jumps = 0

    while True:
        this_jump = instr[pointer]
        # inst[pointer] += 1                            # easy case
        instr[pointer] += 1 if this_jump < 3 else -1    # hard case
        pointer += this_jump
        total_jumps += 1
        if pointer < 0 or pointer >= len(instr):
            print "escaped in {} jumps".format(total_jumps)
            break

