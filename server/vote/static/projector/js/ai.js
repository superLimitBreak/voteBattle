battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

function create_ai() {
    var ai = {};
    
    var INVERSE = true;
    
    ai.take_action = function(actor) {
        var ai_actions = actor.get_data().ai_actions;
        if (ai_actions) {
            if (actor.ai_action_index==undefined) {actor.ai_action_index  = 0;}
            else                                  {actor.ai_action_index += 1;}
            //console.log(actor.ai_action_index, ai_actions.length, ai_actions, ai_actions[actor.ai_action_index % ai_actions.length]);
            actor.action(ai_actions[actor.ai_action_index % ai_actions.length]);
        }
        else {
            console.warn("no ai actions for this actor, falled back to standard attack");
            actor.action("attack");
        }
    }
    
    ai.get_enemys = function(actor) {return battlescape.get_game().get_team(actor.team_name, INVERSE);}
    ai.get_friends = function(actor) {return battlescape.get_game().get_team(actor.team_name);}
    
    ai.get_random_enemy = function(actor) {
        var live_enemys = $.grep(ai.get_enemys(actor), function(a){return !a.is_dead()});
        return live_enemys[_.random(0, live_enemys.length-1)];
    }
    
    ai.get_most_hurt = function(actors) {
        var most_hurt = {get_health_percent: function(){return 65535;}, take_damage: function(x){}};
        $.each(actors, function(i, actor){
            if (!actor.is_dead() && (actor.get_health_percent() < most_hurt.get_health_percent())) {
                most_hurt = actor;
            }
        });
        return most_hurt;
    }
    
    return ai;
}


external.ai = create_ai()

}(battlescape, battlescape));