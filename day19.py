#!python

grid = []
with open('input/day19.txt') as f:
    for line in f:
        grid.append(line.strip('\n'))

row, col = 0, grid[0].index('|')
facing = 'S'
letters = []
steps = 0

while True:
    char = grid[row][col]

    if char.isalpha():
        letters.append(char)

    if char == ' ':
        break

    if char == '+':
        to_north = grid[row-1][col] != ' ' if row > 0              else False
        to_south = grid[row+1][col] != ' ' if row < len(grid)-1    else False
        to_west  = grid[row][col-1] != ' ' if col > 0              else False
        to_east  = grid[row][col+1] != ' ' if col < len(grid[0])-1 else False

        if   to_north and facing != 'S': facing = 'N'
        elif to_south and facing != 'N': facing = 'S'
        elif to_east  and facing != 'W': facing = 'E'
        elif to_west  and facing != 'E': facing = 'W'
        else: break

    if facing == 'N': row -= 1
    if facing == 'S': row += 1
    if facing == 'E': col += 1
    if facing == 'W': col -= 1
    steps += 1

print ''.join(letters)
print "steps: %s" % steps

