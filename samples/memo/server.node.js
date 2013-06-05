var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');

var ncombo = require('ncombo');

if(ncombo.isMaster) {
	require('./master.node').run(ncombo);
} else {
	require('./worker.node').run(ncombo);
}

// Session will be destroyed if all windows relating to it are closed for 5 seconds
ncombo.start({port: port, release: release, sessionTimeout: 5000, title: 'Memo App'});