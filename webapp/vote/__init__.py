from pyramid.config import Configurator
import pyramid.request
import pyramid.events

import pyramid_beaker

from externals.lib.misc import convert_str_with_type
from externals.lib.pyramid.auto_format import append_format_pattern

from vote.templates import helpers as template_helpers

import logging
log = logging.getLogger(__name__)


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    
    # Register Aditional Includes ---------------------------------------------
    config.include('pyramid_mako')  # The mako.directories value is updated in the scan for addons. We trigger the import here to include the correct folders.

    # Settings -----------------------------------------------------------------
    #   Parse/Convert setting keys that have specifyed datatypes
    for key in config.registry.settings.keys():
        config.registry.settings[key] = convert_str_with_type(config.registry.settings[key])
    
    # Session Manager ----------------------------------------------------------
    
    # TODO: Beaker is depreicated and should be replaced with another session facotry
    session_factory = pyramid_beaker.session_factory_from_settings(settings)
    config.set_session_factory(session_factory)

    # WebSocket ----------------------------------------------------------------
    
    from externals.lib.socket.auth_echo_server import AuthEchoServerManager
    def authenicator(key):
        """
        Only authenticated keys can connect to the websocket with write access
        The first message sent MUST be a valid session key or the client is disconnected
        Clients can still connect and read messages
        """
        session_data = session_factory(pyramid.request.Request({'HTTP_COOKIE':'{0}={1}'.format(config.registry.settings['session.key'],key)}))
        #return session_data and session_data.get('admin')
        return True
    socket_manager = AuthEchoServerManager(
        authenticator=authenicator,
        websocket_port=config.registry.settings['vote.port.websocket'],
        tcp_port      =config.registry.settings.get('vote.port.tcp'),
    )
    config.registry['socket_manager'] = socket_manager
    socket_manager.start()

    # Static Routes ------------------------------------------------------------
    
    config.add_static_view('static', 'static'             , cache_max_age=3600)
    config.add_static_view('ext'   , '../externals/static', cache_max_age=3600)
    
    # Routes -------------------------------------------------------------------
    
    config.add_route('mobile_client_select', append_format_pattern('/'))
    config.add_route('mobile_client'       , append_format_pattern('/mobile_client/{pool}'))
    config.add_route('vote'                , append_format_pattern('/api/{pool}/vote'))
    config.add_route('frame'               , append_format_pattern('/api/{pool}/frame'))
    
    
    # Events -------------------------------------------------------------------
    config.add_subscriber(add_template_helpers_to_event, pyramid.events.BeforeRender)
    
    # Init ---------------------------------------------------------------------
    #from vote.lib.vote import VotePool
    #VotePool('default')
    
    # Return -------------------------------------------------------------------
    config.scan(ignore='.tests')
    return config.make_wsgi_app()


def add_template_helpers_to_event(event):
    event['h'] = template_helpers

    
