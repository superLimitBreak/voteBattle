
// Settings --------------------------------------------------------------------

$.cookie.json = true;

var settings = {
    "mobile.client.select.refresh": 20,  // Seconds
    "mobile.client.retry.timeout.error": 10,
    "mobile.client.retry.timeout.missed": 1,
    "mobile.client.retry.timeout.default_frame_duration": 10,
    "mobile.client.fetch.offset": 0.1,  // deliberatly check 1 second after datetime timeout provided, give the server a chance to sort itself
};

// Timesync --------------------------------------------------------------------


function timediff(datetime) {
    var server_datetime_offset = $.cookie('server_datetime_offset');
    if (!server_datetime_offset) {
        try {
            server_datetime_offset = new Date() - new Date($.cookie('server_timesync').server_timesync);
            $.cookie('server_datetime_offset', server_datetime_offset, {path: '/'})
            console.log("Calculated server_datetime_offset: " + server_datetime_offset);
        } catch(e) {
            server_datetime_offset = 0;
            console.warn("Unable to determin server_datetime_offset");
        }
    }
    if (!datetime) {datetime = new Date();}
    return datetime - server_datetime_offset;
};
timediff();  // Set cookies and init server offset as soon as possible
var now = timediff;  // function alias for timediff for readabilty
var timed_functions = {}
function clear_timed_function(func) {clearTimeout(timed_functions[func]);}
function set_timed_function(func, timeout) {
    // at timestamp (with server offset), tigger the function
    if (!timeout) {
        console.error("null timeout");
        return;
    }
    if (typeof(timeout)=="string") {
        timeout = new Date(timeout);
    }
    if (typeof(timeout)=="object" && 'getDate' in timeout) {
        timeout = (timeout - now()) + settings["mobile.client.fetch.offset"]*1000;
    }
    if (typeof(timeout)!="number") {
        console.error("Invalid timeout", timeout);
        return;
    }
    console.debug("waiting "+timeout/1000);
    timed_functions[func] = setTimeout(func, timeout);
}


var sequence_id = 0;


// utils ------

function set_vote_input_state(state, item_confirmed) {
    console.log("set_vote_input_state", state, item_confirmed);
    $('#vote_input li button').each(function(i, element){
        var $element = $(element);
        $element.attr('disabled', !state);
    });
}

// Flow ------------------------------------------------------------------------

function get_frame(pool_id) {
    console.debug("get_frame", pool_id);
	$.getJSON('/api/'+pool_id+'.json')
	.success(function(response_json){
        var data = response_json['data'];
        // If frame aquire is our current frame - retry get_frame
        if (sequence_id == data['sequence_id']) {
            console.log("already on this frame");
            set_timed_function(function(){
                get_frame(pool_id);
            }, settings["mobile.client.retry.timeout.missed"] * 1000);
            return;
        }
        // Setup new frame
        sequence_id = data['sequence_id'];
        var votes = data['frame']['votes'];
        var timeout;
        if (votes) {
            timeout = data['frame']['timeframe']['end'];  // Setup refresh timestamp for the next frame - this could be null
            setup_vote_input(pool_id, votes);  // If we have something to vote for, setup input
        }
        if (!timeout) {
            timeout = settings["mobile.client.retry.timeout.missed"] * 1000;  // Nothing to vote for, keep asking for votes frequently
        }
        set_timed_function(function(){
            get_frame(pool_id);
        }, timeout);
	})
	.error(function(xhr){
        console.error("get_frame failed, the server has issues, recovering timeout");
        setTimeout(function(){
            get_frame(pool_id);
        }, settings["mobile.client.retry.timeout.error"] * 1000);
        return;
	});
}

function setup_vote_input(pool_id, votes) {
    console.debug("setup_vote_input", votes)
    var $vote_input = $('#vote_input');
    $vote_input.empty();
    $.each(votes, function(key, value){
        $vote_input.append('<li><button data-item="'+key+'">'+key+'</button></li>');
    });
    $vote_input.find('li button').on('click', function(){
        var item = $(this).data('item');
        do_vote(pool_id, item);
    });
}

function do_vote(pool_id, item) {
    console.debug("do_vote", pool_id, item);
    set_vote_input_state(false);
    $.getJSON('/api/'+pool_id+'/vote.json?item='+item)
    .success(function(data){
        console.debug("vote successful");
        set_vote_input_state(false, item);
    })
    .error(function(xhr){
        var error_message = xhr.responseJSON['messages'][0];  // TODO: join all the messages
        if (error_message.search("multivote")) {
            alert("already voted");
            return;
        }
        console.error(error_message);
        consoleNode.log("no idea what went wrong, re-enable the buttons");
        set_vote_input_state(true);
    });
}


// Startup ---------------------------------------------------------------------

function startup_client(pool_id) {
    get_frame(pool_id);
};
