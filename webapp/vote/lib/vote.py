from functools import reduce
import datetime

from externals.lib.misc import OrderedDefaultdict, now

import logging
log = logging.getLogger(__name__)

class VoteException(Exception):
    pass


class VotePool(object):
    _pools = {}
    
    @classmethod
    def get_pool_ids(_class):
        return _class._pools.keys()
    
    @classmethod
    def get_pool(_class, id):
        return _class._pools[id]

    @classmethod
    def _add_pool(_class, vote_pool):
        _class._pools[vote_pool.id] = vote_pool

    @classmethod
    def _del_pool(_class, vote_pool):
        del _class._pools[vote_pool.id]

    def __init__(self, id):
        self.id = id
        self.frames = []
        self._add_pool(self)

    def new_frame(self, items, **options):
        self.frames.append(VoteFrame(items, **options))
        return self.current_frame

    def previous_frames(self, limit=0):
        return self.frames[-limit-1:-1]

    def size(self):
        return len(self.frames)

    @property
    def current_frame(self):
        if self.frames:
            return self.frames[-1]

    def remove(self):
        self._del_pool(self)


class VoteFrame(object):

    def __init__(self, items, **options):
        self.frame = OrderedDefaultdict(set)
        for item in items:
            self.frame[item]
        self.timestamp = now()
        if options.get('duration'):
            self.duration = datetime.timedelta(seconds=options.get('duration',0))
        #self.voters = set()
        #self.options = options
        #self.total_votes = 0

    @property
    def items(self):
        return self.frame.keys()

    def vote(self, voter, item):
        if voter in self.voters:
        #if self.options.get('single_vote_per_voter', True) and voter in self.voters:
            raise VoteException('rejected multivote: {0}'.format(voter))
        #self.voters
        if item not in self.frame:
            raise VoteException('rejected item:{0} not in {1}'.format(item, self.frame.keys()))
        self.frame[item].add(voter)
        #self.total_votes += 1

    @property
    def voters(self):
        """
        Emalgamate voters from all items to derive the voter list
        this is potentially inefficent and can be replaced later if
        more complex voting logic or performence are needed
        """
        return reduce(lambda a,b: a.union(b), self.frame.values())
    
    def to_dict(self, total=False):
        d = dict(self.frame)
        if total:
            for key in d:
                d[key] = len(d[key])
        return d
        
