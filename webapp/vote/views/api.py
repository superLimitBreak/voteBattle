"""
Terminology:
    Short periods of voting time are called 'frames'
    
    A frame could be setup with the actions 'attack', 'defend', 'heal'
    A frame is initalsed with a duration time, this is so that client devices
    that are not connected via websockets know when to refresh and can provide
    user feedback
"""

from pyramid.view import view_config

from . import web, action_ok, action_error

from vote.lib.vote import VotePool, VoteFrame, VoteException


@view_config(route_name='frame', request_method='GET')
@web
def get_frame(request):
    return action_ok()



@view_config(route_name='frame', request_method='POST')
@web
def new_frame(request):
    """
    Create a new frame:
    post params:
    
    The final results from the previous frame are returned (this prevents the need )
    """    
    return action_ok()


@view_config(route_name='vote')
@web
def vote(request):
    vote_pool = VotePool.get_pool(request.matchdict['pool'])
    if not vote_pool:
        raise action_error(message='unknown vote_pool: {0}'.format(request.matchdict['pool']), code=400)
    try:
        vote_pool.current_frame.vote(request.session.get('id'), request.params.get('item'))
    except VoteException as e:
        raise action_error(message=e.message, code=400)
    return action_ok()
