var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;

var options = {
	port: port,
	release: release,
	allowUploads: true
};

var nombo = new Master(options);
nombo.start();