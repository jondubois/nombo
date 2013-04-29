/*
	This function is executed once by the master process.
	This is where configuration tasks and resource bundling should happen.
	It is also an ideal place to spawn daemon processes.
*/

module.exports.run = function(ncombo) {
	// These files will be included as part of preload process
	ncombo.bundle.framework.style('bootstrap.css');
	ncombo.bundle.framework.style('jqueryui/ui-lightness/style.css');
	ncombo.bundle.framework.lib('jquery/ui.js');

	ncombo.bundle.app.template('login.html');
	ncombo.bundle.app.template('notes_table.html');
	ncombo.bundle.app.template('main.html');
	ncombo.bundle.app.template('add_note_dialog.html');

	ncombo.bundle.app.style('main.css');
}