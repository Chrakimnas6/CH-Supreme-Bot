/**
 * console简写
 * i-info, e-error, w-warn, l-log, d-debug, t-time, te-timeEnd
 * 这么写貌似速度跟原生的慢了近一倍，某些需要速度的处理，效率上会有一定的打折
 * 看来有时不能太追求编码方便，还是采用原生的吧
 */
var L = {
	i: function() {
		console.info.apply(console, arguments);	
	},
	e: function() {
		console.error.apply(console, arguments);	
	},
	w: function() {
		console.warn.apply(console, arguments);	
	},
	l: function() {
		console.log.apply(console, arguments);	
	},
	d: function() {
		console.debug.apply(console, arguments);	
	},
	t: function() {
		console.time.apply(console, arguments);	
	},
	te: function() {
		console.timeEnd.apply(console, arguments);	
	}
};

/**
 * Elements Loaded Listener
 * 检测所需元素是否已经在到页面上， 如果全部已加载完成，执行callback
 * @returns {Boolean}
 * @author Ansonhorse
 */
function ELL(args) {
	var self = this;
	this.elements = [];
	this.interval = 420;
	this.duration = 120;
	this.visible = false;
	this.before = null;
	this.after = null;
	this.exit = null;
	this.timer = null;
	this.start_time = new Date().getTime();
	
	if (!_.isEmpty(args)) {
		for (var i in args) if (undefined !== self[i]) self[i] = args[i];
	}
	
	if (_.isEmpty(self.elements) || !_.isArray(self.elements)) {
		console.error('ELL: elements null');
		return false;
	}

	self.run = function() {
		if (self.elements.length) {
			var len = self.elements.length;
			// 已经加载在页面的元素数量
			var loaded_count = 0,
				visible_count = 0;
			for (var i = 0; i < len; i++) {
				self.elements[i] = $.trim(self.elements[i]);
				var tmp = $(self.elements[i]);
				tmp.length && loaded_count++;
				tmp.is(':visible') && visible_count++;
			}
			// 如果全部都已经显示，可以执行callback
			var all_loaded = loaded_count == len,
				all_visible = true;
			if (self.visible) all_visible = visible_count == len;
			//console.info('loaded_count:' + loaded_count + ' ,visible count: ' + visible_count);
			if (all_loaded && all_visible) {
				console.info('ELL 耗时：' + ((new Date().getTime() - self.start_time) / 1000) + '秒。' + self.elements.join(' | '));
				if (undefined !== self.after && _.isFunction(self.after)) {
					self.after();
				}
			} else {
				//继续
				var _before = null;
				if (undefined !== self.before && _.isFunction(self.before)) {
					_before = self.before();			
				}
				if (false === _before || null === _before) return false;
				
				self.timer = setTimeout(function() {
					var now = new Date().getTime();
					if (now - self.start_time > self.duration * 1000) {
						
						console.error('ELL: 在限时(' + self.duration + '秒)内未能完成，自动退出');
						console.error(self.elements);
						if (undefined !== self.exit && _.isFunction(self.exit)) {
							self.exit(self.duration);
						}
						clearTimeout(self.timer);
						return false;
					} else {
						self.run();
					}
				}, self.interval);
			}
			
		} else {
			console.error('ELL: jq_expressions is empty');
		}
	};
	
	self.run();
}

/**
 * 返回background
 * @returns
 * @author Ansonhorse
 */
function B() {
	return chrome.extension.getBackgroundPage();
}

/**
 * 发送消息到background
 * @author Ansonhorse
 * @param action
 * @param data
 * @param callback
 */
function M(action, data, callback) {
	var msg = {action:action};
	if (undefined !== data) for (var i in data) msg[i] = data[i];
	chrome.extension.sendMessage(msg, function (resp) {
		_.isFunction(callback) && callback(resp);
	});
}

// chrome.storage.local简写
var CSL = chrome.storage.local;

/**
 * message to active tab
 * 发送消息到激活tab
 */
function M2ActiveTab(event, data, callback) {
	chrome.tabs.query({active:true}, function(tabs) {
		if (tabs.length) {
			var msg = {event:event};
			if (!_.isEmpty(data) && _.isObject(data)) {
				for (var i in data) msg[i] = data[i];
			}
			chrome.tabs.sendMessage(tabs[0].id, msg, function(r) {
				console.log(r);
				_.isFunction(callback) && callback(r);
			});
		}
	});
}

function M2Tab(tabId, event, data, callback) {
	chrome.tabs.get(tabId, function(tab) {
		if (tab) {
			var msg = {event:event};
			if (!_.isEmpty(data) && _.isObject(data)) {
				for (var i in data) msg[i] = data[i];
			}
			chrome.tabs.sendMessage(tab.id, msg, function(r) {
				console.log(r);
				_.isFunction(callback) && callback(r);
			});
		}
	});
}

