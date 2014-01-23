
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
	$.getJSON('/api/'+pool_id)
	.success(function(data){
		console.log("frame data", data);
	})
	.error(function(xhr){
        console.error("ballz");
	});

};
console.log("LIB READY");
