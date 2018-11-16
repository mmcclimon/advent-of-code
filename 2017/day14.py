#!python

from day10 import knot_hash

KEY = 'ugkiagan'

grid = []
seen = set()

def dfs(x, y):
    if not grid[x][y]:
        seen.add((x,y))
        return

    is_group = False
    stack = [(x,y)]

    while stack:
        node = stack.pop()
        x, y = node
        if node not in seen and grid[x][y]:
            seen.add(node)
            is_group = True
            if x < 127 and grid[x+1][y]:  stack.append((x+1,y))
            if x > 0   and grid[x-1][y]:  stack.append((x-1,y))
            if y < 127 and grid[x][y+1]:  stack.append((x,y+1))
            if y > 0   and grid[x][y-1]:  stack.append((x,y-1))

    return is_group

total = 0
for n in xrange(128):
    knot = knot_hash(KEY + '-' + str(n))
    out = ''
    for c in knot:
        out += '{:04b}'.format(int(c, 16))
    total += out.count('1')
    grid.append(map(int, out))

print "total number of 1s: %s" % total

groups = 0
for x in range(128):
    for y in range(128):
        if dfs(x,y):
            groups += 1

print "total number of groupss: %s" % groups
