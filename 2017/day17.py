#!python

STEP_SIZE = 367

def part_one():
    ptr = 0
    buf = [0]

    for i in xrange(1, 2018):
        ptr = ((ptr + STEP_SIZE) % len(buf)) + 1
        buf.insert(ptr, i)

    idx = buf.index(2017)
    return buf[idx-3:idx+4]

def part_two():
    ptr = 0
    buf_len = 1
    elem_one = 0

    for i in xrange(1, 50000001):
        ptr = ((ptr + STEP_SIZE) % buf_len) + 1
        if ptr == 1:
            elem_one = i
        buf_len += 1

    return elem_one

print "part one: %s" % part_one()
print "part two: %s" % part_two()
