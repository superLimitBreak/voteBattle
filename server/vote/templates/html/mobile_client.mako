<%inherit file="_base.mako"/>

<%def name="body()">

	<div id="vote_input">
		<p>Connected, awaiting game to start</p>
	</div>

	<script type="text/javascript">
		document.addEventListener("DOMContentLoaded", function() {
			get_frame("${request.matchdict['pool_id']}");
		});
	</script>

</%def>
