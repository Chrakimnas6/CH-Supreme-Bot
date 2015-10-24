/**
 * 配置options
 * @author Ansonhorse
 * @time 2015-6-23 20:50:10
 * 
 */
function OptionsHandler() {
	var self = this;
	
	this.optionsHelper = new OptionsHelper();
	
	this.hotkeyHelper = null;
	
	this.init = function() {
		$(function() {
			if ('undefined' != typeof HotkeyHelper)
				self.hotkeyHelper = new HotkeyHelper();
		});
	};
	
	this.init();
}