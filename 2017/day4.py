#!/usr/bin/env python

def valid_pw(pw):
    s = set()
    for w in pw.split():
        # k = w                  # easy case
        k = ''.join(sorted(w)) # hard case
        if k in s:
            return False
        s.add(k)
    return True

with open('input/day4.txt', 'r') as f:
    total = 0
    for line in f:
        if valid_pw(line):
            total += 1

print "total: %s" % total

