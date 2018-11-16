#!/usr/bin/env python

import itertools

banks = [0, 2, 7, 0]

challenge = [11, 11, 13, 7, 0, 15, 5, 5, 4, 4, 1, 1, 7, 1, 15, 11]

def realloc_step(banks):
    idx = banks.index(max(banks))
    to_allocate = banks[idx]
    banks[idx] = 0

    others = itertools.cycle(range(idx + 1, len(banks)) +  range(idx+1))
    while to_allocate > 0:
        banks[others.next()] += 1
        to_allocate -= 1

    return banks

def realloc_all(banks):
    seen = dict()
    total = 0
    while tuple(banks) not in seen:
        seen[tuple(banks)] = total
        banks = realloc_step(banks)
        total += 1
    return (total, total - seen[tuple(banks)])


steps,  length = realloc_all(challenge)
print "found in %s steps (cycle is %s steps long)" % (steps, length)

