chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.info(msg);
	if (msg.action != undefined) {
		switch (msg.action) {
			case 'create_tab':
				chrome.tabs.create({url:msg.url, selected:true});
				break;
				
			case 'is_active':
				sendResponse({active:sender.tab.active});
				break;
				
			case 'tab':
				chrome.tabs.create({url:msg.url}, function(tab) {
					sendResponse(tab);
				});
				break;
				
			case 'storage':
				if (undefined === msg.func)
					sendResponse({error:'LS: func not passed'});
				else {
					var result = LS[msg.func].apply(this, msg.args);
					sendResponse(result);
				}
				break;
				
			case 'exec_script':
				chrome.tabs.executeScript(sender.tab.id, msg.details);
				sendResponse({success:1});
				break;
				
			case 'set_highlighted':
				chrome.tabs.highlight({tabs:[sender.tab.index]}, function() {
					console.log('The tab has been highlighted');
				});
				break;
			
			case 'to_active_tab':
				M2ActiveTab(msg.event, msg.data);
				break;
				
			case 'get_cookies':
				delete msg.action;
				chrome.cookies.getAll(msg, function(cookies) {
					console.info(cookies);
					sendResponse({cookies:cookies});
				});
				break;
			
			case 'set_cookies':
				chrome.cookies.set(msg.cookies);
				sendResponse({success:1});
				break;
				
			case 'reload':
				_main.reload(msg);
				break;
				
			default:
				console.error(msg);
				break;
		}
	}
});

_main.ready();

var filter = {
	urls: ['*://www.supremenewyork.com/shop/all*']
};

var cancelRequest = false;

var blockFilters = {
	urls: [
	   '*://*.cloudfront.net/assets/*',
	   '*://connect.facebook.net/en_US/fp.js*'
	]
}

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		console.info(details);
		var cancel = _main.options.enableExtension && _main.options.blockAssets ? true : false;
		return {cancel: cancel};
	},
	blockFilters,
	['blocking']
);


/*//请求成功监听器
chrome.webRequest.onCompleted.addListener(
	function(details) {
		console.info(details);
		M2Tab(details.tabId, 'web_request_captured', {data:details});
	},
	filter,
	['responseHeaders']
);

// 请求失败监听器
chrome.webRequest.onErrorOccurred.addListener(
	function(details) {
		console.error(details);
		M2Tab(details.tabId, 'web_request_captured', {data:details});
	},
	filter
);*/