/*
	Check if session has been authorized.
*/
module.exports.isLoggedIn = function(req, res) {
	req.session.get('loggedIn', function(err, loggedIn) {
		try {
			res.end(loggedIn);
		} catch(e) {
			res.error(e);
		}
	});
}

/*
	The only valid values are username 'bob' and password 'hello'.
	In a practical case, you may want to use a database.
*/
module.exports.login = function(req, res) {
	if(req.data.username == 'bob' && req.data.password == 'hello') {
		// Here we are setting the loggedIn key to true to authorize the current session
		req.session.set('loggedIn', true, function(err) {
			res.end(true);
		});
	} else {
		res.end(false);
	}
}

/*
	Unauthorize the current session.
*/
module.exports.logout = function(req, res) {
	req.session.remove('loggedIn', function(err) {
		res.end(!err);
	});
}