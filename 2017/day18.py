#!python

from collections import defaultdict

class Duet(object):
    def __init__(self, lines, pid, other):
        self.input_lines = lines
        self.registers = defaultdict(int)
        self.buffer = []
        self.ptr = 0
        self.pid = pid
        self.registers['p'] = pid

        self.terminated = False
        self.blocked = False
        self.num_sent = 0
        self.other = other

    def get(self, val):
        try:
            return int(val)
        except ValueError:
            return self.registers[val]

    def next(self):
        if self.terminated or self.ptr < 0 or self.ptr > len(self.input_lines):
            self.terminated = True
            return

        res = self.input_lines[self.ptr].split()
        instr = res[0]
        target = res[1]
        what = res[2] if len(res) > 2 else None

        if instr == 'snd':
            self.other.buffer.append(self.get(target))
            self.other.blocked = False
            self.num_sent += 1

        if instr == 'set':
            self.registers[target] = self.get(what)

        if instr == 'add':
            self.registers[target] += self.get(what)

        if instr == 'mul':
            self.registers[target] *= self.get(what)

        if instr == 'mod':
            self.registers[target] %= self.get(what)

        if instr == 'rcv':
            if len(self.buffer) > 0:
                self.registers[target] = self.buffer.pop(0)
            else:
                self.blocked = True
                return

        if instr == 'jgz':
            if self.get(target) > 0:
                self.ptr += self.get(what)
                return

        self.ptr += 1

with open('input/day18.txt') as f:
    input_lines = f.readlines()

zero = Duet(input_lines, 0, None)
one = Duet(input_lines, 1, zero)
zero.other = one

while not ((zero.terminated or zero.blocked) and (one.terminated or one.blocked)):
    zero.next()
    one.next()

print zero.registers
print "total sent by %s: %s" % (zero.pid, zero.num_sent)
print one.registers
print "total sent by %s: %s" % (one.pid, one.num_sent)

