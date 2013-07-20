var LoadBalancer = require('loadbalancer');
var balancer, server;

process.on('message', function (m) {
	if (m.action == 'init') {
		balancer = new LoadBalancer(m.data);
	}
});