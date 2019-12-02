#!python3

from collections import defaultdict

class Component(object):
    def __init__(self, line):
        self.ports = list(map(int, line.split('/')))

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

components = [ Component(l) for l in input_lines ]

# generate a lookup by port
by_port = defaultdict(list)
for c in components:
    for p in c.ports:
        by_port[p].append(c)

# dfs
def dfs(graph, comp):
    S = []
    S.append(comp)
    seen = {}

    while len(S) > 0:
        this_comp = S.pop()
        if this_comp not in seen:
            seen[this_comp] = True
            # get all the nodes that are adjacent to this one, by some metric.
            for 

    return seen.keys()

print(dfs(components, components[0]))

