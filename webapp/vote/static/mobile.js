$.cookie.json = true;

var settings = {
    "mobile.client.select.refresh": 20  // Seconds
};


function get_server_datetime() {
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
get_server_datetime();  // Set cookies and init server offset as soon as possible
