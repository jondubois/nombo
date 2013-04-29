var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;
var release = arguments[1] == 'release' ? true : false;

var ncombo = require('ncombo');
var master = require('./master.node');
var worker = require('./worker.node');

if(ncombo.isMaster) {
	master.run(ncombo);
} else {
	worker.run(ncombo);
}

// Session will be destroyed if all windows relating to it are closed for 5 seconds
ncombo.start({port: port, release: release, sessionTimeout: 5000, title: 'Projects App', angular: true, angularMainModule: 'project'});