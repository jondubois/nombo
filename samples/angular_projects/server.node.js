var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;

var options = {
	port: port,
	release: release,
	sessionTimeout: 5000,
	title: 'Projects App',
	angular: true,
	angularOptions: {
		mainModule: 'project'
	}
};

var nombo = new Master(options);
require('./master.node').run(nombo);
nombo.start();