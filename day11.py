#!python

directions = {
    'n':  (0,2),
    'ne': (1,1),
    'nw': (-1,1),
    's':  (0,-2),
    'se': (1,-1),
    'sw': (-1,-1),
}


def do_step(coords, direction):
    x, y = directions[direction]
    return coords[0] + x, coords[1] + y

def calculate_distance(coords):
    x, y = coords
    return (abs(x) + abs(y)) / 2

with open('input/day11.txt') as input_lines:
    for line in input_lines:
        line = line.rstrip()

        coords = (0,0)
        dirs = line.split(',')

        highest = 0

        for d in dirs:
            coords = do_step(coords, d)
            this_dist = calculate_distance(coords)
            if this_dist > highest:
                highest = this_dist

        print "distance: %s" % calculate_distance(coords)
        print "highest ever: %s" % highest

