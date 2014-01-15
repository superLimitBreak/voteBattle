"""
Terminology:
    Short periods of voting time are called 'frames'
    
    A frame could be setup with the actions 'attack', 'defend', 'heal'
    A frame is initalsed with a duration time, this is so that client devices
    that are not connected via websockets know when to refresh and can provide
    user feedback
"""
from collections import defaultdict
from pyramid.view import view_config

from externals.lib.misc import json_string

from . import web, action_ok, action_error, etag_decorator, cache, cache_none

from vote.lib.vote import VotePool, VoteException


# Cache ------------------------------------------------------------------------

CURRENT_FRAME_COUNTER = defaultdict(int)
def invalidate_frame(id):
    CURRENT_FRAME_COUNTER[id] += 1
    cache.delete(id)
    

# Vote -------------------------------------------------------------------------

@view_config(route_name='vote')
@web
def vote(request):
    id = request.matchdict['pool']
    vote_pool = VotePool.get_pool(id)
    if not vote_pool:
        raise action_error(message='unknown vote_pool: {0}'.format(id), code=400)
    try:
        vote_pool.current_frame.vote(request.session.get('id'), request.params.get('item'))
    except VoteException as e:
        raise action_error(message=e.message, code=400)
    # Clear Cache
    invalidate_frame(id)
    # Send update over websocket
    request.registry['socket_manager'].recv(json_string(vote_pool.current_frame.to_dict(total=True)).encode('utf-8'))
    return action_ok()


# Current Frame ----------------------------------------------------------------

def generate_cache_key_current_frame(request):
    return '-'.join([
        request.path_qs,
        str(CURRENT_FRAME_COUNTER[request.matchdict['pool']])
    ])
@view_config(route_name='frame', request_method='GET')
@etag_decorator(generate_cache_key_current_frame)
@web
def current_frame(request):
    id = request.matchdict['pool']
    def get_current_frame_dict():
        try:
            vote_pool = VotePool.get_pool(id)
            return {
                'sequence_id': vote_pool.size(),
                'frame': vote_pool.current_frame.to_dict()
            }
        except Exception:
            return cache_none

    current_frame_data = cache.get_or_create(id, get_current_frame_dict)
    if not current_frame_data:
        raise action_error()
    return action_ok(data=current_frame_data)


# New Frame --------------------------------------------------------------------

@view_config(route_name='frame', request_method='POST')
@web
def new_frame(request):
    """
    Create a new frame:
    post params:
    
    The final results from the previous frame are returned (this prevents the need )
    """
    id = request.matchdict['pool']
    vote_pool = VotePool.get_pool(id)
    if not vote_pool:
        raise action_error(message='unknown vote_pool: {0}'.format(id), code=400)
    try:
        items = map(lambda item: item.strip(),request.params['items'].split(','))
    except Exception:
        raise action_error(message='invalid items', status_code=400)
    previous_frame = vote_pool.current_frame
    new_frame = VotePool.new_frame(items, **request.params)
    invalidate_frame(id)
    return action_ok(data={
        'previous_frame': previous_frame.to_dict(),
        'new_frame'     : new_frame.to_dict(),
    })


# Previous Frames --------------------------------------------------------------

def generate_cache_key_previous_frames(request):
    return '-'.join([
        request.path_qs,
        str(VotePool.get_pool(request.matchdict['pool']).size()),
        request.params.get('limit',''),
    ])
@view_config(route_name='previous_frames', request_method='GET')
@etag_decorator(generate_cache_key_previous_frames)
@web
def previous_frames(request):
    def get_previous_frame_dict():
        return {
            'frames': [
                frame.to_dict() for frame in VotePool.get_pool(request.matchdict['pool']).previous_frames(limit=int(request.params.get('limit',0)))
            ],
        }
    previous_frame_data = cache.get_or_create(generate_cache_key_previous_frames(request), get_previous_frame_dict)
    return action_ok(data=previous_frame_data)
