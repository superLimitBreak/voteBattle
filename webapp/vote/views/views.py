from pyramid.view import view_config

from . import web, action_ok

@view_config(route_name='home')
@web
def home(request):
    """
    Landing page
    
    If only one vote pool exists then redirect to the single pool
    else display list of vote pools
    """
    return action_ok(data={'project': 'vote'})
