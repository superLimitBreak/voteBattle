<%inherit file="_base.mako"/>

<%def name="title()">Mobile Client</%def>

<%def name="body()">

	<h1>${title()}</h1>
	##${data}
	<ol class="vote_input">
	
	</ol>

	<script type="text/javascript">
		document.ready = function(){
			console.log("IM READY!");
			startup_client("${request.matchdict['pool_id']}");
		};
	</script>

</%def>
