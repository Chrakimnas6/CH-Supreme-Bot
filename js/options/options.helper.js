/**
 * 
 * @author Ansonhorse
 * @time 2015-6-28 10:06:55
 */
function OptionsHelper() {
	var self = this;
	
	this.init = function() {
		$(function() {
			self.events();
		});			
	}
	
	this.events = function() {
		var methods = ['save', 'add', 'update', 'remove', 'removeAll', 'assign'];
		for (var i = 0; i < methods.length; i++) {
			if (undefined !== self[methods[i]]) 
				self[methods[i]]();
		}
	}
	
	this.save = function() {
		$('.btn-save-options').unbind('click').on('click', function() {
			console.log('OptionsHelper.save');
			self._save(this);
		});
		
		$('.option-field.auto-save').unbind('change').on('change', function() {
			console.log('OptionsHelper.autoSave');
			self._save(this);
		});
	}
	
	this._save = function(element) {
		var _this = $(element);
		var form = _this.closest('form.form-options');
		var fields = form.find('.option-field');
		if (fields.length) {
			var isNode = form.hasClass('is-node');
			if (isNode) {
				var node = form.attr('data-node');
				if (undefined === _main.options[node])
					_main.options[node] = {};
			}

			for (var i = 0; i < fields.length; i++) {
				var fieldObj = $(fields[i]);
				var v = self.getFieldValue(fieldObj);
				if (isNode)
					_main.options[node][fieldObj[0].id] = v;
				else
					_main.options[fieldObj[0].id] = v;
			}

			_main.storageService.set({options:_main.options}, function(r) {
				M('reload', {options:_main.options});
				msgbox.show('保存成功', 'success', 350);
			});
		}
	}
	
	/**
	 * 根据HTML标签不同，获取其值
	 */
	this.getFieldValue = function(jqObject) {
		var val;
		if (jqObject.is('input:text') || 
				jqObject.is('textarea') || 
				jqObject.is('select') || 
				jqObject.attr('type') == 'email' ||
				jqObject.attr('type') == 'number') {
			val = jqObject.hasClass('keep-origin') ? jqObject.val() : $.trim(jqObject.val());
		}
		else if (jqObject.is('input:checkbox')) {
			val = jqObject.prop('checked') ? 1 : 0;
		}
		else if (jqObject.is('input:radio')) {
			val = $('input[name="' + jqObject[0].name + '"]').val();
		}
		if (jqObject.hasClass('json'))
			val = JSON.parse(val);
		return val;
	}
	
	this.assign = function() {
		$('form.form-options').find('.option-field').each(function() {
			var _this = $(this);
			var _form = _this.closest('form.form-options');
			var id = _this[0].id;
			// 非对象类型数据赋值
			var options = _main.options;
			if (_form.hasClass('is-node')) {
				var node = _form.attr('data-node');
				options = undefined === _main.options[node] ? null : _main.options[node];
			}
			if (_.isEmpty(options)) return;
			
			if (options[id] && !_.isObject(options[id])) {
				if (_this.is('input:text') || 
						_this.is('textarea') || 
						_this.is('select') || 
						_this.attr('type') == 'email' ||
						_this.attr('type') == 'number') {
					_this.val(options[id]);
				}
				else if (_this.is('input:checkbox')) {
					_this.prop('checked', options[id] ? true : false);
					//_this.attr('checked', options[id] ? 'checked' : false);
				}
				else if (_this.is('input:radio')) {
					val = $('input[name="' + _this[0].name + '"]').val(options[id]);
				}
			}
		});
	}
	
	this.init();
}