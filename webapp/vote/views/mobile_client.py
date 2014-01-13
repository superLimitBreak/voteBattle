from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound

from . import web, action_ok

from vote.lib.vote import VotePool


@view_config(route_name='mobile_client_select')
@web
def mobile_client_select(request):
    """
    Mobile client landing page
    
    If only one vote pool exists then redirect to the single pool
    else display list of vote pools
    """
    pools = VotePool.get_pool_ids()
    if len(pools) == 1:
        raise HTTPFound(location='mobile_client/{0}'.format(tuple(pools)[0]))
    return action_ok(data={'pools': pools})

@view_config(route_name='mobile_client')
@web
def mobile_client(request):
    return action_ok(data={'pool':request.matchdict['pool']})
