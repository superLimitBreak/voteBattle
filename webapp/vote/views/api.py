"""
Terminology:
    Short periods of voting time are called 'frames'
    
    A frame could be setup with the actions 'attack', 'defend', 'heal'
    A frame is initalsed with a duration time, this is so that client devices
    that are not connected via websockets know when to refresh and can provide
    user feedback
"""
import random
from collections import defaultdict
from pyramid.view import view_config

from externals.lib.misc import json_string, json_load, now

from . import web, action_ok, action_error, etag_decorator, cache

from vote.lib.vote import VotePool, VoteException

import logging
log = logging.getLogger(__name__)


# Cache ------------------------------------------------------------------------

CACHE_COUNTER = defaultdict(lambda: random.randint(0,65535))
def invalidate_cache(id):
    CACHE_COUNTER[id] += 1
    cache.delete(id)
    
# Utils ------------------------------------------------------------------------

def get_pool_id(request):
    try:
        return request.matchdict['pool_id']
    except KeyError:
        try:
            return request.params['pool_id']
        except KeyError:
            raise action_error(message='no pool_id provided', code=400)

def get_pool(request, is_owner=False):
    pool_id = get_pool_id(request)
    vote_pool = VotePool.get_pool(pool_id)
    if not vote_pool:
        raise action_error(message='unknown vote_pool: {0}'.format(pool_id), code=400)
    if is_owner and vote_pool.owner != request.session['id']:
        raise action_error(message='not owner of vote_pool: {0}'.format(pool_id), code=403)
    return vote_pool

# Vote -------------------------------------------------------------------------

@view_config(route_name='vote')
@web
def vote(request):
    vote_pool = get_pool(request)
    if not vote_pool.current_frame:
        raise action_error(message="no vote frame setup yet", code=400)
    try:
        vote_pool.current_frame.vote(request.session.get('id'), request.params.get('item'))
    except VoteException as e:
        raise action_error(message=str(e), code=400)
    # Send update over websocket
    request.registry['socket_manager'].recv(json_string(vote_pool.current_frame.to_dict(total=True)['votes']).encode('utf-8'))
    log.debug('VOTE VotePool:{0} Session:{1} Item:{2}'.format(vote_pool.id, request.session.get('id'), request.params.get('item')))
    return action_ok()


# Current Frame ----------------------------------------------------------------

def generate_cache_key_current_frame(request):
    return '-'.join([
        request.path_qs,
        str(CACHE_COUNTER[request.matchdict['pool_id']])
    ])
@view_config(route_name='frame', request_method='GET')
@etag_decorator(generate_cache_key_current_frame)
@web
def current_frame(request):
    """
    The current frame is client cached under the etag of it's frame counter
    This means if a client wants an 'up to the second' response they have to cache bust the query string
    Projector interfaces will get updates via websockets.
    It's worth noting that if a client joins a vote half way through, the etaged frame they receive will have votes in it
    
    TODO: Is it worth making this return cutdown item details for mobile clients, but the full thing for the frame owner?
    """
    vote_pool = get_pool(request)
    return action_ok(data={
        'sequence_id': vote_pool.size(),
        'frame': vote_pool.current_frame.to_dict() if vote_pool.current_frame else {}
    }
)


# New Frame --------------------------------------------------------------------

@view_config(route_name='frame', request_method='POST')
@web
def new_frame(request):
    """
    Create a new frame:
    post params:
    
    The final results from the previous frame are returned (this prevents the need )
    
    TODO: Make this method optionaly take an entire frame state
    If the server crashs and the client has the state of the current frame, attempt to reinstate it
    We need to be resiliant to both the projector client and the server failing.
    """
    vote_pool = get_pool(request, is_owner=True)
    if request.params.get('frame_state'):
        #frame_state = json_load(request.params['frame_state'])
        # the host interface could need to restore a frame state from server failure
        raise action_error(message='unimplemented', code=502)
    properties = dict(request.params)
    try:
        properties['items'] = map(lambda item: item.strip(),properties['items'].split(','))
    except Exception:
        raise action_error(message='invalid items', code=400)
    previous_frame = vote_pool.current_frame
    if previous_frame and previous_frame.timestamp_end > now():
        raise action_error(message='created new frame before previous frame closed', code=400)
    new_frame = vote_pool.new_frame(**properties)
    invalidate_cache(vote_pool.id)
    log.debug('NEW_FRAME VotePool:{0} Items:{1}'.format(vote_pool.id, properties))
    return action_ok(data={
        'sequence_id': vote_pool.size(),
        'frame': new_frame.to_dict(),
        'previous_frame': previous_frame.to_dict() if previous_frame else None,
    })


# Previous Frames --------------------------------------------------------------

def generate_cache_key_previous_frames(request):
    return '-'.join([
        request.path_qs,
        str(VotePool.get_pool(request.matchdict['pool_id']).size()),
        request.params.get('limit',''),
    ])
# TODO: what if there is an exception in generating the cache key? - should not etag and log 'unable to key'?
@view_config(route_name='previous_frames', request_method='GET')
@etag_decorator(generate_cache_key_previous_frames)
@web
def previous_frames(request):
    try:
        cache_key = generate_cache_key_previous_frames(request)
    except Exception:
        raise action_error(code=400)
    def get_previous_frame_dict():
        return {
            'frames': [
                frame.to_dict() for frame in get_pool(request).previous_frames(limit=int(request.params.get('limit',0)))
            ],
        }
    previous_frame_data = cache.get_or_create(cache_key, get_previous_frame_dict)
    return action_ok(data=previous_frame_data)


# New Vote Pool ----------------------------------------------------------------

@view_config(route_name='new_vote_pool', request_method='POST')
@web
def new_vote_pool(request):
    pool_id = request.params['pool_id']
    if pool_id in VotePool.get_pool_ids():
        raise action_error(message='vote_pool: {0} already exisits'.format(pool_id), code=400)
    vote_pool = VotePool(pool_id, owner=request.session['id'])
    log.info('NEW_POOL VotePool:{0} with owner {1}'.format(vote_pool.id, vote_pool.owner))
    return action_ok(code=201)

@view_config(route_name='frame', request_method='DELETE')
@web
def remove_vote_pool(request):
    vote_pool = get_pool(request, is_owner=True)
    vote_pool.remove()
    invalidate_cache(vote_pool.id)
    log.info('REMOVED_POOL VotePool:{0}'.format(vote_pool.id))
    return action_ok()
