battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

function create_ai() {
    var ai = {};
    
    var INVERSE = true;
    
    ai.take_action = function(actor) {
        actor.action("attack");
        battlescape.game.next_turn();
    }
    
    ai.get_enemys = function(actor) {return battlescape.game.get_team(actor.team_name, INVERSE);}
    ai.get_friends = function(actor) {return battlescape.game.get_team(actor.team_name);}
    
    ai.get_random_enemy = function(actor) {
        var live_enemys = $.grep(ai.get_enemys(actor), function(a){return !a.is_dead()});
        return live_enemys[Math.round(Math.random()*65535) % live_enemys.length];
    }
    
    ai.get_most_hurt = function(actors) {
        var most_hurt = {health: 65535, take_damage: function(x){}};
        $.each(actors, function(i, actor){
            if (!actor.is_dead() && actor.health < most_hurt.health) {
                most_hurt = actor;
            }
        });
        return most_hurt;
    }
    
    return ai;
}


external.ai = create_ai()

}(battlescape, battlescape));