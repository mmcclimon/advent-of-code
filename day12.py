#!python

class Node(object):
    def __init__(self, number, targets):
        self.number = int(number)
        self._targets = set(map(int, targets))
        self._targets.add(number)
        self._seen = set()
        self._have_tracked = False

    def __repr__(self):
        return '<Node %s: %s>' % (self.number, sorted(list(self._targets)))

    @property
    def targets(self):
        return sorted(list(self._targets))

    def track_routes(self, node_list):
        candidates = self._targets.copy()
        while candidates:
            target = candidates.pop()
            if target in self._seen:
                continue

            self._seen.add(target)
            self._targets.add(target)

            for t in node_list[target].targets:
                if t not in self._seen:
                    candidates.add(t)


routes = {}

with open('input/day12.txt') as input_lines:
    for line in input_lines:
        source, targets = line.split(' <-> ')
        source = int(source)
        targets = targets.split(', ')

        routes[source] = Node(source, targets)

groups = set()
for node in routes.values():
    node.track_routes(routes)
    groups.add(tuple(node.targets))

print "group with 0: %s" % len(routes[0].targets)
print "total groups: %s" % len(groups)
