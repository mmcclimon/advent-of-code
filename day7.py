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
        self._computed_weight = 0

    def __repr__(self):
        return 'Node(name={}, weight={}, children={})'.format(
                self.name, self.weight, self.child_names)

    def set_parent(self, parent):
        self.parent = parent

    def add_child(self, child):
        self.children.append(child)

    @property
    def total_weight(self):
        # Only walk the tree once
        if self._computed_weight:
            return self._computed_weight

        wt = 0
        if not self.children:
            wt = self.weight
        else:
            wt = self.weight + sum(map(lambda n: n.total_weight, self.children))

        self._computed_weight = wt
        return self._computed_weight

    def is_balanced(self):
        if self.is_leaf:
            return True

        wts = []
        for c in self.children:
            wts.append(c.total_weight)

        return len(set(wts)) == 1

    def correct_weight(self):
        """Pass an unbalanced node, and find what its weight *should* be.
        Returns (actual, expected) tuple"""
        if not self.parent:
            raise ValueError("node has no parent; can't compute value")
        if self.parent.is_balanced():
            return (self.weight, self.weight)

        for c in self.parent.children:
            if c == self:
                continue

            diff = self.total_weight - c.total_weight
            return (self.weight, self.weight - diff)


class Tree(object):
    def __init__(self, root):
        self.root = root

    def find_unbalanced(self, node=None):
        """Given the root of a tree, return the node that is unbalanced relative
        to its siblings"""
        if not node:
            node = self.root

        if node.is_balanced():
            return node

        wts = {}
        for c in node.children:
            wt = c.total_weight
            if wt in wts:
                wts[wt].append(c)
            else:
                wts[wt] = [c]

        odd = [ n[0] for n in wts.values() if len(n) == 1][0]
        return self.find_unbalanced(odd)


pattern = re.compile(r"""^(?P<name>[a-z]+) \s \( (?P<weight>[0-9]+) \)
                         (?: \s->\s (?P<nodes>.*) )?""", re.X)


# free-floating functions -------
def generate_node_list():
    """Parse the input, generate the raw list of Node objects"""
    with open('input/day7.txt') as input_lines:
        node_list = dict()

        for line in input_lines:
            m = pattern.search(line)
            children = m.group('nodes')
            if children:
                children = children.split(', ')

            name = m.group('name')
            node_list[name] = Node(m.group('name'), m.group('weight'), children)

    return node_list

def build_tree(node_list):
    """Given a list of node objects, build their parents/children and return
    a Tree"""
    root_candidates = set(node_list.keys())
    for node in node_list.values():
        if not node.is_leaf:
            for child in node.child_names:
                root_candidates.remove(child)
                node_list[child].set_parent(node)
                node.add_child(node_list[child])

    root = node_list[ root_candidates.pop() ]
    return Tree(root)


tree = build_tree(generate_node_list())
unbal = tree.find_unbalanced()
actual, expected = unbal.correct_weight()

print "{} is the tree root".format(tree.root.name)
print "{} has weight {}, should be {}".format(unbal.name, actual, expected)




# for node in [ n for n in node_list.values() if not n.is_balanced() ]:
#     print "processing %s" % node.name
#     for c in node.children:
#         print "  {} has weight {}".format(c.name, c.total_weight)
