console.log('supreme shop');
_main.ready(function() {
	
	var district;
	var reg;
	
	var timer = setInterval(function() {
		if (document.getElementById('container')) {
			clearInterval(timer);
			
			district = Supreme.getDistrict();
			var finder = _main.options[district.toLowerCase() + 'Finder'];
			reg = new RegExp(finder.keyword + '[\\S]*/' + finder.color + '[\\s]*', 'i');
			
			find();
		}
	}, 1);

	function find() {
		console.time('find');
		items = document.querySelectorAll('article a');
		if (items.length) {
			for (var i = 0; i < items.length; i++) {
				var href = items[i].getAttribute('href');
				//console.log(href);
				if (reg.test(href)) {
					console.timeEnd('find');
					console.info('found!', href);
					window.location.href = location.origin + href;
					return false;
				}
			}
		} else {
			console.error('oh~ no items...');
		}
		
		setTimeout(function() {
			console.log('retry...');
			window.location.reload();
		}, _main.options.intervalRetryFinding || 1 * 1000);
	}
});