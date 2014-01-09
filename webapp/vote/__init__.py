from pyramid.config import Configurator

import pyramid_beaker

from externals.lib.pyramid_helpers.auto_format import append_format_pattern

import logging
log = logging.getLogger(__name__)


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    
    # Register Aditional Includes ---------------------------------------------
    config.include('pyramid_mako')  # The mako.directories value is updated in the scan for addons. We trigger the import here to include the correct folders.
    
    # Beaker Session Manager
    session_factory = pyramid_beaker.session_factory_from_settings(settings)
    config.set_session_factory(session_factory)

    
    config.add_static_view('static', 'static'             , cache_max_age=3600)
    config.add_static_view('ext'   , '../externals/static', cache_max_age=3600)
    config.add_route('home', append_format_pattern('/'))
    config.scan()
    return config.make_wsgi_app()
