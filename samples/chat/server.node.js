var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('ncombo').Master;

var options = {
	port: port,
	release: release,
	workerPorts: [9000],
	sessionTimeout: 10,
	addressSocketLimit: 2,
	logLevel: 4,
	connectTimeout: 10
};

var ncombo = new Master(options);
require('./master.node').run(ncombo);
ncombo.start();