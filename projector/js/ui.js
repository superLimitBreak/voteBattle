var ui = window.ui || {};

(function(external){
// -----------------------------------------------------------------------------

function update_stats() {
    console.log("update_stats");
    
    var build_player_row = function(player_id) {
        var actor = state.actors[player_id];
        $row = $(
            "<tr><td class='selected_td'></td><th>PLAYER_NAME</th><td class='numeric'>CURRENT_HEALTH/MAX_HEALTH</td></tr>"
            .replace("PLAYER_NAME", actor.data.name)
            .replace("CURRENT_HEALTH", actor.health)
            .replace("MAX_HEALTH", actor.data.health)
        );
        if (actor == state.active_actor) {
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
    $('.characters').empty().append($characters_table);
    $.each(data.players, function(i, player_id){
        $characters_table.append(build_player_row(player_id));
    });
}


// Init ------------------------------------------------------------------------

update_stats();

// External --------------------------------------------------------------------

external.update_stats = update_stats;

}(ui));