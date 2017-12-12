#!python

import re
import collections

class Bot(object):

    def __init__(self):
        self.values = []
        self._seen = set()
        self.number = -1

    def __repr__(self):
        return '<Bot %s has%s seen%s>' % (self.number, self.values, self.seen)

    def append(self, val):
        self.values.append(int(val))
        self._seen.add(int(val))

    def low(self):
        return sorted(self.values)[0]

    def high(self):
        return sorted(self.values)[1]

    def clear(self):
        self.values = []

    @property
    def seen(self):
        return tuple(sorted(self._seen))

bots = collections.defaultdict(Bot)
instructions = {}
outputs = {}
seen_lookup = {}

# Process instructions
with open('input/d10.txt') as f:
    for line in f:
        if line.startswith('value'):
            m = re.search(r'value ([0-9]+) goes to bot ([0-9]+)', line)
            val, bot = m.groups()

            bots[bot].number = bot
            bots[bot].append(val)

        else:
            m = re.search(r'bot ([0-9]+) gives low to ((?:output|bot) [0-9]+) and high to ((?:output|bot) [0-9]+)', line)
            bot = m.group(1)
            low = m.group(2)
            high = m.group(3)
            instructions[bot] = { 'low': low, 'high': high }


# Run the instructions
bots_with_two = [ bot for bot in bots.values() if len(bot.values) == 2 ]
while bots_with_two:
    bot = bots_with_two.pop()
    this_instr =  instructions[bot.number]

    for k in ['low', 'high']:
        instr = this_instr[k]
        kind, which = re.search(r'(output|bot) ([0-9]+)', instr).groups()

        val = bot.low() if k == 'low' else bot.high()

        if kind == 'bot':
            bots[which].number = which  # if we haven't seen this bot yet
            bots[which].append(val)
        else:
            outputs[int(which)] = val

    bot.clear()
    seen_lookup[bot.seen] = bot

    # this could probably be smarter
    bots_with_two = [ b for b in bots.values() if len(b.values) == 2 ]


print "part one: Bot %s" % seen_lookup[(17, 61)].number
print 'part two: %s' % (outputs[0] * outputs[1] * outputs[2])

