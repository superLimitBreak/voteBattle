battlescape.ui = {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

function update_stats() {
    //console.log("update_stats");
    
    function build_player_row(player_id) {
        var actor = battlescape.game.get_actors()[player_id];
        $row = $(
            "<tr><td class='selected_td'></td><th>PLAYER_NAME</th><td class='numeric'>CURRENT_HEALTH/MAX_HEALTH</td></tr>"
            .replace("PLAYER_NAME", actor.get_data().name)
            .replace("CURRENT_HEALTH", actor.get_health())
            .replace("MAX_HEALTH", actor.get_data().health)
        );
        if (actor == battlescape.game.get_current_turn_actor()) {
            $row.addClass('selected');
        }
        if (actor.is_hurt()) {
            $row.addClass('hurt');
        }
        if (actor.is_dead()) {
            $row.addClass('dead');
        }
        return $row;
    };
    
    $characters_table = $("<table></table>");
    $('.stats').empty().append($characters_table);
    $.each(battlescape.data.players, function(i, player_id){
        $characters_table.append(build_player_row(player_id));
    });
}

function update_actions() {

    function build_action_row(action) {
        // Get current vote count for this action
        var current_frame = battlescape.vote.get_current_frame();
        if (current_frame == undefined) {current_frame = {};}
        var count = current_frame[action] || 0;
        
        // Build action row
        $row = $(
            "<tr><td class='selected_td'></td><th>ACTION</th><td class='count'>COUNT</td></tr>"
            .replace("ACTION", action)
            .replace("COUNT", count)
        );
        
        var css_class_selected = 'selected';
        if (battlescape.vote.get_highest_voted_actions().length > 1) {css_class_selected = 'confused';}
        if (count == _.max(_.values(current_frame))) {$row.addClass(css_class_selected);}  // Select the highest vote
        return $row;
    }
    
    $action_table = $("<table></table>");
    $('.actions').empty().append($action_table);
    var actor = battlescape.game.get_current_turn_actor();
    if (actor.is_player()) {
        $.each(actor.get_actions(), function(i, action){
            $action_table.append(build_action_row(action));
        });
    }
    else {
        $action_table.append("");
    }
}

function update_countdown(time_remaining) {
    var $countdown = $('.countdown');
    $countdown.html(time_remaining);
}

function set_message(msg) {
    var $messages = $('.messages');
    $messages.removeClass('message');
    $messages.html(msg);
    $messages.addClass('message');
}

function update() {
    //console.log("ui update");
    update_stats();
    update_actions();
}

// Init ------------------------------------------------------------------------

update();
set_message("VoteBattle");


// External --------------------------------------------------------------------

external.update = update
external.set_message = set_message;
external.update_countdown = update_countdown;
external.update_actions = update_actions;

}(battlescape.ui, battlescape));