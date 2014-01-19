/*
	This function is executed once by the master process.
	This is where configuration tasks and resource bundling should happen.
	It is also an ideal place to spawn daemon processes.
*/

module.exports.run = function (nombo) {
	// These files will be included as part of preload process
	nombo.bundle.framework.style('bootstrap');
	nombo.bundle.framework.lib('angular');
	nombo.bundle.framework.lib('angular/rout');
	nombo.bundle.app.template('index');
	nombo.bundle.app.style('main');
}