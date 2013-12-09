// $n.ready is not really needed here since this file has no dependencies.

exports.ClassC = function() {
	this.getMessage = function() {
		return 'This is getMessage() method of ClassC from script c';
	}
};