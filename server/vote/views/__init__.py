from externals.lib.misc import decorator_combine

from externals.lib.pyramid_helpers import set_cookie
from externals.lib.pyramid_helpers.auto_format import action_ok, action_error
from externals.lib.pyramid_helpers.etag import etag_decorator

__all__ = [
    'web',
    'action_ok',
    'action_error',
    'etag_decorator',
    'set_cookie',
    'cache', 'cache_none',
]

#-------------------------------------------------------------------------------
# Web - (a default combination of a range of common decorators)
#-------------------------------------------------------------------------------

from externals.lib.pyramid_helpers import mark_external_request, gzip
from externals.lib.pyramid_helpers.auto_format import auto_format_output
from externals.lib.pyramid_helpers.session_identity import overlay_session_identity

web = decorator_combine(
    gzip,
    auto_format_output,
    overlay_session_identity(('id',)),
    mark_external_request
)


#-------------------------------------------------------------------------------
# Cache
#-------------------------------------------------------------------------------

from dogpile.cache import make_region
from dogpile.cache.api import NO_VALUE as cache_none

cache = make_region().configure(
    'dogpile.cache.memory'
)
