var LoadBalancer = require('loadbalancer');
var balancer;

var handleError = function (err) {
	var error;
	if (err.stack) {
		error = {
			message: err.message,
			stack: err.stack
		}
	} else {
		error = err;
	}
	process.send({type: 'error', data: error});
};

process.on('message', function (m) {
	if (m.type == 'init') {
		balancer = new LoadBalancer(m.data);
		balancer.on('error', handleError);
	}
});