/**
 * localStorage
 * set, sets
 * get, gets
 * remove
 */
var LS = {
	// 多个键值对
	set: function(pairs) {
		console.log(set);
		console.info(arguments);
		for (var key in pairs) {
			try {
				localStorage.setItem(key, JSON.stringify(pairs[key]));
			} catch (e) {
				console.error('LS.set', e);
				localStorage.setItem(key, pairs[key]);
			}
		}
		//if (arguments.length == 2 && 'function' == typeof arguments[1]) arguments[1]();
	},
	
	// 获取key对应的value，多个key使用英文逗号相隔
	get: function(keys) {
		console.log(keys);
		console.info(arguments);
		var ks = [];
		if ('string' == typeof keys)
			ks = keys.split(/\s*,\s*/);
		else
			ks = keys;
		var pairs = {};
		for (var i = 0; i < ks.length; i++) {
			var key = ks[i].trim();
			if (undefined !== pairs[key]) continue;
			pairs[key] = localStorage.getItem(key);
			try {
				pairs[key] = JSON.parse(pairs[key]);
			} catch (e) {
				console.error('LS.get：JSON解析错误', key, pairs[key]);
			}
		}
		//if (arguments[1] && 'function' == typeof arguments[1]) arguments[1](pairs);
		return pairs;
	},
	
	// localStorage.removeItem
	remove: function(keys) {
		if ('string' == typeof keys)
			keys = keys.split(/\s*,\s*/);
		for (var i in keys) localStorage.removeItem(keys[i].trim());
		//if (arguments[1] && 'function' == typeof arguments[1]) arguments[1]();
	}
};

/**
 * 异步请求获取localStorage
 * get, gets, set, sets, remove
 */
var MLS = {};
var mlsFuncs = ['get', 'gets', 'set', 'sets', 'remove'];
for (var i = 0; i < mlsFuncs.length; i++) {
	(function() {
		var func = mlsFuncs[i];
		MLS[mlsFuncs[i]] = function() {
			var args = _.toArray(arguments);
			//console.log(args);
			M('storage', {func:func, args:args}, function(r) {
				// 如果最后一个参数类型是函数，则作为回调函数执行
				_.isFunction(args[args.length - 1]) && args[args.length - 1](r);
			});
		};
	})();
}

/**
 * 生成绝对地址
 * @param path
 * @returns {String}
 */
function extUrl(path) {
	return chrome.runtime.getURL(path);
}

/**
 * 首字母大写
 * @param string
 * @returns
 */
function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 只在容器里滚动，不影响body
 * @param element_expression 元素CSS选择器
 */
function scrollOnlyMyself(element_expression) {
	var obj = $(element_expression),
		height = obj.height();
		scroll_height = obj.get(0).scrollHeight;
	obj.bind('mousewheel', function(e, d) {
		if ((this.scrollTop === (scroll_height - height) && d < 0) || (this.scrollTop === 0 && d > 0)) {
			e.preventDefault();
		}
	});
}

/**
 * 生成loading的img
 * @returns {String}
 */
function loading() {
	var args = arguments;
	if (undefined === window.__loading_gif_url__) window.__loading_gif_url__ = ext_url('images/loading.gif');
	var img = ' <img style="vertical-align:top;" src="' + window.__loading_gif_url__ + '" ';
	var width = 12,
		height = 12;
	if (!args.length) args[0] = 'sm';
	if (1 == args.length && _.isString(args[0])) {
		switch (arguments[0]) {
			case 'xs':
				width = height = 14;
				break;
			case 'sm':
				width = height = 16;
				break;
			case 'lg':
				width = height = 18;
				break;
			
			default:
				width = height = 16;
				break;
		}
	}
	else if (1 == args.length && _.isNumber(args[0])) {
		width = height = args[0];
	}
	else if (2 == args.length) {
		width = args[0];
		height = args[1];
	}
	img += 'width="' + width + '" height="' + height + '">';
	return img;
}

/**
 * 获取当前选中的字符串
 * @author Ansonhorse
 * @returns {String}
 */
function getSelectedText() {
	var selection;
	if (window.getSelection) {
		selection = window.getSelection();
	} else if (document.selection) {
		selection = document.selection.createRange();
	}
	return selection.toString().trim();
}

/**
 * 获取粘贴板内容
 * @author Ansonhorse
 * @returns String
 */
