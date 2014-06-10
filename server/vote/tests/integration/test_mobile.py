import json
from bs4 import BeautifulSoup


def get_cookie(app, key):
    try:
        return json.loads({cookie.name:cookie for cookie in app.cookiejar}[key].value)
    except KeyError:
        return None


def test_mobile_client_landing_flow(app):
    response = app.get('/')
    assert 'scanning' in response.text.lower(), "The landing screen should start waiting/scanning"

    app.post('/api/.json', dict(pool_id='test_vote')).json
    app.post('/api/test_vote.json', dict(items='option1,option2,option3')).json['data']

    response = app.get('/')
    response.status_code = 302
    assert 'mobile_client/test_vote' in response.location, "The landing page should redirect to single vote_pool"
    response = app.get(response.location)
    assert get_cookie(app, 'server_timesync'), 'timesync cookie is provided'

    app.post('/api/.json', dict(pool_id='test_vote2')).json

    soup = BeautifulSoup(app.get('/').text)
    assert 'mobile_client/test_vote' in soup.find_all('li')[0].a['href'], "The landing screen link to a mobile_client url for the created vote"

    app.delete('/api/test_vote.json').json
    app.delete('/api/test_vote2.json').json
