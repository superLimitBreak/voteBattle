
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

// Startup ---------------------------------------------------------------------

function startup_client(pool_id) {
	$.getJSON('/api/'+pool_id+'.json')
	.success(function(response_json){
        var votes = response_json['data']['frame']['votes'];
        console.debug("vote_options", votes);
        var $vote_input = $('#vote_input');
        $vote_input.empty();
		$.each(votes, function(key, value){
            $vote_input.append('<li data-item="'+key+'">'+key+'</li>');
        });
        $vote_input.find('li').on('click', function(){
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
	})
	.error(function(xhr){
        console.error("startup_client failed");
	});

};
