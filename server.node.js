var arguments = process.argv.splice(2);
var port = arguments[0] ? arguments[0] : 8000;
var gateway = require('ncombo/core/gateway');

var ncombo = require('ncombo'),
	fs = require('fs');

gateway.watchForbidden(function() {
	console.log('forbidden');
});

var prep = function(siRequest) {
	//gateway.restrict();
	//gateway.allow('test', 'fun');
	console.log('prepare', siRequest.getServerInterface(), siRequest.getMethod(), siRequest.getData());
}

ncombo.prepare(prep);

//ncombo.useStyle('node_modules/ncombo/styles/bootstrap.less', 'text/css', 'stylesheet');

ncombo.start(port, {release: false});