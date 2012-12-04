var fork = require('child_process').fork;
var EventEmitter = require('events').EventEmitter;
var ComSocket = require('./com').ComSocket;
var FlexiMap = require('./fleximap').FlexiMap;

var DEFAULT_PORT = 9435;
var HOST = '127.0.0.1';

var Server = function(port, secretKey) {
	var self = this;
	
	var args;
	if(secretKey) {
		args = [port, secretKey];
	} else {
		args = [port];
	}
	
	self._server = fork(__dirname + '/server.js', args);
	
	self._server.on('message', function(value) {
		if(value.event == 'listening') {
			self.emit('ready');
		}
	});
}

Server.prototype.__proto__ = EventEmitter.prototype;

module.exports.createServer = function(port, secretKey) {
	if(!port) {
		port = DEFAULT_PORT;
	}
	return new Server(port, secretKey);
}

var Client = function(port, host, secretKey, timeout) {
	var self = this;
	secretKey = secretKey || null;
	if(timeout) {
		self._timeout = timeout;
	} else {
		self._timeout = 10000;
	}
	
	var maxRetries = 4;
	var retryCount = 0;
	var retryInterval = 1000;
	
	self._watchMap = new FlexiMap();
	self._commandMap = {};
	self._pendingActions = [];
	
	self._socket = new ComSocket();
	self._connected = false;
	
	self._curID = 1;
	self.MAX_ID = Math.pow(2, 53) - 2;
	
	self.setMaxListeners(0);
	
	self._genID = function() {
		self._curID = (self._curID + 1) % self.MAX_ID;
		return 'n' + self._curID;
	}
	
	self._broadcast = function(event, value) {
		if(self._watchMap.hasKey(event)) {
			var watchers = self._watchMap.get(event);
			var i;
			for(i in watchers) {
				if(watchers[i] instanceof Function) {
					watchers[i](value);
				}
			}
		}
	}
	
	self._execPending = function() {
		var i;
		for(i in self._pendingActions) {
			self._exec.apply(self, self._pendingActions[i]);
		}
		self._pendingActions = [];
	}
	
	self._connectHandler = function() {
		if(secretKey) {
			var command = {
				action: 'init',
				secretKey: secretKey
			}
			self._connected = true;
			self._exec(command, function(data) {
				self._execPending();
				self.emit('ready');
			});
		} else {
			self._connected = true;
			self._execPending();
			self.emit('ready');
		}		
	}
	
	self._connect = function() {
		self._socket.connect(port, host, self._connectHandler);
	}
	
	var handleError = function() {
		self._connected = false;
		if(++retryCount <= maxRetries) {
			setTimeout(self._connect, retryInterval);
		} else {
			self.emit('connect_failed');
		}
	}
	
	self._socket.on('error', handleError);
	
	self._socket.on('message', function(response) {
		var id = response.id;
		var error = response.error || null;
		if(response.type == 'response') {
			if(self._commandMap.hasOwnProperty(id)) {
				clearTimeout(self._commandMap[id].timeout);
				
				var action = response.action;
				if(response.value !== undefined) {
					self._commandMap[id].callback(error, response.value);
				} else if(action == 'watch' || action == 'unwatch') {
					self._commandMap[id].callback(error);
				} else {
					self._commandMap[id].callback(error);
				}
				
				delete self._commandMap[id];
			}
		} else if(response.type == 'event') {
			self._broadcast(response.event, response.value);
		}
	});
	
	self._connect();
	
	self._exec = function(command, callback) {
		if(self._connected) {
			command.id = self._genID();
			if(callback) {
				var request = {callback: callback, command: command};
				self._commandMap[command.id] = request;
				
				var timeout = setTimeout(function() {
					var error = 'nData Error - ' + command.action + ' action timed out';
					callback(error);
					delete request.callback;
					if(self._commandMap.hasOwnProperty(command.id)) {
						delete self._commandMap[command.id];
					}
				}, self._timeout);
				
				request.timeout = timeout;
			}
			self._socket.write(command);
		} else {
			self._pendingActions.push(arguments);
		}
	}
	
	self.escapeDots = function(str) {
		return str.replace(/[.]/g, '\\u001a');
	}
	
	self.escapeCode = function(str) {
		return str.replace(/([()'"])/g, '\\u001b$1');
	}
	
	self.watch = function(event, handler, ackCallback) {
		var command = {
			event: event,
			action: 'watch'
		}
	
		var callback = function(err) {
			if(err) {
				ackCallback && ackCallback(err);
				self.emit('watchfail');
			} else {
				self._watchMap.add(event, handler);
				ackCallback && ackCallback();
				self.emit('watch');
			}
		}
		self._exec(command, callback);
	}
	
	self.watchOnce = function(event, handler, ackCallback) {
		if(self.isWatching(event, handler)) {
			ackCallback && ackCallback();
			self.emit('watch');
		} else {
			self.watch(event, handler, ackCallback);
		}
	}
	
	self.watchExclusive = function(event, handler, ackCallback) {
		var command = {
			event: event,
			action: 'watchExclusive'
		}
	
		var callback = function(err, alreadyWatching) {
			if(err) {
				ackCallback && ackCallback(err);
				self.emit('watchfail');
			} else {
				if(!alreadyWatching) {
					self._watchMap.add(event, handler);
				}
				ackCallback && ackCallback();
				self.emit('watch');
			}
		}
		self._exec(command, callback);
	}
	
	self.isWatching = function(event, handler) {
		if(handler) {
			return self._watchMap.hasValue(event, handler);
		} else {
			return self._watchMap.hasKey(event);
		}
	}
	
	self._unwatch = function(event, callback) {
		var command = {
			action: 'unwatch',
			event: event
		}
		
		var cb = function(error) {
			if(error) {
				callback && callback(error);
				self.emit('unwatchfail');
			} else {
				callback && callback();
				self.emit('unwatch');
			}
		}
		
		self._exec(command, cb);
	}
	
	self.unwatch = function(event, handler, ackCallback) {
		if(event) {
			if(self._watchMap.hasKey(event)) {
				if(handler) {
					var newWatchers = [];
					var watchers = self._watchMap.get(event);
					var i;
					for(i in watchers) {
						if(watchers[i] != handler) {
							newWatchers.push(watchers[i]);
						}
					}
					
					var callback = function(err) {
						if(!err) {
							self._watchMap.set(event, newWatchers);
						}
						if(self._watchMap.count(event) < 1) {
							self._watchMap.remove(event);
						}
						ackCallback && ackCallback(err);
					}
					
					if(newWatchers.length < 1) {
						self._unwatch(event, callback);
					} else {
						self._watchMap.set(event, newWatchers);
						if(self._watchMap.count(event) < 1) {
							self._watchMap.remove(event);
						}
						ackCallback && ackCallback();
					}
				} else {
					var callback = function(err) {
						if(!err) {
							self._watchMap.remove(event);
						}
						ackCallback && ackCallback(err);
					}
					self._unwatch(event, callback);
				}
			} else {
				self._unwatch(event, ackCallback);
			}
		} else {
			self._watchMap.removeAll();
			self._unwatch(null, ackCallback);
		}
	}
	
	self.broadcast = function() {
		var event = arguments[0];
		var value = null;
		var callback = null;
		if(arguments[1] instanceof Function) {
			callback = arguments[1];
		} else {
			value = arguments[1];
			callback = arguments[2];
		}
		
		var command = {
			action: 'broadcast',
			event: event,
			value: value
		}
		self._exec(command, callback);
	}
	
	self.set = function(key, value, callback) {
		var command = {
			action: 'set',
			key: key,
			value: value
		}
		self._exec(command, callback);
	}
	
	self.add = function(key, value, callback) {
		var command = {
			action: 'add',
			key: key,
			value: value
		}
		self._exec(command, callback);
	}
	
	self.get = function(key, callback) {
		var command = {
			action: 'get',
			key: key	
		}
		self._exec(command, callback);
	}
	
	self.getAll = function(callback) {
		var command = {
			action: 'getAll'
		}
		self._exec(command, callback);
	}
	
	self.count = function(key, callback) {
		var command = {
			action: 'count',
			key: key
		}
		self._exec(command, callback);
	}
	
	self.run = function(code, callback) {
		code = code.replace(/[\t ]+/g, ' ');
		
		var command = {
			action: 'run',
			value: code
		}
		
		self._exec(command, callback);
	}
	
	self.remove = function(key, callback) {
		var command = {
			action: 'remove',
			key: key
		}
		self._exec(command, callback);
	}
	
	self.removeAll = function(callback) {
		var command = {
			action: 'removeAll'
		}
		self._exec(command, callback);
	}
	
	self.pop = function(key, callback) {
		var command = {
			action: 'pop',
			key: key
		}
		self._exec(command, callback);
	}
	
	self.hasKey = function(key, callback) {
		var command = {
			action: 'hasKey',
			key: key
		}
		self._exec(command, callback);
	}
	
	self.end = function(callback) {
		if(callback) {
			var disconnectCallback = function() {
				if(disconnectTimeout) {
					clearTimeout(disconnectTimeout);
				}
				callback();
				self._socket.removeListener('end', disconnectCallback);
			}
			
			var disconnectTimeout = setTimeout(function() {
				self._socket.removeListener('end', disconnectCallback);
				callback('Disconnection timed out');
			}, self._timeout);
			
			self._socket.on('end', disconnectCallback);
		}
		var setDisconnectStatus = function() {
			self._socket.removeListener('end', setDisconnectStatus);
			self._connected = false;
		}
		self._socket.on('end', setDisconnectStatus);
		self._socket.end();
	}
}

Client.prototype.__proto__ = EventEmitter.prototype;

module.exports.createClient = function(port, secretKey) {
	if(!port) {
		port = DEFAULT_PORT;
	}
	
	return new Client(port, HOST, secretKey);
}
