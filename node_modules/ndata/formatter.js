var json = require('json');
var cycle = require('json/cycle');

module.exports.parse = function(buffer, skipRetrocycle)  {
	var comString = buffer.toString();
	var firstParse = json.parse('[' + comString.substring(0, comString.length - 1) + ']');
	var secondParse = [];
	var i;
	if(skipRetrocycle) {
		for(i in firstParse) {
			secondParse[i] = firstParse[i];
		}
	} else {
		for(i in firstParse) {
			secondParse[i] = cycle.retrocycle(firstParse[i]);
		}
	}
	return secondParse;
}

module.exports.stringify = function(object)  {
	return json.stringify(cycle.decycle(object)) + ',';
}
