<%def name="init()"><%
	self.path_static_external = 'ext/'
	self.path_static          = 'static/'
%></%def>

<%def name="title()"></%def>

<%def name="body()">
${self.init()}\
<!DOCTYPE html>
<html>
	<head>
		<title>${self.title()}</title>
		${head()}
	</head>
	
	<body>
		${next.body()}
		${scripts()}
	</body>
</html>
</%def>

<%def name="head()">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<meta name="description" content="">
		<meta name="author" content="">
		
		<!-- CSS - External -->
		<link href="${ self.path_static_external }cssreset-min.css" rel="stylesheet">
		<link href="${ self.path_static_external }jquery.mobile.min.css" rel="stylesheet">
		
		<!-- CSS - Site -->
		<link href="${ self.path_static }mobile.css" rel="stylesheet">
</%def>

<%def name="scripts()">
		<!-- Javascript - External -->
		<script src="${ self.path_static_external }jquery.min.js"></script>
		<script src="${ self.path_static_external }jquery.cookie.js"></script>
		<script src="${ self.path_static_external }jquery.mobile.min.js"></script>
		
		<!-- Javascript - Site -->
		<script src="${ self.path_static }mobile.js"></script>
</%def>
