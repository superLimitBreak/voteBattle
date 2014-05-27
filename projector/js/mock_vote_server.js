battlescape = window.battlescape || {};
battlescape.vote = {}

(function(external, battlescape){
// -----------------------------------------------------------------------------

var current_frame = {};


var keys = {49:'1', 50:'2', 51:'3', 52:'4', 32:'SPACE'};
window.addEventListener('keydown', eventKeyDown, true);
function eventKeyDown(event) {
    if (event.keyCode in keys) {
        console.log(keys[event.keyCode]);
        event.preventDefault();
    }
}


function new_frame(items, duration) {
    
}

function end_frame() {
    // Find highest voted actions
    var max = _.max(_values(current_frame));
    var actions = []
    _.each(curent_frame, function(value, key, list){
        if (value == max) {
            actions.push(key);
        }
    });
    
    var actor = battlescape.game.get_current_turn_actor();
    if (actions.length != 1) {actions.push("confused");}
    actor.action(_.last(actions));
    battlescape.game.next_turn();
}

function get_current_frame() {
    
}


// Init ------------------------------------------------------------------------


// External --------------------------------------------------------------------
external.votes = new_frame;

}(battlescape.vote, battlescape));