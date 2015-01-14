
window.addEventListener('message', function(event) {
    //if (event.origin.indexOf('localhost') == -1) {console.error('postMessage with incorrect origin', event.origin); return;}
    var data = JSON.parse(event.data);
    
	if (data.func_iframe) {
		battlescape.ui.screen(data.func_iframe);
	}
	
	//event.source.postMessage('reply', event.origin);  // post back to origin
},false);
