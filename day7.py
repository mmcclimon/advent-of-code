#!python

import re

class Node(object):
    def __init__(self, name, weight, child_names):
        self.name = name
        self.weight = int(weight)
        self.child_names = child_names
        self.is_leaf = not bool(self.child_names)
        self.parent = None
        self.children = []

    def set_parent(self, parent):
        self.parent = parent

    def add_child(self, child):
        self.children.append(child)

    def compute_weight(self):
        if not self.children:
            return self.weight

        return self.weight + sum(map(lambda n: n.compute_weight(), self.children))

    def is_balanced(self):
        if self.is_leaf:
            return True

        wts = []
        for c in self.children:
            wts.append(c.compute_weight())

        return len(set(wts)) == 1


# test data
input_lines = [
    'pbga (66)',
    'xhth (57)',
    'ebii (61)',
    'havc (66)',
    'ktlj (57)',
    'fwft (72) -> ktlj, cntj, xhth',
    'qoyq (66)',
    'padx (45) -> pbga, havc, qoyq',
    'tknk (41) -> ugml, padx, fwft',
    'jptl (61)',
    'ugml (68) -> gyxo, ebii, jptl',
    'gyxo (61)',
    'cntj (57)',
]

pattern = re.compile(r"""^(?P<name>[a-z]+)
                         \s
                         \(
                           (?P<weight>[0-9]+)
                         \)
                         (?:
                           \s->\s
                           (?P<nodes>.*)
                         )?""", re.X)

node_list = dict()

# Do a pass, create the nodes
with open('input/day7.txt') as f:
# if True:
    for line in f:
        m = pattern.search(line)
        children = m.group('nodes')
        if children:
            children = children.split(', ')

        name = m.group('name')

        node_list[name] = Node(m.group('name'), m.group('weight'), children)

# Loop through again, adding parents and children
for name, node in node_list.items():
    if not node.is_leaf:
        for child in node.child_names:
            node_list[child].set_parent(node)
            node.add_child(node_list[child])

root = None
unbalanced = []
for name, node in node_list.items():
    if not node.is_balanced():
        unbalanced.append(node)
    if node.parent:
        continue

    root = node
    print "{} has no parent!".format(node.name)

for node in unbalanced:
    print "processing %s" % node.name
    for c in node.children:
        print "  {} has weight {}".format(c.name, c.compute_weight())

# for c in root.children:
#     print "{} has weight {}".format(c.name, c.compute_weight())


