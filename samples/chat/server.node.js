var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;
var fs = require('fs');

var options = {
	port: port,
	release: release,
	balancerCount: 1,
	workers: [{port: 9100}],//, {port: 9101}],
	stores: [{port: 9120}],
	sessionTimeout: 10,
	addressSocketLimit: 4,
	connectTimeout: 10,
	//hostAddress: '127.0.0.1',
	spinner: true,
	spinnerOptions: {
		lines: 10,
		radius: 15,
		color: '#009'
	},
	logLevel: 2
};

var nombo = new Master(options);
require('./master.node').run(nombo);
nombo.start();