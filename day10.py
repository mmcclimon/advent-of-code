#!python

import collections

STRAND_LEN = 256

def get_indices(length, ptr):
    if ptr + length <= STRAND_LEN:
        return range(ptr, ptr + length)

    tail = range(ptr, STRAND_LEN)
    return tail + range(0, length - len(tail))

def hash_round(strand, lengths, ptr, skip_size):
    for length in lengths:
        sublist = []
        indices = get_indices(length, ptr)

        for idx in indices:
            sublist.append(strand[idx])

        for idx in indices:
            strand[idx] = sublist.pop()

        ptr = (ptr + length + skip_size) % STRAND_LEN
        skip_size += 1

    return strand, ptr, skip_size


def part_one(lengths):
    strand = range(STRAND_LEN)
    strand = hash_round(strand, lengths, 0, 0)[0]
    return strand[0] * strand[1]


def knot_hash(s):
    input_lens = map(ord, s)
    input_lens += [17, 31, 73, 47, 23]

    strand = range(STRAND_LEN)

    ptr = 0
    skip_size = 0

    # do hash 64x
    for _ in range(64):
        strand, ptr, skip_size = hash_round(strand, input_lens, ptr, skip_size)

    # split into 16-byte chunks
    chunks = [ strand[i:i+16] for i in xrange(0, STRAND_LEN, 16) ]

    out = ''
    for chunk in chunks:
        out += '{:02x}'.format(reduce(lambda x,y: x^y, chunk))

    return out

if __name__ == '__main__':
    print "part 1: %s" % part_one([197,97,204,108,1,29,5,71,0,50,2,255,248,78,254,63])
    print "part 2: %s" % knot_hash('197,97,204,108,1,29,5,71,0,50,2,255,248,78,254,63')
