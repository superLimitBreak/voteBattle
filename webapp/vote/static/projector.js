var settings = {
    "websocket.port":9873,
    "websocket.disconnected_retry_interval":5,
    "projector.frame.duration.default": 15,
};

function keys(obj) {
	var keys = [];
	for (item in obj) {keys.push(item);}
	return keys;
}



// Browser Compatability -------------------------------------------------------

function check_browser_compatability() {
    function get_chrome_version() {
        try      {return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);}
        catch(e) {return 0;}
    }
	if (!get_chrome_version()) {
		$('body').addClass('browser_unsupported');
		var msg = "Browser is unsupported. This player is currently only designed and tested to work with Google Chrome. It may behave unexpectedly.";
		console.warn(msg);
		alert(msg);
	}
};

// Websocket -------------------------------------------------------------------
var socket;
var socket_retry_interval = null;
function setup_websocket(on_message) {
	console.log("setup_websocket");

	socket = new WebSocket("ws://"+location.hostname+":"+settings['websocket.port']+"/");
	socket.onopen = function(){ // Authenicate client with session key on socket connect
		socket.send(document.cookie.match(/_session=(.+?)(\;|\b)/)[1]);  // TODO - replace with use of settings['session_key'] or server could just use the actual http-header
		$('body').removeClass('websocket_disconnected');
		console.log("Websocket: Connected");
		if (socket_retry_interval) {
			clearInterval(socket_retry_interval);
			socket_retry_interval = null;
		}
		startup();
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

// Vote stuff ------------------------------------------------------------------

var vote_pool = 'battle';
var current_frame;
var interval_next_check;

function new_frame(vote_pool, items, duration) {
	console.debug("new_frame", items, duration);
	if (!duration) {
		duration = settings["projector.frame.duration.default"];
	}
	$.post('/api/'+vote_pool+'.json', {items: items.join(","), duration: duration})
	.success(function(data){
		current_frame = data.data;
		interval_next_check = setTimeout( // if we ever get websocket diconnected we have to stop any timers
			function(){new_frame(vote_pool, [Math.random(), Math.random(), Math.random()]);},
			duration * 1000
		);
		console.debug("new_frame created");
	})
	.error(function(xhr){
		var data = xhr.responseJSON;
		console.error("new_frame cant create new frame, hu?", data);
	});
}

function cancelTimeout() {
	if (interval_next_check) {
		clearInterval(interval_next_check);
		interval_next_check = null;
	}
}

// Startup cycle ---------------------------------------------------------------
//    The startup cycle trys to automatically setup a vote_pool with a frame
//    in the event these exisit on the server, it will use the server copys
//    if not, it will create new ones for this projector client

function startup() {
	console.debug("startup");
	cancelTimeout();
	create_vote_pool(vote_pool);
}

function create_vote_pool(vote_pool) {
	console.debug("create_vote_pool", vote_pool);
	// Create vote_pool if needed
	$.post("/api/.json" , {"pool_id":vote_pool})
	.success(function(data){
		create_frame(vote_pool);
    })
    .error(function(xhr){
		var error_message = xhr.responseJSON.messages[0];
		if (error_message.search("pool already exists")) {
			create_frame(vote_pool);
		}
	});
}

function create_frame(vote_pool) {
	console.debug("create_frame", vote_pool);
	$.getJSON('/api/'+vote_pool)
	.success(function(data){
		console.debug("create_frame", vote_pool, "aquireing frame from server");
		current_frame = data['data']
	})
	.error(function(xhr){
		if (current_frame) {
			console.debug("projector has state, server has no state, re-instating last know frame");
			//console.warn("the server has failed and this projector interface has state - unimplemented resilience of reinstating server frame state")
			// TODO - Failure resilience
			// If this client already has a current frame, this may mean the server has died and may not have it's state
			// Try to instanciate the state of the last frame
			new_frame(vote_pool, keys(current_frame['frame']['votes']), current_frame['frame']['timeframe']['duration']);
		}
		else {
			console.debug("create_frame", vote_pool, "create new frame");
			new_frame(vote_pool, ['attack', 'defend', 'heal']);
		}
	});
}


//$(document).ready(function() {startup();});

//$.getJSON( url , params , callback )
//$.post( url , params , callback )

function on_message(data) {
	console.debug("websocket message recived");
	console.log(data);
}


// Init ------------------------------------------------------------------------

check_browser_compatability();
setup_websocket(on_message);
