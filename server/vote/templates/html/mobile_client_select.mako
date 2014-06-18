<%inherit file="_base.mako"/>

<%def name="body()">
	
	% if data['pools']:
		<ul>
		% for pool in data['pools']:
			<li><a href="mobile_client/${pool}">${pool}</a></li>
		% endfor
		</ul>
	% else:
		<p>Scanning for vote to become avalable <span id="active_feedback"></span></p>
	% endif
	
	<script type="text/javascript">
		var refresh_timeout;
		document.addEventListener("DOMContentLoaded", function() {
		//$(document).ready(function() {
			refresh_timeout = setInterval(
				function(){
					window.location = window.location;
				},
				settings["mobile.client.select.refresh"]
			);
			
			active_feedback_timeout = setInterval(
				function() {
					var active_feedback = document.getElementById('active_feedback');
					active_feedback.innerHTML = active_feedback.innerHTML + "."
				},
				1000
			)
		});
	</script>
</%def>
