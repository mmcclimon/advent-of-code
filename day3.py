#!/usr/bin/env python

class Spiral(object):
    def __init__(self):
        self.spiral = {}
        self.coordinates = {}
        self.gen = self._coord_gen()

    def _coord_gen(self):
        turns = { 'E': 'N', 'N': 'W', 'W': 'S', 'S': 'E' }
        steps = {
            'E': lambda x,y: (x+1, y),
            'N': lambda x,y: (x, y+1),
            'W': lambda x,y: (x-1, y),
            'S': lambda x,y: (x, y-1),
        }

        x = 0
        y = 0
        facing = 'E'
        cur_len = 1
        steps_in_dir = 0

        while True:
            yield (x, y)

            x, y = steps[facing](x, y)
            steps_in_dir += 1

            # We've now stepped: if we've gone enough, turn and reset the counter
            if steps_in_dir == cur_len:
                facing = turns[facing]
                steps_in_dir = 0
                if facing == 'E' or facing == 'W':
                    cur_len += 1


class EasySpiral(Spiral):
    def __init__(self):
        super(EasySpiral, self).__init__()

    def _extend_spiral(self, limit):
        for n in xrange(1, limit + 1):
            if self.spiral.get(n, False):
                continue

            xy = self.gen.next()
            self.spiral[n] = xy

    def get_taxicab_distance(self, n):
        self._extend_spiral(n)
        x, y = self.spiral[n]
        return abs(x) + abs(y)

class HardSpiral(Spiral):
    def __init__(self):
        Spiral.__init__(self)

    def _get_val_for_square(self, xy):
        x, y = xy
        total = 0

        for xcur in [ x-1, x, x+1 ]:
            for ycur in [y-1, y, y+1]:
                if (xcur, ycur) != (x, y):
                    total += self.coordinates.get((xcur, ycur), 0)

        return total if total else 1

    def get_first_over(self, limit):
        for n in xrange(1, limit + 1):
            if self.spiral.get(n, False):
                continue

            xy = self.gen.next()
            val = self._get_val_for_square(xy)
            self.spiral[n] = val
            self.coordinates[xy] = val

            if val > limit:
                return val

       return None


if __name__ == '__main__':
    n = 277678
    easy = EasySpiral()
    hard = HardSpiral()
    print "Easy case for %s: %s steps" % (n, easy.get_taxicab_distance(n))
    # print "Hard case for %s: %s is 1st over limit" % (n, hard.get_first_over(n))


