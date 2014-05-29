battlescape = window.battlescape || {};
battlescape.vote = {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

var vote_pool = battlescape.data.settings.vote.pool;

var current_frame_item_order = [];
var current_frame = {};

var timeout_end_frame;
var interval_countdown;


// Websocket -------------------------------
function setup_websocket(on_connect, on_message) {
	console.log("setup_websocket");
    $('body').addClass('websocket_disconnected');
    
	var socket = new WebSocket("ws://"+location.hostname+":"+battlescape.data.settings.websocket.port+"/");
    var socket_retry_interval = null;
	socket.onopen = function(){ // Authenicate client with session key on socket connect
		socket.send(document.cookie.match(/_session=(.+?)(\;|\b)/)[1]);  // TODO - replace with use of settings['session_key'] or server could just use the actual http-header
		$('body').removeClass('websocket_disconnected');
		console.log("Websocket: Connected");
		if (socket_retry_interval) {
			clearInterval(socket_retry_interval);
			socket_retry_interval = null;
		}
		on_connect();
	};
	socket.onclose  = function() {
		socket = null;
		$('body').addClass('websocket_disconnected');
		console.log("Websocket: Disconnected");
		if (!socket_retry_interval) {
			socket_retry_interval = setInterval(function(){setup_websocket(on_message)},settings["websocket.disconnected_retry_interval"]*1000);
		}
	};
	socket.onmessage = function(msg) {
		var data = JSON.parse(msg.data);
		on_message(data);
	};
}


function update_current_frame_ui() {
    _.throttle(battlescape.ui.update_actions, 500)();
}


// Key Events ------------------------------

var keys = {49:'0', 50:'1', 51:'2', 52:'3', 32:'SPACE'};
window.addEventListener('keydown', eventKeyDown, true);
function eventKeyDown(event) {
    if (event.keyCode in keys) {
        var key = keys[event.keyCode];
        current_frame[current_frame_item_order[key]]++;
        event.preventDefault();
        update_current_frame_ui();
    }
}




// Frame Controls ----------------------------

function new_frame(items, duration) {
	$.post('/api/'+vote_pool+'.json', {items: items.join(","), duration: duration})
        .success(function(data){})
        .error(function(xhr){
            console.error("new_frame failed", xhr.responseJSON);
        });
    
    current_frame_item_order = _.clone(items);
    current_frame = {};
    _.each(items, function(item, index, items){
        current_frame[item] = 0;
    });
    battlescape.ui.update_actions();
    _.delay(end_frame, duration * 1000);
    var countdown = duration;
	function update_countdown(){battlescape.ui.update_countdown(countdown--);};
    interval_countdown = setInterval(update_countdown, 1000);
	update_countdown();
}

function end_frame() {
    clearInterval(interval_countdown);
    
    var actor = battlescape.game.get_current_turn_actor();
    
    var actions = get_highest_voted_actions();
    // If more than one highest action - confused
    if (actions.length != 1) {actions.push("confused");}
    
    actor.action(_.last(actions));
    battlescape.game.next_turn();
}

function get_highest_voted_actions() {
    var max = _.max(_.values(current_frame));
    var actions = []
    _.each(current_frame, function(value, key, list){
        if (value == max) {
            actions.push(key);
        }
    });
    return actions;
}

function get_current_frame() {
    return current_frame;    
}


// Init ------------------------------------------------------------------------
setup_websocket(
    // connect
    function(){},
    // message
    function(data){
        console.log(data);
        //current_frame[] = 
        //update_current_frame_ui();
    }
);

// External --------------------------------------------------------------------
external.new_frame = new_frame;
external.get_current_frame = get_current_frame;
external.get_highest_voted_actions = get_highest_voted_actions;

}(battlescape.vote, battlescape));

