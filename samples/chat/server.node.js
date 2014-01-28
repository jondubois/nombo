var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;
var fs = require('fs');

var options = {
	port: port,
	release: release,
	balancerCount: 1,
	workers: [9100],
	stores: [9120],
	addressSocketLimit: 4,
	connectTimeout: 10,
	//hostAddress: '127.0.0.1',
	spinner: true,
	spinnerOptions: {
		lines: 10,
		radius: 15,
		color: '#9cd85b'
	},
	logLevel: 2
};

var nombo = new Master(options);
nombo.start();