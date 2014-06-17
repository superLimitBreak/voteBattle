VoteBattle Serving
==================

Ports
-----

Python server 6543
Websocket server 9873

Static files
------------

server/externals/ -> /ext
server/vote/static -> /static

(/ext are populated by running vote/make externals)

Use
---

BUG! projector must visit / first to obtain a session id before visiting battlescape.html
Projector should visit /static/projector/battlescape.html - this will setup votepool for subsiquent clients visiting /
Clients just connect to server / then get redirected by python code when a vote pool is active
the websocket port must be open


