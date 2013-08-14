var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('ncombo').Master;

var options = {
	port: port,
	release: release,
	//workers: [{port: 9000, statusPort: 9001}, {port: 9002, statusPort: 9003}, {port: 9004, statusPort: 9005}],
	sessionTimeout: 10,
	addressSocketLimit: 4,
	logLevel: 4,
	connectTimeout: 10
};

var ncombo = new Master(options);
require('./master.node').run(ncombo);
ncombo.start();