from ..conftest import unimplemented, unfinished, xfail

from bs4 import BeautifulSoup


def assert_in(values, items):
    for value in values:
        assert value in items


def test_frame_sequence(app):
    """
    """
    # Create new vote pool called 'test_vote'
    response_json = app.post('/api/.json', dict(id='test_vote')).json
    assert response_json['status']=='ok'

    # Create new frame with 3 options
    response_data = app.post('/api/test_vote.json', dict(items='option1,option2,option3')).json['data']
    assert response_data['sequence_id'] == 1
    assert response_data['previous_frame'] == None
    assert_in(('option1','option2','option3'), response_data['frame'])

    # Ensure the frame can be aquired
    response_data = app.get('/api/test_vote.json').json['data']
    assert response_data['sequence_id'] == 1
    assert_in(('option1','option2','option3'), response_data['frame'])

    # Create new frame with 3 more options
    response_data = app.post('/api/test_vote.json', dict(items='option4,option5,option6')).json['data']
    assert response_data['sequence_id'] == 2
    assert_in(('option1','option2','option3'), response_data['previous_frame'])
    assert_in(('option4','option5','option6'), response_data['frame'])

    # Check previous frames
    response_data = app.get('/api/test_vote/previous_frames.json').json['data']
    assert len(response_data['frames']) == 1
    assert_in(('option1','option2','option3'), response_data['frames'][0])

    # Create new frame with 3 more options
    response_data = app.post('/api/test_vote.json', dict(items='option7,option8,option9')).json['data']
    assert response_data['sequence_id'] == 3

    # Check previous frames
    response_data = app.get('/api/test_vote/previous_frames.json').json['data']
    assert len(response_data['frames']) == 2
    assert 'option1' in response_data['frames'][0]
    assert 'option4' in response_data['frames'][1]
    # Check previous frames limit
    response_data = app.get('/api/test_vote/previous_frames.json?limit=1').json['data']
    assert len(response_data['frames']) == 1
    assert 'option4' in response_data['frames'][0]

    # Remove vote pool called 'test_vote'
    response_json = app.delete('/api/test_vote.json').json
    assert response_json['status']=='ok'
    response_json = app.get('/api/test_vote.json', expect_errors=True).json
    assert response_json['code'] == 400
    

def test_vote(app):
    # Vote on on non exisitnat vote_pool
    app.get('/api/test_vote/vote.json?item=ERROR', expect_errors=True).json
    
    # Create new vote pool called 'test_vote'
    app.post('/api/.json', dict(id='test_vote')).json

    # Vote when no frames are present
    app.get('/api/test_vote/vote.json?item=ERROR', expect_errors=True).json

    # Create vote frame with 3 options
    app.post('/api/test_vote.json', dict(items='option1,option2,option3')).json['data']

    # Vote on invalid option
    app.get('/api/test_vote/vote.json?item=ERROR', expect_errors=True).json

    # Vote on valid option
    app.get('/api/test_vote/vote.json?item=option1').json

    # Get current frame and assert state
    response_data = app.get('/api/test_vote.json').json['data']
    assert len(response_data['frame']['option1']) == 1
    assert len(response_data['frame']['option2']) == 0

    # Remove vote pool called 'test_vote'
    app.delete('/api/test_vote.json').json


def test_mobile_client_landing_flow(app):
    response = app.get('/')
    assert 'waiting' in response.text.lower(), "The landing screen should start waiting"

    app.post('/api/.json', dict(id='test_vote')).json
    app.post('/api/test_vote.json', dict(items='option1,option2,option3')).json['data']

    response = app.get('/')
    assert 'mobile_client/test_vote' in response.text.lower(), "The landing screen link to a mobile_client url for the created vote"
    # humm. . this is redirect
    
    #soup = BeautifulSoup(app.get('/').text)
    #assert 'mobile_client/test_vote' in soup.find_all('li')[0].a['href'], "The landing screen link to a mobile_client url for the created vote"
    

    app.delete('/api/test_vote.json').json
