var arguments = process.argv.splice(2);
var port = arguments[0] ? arguments[0] : 8000;
var gateway = require('ncombo/core/gateway');

var ncombo = require('ncombo'),
	fs = require('fs');

ncombo.start(port, {release: false});