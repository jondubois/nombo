var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');

var ncombo = require('ncombo');

if(ncombo.isMaster) {
	require('./master.node').run(ncombo);
} else {
	require('./worker.node').run(ncombo);
}

ncombo.start({port: port, release: release, allowUploads: true});