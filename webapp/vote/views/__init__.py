from externals.lib.misc import decorator_combine

from externals.lib.pyramid.auto_format import action_ok, action_error

__all__ = [
    'web',
    'action_ok',
    'action_error',
]

#-------------------------------------------------------------------------------
# Web - (a default combination of a range of common decorators)
#-------------------------------------------------------------------------------

from externals.lib.pyramid import mark_external_request
from externals.lib.pyramid.auto_format import auto_format_output
from externals.lib.pyramid.session_identity import overlay_session_identity

web = decorator_combine(
    auto_format_output,
    overlay_session_identity(('id',)),
    mark_external_request
)
