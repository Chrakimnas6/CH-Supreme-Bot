var Supreme = {
	/**
	 * 获取当前站点地区
	 * @param callback
	 * @returns
	 */
	getDistrict: function(callback) {		
		if (_.isFunction(callback)) {
			var o = null;
			var _t = setInterval(function() {
				o = document.getElementById('time-zone-name');
				if (o) {
					clearInterval(_t);
					return o.innerText.trim();
				}
			}, 10);
			setTimeout(function() {
				clearInterval(_t);
			}, 5000);
		} else {
			var o = document.getElementById('time-zone-name');
			return o ? o.innerText.trim() : '';
		}		
	}
}

/**
 * 根据text选中select对应option
 * @param id
 * @param text
 * @param caseSensitive 忽略大小写，默认为false
 */
function selectByText(id, text, caseSensitive) {
	console.time('select #' + id, text);
	var o = document.getElementById(id);
	if (o) {
		caseSensitive = undefined === caseSensitive ? true : caseSensitive;
		for (var i = 0; i < o.options.length; i++) {
			if (!caseSensitive) {
				text = text.toLowerCase();
				o.options[i].text = o.options[i].text.toLowerCase();
			}
			if (text == o.options[i].text) {
				o.selectedIndex = i;
				console.timeEnd('select #' + id, text);
				return true;
			}
		}
	}
	return false;
}