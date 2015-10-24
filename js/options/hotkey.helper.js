/**
 * 快捷键
 * @author Ansonhorse
 */
function HotkeyHelper() {
	var self = this;
	// 默认的快捷键为
	this._default = {key1:'', key2:'', key3:''};
	// 可选的键位
	this.keys = {
		key1: ['ALT', 'CTRL', 'SHIFT'],
		key2: ['ALT', 'CTRL', 'SHIFT'],
		key3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
	};
	
	this.init = function() {
		if (!_.isEmpty(_main.options)) {
			var fields = [];
			for (var k in _main.options) {
				if (0 == k.indexOf('hotkey')) {
					fields.push(k);
				}
			}
			
			if (fields.length) {
				for (var i = 0; i < fields.length; i++) {
					self.render(fields[i], _main.options[fields[i]]);
				}
			}
		}
		
		$(function() {
			self.events();
		});
	}
	
	this.render = function(field, hotkey, act) {
		hotkey = hotkey || self._default;
		var html = '<span class="hotkey-wrapper">';
		html += '<textarea class="hidden option-field hotkey-json json" id="' + field + '">' + JSON.stringify(hotkey) + '</textarea>';
		html += '<span class="hotkey-label">快捷键：</span>';
		var keys = [];
		for (var i = 1; i <=3; i++)
			keys.push(this._select(this.keys['key' + i], hotkey['key' + i], 'id="' + field + '_key' + i + '" data-id="' + field + '" class="form-control key"'));
		html += keys.join(' + ');
		html += '</span>';		
		act = undefined === act ? true : act;
		act && $('#for-' + field).html(html);
		return html;
	}
	
	/**
	 * select按键值变动跟textarea联动
	 */
	this.events = function() {
		$('select.key').die().unbind('change').live('change', function() {
			var _this = $(this);
			var wrapper = _this.closest('.hotkey-wrapper');
			var ta = wrapper.find('textarea.hotkey-json');
			var hotkey = JSON.parse(ta.val());
			
			var keys = {};
			wrapper.find('select.key').each(function(i) {
				keys['key' + (i + 1)] = $(this);
				hotkey['key' + (i + 1)] = this.value;
			});
			if (hotkey.key1 == hotkey.key2 && '' != hotkey.key1) {
				swal('按键1和按键2不能相同');
				keys.key2.val('').focus();
				return false;
			}
			console.info(hotkey);
			ta.val(JSON.stringify(hotkey));
		});
	}
	
	this._select = function(data, selected_value, args) {
		var html = '<select ' + args + '>';
		if (data.length) {
			html += '<option value="">无</option>';
			for (var i = 0; i < data.length; i++)
				html += '<option value="' + data[i] + '"' + (data[i] == selected_value ? ' selected="selected"' : '') + '>' + data[i] + '</option>';
		}
		html += '</select>';
		return html;
	}
	
	this.save = function() {
		var obj_k1 = $('#key1'),
			obj_k2 = $('#key2'),
			obj_k3 = $('#key3'),
			k1 = obj_k1.val(),
			k2 = obj_k2.val(),
			k3 = obj_k3.val();
		if ('' == k1 && '' == k2 && '' == k3) {
			if (!confirm('确定不设置快捷键？')) return false;
		}
		else if ((k1 || k2) && '' == k3) {
			alert('按键3不能为无');
			return false;
		}
		else if (k1 && k2 && k1 == k2) {
			alert('按键1和按键2不能相同');
			return false;
		}
		else if (!k1 && !k2 && '' != k3) {
			// 如果第三个键不是FUN键，则至少需要一个功能按键
			if (0 > _.indexOf(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'], k3)) {
				alert('如果不是F1~F12, 则需要至少设置一个功能按键(按键1，或按键2)');
				return false;
			}
		}
		self.hotkey = {key1:k1, key2:k2, key3:k3};
		LS.sets({hotkey:self.hotkey}, true);
		alert("保存快捷键成功 \n\n[提示：需要刷新页面才会生效]");
	}
	
	this.init();
}