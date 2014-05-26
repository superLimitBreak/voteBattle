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
        $row = $(
            "<tr><td class='selected_td'></td><th>ACTION</th><td class='count'>COUNT</td></tr>"
            .replace("COUNT", _.random(0,15))
            .replace("ACTION", action)
        );
        if (action == "defend") {$row.addClass('selected');}  // HACK!! Selected placeholder
        return $row;
    }
    
    $action_table = $("<table></table>");
    $('.actions').empty().append($action_table);
    $.each(battlescape.game.get_current_turn_actor().get_actions(), function(i, action){
        $action_table.append(build_action_row(action));
    });
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
set_message("Techno Mage does 23 damage to Nyan Cat");


// External --------------------------------------------------------------------

external.update = update
external.set_message = set_message;

}(battlescape.ui, battlescape));