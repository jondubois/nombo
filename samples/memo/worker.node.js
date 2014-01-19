/*
	This function is executed for each Nombo worker instance.
	Middleware functions should be added here.
*/

var ws = require('nombo/webservice');

module.exports.run = function (nombo) {
	nombo.addMiddleware(nombo.MIDDLEWARE_IO, function(req, res, next) {
		if(req.sim == 'auth') {
			// Do not need to login to use auth server interface module
			next();
		} else {
			// For any other sim, check if current session is authorized
			req.session.get('loggedIn', function(err, loggedIn) {
				if(loggedIn) {
					next();
				} else {
					res.error('Socket communication not authorized - You are not logged in');
				}
			});
		}
	});
}