#!python

def make_grid(lines):
    grid = {}
    start = (len(lines) / 2) * -1

    for y, row in enumerate(lines, start):
        for x, c in enumerate(row.strip('\n'), start):
            grid[(x, y)] = c

    return grid

def print_grid(grid):
    big = reduce(max, [ k[0] for k in grid ] + [ k[1] for k in grid ])

    for _y in xrange(-1*big, big+1):
        for _x in xrange(-1*big, big+1):
            try:
                print grid[(_x,_y)],
            except KeyError:
                print '.',
        print ''

def get_new_dir(facing, char):
    infected = { 'N': 'E', 'E': 'S', 'S': 'W', 'W': 'N' }
    clean    = { 'N': 'W', 'E': 'N', 'S': 'E', 'W': 'S' }
    flagged  = { 'N': 'S', 'E': 'W', 'S': 'N', 'W': 'E' }

    if   char == '#': return infected[facing]
    elif char == '.': return clean[facing]
    elif char == 'F': return flagged[facing]
    elif char == 'W': return facing

def burst(x, y, facing):
    if PART_TWO:
        results = { '.': 'W', 'W': '#', '#': 'F', 'F': '.' }
    else:
        results = { '.': '#', '#': '.'}

    try:
        char = grid[ (x,y) ]
    except KeyError:
        char = '.'
        grid[(x,y)]  = '.'

    facing = get_new_dir(facing, char)

    grid[(x,y)] = results[char]
    caused_infection = grid[(x,y)] == '#'

    if facing == 'N': y -= 1
    if facing == 'S': y += 1
    if facing == 'W': x -= 1
    if facing == 'E': x += 1

    return x, y, facing, caused_infection


lines = open('input/day22.txt').readlines()
grid = make_grid(lines)

x = 0
y = 0
facing = 'N'
total = 0

for i in xrange(10000000):
    x, y, facing, infected = burst(x, y, facing)
    if infected:
        total += 1

print "total_infected: %s" % total
