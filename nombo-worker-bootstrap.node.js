var Worker = require('./nombo-worker.node');
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

var handleNotice = function (notice) {
	if (notice instanceof Error) {
		notice = notice.message;
	}
	process.send({type: 'notice', data: notice});
};

process.on('message', function (m) {
	if (m.type == 'init') {
		worker = new Worker(m.data);
		worker.on('error', handleError);
		worker.on('notice', handleNotice);
		var workerController = require(m.data.paths.appWorkerControllerPath);
		workerController.run(worker);
		worker.start();
	} else if (m.type == 'updateCache') {
		worker.handleCacheUpdate(m.data.url, m.data.content, m.data.size);
	} else if (m.type == 'updateCacheVersion') {
		worker.handleCacheVersionUpdate(m.data.cacheVersion);
	} else if (m.type == 'emit') {
		if (m.data) {
			worker.handleMasterEvent(m.event, m.data);
		} else {
			worker.handleMasterEvent(m.event);
		}
	} else if (m.type == 'kill') {
		worker.kill();
	}
});