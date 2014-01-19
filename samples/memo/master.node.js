/*
	This function is executed once by the master process.
	This is where configuration tasks and resource bundling should happen.
	It is also an ideal place to spawn daemon processes.
*/

module.exports.run = function (nombo) {
	// These files will be included as part of preload process
	nombo.bundle.framework.style('bootstrap.css');
	nombo.bundle.framework.style('jqueryui/ui-lightness/style.css');
	nombo.bundle.framework.lib('jquery/ui.js');

	nombo.bundle.app.template('login.html');
	nombo.bundle.app.template('notes_table.html');
	nombo.bundle.app.template('main.html');
	nombo.bundle.app.template('add_note_dialog.html');

	nombo.bundle.app.style('main.css');

	nombo.on('fail', function (err) {
		console.log('FAIL:', err.origin, err.message);
	});
	nombo.on('notice', function (err) {
		console.log('NOTICE:', err.origin, err.message);
	});
}