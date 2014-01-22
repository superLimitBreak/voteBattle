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

function new_frame(items) {
	items = "attack,defend,heal";
	$.post('/api/'+vote_pool+'.json', {"items": items})
	.success(function(data){
		console.log("new frame");
	})
	.error(function(xhr){
		var data = xhr.responseJSON;
		console.log("ballz", data);
	});
}

function pool_ready() {
	//new_frame(['attack', 'defend', 'heal']);
}

$(document).ready(function() {
	$.post("/api/.json" , {"pool_id":vote_pool})
	.success(function(data){
		//console.log(data);
		pool_ready();
    })
    .error(function(xhr){
		var data = xhr.responseJSON;
		if (data.messages[0].search("already exists")) {
			//console.log('its all ok');
			pool_ready();
		}
	});
	
});

//$.getJSON( url , params , callback )
//$.post( url , params , callback )
