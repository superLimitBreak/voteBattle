from pyramid.events import subscriber
from libs.misc import json_string
from libs.pyramid_helpers.events import SessionCreated


@subscriber(SessionCreated)
def session_created(event):
    event.request.registry['socket_manager'].recv(json_string(
        {'join': 1}
    ).encode('utf-8'))
