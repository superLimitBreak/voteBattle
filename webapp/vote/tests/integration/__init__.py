import json

def get_cookie(app, key):
    try:
        return json.loads({cookie.name:cookie for cookie in app.cookiejar}[key].value)
    except KeyError:
        return None
