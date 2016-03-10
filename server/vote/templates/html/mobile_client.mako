<%inherit file="_base.mako"/>

<%def name="body()">

	<div id="vote_input">
		<p>Connected, awaiting game to start</p>
	</div>

	<script type="text/javascript">
		document.addEventListener("DOMContentLoaded", function() {
			var pool_id = "${request.matchdict['pool_id']}";
			join(pool_id);
			get_frame(pool_id);
		});
	</script>

</%def>
