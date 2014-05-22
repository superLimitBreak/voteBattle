battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

function create_ai() {
    var ai = {};
    
    var INVERSE = true;
    
    ai.take_action = function() {
        console.warn("ai Perform action not implemented");
        battlescape.game.next_turn();
    }
    
    ai.get_enemys = function(actor) {return battlescape.game.get_team(actor.team_name, INVERSE);}
    ai.get_friends = function(actor) {return battlescape.game.get_team(actor.team_name);}
    
    ai.get_random_enemy = function(actor) {
        var enemys = ai.get_enemys(actor);
        return enemys[Math.round(Math.random()*65535) % enemys.length];
    }
    
    return ai;
}


external.ai = create_ai()

}(battlescape, battlescape));