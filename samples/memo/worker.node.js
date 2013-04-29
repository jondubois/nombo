/*
	This function is executed for each nCombo worker instance.
	Middleware functions should be added here.
*/

module.exports.run = function(ncombo) {
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
}