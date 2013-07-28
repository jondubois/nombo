var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('ncombo').Master;

var options = {
	port: port,
	release: release
};

var ncombo = new Master(options);
require('./master.node').run(ncombo);
ncombo.start();