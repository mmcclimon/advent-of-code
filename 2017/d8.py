#!python
# -*- coding: utf-8 -*-

from collections import deque
import re

class Screen(object):
    def __init__(self, cols, rows):
        self.screen = []
        for i in xrange(rows):
            self.screen.append([0] * cols)

    def __repr__(self):
        out = ''
        for row in self.screen:
            out += ''.join('█' if c else '_' for c in row)
            out += '\n'
        return out

    def rect(self, cols, rows):
        for i in xrange(rows):
            for j in xrange(cols):
                self.screen[i][j] = 1

    def rotate_col(self, idx, amt):
        col = deque([ row[idx] for row in self.screen ])
        col.rotate(amt)
        for i in xrange(len(self.screen)):
            self.screen[i][idx] = col[i]

    def rotate_row(self, idx, amt):
        row = deque(self.screen[idx])
        row.rotate(amt)
        self.screen[idx] = list(row)

    def total_lit(self):
        return sum(sum(row) for row in self.screen)



screen = Screen(50, 6)

with open('input/d8.txt') as input_lines:
    for line in input_lines:
        if line.startswith('rect'):
            m = re.search(r'([0-9]+)x([0-9]+)', line)
            screen.rect(int(m.group(1)), int(m.group(2)))

        elif line.startswith('rotate column'):
            m = re.search(r'x=([0-9]+) by ([0-9]+)', line)
            screen.rotate_col(int(m.group(1)), int(m.group(2)))

        elif line.startswith('rotate row'):
            m = re.search(r'y=([0-9]+) by ([0-9]+)', line)
            screen.rotate_row(int(m.group(1)), int(m.group(2)))



print screen
print "total lit: %s" % screen.total_lit()
