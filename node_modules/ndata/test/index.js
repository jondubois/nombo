var ndata = require('../index');

var server = ndata.createServer(9000);
var clientA = ndata.createClient(9000);	

var arr = [0, 1, 2, 3, 4, 5, 6, 7];
var obj = {red: 1, green: 2, blue: 3, yellow: 4, orange: 5};

clientA.set('this.is.an.array', arr, function(err) {
	clientA.getRange('this.is.an.array', 2, 5, function(err, value) {
		console.log(1, value);
	});
	
	clientA.getRange('this.is.an.array', 4, function(err, value) {
		console.log(2, value);
	});
	
	clientA.getRange('this.is.an.array', 0, 5, function(err, value) {
		console.log(3, value);
	});
})

clientA.set('this.is.an.object', obj, function(err) {
	clientA.getRange('this.is.an.object', 'green', 'blue', function(err, value) {
		console.log(4, value);
	});
	
	clientA.getRange('this.is.an.object', 'blue', function(err, value) {
		console.log(5, value);
	});
	
	clientA.getRange('this.is.an.object', 'green', 'yellow', function(err, value) {
		console.log(6, value);
	});
})