
// Settings --------------------------------------------------------------------

$.cookie.json = true;

var settings = {
    "mobile.client.select.refresh": 20  // Seconds
};

// Timesync --------------------------------------------------------------------

function now() {
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
    return new Date() - server_datetime_offset;
};
now();  // Set cookies and init server offset as soon as possible

// utils ------

function set_vote_input_state(state) {
    console.log("set_vote_input_state", state)
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
        var votes = response_json['data']['frame']['votes'];
        setup_vote_input(pool_id, votes);
	})
	.error(function(xhr){
        console.error("startup_client failed");
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
        set_vote_input_state(false);
        var item = $(this).data('item');
        //console.debug("vote", item);
        $.getJSON('/api/'+pool_id+'/vote.json?item='+item)
        .success(function(data){
            console.debug("vote successful");
            $vote_input.empty();
        })
        .error(function(xhr){
            console.error(xhr.responseJSON['messages'][0]);
        });
    });
}

// Startup ---------------------------------------------------------------------

function startup_client(pool_id) {
    get_frame(pool_id);
};
