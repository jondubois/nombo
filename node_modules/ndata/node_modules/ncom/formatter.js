var json = require('json');
var cycle = require('json/cycle');

module.exports.parse = function(buffer, skipRetrocycle)  {
	var firstParse = json.parse(buffer.toString());
	var secondParse;
	var i;
	if(skipRetrocycle) {
		secondParse = firstParse;
	} else {
		secondParse = cycle.retrocycle(firstParse);
	}
	return secondParse;
}

module.exports.stringify = function(object)  {
	return json.stringify(cycle.decycle(object));
}
