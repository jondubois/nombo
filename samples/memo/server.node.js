var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('ncombo').Master;

var options = {
	port: port,
	release: release,
	sessionTimeout: 10,
	stores: [{port: 9020}, {port: 9021}],
	title: 'Memo App'
};

var ncombo = new Master(options);
require('./master.node').run(ncombo);
ncombo.start();