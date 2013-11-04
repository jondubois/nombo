var EventEmitter = require('events').EventEmitter;
var ndata = require('ndata');
var async = require('async');
var LinkedList = require('linkedlist');
var ClientCluster = require('./clientcluster').ClientCluster;

var KeyManager = function () {};

KeyManager.prototype.getGlobalDataKey = function (keys) {
	var keyChain = ['__iocl', 'gld'];
	if (keys != null) {
		keyChain = keyChain.concat(keys);
	}
	return keyChain;
};

KeyManager.prototype.getSessionDataKey = function (sessionId, keys) {
	var keyChain = ['__iocl', 'sed', sessionId];
	if (keys != null) {
		keyChain = keyChain.concat(keys);
	}
	return keyChain;
};

KeyManager.prototype.getSocketDataKey = function (socketId, keys) {
	var keyChain = ['__iocl', 'sod', socketId];
	if (keys != null) {
		keyChain = keyChain.concat(keys);
	}
	return keyChain;
};

KeyManager.prototype.getGlobalEventKey = function (key) {
	if (key == null) {
		return ['__iocl', 'gle'];
	} else {
		return ['__iocl', 'gle', key];
	}
};

KeyManager.prototype.getSessionEventKey = function (sessionId, key) {
	if (key == null) {
		return ['__iocl', 'see', sessionId];
	} else {
		return ['__iocl', 'see', sessionId, key];
	}
};

KeyManager.prototype.getSocketEventKey = function (socketId, key) {
	if (key == null) {
		return ['__iocl', 'soe', socketId];
	} else {
		return ['__iocl', 'soe', socketId, key];
	}
};

var isEmpty = function(obj) {
	var i;
	for (i in obj) {
		return false;
	}
	return true;
};

var AbstractDataClient = function (dataClient) {
	this._dataClient = dataClient;
};

