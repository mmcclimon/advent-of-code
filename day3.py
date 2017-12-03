#!/usr/bin/env python

class Spiral():

    turns = { 'E': 'N', 'N': 'W', 'W': 'S', 'S': 'E' }

    def __init__(self, limit, case='easy'):
        self.spiral = {}
        self.coordinates = {}
        self.limit = limit
        self.case = case

        self._make_spiral()

    def _make_spiral(self):
        x = 0
        y = 0
        facing = 'E'
        cur_len = 1
        steps_in_dir = 0


        for n in xrange(1, self.limit + 1):
            val = self._get_val_for_square(n, x, y)

            self.spiral[n] = val
            self.coordinates[(x,y)] = val

            # Do the step
            if facing == 'E': x += 1
            if facing == 'N': y += 1
            if facing == 'W': x -= 1
            if facing == 'S': y -= 1
            steps_in_dir += 1

            # We've now stepped: if we've gone enough, turn and reset the counter
            if steps_in_dir == cur_len:
                facing = self.turns[facing]
                steps_in_dir = 0
                if facing == 'E' or facing == 'W':
                    cur_len += 1


class EasySpiral(Spiral):
    def __init__(self, limit):
        Spiral.__init__(self, limit)

    def _get_val_for_square(self, n, x, y):
        return (x, y)

    def get_taxicab_distance(self, n):
        x, y = self.spiral[n]
        return abs(x) + abs(y)

class HardSpiral(Spiral):
    def __init__(self, limit):
        Spiral.__init__(self, limit)

    def _get_val_for_square(self, n, x, y):
        total = 0

        for xcur in [ x-1, x, x+1 ]:
            for ycur in [y-1, y, y+1]:
                if (xcur, ycur) != (x, y):
                    total += self.coordinates.get((xcur, ycur), 0)

        return total if total else 1

    def get_first_over(self, limit):
        for i in xrange(1, self.limit + 1):
            if self.spiral[i] > limit:
                return self.spiral[i]



if __name__ == '__main__':
    n = 277678
    easy = EasySpiral(n)
    print "Easy case for %s: %s steps" % (n, easy.get_taxicab_distance(n))

    hard = HardSpiral(n)
    print "Hard case for %s: %s is 1st over limit" % (n, hard.get_first_over(n))


