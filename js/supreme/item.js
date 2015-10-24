console.log('supreme item');
_main.ready(function() {
	var district;
	var finder;
	var reg;

	var timer = setInterval(function() {
		
		var formObj = $('#cart-addf');
		
		if (formObj.length) {
			clearInterval(timer);
			clearInterval(timerSoldout);
			
			district = Supreme.getDistrict();
			finder = _main.options[district.toLowerCase() + 'Finder'];
			reg = new RegExp(finder.keyword + '[\\S]*/' + finder.color + '[\\s]*', 'i');
			
			if (reg.test(location.href)) {
				if (finder.size)
					selectByText('size', finder.size, false);
				
				function _ajax() {
					console.time('item.js ajax');
					$.ajax({
						type: 'POST',
						url: formObj.attr('action'),
						dataType: 'json',
						data: formObj.serialize(),
						success: function(r) {
							console.timeEnd('item.js ajax');
							console.info('AJAX:', r);
							if (r && r.length) {
								if (_main.options.checkCart)
									window.location.href = 'http://www.supremenewyork.com/shop/cart';
								else if (_main.options.autoCheckout)
									window.location.href = 'https://www.supremenewyork.com/checkout';
							}
						},
						error: function() {
							_ajax();
						}
					});
				}
				_ajax();
			
			} else {
				console.error('当前URL并不匹配：', reg);
			}
			
		}
		
	}, 1);
	
	var timerSoldout = setInterval(function() {
		if (document.querySelector('b.sold-out')) {
			clearInterval(timer);
			clearInterval(timerSoldout);
			console.error('sold out');
			
			district = district || Supreme.getDistrict();
			finder = finder || _main.options[district.toLowerCase() + 'Finder'];
			reg = reg || new RegExp(finder.keyword + '[\\S]*/' + finder.color + '[\\s]*');
			
			if (reg.test(location.href)) {
				setTimeout(function() {
					window.location.reload();
				}, _main.options.intervalCheckSoldout || 8 * 1000);
			} else {
				console.error('sold out but not the right item');
			}
		}
	}, 50);

});
