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

ncombo.start({port: port, release: release, allowUploads: true});