from pyramid.view import view_config

#from . import web
from externals.lib.misc import now


@view_config(route_name='home')
#@web
def my_view(request):
    return {'project': 'vote'}
