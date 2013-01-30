var arguments = process.argv.slice(2);
var port = arguments[0] ? arguments[0] : 8000;
var release = arguments[1] == 'release' ? true : false;

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

// These files will be included as part of preload process
ncombo.bundle.framework.style('bootstrap.css');
ncombo.bundle.framework.style('jqueryui/ui-lightness/style.css');
ncombo.bundle.framework.lib('jquery/ui.js');

ncombo.bundle.app.template('login.html');
ncombo.bundle.app.template('notes_table.html');
ncombo.bundle.app.template('main.html');
ncombo.bundle.app.template('add_note_dialog.html');

ncombo.bundle.app.style('main.css');

// Session will be destroyed if all windows relating to it are closed for 5 seconds
ncombo.start({port: port, release: release, sessionTimeout: 5000, title: 'Memo App'});
