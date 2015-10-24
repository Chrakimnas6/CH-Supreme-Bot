chrome.runtime.onMessage.addListener(function(m, sender, sendResponse) {
	switch(m.event) {	
		case 'reload':
			_main.reload(m);
			break;
			
		case 'web_request_captured':
			//console.info(m);
			//console.info($('article'));
			break;
			
		default:
			break;
	}
});

/*$(function() {
	$('a.sa-close').live('click', function() {
		swal.close();
		return false;
	});
});*/