from externals.lib.misc import OrderedDefaultdict

import logging
log = logging.getLogger(__name__)


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

    def new_frame(self, items):
        self.frames.append(Frame(items))

    def remove(self):
        self._del_pool(self)


class Frame(object):

    def __init__(self, items, **options):
        self.frame = OrderedDefaultdict(set)
        for item in items:
            self.frame[item]
        #self.voters = set()
        #self.options = options
        #self.total_votes = 0

    @property
    def items(self):
        return self.frame.keys()

    def vote(self, voter, item):
        if voter in self.voters:
        #if self.options.get('single_vote_per_voter', True) and voter in self.voters:
            log.debug('rejected multivote')
            return
        #self.voters
        if item not in self.frame:
            log.debug('rejected item not in frame')
            return
        self.frame[item].add(voter)
        #self.total_votes += 1

    @property
    def voters(self):
        """
        Emalgamate voters from all items to derive the voter list
        this is potentially inefficent and can be replaced later if
        more complex voting logic or performence are needed
        """
        voters = set()
        for s in self.frame.values():
            voters |= s
        return voters
    
    def to_dict(self, total=True):
        d = dict(self.frame)
        if total:
            for key in d:
                d[key] = len(d[key])
        return d
        
