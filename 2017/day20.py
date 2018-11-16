#!python

from collections import defaultdict

class Particle(object):
    def __init__(self, line, n):
        self._id = n

        parts = line.strip('\n').split(', ')

        for part in parts:
            t = map(int, part[3:-1].split(','))
            if part.startswith('p'): self.pos = t
            if part.startswith('v'): self.vel = t
            if part.startswith('a'): self.acc = t

    def __repr__(self):
        return '<Particle %s: at %s>' % (self._id, self.pos)

    def next(self):
        for i in xrange(3):
            self.vel[i] += self.acc[i]
            self.pos[i] += self.vel[i]

    def distance(self):
        return sum(map(abs, self.pos))

particles = {}
input_lines = open('input/day20.txt').readlines()

for i, line in enumerate(input_lines):
    particles[i] = Particle(line, i)


def part_one():
    closest_num = -1
    last_num = -1
    num_same = 0

    while True:
        close = False

        for particle in particles.values():
            particle.next()
            if not close or particle.distance() < close[1]:
                close = (particle._id, particle.distance())

        # If it hasn't changed in 500 times, that's good enough
        closest_num = close[0]
        num_same = num_same + 1 if closest_num == last_num else 0
        if num_same > 500:
            break

        last_num = closest_num

    print "closest is particle %s (%s in a row)" % (last_num, num_same)

def part_two():
    num_same = 0
    last_num = 0
    while True:
        positions = defaultdict(list)

        for particle in particles.values():
            particle.next()
            positions[ tuple(particle.pos) ].append(particle._id)

        for pos_list in positions.values():
            if len(pos_list) > 1:
                for p in pos_list:
                    del particles[p]

        num_same = num_same + 1 if len(particles.keys()) == last_num else 0
        if num_same > 100:
            break

        last_num = len(particles.keys())

    print "there are %s particles left" % len(particles.keys())
