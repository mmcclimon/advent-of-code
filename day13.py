#!python

firewall = {
   0: 3,
   1: 2,
   4: 4,
   6: 4,
}

DEPTH = 92

with open('input/day13.txt') as f:
    for line in f:
        l, d = map(int, line.split(': '))
        firewall[l] = d


def scanner_at_top(step, depth):
    if depth not in firewall:
        return False

    period = (firewall[depth] - 1) * 2
    return step % period == 0


def do_with_delay(delay, shortcircuit=False):
    caught = False
    loc = 0
    sev = 0
    step = delay

    while loc <= DEPTH:
        if scanner_at_top(step, loc):
            if shortcircuit:
                return True, None
            caught = True
            sev += loc * firewall.get(loc, 0)

        step += 1
        loc += 1

    return (caught, sev)

# Part one
_, sev = do_with_delay(0)
print "part one: severity %s" % sev

# Part two

delay = 0
caught = True
while caught:
    caught, sev = do_with_delay(delay, True)
    if caught:
        delay += 1

print "made it with delay %s" % delay
