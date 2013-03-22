var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;
var release = arguments[1] == 'release' ? true : false;

var ncombo = require('ncombo');

// These files will be included as part of preload process
ncombo.bundle.framework.style('bootstrap');
ncombo.bundle.app.style('main');

// Session will be destroyed if all windows relating to it are closed for 5 seconds
ncombo.start({port: port, release: release, sessionTimeout: 5000, title: 'Memo App', angular: true});