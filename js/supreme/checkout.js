console.log('supreme checkout');
_main.ready(function() {
	if (!_main.options.autoCheckout) return;
	
	var formObj = null;
	var timer = setInterval(function() {
		formObj = document.getElementById('checkout_form');
		if (formObj) {
			clearInterval(timer);
			fillProcess();
		}
	}, 1);
	
	setTimeout(function() {
		clearInterval(timer);
	}, 20 * 1000);

	function fillProcess() {
		var zoneObj = document.getElementById('time-zone-name');
		var zone = zoneObj.innerText.trim();	
		var options = _main.options[zone.toLowerCase() + 'CheckoutInfo'];

		// TODO 可添加配置项：处理站点地区，如果没有配置，则在运行时判断
		if ('NYC' == zone) {
			options.order_billing_state = options['order_billing_state_' + options.order_billing_country.toLowerCase()];
			var skips = ['order_billing_state_usa', 'order_billing_state_canada'];
		}
		console.time('fill in');
		for (var field in options) {
			console.time(field);
			var fieldObj = document.getElementById(field);
			//console.warn(field, fieldObj);
			
			if (fieldObj) {
				if ('NYC' == zone) {
					if (_.indexOf(skips, field) >= 0) continue;
					
					if ('order_billing_state' == field && options.order_billing_state != fieldObj.value) {
						var newObj = document.createElement('input');
						newObj.id = 'order_billing_state';
						newObj.name = 'order[billing_state]';
						newObj.value = options[field];
						fieldObj.parentNode.insertBefore(newObj, fieldObj);
						fieldObj.disabled = true;
						fieldObj.style.display = 'none';
					} else {
						fieldObj.value = options[field];
					}
				} else {
					fieldObj.value = options[field];
				}
			} else {
				console.error('field not found: ' + field);
			}
			console.timeEnd(field);
		}
		
		document.getElementById('order_terms').checked = true;

		document.getElementsByClassName('checkout')[0].click();

		console.timeEnd('fill in');
	}
	
});