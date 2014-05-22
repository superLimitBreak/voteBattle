battlescape = window.battlescape || {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

function create_ai() {
    var ai = {};
    
    
    ai.take_action = function() {
        console.warn("ai Perform action not implemented");
        battlescape.game.next_turn();
    }
    
    return ai;
}


external.ai = create_ai()

}(battlescape, battlescape));