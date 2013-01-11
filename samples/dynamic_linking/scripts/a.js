var b = $n.grab.app.script('b');

$n.ready(function() {
	// This script will have a foo(callback) method. Note that you can also use module.exports in the place of exports
	exports.foo = function(callback) {
		var c = new b.ClassC();
		// This function is taken from scrpt b, it dynamically requires the d script and calls a method on it
		b.dynamicLoadAndRun(function(dataFromDScript) {
			// Here functions are being evoked on all subdependencies
			callback('This is a.foo(), ' + b.foo() + ', ' + c.getMessage() + ', ' + dataFromDScript);
		});
	}
});