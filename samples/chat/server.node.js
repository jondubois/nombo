var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;
var fs = require('fs');

var options = {
	port: port,
	release: release,
	balancerCount: 2,
	workers: [{port: 9100, statusPort: 9101}, {port: 9102, statusPort: 9103}],
	stores: [{port: 9120}, {port: 9121}],
	sessionTimeout: 10,
	addressSocketLimit: 4,
	connectTimeout: 10,
	//hostAddress: '127.0.0.1',
	logLevel: 2
};

var nombo = new Master(options);
require('./master.node').run(nombo);
nombo.start();