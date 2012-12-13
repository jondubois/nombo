var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;

var ncombo = require('ncombo');

ncombo.addMiddleware(ncombo.MIDDLEWARE_SOCKET_IO, function(req, res, next) {
	if(req.sim == 'auth') {
		// Do not need to login to use auth server interface module
		next();
	} else {
		// For any other sim, check if current session is authorized
		req.session.get('loggedIn', function(err, loggedIn) {
			if(loggedIn) {
				next();
			} else {
				res.error('Socket communication not authorized');
			}
		});
	}
});

// These styles will be included as part of preload process
ncombo.useStyle('/~framework/client/styles/bootstrap.css');
ncombo.useStyle('/~framework/client/styles/jqueryui/ui-lightness/jquery.ui.core.css');
ncombo.useStyle('/~framework/client/styles/jqueryui/ui-lightness/jquery.ui.dialog.css');
ncombo.useStyle('/~framework/client/styles/jqueryui/ui-lightness/jquery.ui.resizable.css');
ncombo.useStyle('/~framework/client/styles/jqueryui/ui-lightness/jquery.ui.selectable.css');
ncombo.useStyle('/~framework/client/styles/jqueryui/ui-lightness/jquery.ui.theme.css');
ncombo.useScript('/~framework/client/libs/jquery/ui.js');

ncombo.useScript('/styles/main.css');

// Session will be destroyed if all windows relating to it are closed for 2 seconds
ncombo.start({port: port, release: true, sessionTimeout: 2000, title: 'Notes App'});
