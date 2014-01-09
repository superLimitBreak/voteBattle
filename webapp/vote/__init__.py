from pyramid.config import Configurator

from externals.lib.pyramid_helpers.auto_format import append_format_pattern

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_mako')
    config.add_static_view('static', 'static'             , cache_max_age=3600)
    config.add_static_view('ext'   , '../externals/static', cache_max_age=3600)
    config.add_route('home', append_format_pattern('/'))
    config.scan()
    return config.make_wsgi_app()
