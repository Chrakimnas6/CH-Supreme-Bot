// 购物车检查
console.log('supreme cart');
_main.ready(function() {
	if (!_main.options.checkCart) return;

	var items;
	var timerCancel = null;
	
	var timer = setInterval(function() {
		items = document.querySelectorAll('.cart-image a');
		if (items.length) {
			clearInterval(timer);
			clearInterval(timerCancel);
			
			if (items.length == 1) {
				var district = Supreme.getDistrict();
				var finder = _main.options[district.toLowerCase() + 'Finder'];
				var regUrl = new RegExp(finder.keyword + '[\\S]*/' + finder.color + '[\\s]*', 'i');
				
				if (regUrl.test(items[0].getAttribute('href'))) {
					var desc = items[0].parentNode.nextSibling.textContent;
					console.log(desc);
					var regDesc = new RegExp(finder.color + '(.*)' + finder.size + '(.*)', 'i');
					console.log(regDesc);
					if (regDesc.test(desc))
						window.location.href = 'https://www.supremenewyork.com/checkout';
					else
						alert('description not match');
				} else {
					alert('url not match');
				}
			} else {
				alert('more than 1 item');
			}
		}
	}, 1);
	
	var timerCancel = setTimeout(function() {
		clearInterval(timer);
	}, 10 * 1000);
	
});