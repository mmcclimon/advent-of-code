#!python

def make_rng(seed, factor, mod=1):
    val = seed
    divisor = 2147483647
    while True:
        val = (val * factor) % divisor
        if val % mod == 0:
            yield val

def part_one():
    gen_a = make_rng(289, 16807)
    gen_b = make_rng(629, 48271)
    count = 0
    for i in xrange(40000000):
        if bin(gen_a.next())[-16:] == bin(gen_b.next())[-16:]:
            count += 1

    return  count

def part_two():
    gen_a = make_rng(289, 16807, 4)
    gen_b = make_rng(629, 48271, 8)
    count = 0

    for i in xrange(5000000):
        if bin(gen_a.next())[-16:] == bin(gen_b.next())[-16:]:
            count += 1

    return count

print "part 1: %s" % part_one()
print "part 2: %s" % part_two()
