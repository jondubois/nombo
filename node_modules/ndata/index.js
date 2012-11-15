var fork = require('child_process').fork;
var EventEmitter = require('events').EventEmitter;
var ComSocket = require('./com').ComSocket;

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
	self._chanelWatchers = {};
	self._commandMap = {};
	
	self._socket = new ComSocket();
	
	self._curID = 1;
	self.MAX_ID = Math.pow(2, 53) - 2;
	
	self.setMaxListeners(0);
	
	self._genID = function() {
		self._curID = (self._curID + 1) % self.MAX_ID;
		return 'n' + self._curID;
	}
	
	self._broadcast = function(event, value) {
		if(self._chanelWatchers.hasOwnProperty(event)) {
			var watchers = self._chanelWatchers[event];
			var i;
			for(i in watchers) {
				watchers[i](value);
			}
		}
	}
	
	self._socket.connect(port, host, function() {
		if(secretKey) {
			var command = {
				action: 'init',
				secretKey: secretKey
			}
			
			self._exec(command, function(data) {
				self.emit('ready');
			});
		} else {
			self.emit('ready');
		}		
	});
	
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
	
	self._exec = function(command, callback) {	
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
	}
	
	self._pendingWatches = 0;
	self._pendingUnwatches = 0;
	
	self._onProcessWatchQueue = function(callback) {
		var numActions = self._pendingWatches;
		
		if(numActions <= 0) {
			callback();
		} else {
			var handler = function() {
				self.removeListener('watch', handler);
				self.removeListener('watchfail', handler);
				if(--numActions <= 0) {
					callback();
				}
			}
			
			self.on('watch', handler);
			self.on('watchfail', handler);
		}
	}
	
	self._onProcessUnwatchQueue = function(callback) {
		var numActions = self._pendingUnwatches;
		
		if(numActions <= 0) {
			callback();
		} else {
			var handler = function() {
				self.removeListener('unwatch', handler);
				self.removeListener('unwatchfail', handler);
				if(--numActions <= 0) {
					callback();
				}
			}
			
			self.on('unwatch', handler);
			self.on('unwatchfail', handler);
		}
	}
	
	self._onProcessActionQueue = function(callback) {
		var numActions = self._pendingWatches + self._pendingUnwatches;
		
		if(numActions <= 0) {
			callback();
		} else {
			var handler = function() {
				self.removeListener('watch', handler);
				self.removeListener('watchfail', handler);
				self.removeListener('unwatch', handler);
				self.removeListener('unwatchfail', handler);
				if(--numActions <= 0) {
					callback();
				}
			}
			
			self.on('watch', handler);
			self.on('watchfail', handler);
			self.on('unwatch', handler);
			self.on('unwatchfail', handler);
		}
	}
	
	self.escapeDots = function(str) {
		return str.replace(/[.]/g, '\\u001a');
	}
	
	self.escapeCode = function(str) {
		return str.replace(/([()'"])/g, '\\u001b$1');
	}
	
	self.watch = function(event, handler, ackCallback) {
		self._pendingWatches++;
		
		var command = {
			action: 'watch',
			event: event	
		}
		
		var callback = function(error) {
			if(--self._pendingWatches <= 0 ) {
				self._pendingWatches = 0;
			}
			if(error) {
				if(ackCallback) {
					ackCallback(error);
				}
				self.emit('watchfail');
			} else {
				if(!self._chanelWatchers[event]) {
					self._chanelWatchers[event] = [];
				}
				self._chanelWatchers[event].push(handler);
				if(ackCallback) {
					ackCallback();
				}
				self.emit('watch');
			}
		}
		self._exec(command, callback);
	}
	
	self.watchOnce = function(event, handler, ackCallback) {
		if(!self._chanelWatchers[event]) {
			self.watch(event, handler, ackCallback);
		} else {
			if(ackCallback) {
				ackCallback();
			}
		}
	}
	
	self.isWatching = function(event, handler) {
		var watching = false;
		var listeners = self._chanelWatchers[event];
		if(listeners) {
			var i;
			for(i in listeners) {
				if(listeners[i] == handler) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	self._isEmpty = function(object) {
		var i;
		var empty = true;
		for(i in object) {
			empty = false;
			break;
		}
		return empty;
	}
	
	self._unwatch = function(event, callback) {
		self._pendingUnwatches++;
		var command = {
			action: 'unwatch',
			event: event	
		}
		
		var cb = function(error) {
			if(--self._pendingUnwatches <= 0 ) {
				self._pendingUnwatches = 0;
			}
			
			if(error) {
				if(callback) {
					callback(error);
				}
				self.emit('unwatchfail');
			} else {
				if(callback) {
					callback();
				}
				self.emit('unwatch');
			}
		}
		self._exec(command, cb);
	}
	
	self.unwatch = function(event, handler, ackCallback) {
		if(event) {
			self._onProcessWatchQueue(function() {
				if(self._chanelWatchers.hasOwnProperty(event)) {
					if(handler) {
						var newWatchers = [];
						var watchers = self._chanelWatchers[event];
						var i;
						for(i in watchers) {
							if(watchers[i] != handler) {
								newWatchers.push(watchers[i]);
							}
						}
						
						var callback = function(err) {
							if(!err) {
								self._chanelWatchers[event] = newWatchers;
							}
							if(ackCallback) {
								ackCallback(err);
							}
						}
						
						if(newWatchers.length < 1) {
							self._unwatch(event, callback);
						} else {
							self._chanelWatchers[event] = newWatchers;
							if(ackCallback) {
								ackCallback();
							}
						}
					} else {
						var callback = function(err) {
							if(!err) {
								delete self._chanelWatchers[event];
							}
							if(ackCallback) {
								ackCallback(err);
							}
						}
						
						self._unwatch(event, callback);
					}
				} else {
					self._unwatch(event, ackCallback);
				}
			});
		} else {
			self._chanelWatchers = {};
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
	
		self._onProcessActionQueue(function() {
			var command = {
				action: 'broadcast',
				event: event,
				value: value
			}
			self._exec(command, callback);
		});
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
