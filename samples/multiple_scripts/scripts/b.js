var c = $n.grab.app.script('c');

$n.ready(function() {
	exports.foo = function() {
		return 'This is b.foo()';
	}
	
	exports.ClassC = c.ClassC;
	
	exports.dynamicLoadAndRun = function(callback) {
		var d = $n.grab.app.script('d');
		// Wait for d script to load before calling its someMethod method and returning the result asynchronously via callback
		$n.ready(function() {
			callback(d.someMethod());
		});
	}
});