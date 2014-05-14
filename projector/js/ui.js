(function(external){
// -----------------------------------------------------------------------------

function ui_update_stats() {
    console.log("update_stats");
    
    var build_player_row = function(player) {
        var player_data = data.characters[player];
        var player_state = state.characters[player];
        $row = $(
            "<tr><td class='selected_cell'></td><th>PLAYER_NAME</th><td class='numeric'>CURRENT_HEALTH/MAX_HEALTH</td></tr>"
            .replace("PLAYER_NAME", player_data.name)
            .replace("CURRENT_HEALTH", player_state.health)
            .replace("MAX_HEALTH", player_data.health)
        );
        //$row.addClass('selected');
        if ((player_state.health/player_data.health) < 0.2) {
            $row.addClass('low_health');
        }
        if (player_state.health <= 0) {
            $row.addClass('dead');
        }
        return $row;
    };
    
    $characters_table = $("<table></table>");
    $('.characters').empty().append($characters_table);
    $.each(data.players, function(i, player){
        $characters_table.append(build_player_row(player));
    });
}

// External --------------------------------------------------------------------

external.ui_update_stats = ui_update_stats;

}(global));