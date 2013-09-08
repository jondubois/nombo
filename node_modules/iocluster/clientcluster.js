var async = require('async');

var ClientCluster = function (clients) {
	var self = this;
	
	var i, method;
	var client = clients[0];
	var clientIds = [];
	
	var clientInterface = [
		'watch',
		'watchOnce',
		'watchExclusive',
		'isWatching',
		'unwatch',
		'broadcast',
		'set',
		'getExpiry',
		'add',
		'concat',
		'get',
		'getRange',
		'getAll',
		'count',
		'registerDeathQuery',
		'run',
		'query',
		'remove',
		'removeRange',
		'removeAll',
		'pop',
		'hasKey',
		'end'
	];
	
	var clientUtils = [
		'stringify',
		'extractKeys',
		'extractValues'
	];
	
	for (i in clients) {
		clients[i].id = i;
		clientIds.push(i);
	}
	
	// Default mapper maps to all clients.
	var mapper = function () {
		return clientIds;
	};
	
	for (i in clientInterface) {
		(function (method) {
			self[method] = function () {
				var key = arguments[0];
				var lastArg = arguments[arguments.length - 1];
				var results = [];
				var activeClients = self.map(key, method);
				
				if (lastArg instanceof Function) {
					if (activeClients.length < 2) {
						activeClients[0][method].apply(activeClients[0], arguments);
					} else {
						var result;
						var tasks = [];
						var args = Array.prototype.slice.call(arguments, 0, -1);
						var cb = lastArg;
						
						for (var i in activeClients) {
							tasks.push(function () {
								var callback = arguments[arguments.length - 1];
								result = activeClients[i][method].apply(activeClients[i], args.concat(callback));
								results.push(result);
							});
						}
						async.parallel(tasks, cb);
					}
				} else {
					for (var i in activeClients) {
						result = activeClients[i][method].apply(activeClients[i], arguments);
						results.push(result);
					}
				}
				return results;
			}
		})(clientInterface[i]);
	}
	
	var multiKeyClientInterface = [
		'expire',
		'unexpire'
	];
	
	for (i in multiKeyClientInterface) {
		(function (method) {
			self[method] = function () {
				var j, k, activeClients, mapping, key;
				var keys = arguments[0];
				var tasks = [];
				var results = [];
				var expiryMap = {};
				
				var lastArg = arguments[arguments.length - 1];
				var cb = lastArg;
				
				for (j in keys) {
					key = keys[j];
					activeClients = self.map(key, method);
					for (k in activeClients) {
						mapping = activeClients[k].id;
						if (expiryMap[mapping] == null) {
							expiryMap[mapping] = [];
						}
						expiryMap[mapping].push(key);
					}
				}
				
				var partArgs = Array.prototype.slice.call(arguments, 1, -1);
				
				for (mapping in expiryMap) {
					(function (activeClient, expiryKeys) {
						var newArgs = [expiryKeys].concat(partArgs);
						tasks.push(function () {	
							var callback = arguments[arguments.length - 1];
							var result = activeClient[method].apply(activeClient, newArgs.concat(callback));
							results.push(result);
						});
					})(clients[mapping], expiryMap[mapping]);
				}
				async.parallel(tasks, cb);
				
				return results;
			};
		})(multiKeyClientInterface[i]);
	}
	
	for (i in clientUtils) {
		method = clientUtils[i];
		this[method] = client[method].bind(client);
	}
	
	this.setMapper = function (mapperFunction) {
		mapper = mapperFunction;
	};
	
	this.getMapper = function (mapperFunction) {
		return mapper;
	};
	
	this.map = function (key, method) {
		var result = mapper(key, method, clientIds);
		if (typeof result == 'number') {
			return [clients[result % clients.length]];
		} else if (result instanceof Array) {
			var dataClients = [];
			for (var i in result) {
				dataClients.push(clients[result[i] % clients.length]);
			}
			return dataClients;
		}
		
		return [];
	};
};

module.exports.ClientCluster = ClientCluster;