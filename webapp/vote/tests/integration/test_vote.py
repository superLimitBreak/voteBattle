from ..conftest import unimplemented, unfinished, xfail

from bs4 import BeautifulSoup

def assert_in(values, items):
    for value in values:
        assert value in items


def test_frame_sequence(app):
    """
    """
    # Create new vote pool called 'test_vote'
    response_json = app.post('/api/new.json', dict(id='test_vote')).json
    assert response_json['status']=='ok'

    # Create new frame with 3 options
    response_data = app.post('/api/test_vote/frame.json', dict(items='option1,option2,option3')).json['data']
    assert response_data['sequence_id'] == 1
    assert response_data['previous_frame'] == None
    assert_in(('option1','option2','option3'), response_data['frame'])

    # Ensure the frame can be aquired
    response_data = app.get('/api/test_vote/frame.json').json['data']
    assert response_data['sequence_id'] == 1
    assert_in(('option1','option2','option3'), response_data['frame'])

    # Create new frame with 3 more options
    response_data = app.post('/api/test_vote/frame.json', dict(items='option4,option5,option6')).json['data']
    assert response_data['sequence_id'] == 2
    assert_in(('option1','option2','option3'), response_data['previous_frame'])
    assert_in(('option4','option5','option6'), response_data['frame'])

    # Check previous frames
    response_data = app.get('/api/test_vote/previous_frames.json').json['data']
    assert len(response_data['frames']) == 1
    assert_in(('option1','option2','option3'), response_data['frames'][0])

    # Create new frame with 3 more options
    response_data = app.post('/api/test_vote/frame.json', dict(items='option7,option8,option9')).json['data']
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
    
    

def test_vote(app):
    # Create new vote pool called 'test_vote'
    #response_json = app.post('/api/new.json', dict(id='test_vote')).json
    #assert response_json['status']=='ok'
    pass

def test_cache(app):
    pass
