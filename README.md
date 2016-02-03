VoteBattle
==========

Vote with mobile phones on a JRPG style battle.

Created for a live music performance where the audience take part in the battle while the band rock out playing a battle track.

Example setup
-------------

    apt-get install python3 git make wget virtualenv
    git clone https://github.com/SuperLimitBreak/voteBattle.git
    cd voteBattle/server
    make install
    make run

Use Chrome (at exactly 1024x768) and to go to
`http://localhost:8808/static/projector/battlescape.html`
and fire up another client to vote at
`http://localhost:8808/`
Battle can be started by pressing `a` on the battlescape machine.
