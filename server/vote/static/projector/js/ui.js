battlescape.ui = {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

function update_stats() {
    //console.log("update_stats");
    
    function build_player_row(player_id) {
        var actor = battlescape.get_game().get_actors()[player_id];
        $row = $(
            "<tr><td class='selected_td emoji'></td><th>PLAYER_NAME</th><td class='numeric'>CURRENT_HEALTH/MAX_HEALTH</td></tr>"
            .replace("PLAYER_NAME", actor.get_data().name)
            .replace("CURRENT_HEALTH", actor.get_health())
            .replace("MAX_HEALTH", actor.get_data().health)
        );
        if (actor == battlescape.get_game().get_current_turn_actor()) {
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
    $('#stats').empty().append($characters_table);
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
    
    $actions = $('#actions');
    var actor = battlescape.get_game().get_current_turn_actor();
    if (actor.is_player()) {
        $actions.removeClass('hidden');
        $action_table = $("<table></table>");
        $('#action_menu').empty().append($action_table);
        $.each(actor.get_actions(), function(i, action) {
            $action_table.append(build_action_row(action));
        });
    }
    else {
        $actions.addClass('hidden');
    }
}


//
var context = document.getElementById('countdown_canvas').getContext('2d');
var x = context.canvas.width / 2;
var y = x;
function filled_circle(angle, line_width) {
    var radius = x - line_width;
    var angle_start = -Math.PI/2;
    context.beginPath();
    context.arc(x, y, radius, angle_start, angle + angle_start, false);
    context.lineTo(x, y);
    context.closePath();
    context.lineWidth = line_width;
    context.fillStyle = 'white';
    context.fill();
    context.strokeStyle = '#dddddd';
    context.stroke();
}


function update_countdown(time_remaining) {
    if (time_remaining == 0) {context.clearRect(0,0,100,100);}
    // time remaining is a fraction 0 -> 1
    //var $countdown = $('.countdown');
    //$countdown.html(time_remaining);
    filled_circle(time_remaining * Math.PI * 2, 1);
}

function set_joined(count) {
    $('#join_count').html(count);
}


function set_message(msg) {
    var $messages = $('#messages');
    if (msg) {
        $messages.removeClass('message').removeClass('hidden');
        $messages.html(msg);
        $messages.addClass('message');
    }
    else {
        $messages.addClass('hidden');
    }
}

function update() {
    //console.log("ui update");
    update_stats();
    update_actions();
}

var keys = {65:'A', 76:'L'};
function keyboard_title(event) {
    if (event.keyCode in keys) {
        var key = keys[event.keyCode];
        if (key == 'L') {
            battlescape.ui.screen('preroll');
        }
        if (key == 'A') {
            battlescape.ui.screen('battle');
        }
        event.preventDefault();
    }
}

// TODO - Screen should be a class with a show() and hide() method that act like
//   constructor/destructor
// This REALLY shouldnt be in ui .. really!
var screen_init_functions = {
    'battle': function() {
        battlescape.new_game();
        $(window).on('keydown', battlescape.vote.keyboard_vote);  // TODO - this should be unbound on screen hide
        battlescape.cameras.new_camera('_into_pan_players');
        setTimeout(battlescape.get_game().start, 6000);  // Allow 4 seconds for the intro pan before starting the combat
    },
    'preroll': function() {
        var countdown = 10;
        function countdown_timer() {
            if (countdown > 0) {
                console.log("preroll", countdown);
                $('#screen_preroll .countdown').html(countdown);
                countdown--;
                setTimeout(countdown_timer, 1000);
            }
            else {
                screen('battle');
            }
        }
        countdown_timer();
    },
    'title': function() {
        $(window).on('keydown', keyboard_title);  // TODO - this should be unbound on screen hide
    }
};

function screen(screen_name) {
    $screen = $('#screen_'+screen_name);
    $('.screen').addClass('hidden'); // Hide all screens
    $screen.removeClass('hidden');
    screen_init_functions[screen_name]();
}


// Init ------------------------------------------------------------------------

//update();
set_message();
//set_message("VoteBattle");


// External --------------------------------------------------------------------

external.update = update
external.set_message = set_message;
external.update_countdown = update_countdown;
external.update_actions = update_actions;
external.screen = screen;
external.set_joined = set_joined;

}(battlescape.ui, battlescape));