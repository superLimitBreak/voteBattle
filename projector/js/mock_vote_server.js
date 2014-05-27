battlescape = window.battlescape || {};
battlescape.vote = {};

(function(external, battlescape){
// -----------------------------------------------------------------------------


var current_frame_item_order = [];
var current_frame = {};

var timeout_end_frame;
var interval_countdown;

var keys = {49:'0', 50:'1', 51:'2', 52:'3', 32:'SPACE'};
window.addEventListener('keydown', eventKeyDown, true);
function eventKeyDown(event) {
    if (event.keyCode in keys) {
        var key = keys[event.keyCode];
        current_frame[current_frame_item_order[key]]++;
        event.preventDefault();
        _.throttle(battlescape.ui.update_actions, 500)();
    }
}


function new_frame(items, duration) {
    current_frame_item_order = _.clone(items);
    current_frame = {};
    _.each(items, function(item, index, items){
        current_frame[item] = 0;
    });
    battlescape.ui.update_actions();
    _.delay(end_frame, duration * 1000);
    var countdown = duration;
    interval_countdown = setInterval(function(){battlescape.ui.update_countdown(--countdown);}, 1000);
}

function end_frame() {
    clearInterval(interval_countdown);
    
    var actor = battlescape.game.get_current_turn_actor();
    
    // Find highest voted actions
    var max = _.max(_.values(current_frame));
    var actions = []
    _.each(current_frame, function(value, key, list){
        if (value == max) {
            actions.push(key);
        }
    });
    // If more than one highest action - confused
    if (actions.length != 1) {actions.push("confused");}
    
    actor.action(_.last(actions));
    battlescape.game.next_turn();
}

function get_current_frame() {
    return current_frame;    
}


// Init ------------------------------------------------------------------------


// External --------------------------------------------------------------------
external.new_frame = new_frame;
external.get_current_frame = get_current_frame;

}(battlescape.vote, battlescape));