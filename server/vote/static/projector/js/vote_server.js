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
var socket_retry_interval = null;
function setup_websocket(on_connect, on_message) {
	console.log("setup_websocket");
    $('body').addClass('websocket_disconnected');
    
	var socket = new WebSocket("ws://"+location.hostname+":"+battlescape.data.settings.websocket.port+"/");
    
	socket.onopen = function(){ // Authenicate client with session key on socket connect
		var cookie = document.cookie.match(/_session=(.+?)(\;|\b)/);  // TODO - replace with use of settings['session_key'] or server could just use the actual http-header
		if (cookie) {
			socket.send(cookie[1]);
		}
		else {
			console.warn("No session cookie to authenticate websocket write access");
		}
		$('body').removeClass('websocket_disconnected');
		if (socket_retry_interval) {
			clearInterval(socket_retry_interval);
			socket_retry_interval = null;
		}
		console.log("Websocket: Connected");
		on_connect();
	};
	socket.onclose  = function() {
		socket = null;
		$('body').addClass('websocket_disconnected');
		console.log("Websocket: Disconnected");
		if (!socket_retry_interval) {
			socket_retry_interval = setInterval(function(){setup_websocket(on_connect, on_message)}, battlescape.data.settings.websocket.disconnected_retry_interval * 1000);
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
//window.addEventListener('keydown', keyboard_vote, true);
function keyboard_vote(event) {
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
	
	battlescape.ui.update_countdown(0);
	var ui_progress_update_interval = 0.05;
    var progress = 0;
	function update_countdown(){progress += ui_progress_update_interval/duration; battlescape.ui.update_countdown(progress);};
    interval_countdown = setInterval(update_countdown, ui_progress_update_interval * 1000);
	update_countdown();
}

function end_frame() {
    clearInterval(interval_countdown);
    var game = battlescape.get_game();
    var actor = game.get_current_turn_actor();
    
    var actions = get_highest_voted_actions();
    // If more than one highest action - confused
    if (actions.length != 1) {actions.push("confused");}
    
    actor.action(_.last(actions));
    game.next_turn();
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

function create_vote_pool(vote_pool) {
	//console.info("create_vote_pool", vote_pool);
	// Create vote_pool if needed
	$.post("/api/.json" , {"pool_id":vote_pool})
	.success(function(data){
		console.log("vote_pool created", vote_pool);
    })
    .error(function(xhr){
		var error_message = xhr.responseJSON.messages[0];
		if (error_message.search("pool already exists")) {
			console.debug("vote_pool already exisits", vote_pool);
		}
		else {
			console.warn("unable to create vote_pool", vote_pool);
		}
	});
}

var websocket_message_handlers = {};
function register_websocket_message_handler(key, handler_function) {
	websocket_message_handlers[key] = handler_function;
}

register_websocket_message_handler('votes', function(data){
	_.extend(current_frame, data);
	update_current_frame_ui();
});

var joined_count = 0;
register_websocket_message_handler('join', function(data){
	battlescape.ui.set_joined(joined_count++);
});


setup_websocket(
    // onconnect
    function(){
		create_vote_pool(vote_pool);
	},
    // onmessage
    function(data){
		_.each(data, function(value, key, list){
			if (_.has(websocket_message_handlers, key)) {
				websocket_message_handlers[key](value);
			}
			else {
				console.warn("unknown message key: "+key);
			}
		});
    }
);

// External --------------------------------------------------------------------
external.new_frame = new_frame;
external.get_current_frame = get_current_frame;
external.get_highest_voted_actions = get_highest_voted_actions;
external.register_websocket_message_handler = register_websocket_message_handler;
external.keyboard_vote = keyboard_vote;

}(battlescape.vote, battlescape));

