_main.ready(function() {
	_main.optionsHelper = new OptionsHelper();
	
	_main.optionsHandler = new OptionsHandler();
}, 'admin');

$(function() {
	$('a.sa-close').live('click', function() {
		swal.close();
		return false;
	});
	
	/**
	 * 生成导航链接
	 */
	function generateNavLinks() {
		var links = [];
		$('#main').find('div.panel').each(function(i) {
			var _this = $(this);
			//console.warn(_this[0].id);
			var title = _this.find('div.panel-heading').html();
			var a = $('<a href="#" class="nav-link list-group-item"></a>');
			a.html(title);
			a.attr('data-pos', _this[0].id);
			if (_this.hasClass('default-pos'))
				a.addClass('default-nav-link');
			//0 == i && a.addClass('active');
			links.push(a);
		});
		$('#nav_link_list').append(links);
		
		$('a.nav-link').on('click', function() {
			$('a.nav-link').removeClass('active');
			var _this = $(this);
			$('.main-col').scrollTo('#' + _this.attr('data-pos'), 500, {offset:{top:-3}});
			_this.addClass('active');
			return false;
		});
	}
	
	generateNavLinks();
	
	$('.default-nav-link').addClass('active');
	$('.main-col').scrollTo('.default-pos', 500);
	
	$('.extension-name').text(MANIFEST.name + ' ' + MANIFEST.version);
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.info(msg);
	switch (msg.action) {
		case 'reload':
			_main.options = msg.options;
			_main.optionsHandler.optionsHelper.assign();
			break;
	}
});