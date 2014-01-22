<%inherit file="_base.mako"/>

<%def name="title()">Mobile Client</%def>

<%def name="body()">
	<h1>${title()}</h1>
	
	% if data['pools']:
		<ul>
		% for pool in data['pools']:
			<li><a href="mobile_client/${pool}">${pool}</a></li>
		% endfor
		</ul>
	% else:
		<p>Waiting for vote to become avalable ...</p>
	% endif
	
	<script type="text/javascript">
		var refresh_timeout;
		document.ready = function() {
		//$(document).ready(function() {
			refresh_timeout = setInterval(
				function(){
					window.location = window.location;
				},
				settings["mobile.client.select.refresh"] * 1000
			);
		}//);
	</script>
</%def>
