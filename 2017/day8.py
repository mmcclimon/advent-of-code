#!python

import re

pattern = re.compile(r'''^(?P<reg>[a-z]+) \s
                          (?P<instr>inc|dec) \s
                          (?P<amt>-?[0-9]+) \s
                          if \s
                          (?P<other_reg>[a-z]+) \s
                          (?P<op>[!=<>]+) \s
                          (?P<cond>-?[0-9]+)
                     ''', re.X)

registers = dict()
highest = 0
ops = {
    '==': lambda val,cond: val == cond,
    '!=': lambda val,cond: val != cond,
    '<=': lambda val,cond: val <= cond,
    '>=': lambda val,cond: val >= cond,
    '>':  lambda val,cond: val > cond,
    '<':  lambda val,cond: val < cond,
}

with open('input/day8.txt') as input_lines:
    for line in input_lines:
        m = pattern.search(line)

        reg = m.group('reg')
        instruction = m.group('instr')
        val = int(m.group('amt'))
        op = m.group('op')
        other_reg = m.group('other_reg')
        cond = int(m.group('cond'))

        if other_reg not in registers:
            registers[other_reg] = 0

        if reg not in registers:
            registers[reg] = 0


        if ops[op](registers[other_reg], cond):
            if instruction == 'inc':
                registers[reg] += val
            else:
                registers[reg] -= val

        highest = max(highest, registers[reg])

    print "maximum value is %s " % max(registers.values())
    print "highest value ever seen was %s " % highest




