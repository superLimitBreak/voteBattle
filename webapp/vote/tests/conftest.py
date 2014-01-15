import pytest

import logging
log = logging.getLogger(__name__)

INI = 'test.ini'
#INI = 'production.ini'


# Markers ----------------------------------------------------------------------

def pytest_addoption(parser):
    parser.addoption("--runslow", action="store_true", help="run slow tests")
def pytest_runtest_setup(item):
    if 'unimplemented' in item.keywords: #and not item.config.getoption("--runslow"):
        pytest.skip('unimplemented functionality')
    if 'unfinished' in item.keywords:
        pytest.skip('unfinished functionality')
    try:
        runslow = item.config.getoption("--runslow")
    except ValueError:
        runslow = False
    if 'slow' in item.keywords and not runslow:
        pytest.skip("need --runslow option to run")

unimplemented = pytest.mark.unimplemented # Server dose not support the functionlity this test is asserting yet
unfinished    = pytest.mark.unfinished    # The test is unfinished and currently is know to fail
xfail         = pytest.mark.xfail
slow          = pytest.mark.slow

# Fixtures ---------------------------------------------------------------------

@pytest.fixture(scope="session")
def settings(request, ini_file=INI):
    from pyramid.paster import get_appsettings
    return get_appsettings(ini_file)

@pytest.fixture(scope="session")
def app(request, settings):
    from webtest import TestApp
    from vote import main as _main
    
    #print('setup WebApp')
    app = TestApp(_main({}, **settings))
        
    def finalizer():
        #print('tearDown WebApp')
        pass
    request.addfinalizer(finalizer)
    
    return app
