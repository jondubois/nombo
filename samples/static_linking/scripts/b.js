var c = require('./c');

exports.foo = function() {
	return 'This is b.foo()';
}

exports.ClassC = c.ClassC;

exports.run = function() {
	var d = require('./d');
	return d.someMethod();
}