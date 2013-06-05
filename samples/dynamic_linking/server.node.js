var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;
var release = arguments[1] == 'release' ? true : false;

var ncombo = require('ncombo');

if(ncombo.isMaster) {
	require('./master.node').run(ncombo);
} else {
	require('./worker.node').run(ncombo);
}

ncombo.start({port: port, release: release});