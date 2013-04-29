/*
	This function is executed once by the master process.
	This is where configuration tasks and resource bundling should happen.
	It is also an ideal place to spawn daemon processes.
*/

module.exports.run = function(ncombo) {
	// These files will be included as part of preload process
	ncombo.bundle.framework.style('bootstrap');
	ncombo.bundle.app.style('main');
}