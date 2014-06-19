
// Settings --------------------------------------------------------------------

$.cookie.json = true;

var settings = {
	"mobile.client.select.refresh": 10 * 1000,
	"mobile.client.retry.timeout.error": 10 * 1000,
	"mobile.client.retry.timeout.missed": 1 * 1000,
	//"server.websocket.port": 9883,
};


// Button manager ------

function set_vote_input_state(state, item_confirmed) {
	//console.log("set_vote_input_state", state, item_confirmed);
	$('#vote_input button').each(function(i, element){
		var $element = $(element);
		$element.attr('disabled', !state);
	});
}

function setup_vote_input(pool_id, vote_items) {
	console.debug("setup_vote_input", vote_items)
	var $vote_list = $('#vote_input').append('ol');
	$vote_list.empty();
	$.each(vote_items, function(index, value){
		$vote_list.append('<button data-item="'+value+'">'+value+' <span></span></button>');
	});
	$vote_list.trigger("create");
	$vote_list.find('button').on('click', function(){
		var $button = $(this);
		$button.addClass('selected');
		do_vote(pool_id, $button.data('item'));
	});
}

function update_vote_counts(votes) {
	$.each(votes, function(key, value){
		console.debug("vote_count", key, value);
		if (value.length) {
			$("button:contains('"+key+"') span").html(""+value.length);
		}
	});
}


// Poll vote frame -------------------------------------------------------------

function get_frame(pool_id, sequence_id) {
	if (!sequence_id) {sequence_id = 0;}
	console.debug("get_frame", pool_id, sequence_id);
	$.getJSON('/api/'+pool_id+'.json')
		.success(function(response_json){
			var data = response_json['data'];
			// If frame aquire is our current frame - retry get_frame
			if (data['sequence_id'] != sequence_id) {
				// Setup new frame
				sequence_id = data['sequence_id'];  // Update sequence_id
				var vote_items = data['frame']['item_order'];
				if (vote_items) {
					setup_vote_input(pool_id, vote_items);  // If we have something to vote for, setup input
				}
			}
			
			if (data && data.frame && data.frame.votes) {
				update_vote_counts(data.frame.votes);
			}
			
			setTimeout(function(){
				get_frame(pool_id, sequence_id);
			}, settings["mobile.client.retry.timeout.missed"]);
		})
		.error(function(xhr){
			console.error("get_frame failed, the server has issues, recovering timeout");
			setTimeout(function(){
				get_frame(pool_id, sequence_id);
			}, settings["mobile.client.retry.timeout.error"]);
			return;
		});
}

// Perform the vote ------------------------------------------------------------

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
				alert("already voted this frame (something has gone wrong)");
				return;
			}
			console.error(error_message);
			console.log("no idea what went wrong, re-enable the buttons");
			set_vote_input_state(true);
		});
}