AbstractDataClient.prototype.set = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.set.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.expire = function() {
	var keys = arguments[0];
	for (var i in keys) {
		keys[i] = this._localizeDataKey(keys[i]);
	}
	arguments[0] = keys;
	
	this._dataClient.expire.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.unexpire = function() {
	var keys = arguments[0];
	for (var i in keys) {
		keys[i] = this._localizeDataKey(keys[i]);
	}
	arguments[0] = keys;
	
	this._dataClient.unexpire.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.add = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.add.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.get = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.get.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.getRange = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.getRange.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.getAll = function(callback) {
	var clientRootKey = this._localizeDataKey();
	this._dataClient.get.call(this._dataClient, clientRootKey, callback);
};

AbstractDataClient.prototype.count = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.count.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.remove = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.remove.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.removeRange = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.removeRange.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.removeAll = function(callback) {
	var clientRootKey = this._localizeDataKey();
	this._dataClient.set.call(this._dataClient, clientRootKey, {}, callback);
};

AbstractDataClient.prototype.pop = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.pop.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.hasKey = function() {
	arguments[0] = this._localizeDataKey(arguments[0]);
	this._dataClient.hasKey.apply(this._dataClient, arguments);
};

AbstractDataClient.prototype.stringify = function(value) {
	return this._dataClient.stringify(value);
};

AbstractDataClient.prototype.extractKeys = function(object) {
	return this._dataClient.extractKeys(object);
};

AbstractDataClient.prototype.extractValues = function(object) {
	return this._dataClient.extractValues(object);
};

/*
	query(query,[ data, callback])
*/
AbstractDataClient.prototype.query = function() {
	var options = {
		baseKey: this._localizeDataKey()
	};
	
	if (arguments[1] && !(arguments[1] instanceof Function)) {
		options.data = arguments[1];
	}
	this._dataClient.run(arguments[0], options, arguments[2]);
};


var Global = function (socketId, privClientCluster, pubClientCluster, eventEmitter, namespace) {
	this.socketId = socketId;
	this._privClientCluster = privClientCluster;
	this._pubClientCluster = pubClientCluster;
	this._eventEmitter = eventEmitter;
	this._namespace = namespace ? namespace : '__';
	this._keyManager = new KeyManager();
	
	AbstractDataClient.call(this, this._pubClientCluster);
};

Global.prototype = Object.create(AbstractDataClient.prototype);

Global.prototype._localizeDataKey = function (key) {
	return this._keyManager.getGlobalDataKey(key);
};

Global.prototype.broadcast = function (event, data, callback) {
	this._privClientCluster.broadcast(this._keyManager.getGlobalEventKey(), {ns: this._namespace, event: event, data: data}, callback);
};

Global.prototype._emit = function (sessionId, event, data, excludeCurrentSocket, callback) {
	var eventData = {ns: this._namespace, session: sessionId, event: event, data: data};
	if (excludeCurrentSocket) {
		eventData.exclude = this.socketId;
	}
	this._privClientCluster.broadcast(this._keyManager.getSessionEventKey(sessionId), eventData, callback);
};

Global.prototype.emit = function (sessionId, event, data, callback) {
	this._emit(sessionId, event, data, false, callback);
};

Global.prototype.transmit = function (sessionId, event, data, callback) {
	this._emit(sessionId, event, data, true, callback);
};

Global.prototype.watch = function (event, handler) {
	this._eventEmitter.on(this._namespace + '.' + event, handler);
};

Global.prototype.unwatch = function (event, handler) {
	if (handler) {
		this._eventEmitter.removeListener(this._namespace + '.' + event, handler);
	} else {
		if (arguments[0] != null) {
			arguments[0] = this._namespace + '.' + arguments[0];
		}
		this._eventEmitter.removeAllListeners.apply(this._eventEmitter, arguments);
	}
};

Global.prototype.setMapper = function (mapper) {
	this._pubClientCluster.setMapper(mapper);
};

Global.prototype.getMapper = function () {
	return this._pubClientCluster.getMapper();
};

Global.prototype.map = function () {
	return this._pubClientCluster.map.apply(this._pubClientCluster, arguments);
};

Global.prototype.ns = function (namespace) {
	return new Global(this.socketId, this._privClientCluster, this._pubClientCluster, this._eventEmitter, namespace);
};


var Session = function (sessionId, socketId, dataClient, eventEmitter, namespace) {
	this.id = sessionId;
	this.socketId = socketId;
	this._dataClient = dataClient;
	this._eventEmitter = eventEmitter;
	this._namespace = namespace ? namespace : '__';
	this._keyManager = new KeyManager();
};

Session.prototype = Object.create(AbstractDataClient.prototype);

Session.prototype._localizeDataKey = function (key) {
	return this._keyManager.getSessionDataKey(this.id, key);
};

Session.prototype.setAuth = function(data, callback) {
	this.set('__auth', data, callback);
};

Session.prototype.getAuth = function(callback) {
	this.get('__auth', callback);
};

Session.prototype.clearAuth = function(callback) {
	this.remove('__auth', callback);
};

Session.prototype.emit = function (event, data, callback) {
	this._dataClient.broadcast(this._keyManager.getSessionEventKey(this.id), {ns: this._namespace, session: this.id, event: event, data: data}, callback);
};

Session.prototype.transmit = function (event, data, callback) {
	this._dataClient.broadcast(this._keyManager.getSessionEventKey(this.id), {ns: this._namespace, session: this.id, event: event, data: data, exclude: this.socketId}, callback);
};

Session.prototype.countSockets = function (callback) {
	this._dataClient.count(this._keyManager.getSessionDataKey(this.id, ['__meta', 'sockets']), callback);
};

Session.prototype.watch = function (event, handler) {
	this._eventEmitter.on(this._namespace + '.' + event, handler);
};

Session.prototype.unwatch = function (event, handler) {
	if (handler) {
		this._eventEmitter.removeListener(this._namespace + '.' + event, handler);
	} else {
		if (arguments[0] != null) {
			arguments[0] = this._namespace + '.' + arguments[0];
		}
		this._eventEmitter.removeAllListeners.apply(this._eventEmitter, arguments);
	}
};

Session.prototype.ns = function (namespace) {
	return new Session(this.id, this.socketId, this._dataClient, this._eventEmitter, namespace);
};


var Socket = function (socketId, dataClient, eventEmitter, namespace) {
	this.id = socketId;
	this._dataClient = dataClient;
	this._eventEmitter = eventEmitter;
	this._namespace = namespace ? namespace : '__';
	this._keyManager = new KeyManager();
};

Socket.prototype = Object.create(AbstractDataClient.prototype);

Socket.prototype._localizeDataKey = function (key) {
	return this._keyManager.getSocketDataKey(this.id, key);
};

Socket.prototype.emit = function (event, data, callback) {
	this._dataClient.broadcast(this._keyManager.getSocketEventKey(this.id), {ns: this._namespace, socket: this.id, event: event, data: data}, callback);
};

Socket.prototype.watch = function (event, handler) {
	this._eventEmitter.on(this._namespace + '.' + event, handler);
};

Socket.prototype.unwatch = function (event, handler) {
	if (handler) {
		this._eventEmitter.removeListener(this._namespace + '.' + event, handler);
	} else {
		if (arguments[0] != null) {
			arguments[0] = this._namespace + '.' + arguments[0];
		}
		this._eventEmitter.removeAllListeners.apply(this._eventEmitter, arguments);
	}
};

Socket.prototype.ns = function (namespace) {
	return new Socket(this.id, this._dataClient, this._eventEmitter, namespace);
};


var IOCluster = module.exports.IOCluster = function (options) {
	var self = this;
	
	var dataServer;
	this._dataServers = [];
	
	var readyCount = 0;
	var len = options.stores.length;
	var firstTime = true;
	
	for (var i=0; i<len; i++) {
		var launchServer = function (i) {
			dataServer = ndata.createServer(options.stores[i].port, options.dataKey, options.expiryAccuracy);
			self._dataServers[i] = dataServer;
			
			if (firstTime) {
				dataServer.on('ready', function () {
					if (++readyCount >= options.stores.length) {
						firstTime = false;
						self.emit('ready');
					}
				});
			}
			
			dataServer.on('error', function (err) {
				self.emit('error', err);
			});
			
			dataServer.on('exit', function () {
				self.emit('error', new Error('nData server at port ' + options.stores[i].port + ' exited'));
				launchServer(i);
			});
		};
		
		launchServer(i);
	}
};

IOCluster.prototype = Object.create(EventEmitter.prototype);

IOCluster.prototype.destroy = function () {
	for (var i in this._dataServers) {
		this._dataServers[i].destroy();
	}
};


var IOClusterClient = module.exports.IOClusterClient = function (options) {
	var self = this;
	this._dataExpiry = options.dataExpiry;
	this._connectTimeout = options.connectTimeout;
	this._addressSocketLimit = options.addressSocketLimit;
	
	// Expressed in milliseconds
	this._expiryReset = Math.ceil(this._dataExpiry * 300);
	this._expiryBatchSize = 1000;
	this._keyManager = new KeyManager();
	this._ready = false;
	
	var dataClient;
	var dataClients = [];
	
	for (var i in options.stores) {
		dataClient = ndata.createClient(options.stores[i].port, options.dataKey);
		dataClients.push(dataClient);
	}
	
	var hasher = function (string) {
		if (string == null) {
			string = '';
		}
		var result = 0;
		
		var len = string.length;
		for (var i=0; i<len; i++) {
			result += string.charCodeAt(i);
		}
		
		return result % dataClients.length;
	};
	
	this._privMapper = function (key, method, clientIds) {
		if (method == 'broadcast') {
			if (key[1] == 'see') {
				return hasher(key[2]);
			}
			return clientIds;
		}
		if (method == 'query' || method == 'run') {
			return hasher(key.mapIndex || 0);
		}
		if (key instanceof Array) {
			if (key[3] == 'addresses') {
				return hasher(key[4]);
			}
			return hasher(key[2]);
		}
		return hasher(key);
	};
	
	this._pubMapper = function (key, method, clientIds) {
		return 0;
	};
	
	this._privClientCluster = new ClientCluster(dataClients);
	this._privClientCluster.setMapper(this._privMapper);
	
	this._pubClientCluster = new ClientCluster(dataClients);
	this._pubClientCluster.setMapper(this._pubMapper);
	
	// The last one will be used to check for global events.
	dataClient.on('ready', function () {
		dataClient.watchOnce(self._keyManager.getGlobalEventKey(),
			function () { self._handleGlobalEvent.apply(self, arguments); },
			function(err) {
				if (err) {
					self.emit('error', err);
				} else {
					self._ready = true;
					self.emit('ready');
				}
			}
		);
		
		self._expiryInterval = setInterval(function () {
			self._extendExpiries();
		}, self._expiryReset);
	});
	
	this._sockets = {};
	this._sessions = {};
	this._addresses = {};
	
	this._socketEmitter = new EventEmitter();
	this._sessionEmitter = new EventEmitter();
	this._globalEmitter = new EventEmitter();
};

IOClusterClient.prototype = Object.create(EventEmitter.prototype);

IOClusterClient.prototype.destroy = function (callback) {
	clearInterval(this._expiryInterval);
	this._privClientCluster.removeAll(callback);
};

IOClusterClient.prototype.on = function (event, listener) {
	if (event == 'ready' && this._ready) {
		listener();
	} else {
		EventEmitter.prototype.on.apply(this, arguments);
	}
};

IOClusterClient.prototype._processExpiryList = function (expiryList) {
	var self = this;
	var key, i;
	var keys = [];
	for (i=0; i<this._expiryBatchSize; i++) {
		key = expiryList.shift();
		if (key == null) {
			break;
		}
		keys.push(key);
	}
	if (keys.length > 0) {
		this._privClientCluster.expire(keys, this._dataExpiry, function() {
			self._processExpiryList(expiryList);
		});
	}
};

IOClusterClient.prototype._extendExpiries = function () {
	var sessionExpiryList = new LinkedList();
	var addressExpiryList = new LinkedList();
	
	var sockets = this._sockets;
	var sessions = this._sessions;
	var addresses = this._addresses;
	var i;
	for (i in sockets) {
		sessionExpiryList.push(sockets[i].dataKey);
	}
	for (i in sessions) {
		sessionExpiryList.push(sessions[i].dataKey);
	}
	for (i in addresses) {
		addressExpiryList.push(addresses[i].dataKey);
	}
	this._processExpiryList(sessionExpiryList);
	this._processExpiryList(addressExpiryList);
};

IOClusterClient.prototype._handshake = function (socket, callback) {
	var self = this;
	
	if (socket.address == null || socket.id == null) {
		callback && callback("Failed handshake - Invalid handshake data");
	} else {
		var ioSocket = this.socket(socket.id, socket.ssid);
		var remoteAddr = socket.address;
		
		if (remoteAddr.address) {
			remoteAddr = remoteAddr.address;
		}
		
		var acceptHandshake = function () {
			var addressStartQuery = function (dataMap, dataExpirer) {
				dataExpirer.expire([dataKey], expiry);
				dataMap.set(addressSocketKey, 1);
			};
			addressStartQuery.mapIndex = remoteAddr;
			addressStartQuery.data = {
				dataKey: self._keyManager.getGlobalDataKey(['__meta', 'addresses', remoteAddr]),
				expiry: self._connectTimeout,
				addressSocketKey: self._keyManager.getGlobalDataKey(['__meta', 'addresses', remoteAddr, 'sockets', socket.id])
			};
			
			self._privClientCluster.query(addressStartQuery, function (err) {
				callback && callback(err);
			});
		};
		
		if (this._addressSocketLimit > 0) {
			this.getAddressSockets(remoteAddr, function(err, sockets) {
				if (err) {
					callback && callback(err);
				} else {
					if (sockets.length < self._addressSocketLimit) {
						acceptHandshake();
					} else {
						callback && callback("Reached connection limit for the address " + remoteAddr, true);
					}
				}
			});
		} else {
			acceptHandshake();
		}
	}
};

IOClusterClient.prototype.bind = function (socket, callback) {
	var self = this;
	
	socket.eventKey = this._keyManager.getSocketEventKey(socket.id);
	socket.dataKey = this._keyManager.getSocketDataKey(socket.id);
	socket.sessionEventKey = this._keyManager.getSessionEventKey(socket.ssid);
	socket.sessionDataKey = this._keyManager.getSessionDataKey(socket.ssid);
	socket.addressDataKey = this._keyManager.getGlobalDataKey(['__meta', 'addresses', socket.address]);
	
	this._handshake(socket, function (err, notice) {
		if (err) {
			callback && callback(err, socket, notice);
		} else {
			self._sockets[socket.id] = socket;
			if (self._sessions[socket.ssid] == null) {
				self._sessions[socket.ssid] = {
					dataKey: socket.sessionDataKey,
					sockets: {}
				};
			}
			self._sessions[socket.ssid].sockets[socket.id] = socket;
			
			if (self._addresses[socket.address] == null) {
				self._addresses[socket.address] = {
					dataKey: socket.addressDataKey,
					sockets: {}
				};
			}
			self._addresses[socket.address].sockets[socket.id] = socket;
			
			var sessionStartQuery = function (dataMap, dataExpirer) {
				dataExpirer.expire([dataKey], expiry);
				dataMap.set(metaDataKey, 1);
			};
			sessionStartQuery.mapIndex = socket.ssid;
			sessionStartQuery.data = {
				dataKey: socket.sessionDataKey,
				expiry: self._dataExpiry,
				metaDataKey: self._keyManager.getSessionDataKey(socket.ssid, ['__meta', 'sockets', socket.id])
			};
			
			async.parallel([
				function () {
					var cb = arguments[arguments.length - 1];
					self._privClientCluster.watchOnce(socket.eventKey, function () { self._handleSocketEvent.apply(self, arguments); }, cb);
				},
				function () {
					var cb = arguments[arguments.length - 1];
					self._privClientCluster.watchOnce(socket.sessionEventKey, function () { self._handleSessionEvent.apply(self, arguments); }, cb);
				},
				function () {
					var cb = arguments[arguments.length - 1];
					self._privClientCluster.query(sessionStartQuery, cb);
				},
				function () {
					var cb = arguments[arguments.length - 1];
					self._privClientCluster.expire([socket.dataKey], self._dataExpiry, cb);
				},
				function () {
					var cb = arguments[arguments.length - 1];
					self._privClientCluster.expire([socket.addressDataKey], self._dataExpiry, cb);
				}
			],
			function(err) {
				callback && callback(err, socket);
			});
		}
	});
};

IOClusterClient.prototype.unbind = function (socket, callback) {
	var self = this;
	
	async.waterfall([
		function () {
			var cb = arguments[arguments.length - 1];
			self._privClientCluster.unwatch(socket.eventKey, null, cb);
		},
		function () {
			var cb = arguments[arguments.length - 1];
			delete self._sockets[socket.id];
			self._privClientCluster.remove(self._keyManager.getSessionDataKey(socket.ssid, ['__meta', 'sockets', socket.id]));
			if (self._addresses[socket.address]) {
				delete self._addresses[socket.address].sockets[socket.id];
				self._privClientCluster.remove(self._keyManager.getGlobalDataKey(['__meta', 'addresses', socket.address, 'sockets', socket.id]));
				if (isEmpty(self._addresses[socket.address].sockets)) {
					delete self._addresses[socket.address];
				}
			}
			if (self._sessions[socket.ssid]) {
				delete self._sessions[socket.ssid].sockets[socket.id];
			}
			
			if (self._sessions[socket.ssid] && isEmpty(self._sessions[socket.ssid].sockets)) {
				delete self._sessions[socket.ssid];				
				self.emit('sessiondestroy', socket.ssid);
				self._privClientCluster.unwatch(socket.sessionEventKey, null, cb);
			} else {
				cb();
			}
		}
	], callback);
};

IOClusterClient.prototype.getAddressSockets = function (ipAddress, callback) {
	var addressDataKey = ['__meta', 'addresses', ipAddress, 'sockets'];
	this._privClientCluster.get(this._keyManager.getGlobalDataKey(addressDataKey), function (err, data) {
		var sockets = [];
		var i;
		for (i in data) {
			sockets.push(i);
		}
		callback(err, sockets);
	});
};

IOClusterClient.prototype.global = function (socketId) {
	return new Global(socketId, this._privClientCluster, this._pubClientCluster, this._globalEmitter);
};

IOClusterClient.prototype.session = function (sessionId, socketId) {
	return new Session(sessionId, socketId, this._privClientCluster.map(sessionId)[0], this._sessionEmitter);
};

IOClusterClient.prototype.socket = function (socketId, sessionId) {
	if (!sessionId) {
		sessionId = this._sockets[socketId].ssid;
	}
	return new Socket(socketId, this._privClientCluster.map(sessionId)[0], this._socketEmitter);
};

IOClusterClient.prototype._handleSocketEvent = function (e) {
	var eventName = e.ns + '.' + e.event;
	this._socketEmitter.emit(eventName, e.data);
	
	if (this._sockets[e.socket] != null) {
		var socket = this._sockets[e.socket];
		if (e.ns) {
			socket = socket.ns(e.ns);
		}
		socket.emit(e.event, e.data);
	}
};

IOClusterClient.prototype._handleSessionEvent = function (e) {
	var eventName = e.ns + '.' + e.event;
	this._sessionEmitter.emit(eventName, e.data);
	
	if (this._sessions[e.session] != null) {
		var sockets = this._sessions[e.session].sockets;
		var socket;
		
		for (var i in sockets) {
			socket = sockets[i];
			if (socket.id != e.exclude) {
				if (e.ns) {
					socket = socket.ns(e.ns);
				}
				socket.emit(e.event, e.data);
			}
		}
	}
};

IOClusterClient.prototype._handleGlobalEvent = function (e) {
	var eventName = e.ns + '.' + e.event;
	this._globalEmitter.emit(eventName, e.data);
	
	var socket;
	for (var i in this._sockets) {
		socket = this._sockets[i];
		if (socket.id != e.exclude) {
			if (e.ns) {
				socket = socket.ns(e.ns);
			}
			socket.emit(e.event, e.data);
		}
	}
};