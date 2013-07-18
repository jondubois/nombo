var Worker = require('./ncombo-worker.node');

process.on('message', function (m) {
	if (m.action == 'init') {
		var worker = new Worker(m.data);
		var workerController = require(m.data.paths.appWorkerControllerPath);
		workerController.run(worker);
		worker.start();
	} else if (m.action == 'updateCache') {
		worker.handleCacheUpdate(m.data.url, m.data.content, m.data.size);
	} else if (m.action == 'emit') {
		worker.handleMasterEvent(m.event, m.data);
	}
});