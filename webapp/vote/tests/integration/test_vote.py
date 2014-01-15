from ..conftest import unimplemented, unfinished, xfail

from bs4 import BeautifulSoup


def test_vote_cycle(app):
    """
    """
    response_json = app.post('/api/new.json', dict(id='test_vote')).json
    assert response_json['status']=='ok'

    response_json = app.post('/api/test_vote/frame.json', dict(items='option1,option2,option3')).json
    assert response_json['status']=='ok'
    assert response_json['data']['sequence_id'] == 1
    assert response_json['data']['previous_frame'] == None
    assert 'option1' in response_json['data']['frame']

    response_json = app.get('/api/test_vote/frame.json').json
    assert response_json['data']['sequence_id'] == 1
    assert 'option1' in response_json['data']['frame']
