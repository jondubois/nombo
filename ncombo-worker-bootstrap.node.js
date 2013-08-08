var Worker = require('./ncombo-worker.node');
var worker;

var handleError = function (err) {
	var error;
	if (err.stack) {
		error = {
			message: err.message,
			stack: err.stack
		}
	} else {
		error = err;
	}
	process.send({type: 'error', data: error});
};

process.on('message', function (m) {
	if (m.type == 'init') {
		worker = new Worker(m.data);
		worker.on('error', handleError);
		
		var workerController = require(m.data.paths.appWorkerControllerPath);
		workerController.run(worker);
		worker.start();
	} else if (m.type == 'updateCache') {
		worker.handleCacheUpdate(m.data.url, m.data.content, m.data.size);
	} else if (m.type == 'emit') {
		worker.handleMasterEvent(m.event, m.data);
	}
});