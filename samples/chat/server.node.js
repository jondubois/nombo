var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;

var options = {
	port: port,
	release: release,
	balancerCount: 3,
	workers: [{port: 9000, statusPort: 9001}, {port: 9002, statusPort: 9003}, {port: 9004, statusPort: 9005}],
	stores: [{port: 9020}, {port: 9021}],
	sessionTimeout: 10,
	addressSocketLimit: 4,
	connectTimeout: 10,
	//hostAddress: '127.0.0.1',
	logLevel: 1
};

var nombo = new Master(options);
require('./master.node').run(nombo);
nombo.start();