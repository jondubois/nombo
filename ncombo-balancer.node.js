var cluster = require('cluster');
var LoadBalancer = require('loadbalancer');

if (cluster.isMaster) {
	process.on('message', function (m) {
		if (m.type == 'init') {
			var balancerCount = m.data.balancerCount || m.data.workers.length;
			var worker;
			for (var i=0; i<balancerCount; i++) {
				worker = cluster.fork();
				worker.send(m);
				worker.on('message', process.send.bind(process));
			}
		}
	});
} else {
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
}