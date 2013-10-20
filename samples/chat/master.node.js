/*
	This function is executed once by the master process.
	This is where configuration tasks and resource bundling should happen.
	It is also an ideal place to spawn daemon processes.
*/

module.exports.run = function(nombo) {
	nombo.on('fail', function (err) {
		console.log('FAIL:', err.origin, err.message);
	});
	nombo.on('notice', function (err) {
		console.log('NOTICE:', err.origin, err.message);
	});
}