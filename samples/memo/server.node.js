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

// Session will be destroyed if all windows relating to it are closed for 2 seconds
ncombo.start({port: port, release: false, sessionTimeout: 2000, title: 'Notes App'});
