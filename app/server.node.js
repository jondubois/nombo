var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;

var ncombo;
try {
	ncombo = require('ncombo');
} catch(e) {
	ncombo = require('../');
}

ncombo.start({port: port, release: false});
