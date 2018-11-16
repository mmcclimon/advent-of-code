#!python

from collections import defaultdict

class Component(object):
    def __init__(self, line):
        self.ports = map(int, line.split('/'))

    def __repr__(self):
        return '<Component %s>' % self.ports

    def has_port(self, n):
        return n in self.ports

    def as_tuple(self):
        return tuple(self.ports)

input_lines = [
    '0/2',
    '2/2',
    '2/3',
    '3/4',
    '3/5',
    '0/1',
    '10/1',
    '9/10',
]

components = map(lambda l: Component(l), input_lines)

by_port = defaultdict(list)

for i in xrange(11):
    for c in components:
        if c.has_port(i):
            by_port[i].append(c)



