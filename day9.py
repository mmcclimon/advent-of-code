#!python

def parse_line(s):
    total = 0
    group_level = 0
    garbage = 0
    in_garbage = False
    ignore_next = False

    for c in s:
        if ignore_next:
            ignore_next = False

        elif c == '!':
            ignore_next = True

        elif c == '<' and not in_garbage:
            in_garbage = True

        elif c == '>':
            in_garbage = False

        elif in_garbage:
            garbage += 1

        elif c == '{':
            group_level += 1

        elif c == '}':
            total += group_level
            group_level -= 1

    return (total, garbage)

with open('input/day9.txt') as input_lines:
    for line in input_lines:
        score, garbage = parse_line(line)
        print "score is %s" % score
        print "garbage count is %s" % garbage

