_main.ready(function() {
	_main.optionsHelper = new OptionsHelper();	
	_main.optionsHandler = new OptionsHandler();
}, 'admin');

$(function() {
	$('a.sa-close').live('click', function() {
		swal.close();
		return false;
	});
	
	$('.extension-name').text(MANIFEST.name + ' ' + MANIFEST.version);
});