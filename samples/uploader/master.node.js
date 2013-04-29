/*
	This function is executed once by the master process.
	This is where configuration tasks and resource bundling should happen.
	It is also an ideal place to spawn daemon processes.
*/

module.exports.run = function(ncombo) {
	ncombo.bundle.framework.style('fileuploader');
	ncombo.bundle.framework.lib('fileuploader');
}