var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');
var Master = require('nombo').Master;
var fs = require('fs');

var options = {
	port: port,
	release: release,
	protocol: 'https',
	protocolOptions: {
		key: fs.readFileSync(__dirname + '/keys/enc_key.pem', 'utf8'),
		cert: fs.readFileSync(__dirname + '/keys/cert.pem', 'utf8'),
		passphrase: 'apple'
	}
};

var nombo = new Master(options);
nombo.start();