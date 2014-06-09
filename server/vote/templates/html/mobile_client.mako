<%inherit file="_base.mako"/>

<%def name="body()">

	##${data}
	<div id="vote_input">
	</div>

	<script type="text/javascript">
		document.addEventListener("DOMContentLoaded", function() {
			startup_client("${request.matchdict['pool_id']}");
		});
	</script>

</%def>
