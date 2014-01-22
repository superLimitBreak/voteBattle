var settings = {
    "websocket.port":9873,
    "websocket.disconnected_retry_interval":5
    
};

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
function setup_websocket() {
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
			socket_retry_interval = setInterval(setup_websocket,settings["websocket.disconnected_retry_interval"]*1000);
		}
	};
	socket.onmessage = function(msg) {
		var data = JSON.parse(msg.data);
		console.log('Websocket: data: '+data);
	};
}

// Init ------------------------------------------------------------------------

check_browser_compatability();
setup_websocket();

var vote_pool = 'battle';

var current_frame;

function new_frame(vote_pool, items) {
	items = "attack,defend,heal";
	$.post('/api/'+vote_pool+'.json', {"items": items})
	.success(function(data){
		//current_frame = ;
		console.log("I just made a new frame, im a clever projector interface, now give me a cookie");
	})
	.error(function(xhr){
		var data = xhr.responseJSON;
		console.error("ballz", data);
	});
}

// Startup cycle ---------------------------------------------------------------
//    The startup cycle trys to automatically setup a vote_pool with a frame
//    in the event these exisit on the server, it will use the server copys
//    if not, it will create new ones for this projector client

function startup() {
	console.debug("startup");
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
		var data = xhr.responseJSON;
		if (data.messages[0].search("already exists")) {
			create_frame(vote_pool);
		}
	});
}

function create_frame(vote_pool) {
	console.debug("create_frame", vote_pool);
	$.getJSON('/api/'+vote_pool)
	.success(function(data){
		console.debug("create_frame", vote_pool, "current frame already on server");
		current_frame = data['data']
	})
	.error(function(xhr){
		if (current_frame) {
			console.warn("unimplemented resilience")
			// TODO - Failure resilience
			// If this client already has a current frame, this may mean the server has died and may not have it's state
			// Try to instanciate the state of the last frame
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
