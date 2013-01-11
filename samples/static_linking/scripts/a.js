var b = require('./b');

exports.foo = function() {
	var c = new b.ClassC();
	var dataFromDScript = b.run();
	
	return 'This is a.foo(), ' + b.foo() + ', ' + c.getMessage() + ', ' + dataFromDScript;
}