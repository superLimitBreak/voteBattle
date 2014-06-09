<%def name="init()"><%
	self.path_static_external = '/ext/'
	self.path_static          = '/static/'
%></%def>

<%def name="title()">${request.registry.settings.get('vote.template.title') or 'VoteBattle'}</%def>

<%def name="body()">
${self.init()}\
<!DOCTYPE html>
<html>
	<head>
		<title>${self.title()}</title>
		${head()}
	</head>
	
	<body>
		
		<div data-role="page">
            
            <div data-role="header" data-position="fixed" data-tap-toggle="false">
                
                <h1>${next.title()}</h1>
                
                ##% if request.path != '/':
                ##<a href="#" class="ui-btn-icon-notext ui-btn-left  ui-btn ui-btn-inline ui-mini ui-corner-all ui-icon-back" data-rel="back">Back</a>
                ##<a href="/" class="ui-btn-icon-notext ui-btn-right ui-btn ui-btn-inline ui-mini ui-corner-all ui-icon-home"                >Home</a>
                ##% endif
            </div><!-- /header -->
            
            <!-- flash messages -->
            <div class="flash_messages">
            % for message in messages:
            <div class="flash_message ui-bar ui-bar-e status_${status}">
                <p>${message}</p>
                <a href="#" class="flash_remove" data-role="button" data-icon="delete" data-iconpos="notext" onclick="$(this).closest('.flash_message').slideUp(function(){$(this).remove()}); return false;">Remove</a>
            </div>
            % endfor
            </div>
            <!-- /flash messages -->
            
            <div data-role="content">
                ${next.body()}
            </div><!-- /content -->
        
        </div><!-- /page -->
		
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
		<link href="${ self.path_static }mobile/mobile.css" rel="stylesheet">
</%def>

<%def name="scripts()">
		<!-- Javascript - External -->
		<script src="${ self.path_static_external }jquery.min.js"></script>
		<script src="${ self.path_static_external }jquery.cookie.js"></script>
		<script src="${ self.path_static_external }jquery.mobile.min.js"></script>
		
		<!-- Javascript - Site -->
		<script src="${ self.path_static }mobile/mobile.js"></script>
</%def>
