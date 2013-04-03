var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;
var release = arguments[1] == 'release' ? true : false;

var ncombo = require('ncombo');

ncombo.bundle.framework.lib('easeljs');
ncombo.bundle.app.template('index');
ncombo.bundle.app.asset('bot.png');

ncombo.start({port: port, release: release, workers: 1});
