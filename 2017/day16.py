#!python

from collections import deque

ITERATIONS = 1000000000

row = deque('abcdefghijklmnop')
seen = set()
by_index = {}
broken = -1

with open('input/day16.txt') as f:
    tokens = f.readlines()[0].split(',')

for i in xrange(ITERATIONS):
    for token in tokens:
        if token.startswith('s'):
            count = int(token[1:])
            row.rotate(count)

        if token.startswith('x'):
            m, n = map(int, token[1:].split('/'))
            row[m], row[n] = row[n], row[m]

        if token.startswith('p'):
            m, n = token[1:].split('/')
            idx_m = list(row).index(m)
            idx_n = list(row).index(n)
            row[idx_m], row[idx_n] = row[idx_n], row[idx_m]

    s = ''.join(row)
    if s in seen:
        broken = i
        break

    seen.add(s)
    by_index[i+1] = s

n = ITERATIONS % broken
print "after one:       %s" % by_index[1]
print "after a billion: %s" % by_index[n]
