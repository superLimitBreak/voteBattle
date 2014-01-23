<%inherit file="_base.mako"/>

<%def name="title()">Mobile Client</%def>

<%def name="body()">

	<h1>${title()}</h1>
	##${data}
	<ol id="vote_input">
	
	</ol>

	<script type="text/javascript">
		document.addEventListener("DOMContentLoaded", function() {
			startup_client("${request.matchdict['pool_id']}");
		});
	</script>

</%def>
