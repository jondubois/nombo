var arguments = process.argv.splice(2);
var port = arguments[0] ? arguments[0] : 8000;

var ncombo = require('ncombo');

ncombo.start(port, {release: false});