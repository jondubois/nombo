var argv = require('optimist').argv;
var port = argv._[0] ? argv._[0] : 8000;
var release = argv.hasOwnProperty('r');

var ncombo = require('ncombo');

require('./master.node').run(ncombo);

// Start nCombo app with some default options.
ncombo.start({port: port, release: release});