function getClipboardText() {
	var id = '__get_clipboard_ta__';
	var cb = document.getElementById(id);
	if (!cb) {
		cb = document.createElement('textarea');
		cb.id = id;
		cb.setAttribute('style', 'width:0;height:0;opacity:0;position:fixed;left:0;bottom:0;')
		document.body.appendChild(cb);
	}
	cb.select();
	var pasted = document.execCommand('paste');
	console.log('粘贴结果：' + pasted, '粘贴内容：' + "\n" + cb.value.trim());
	document.activeElement.blur();
	return cb.value.trim();
}

/**
 * 复制文本到粘贴板
 * @param String text
 */
function copyToClipboard(text) {
	var id = '__copy_to_clipboard_ta__';
	var cb = document.getElementById(id);
	if (!cb) {
		cb = document.createElement('textarea');
		cb.id = id;
		cb.setAttribute('style', 'width:0;height:0;opacity:0;position:fixed;left:0;bottom:0;')
		document.body.appendChild(cb);
	}
	cb.value = text;
	cb.select();
	var copy = document.execCommand('copy');
	console.info('复制' + (copy ? '成功' : '失败'));
	document.activeElement.blur();
	return copy;
}

/**
 * 注册快捷键
 * @author Ansonhorse
 * @returns
 */
function registerHotkey(jqSelector, hotkey, callback) {
	var keys = [];
	for (var i in hotkey)
		if (hotkey[i]) keys.push(hotkey[i].toLowerCase());
	keys = keys.join('+');

	if (!_.isEmpty(keys)) {
		console.info('快捷键绑定：' + keys);
		var key_fn = function(e) {
			//console.info('您按下了快捷键：' + keys);
			_.isFunction(callback) && callback();
		};
		jqSelector = _.isEmpty(jqSelector) ? document : jqSelector;
		$(jqSelector).bind('keydown', keys, key_fn);
	} else {
		//console.warn('没有定义快捷键');
	}
}

/**
 * sweetalert的confirm简写
 * @param args	confirm配置
 * @param confirmedCallback	确定回调
 * @param cancelCallback	取消回调
 */
function swalConfirm(args, confirmedCallback, cancelCallback) {
	swal({
		title: args.title || '提示',
		text: args.text,
		type: args.type || 'warning',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: '确定',
		closeOnConfirm: false
	}, function(confirmed) {
		if (confirmed) {
			_.isFunction(confirmedCallback) && confirmedCallback();
		} else {
			_.isFunction(cancelCallback) && cancelCallback();
		}
	});
}

function fireEvent(element, event) {
	if (document.createEventObject){
        // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
    }
    else{
        // dispatch for firefox + others
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

const MANIFEST = chrome.runtime.getManifest();
var DEFAULT_HOTKEY = {key1:'', key2:'', key3:''};

var DEFAULT_OPTIONS = {
	enableExtension: 1,	//开关
	blockAssets: 0,	//block网站的相关资源（js,css）
	checkCart: 0,	//检查购物车
	autoCheckout: 1,	//自动结算
	intervalRetryFinding: 1000,	//搜索重试间隔
	intervalCheckSoldout: 8000,	//sold out检查间隔
	refreshSoldout: 1,
	tyoFinder: {},	//日版搜索器
	nycFinder: {},	//美版搜索器
	tyoCheckoutInfo: {},	//日版checkout信息
	nycCheckoutInfo: {}	//美版checkout信息
};

function _Main() {
	var self = this;
	
	this.options = DEFAULT_OPTIONS;
	this.context = undefined === chrome.extension.getBackgroundPage ? 'frontend' : 'backend';
	//this.storageService = this.context == 'frontend' ? MLS : LS;
	this.storageService = chrome.storage.local;
	this.isReady = false;

	this.ready = function(callback, role) {
		
		if (self.isReady) {
			if (self.options.enableExtension || 'admin' == role) {
				_.isFunction(callback) && callback(r);
			} else {
				console.log(MANIFEST.name + ' 已关闭');
			}
			return;
		}
		
		console.time('获取options');
		// TODO chrome.storage.local竟然要半秒钟？可能是加载资源过多造成；
		// 在页面加载完后再获取数据，一般只需10~20ms (为神马还是这么没效率呢 ？？？)
		self.storageService.get(['initialized', 'options'], function(r) {
			console.timeEnd('获取options');
			if (r.initialized) {
				self.options = r.options;
			} else {
				self.initOptions();
			}
			self.isReady = true;
			if (self.options.enableExtension || 'admin' == role) {
				_.isFunction(callback) && callback(r);
			} else {
				console.log(MANIFEST.name + ' 已关闭');
			}
		});
	}

	this.initOptions = function() {
		self.storageService.set({initialized:1, options:DEFAULT_OPTIONS});
	}
	
	this.clearOptions = function() {
		self.storageService.clear();
	}
	
	this.reload = function(m) {
		if (_.isObject(m) && m.options)
			self.options = m.options;
	}
}

var _main = new _Main();