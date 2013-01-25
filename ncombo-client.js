/**
	This script provides the core client-side functionality of nCombo.
*/
var $n = {
	MAX_ID: Math.pow(2, 53) - 2,
	socketIO: null,
	_wsEndpoint: null,
	_timeout: 10000,
	_appURL: null,
	_curID: 1,
	_callTracker: {},
	_frameworkURL: null,
	_jsLibsURL: null,
	_frameworkStylesURL: null,
	_scriptsRouterURL: null,
	_appScriptsURL: null,
	_appStylesURL: null,
	_appAssetsURL: null,
	_appFilesURL: null,
	_cacheSeverCalls: false,
	_cacheVersion: null,
	_callbacks: {},
	_releaseMode: false,
	
	initIO: function() {
		$n.socketIO = NCOMBO_SOCKET;
		if($n.socketIO) {
			$n.socketIO.on('return', $n._callReturn);
			$n.socketIO.on('event', $n._eventReceived);
		}
	},
    
	init: function() {
		var appDefinition = $loader.getAppDefinition();
		
		$n._frameworkURL = appDefinition.frameworkURL;
		$n._appURL = appDefinition.appURL;
		$n._jsLibsURL = appDefinition.jsLibsURL;
		$n._frameworkStylesURL = appDefinition.frameworkStylesURL;
		$n._scriptsRouterURL = location.href.replace(/\?.*/, '');
		$n._appScriptsURL = appDefinition.appScriptsURL;
		$n._appStylesURL = appDefinition.appStylesURL;
		$n._appAssetsURL = appDefinition.appAssetsURL;
		$n._appFilesURL = appDefinition.appFilesURL;
		$n._wsEndpoint = appDefinition.wsEndpoint;
		$n._releaseMode = appDefinition.releaseMode;
		$n._timeout = appDefinition.timeout;
		
		// global variables from session.js
		$n._autoSession = NCOMBO_AUTO_SESSION;
		$n._cacheVersion = NCOMBO_CACHE_VERSION;
		
		$n.initIO();
		
		$n.local.init();
	},
	
	session: {
		start: function() {
			var data = null;
			var callback = null;
			if(arguments[0] instanceof Function) {
				callback = arguments[0];
			} else {
				data = arguments[0];
				callback = arguments[1];
			}
			NCOMBO_SESSION_MANAGER.startSession(data, function(err, ssid) {
				$n.initIO();
				if(callback) {
					callback(err, ssid);
				}
			});
		},
		
		end: function(callback) {
			NCOMBO_SESSION_MANAGER.endSession(callback);
		}
	},
	
	_genID: function() {
		$n._curID++;
		$n._curID = $n._curID % $n.MAX_ID;
		return 'l' + $n._curID;
	},
	
	_globalEval: $loader.grab._globalEval,
	
	/**
		Convert a class (function) into a mixin-extendable class. This will give the class internal access to an
		initMixin(MixinClass, args) method and a callMixinMethod(MixinClass, method, arg1, ...argn) which will allow the current
		class to manipulate base mixins.
	*/
	mixin: $loader.mixin,
	
	EventEmitter: $loader.EventEmitter,
	
	getBasicType: function(variable) {
		var classType = {}.toString
		var typeRegex = /[^0-9A-Za-z]*([A-Z][a-zA-Z0-9]*)/;
		var typeString = classType.call(variable);
		return typeString.match(typeRegex)[1];
	},
	
	/**
		Bind a callback function to nCombo's ready event. The specified function will be called when nCombo is ready to begin processing.
	*/
	ready: $loader.grab.ready,
	
	/**
		Bind a callback function to nCombo's fail event. The specified function will be called when nCombo fails to load a resource.
		The callback can accept a parameter which indicates the URL of the resource which failed to load.
	*/
	fail:  $loader.grab.fail,
	
	/**
		This object holds error functions to handle various client-side error types that can occur within the system.
		Each function handles a specific type of error and can accept any suitable number of parameters
		in order to generate the appropriate error message.
	*/
	errors: {
		serverInterfaceError: function(message) {
			return "ServerInterfaceError: " + message;
		},
		
		loadError: function(resourceURL) {
			return "LoadError: Failed to load resource: " + resourceURL;
		}
	},
	
	/**
		Get the URL of nCombo's root directory.
	*/
	getRootURL: function() {
		return $n._frameworkURL;
	},
	
	/**
		Navigate to another script.
	*/
	navigateToScript: function(scriptName) {
		location.href = $n._scriptsRouterURL + (scriptName ? "?" + scriptName : "");
	},
	
	caching: {
		/**
			Enable/disable default caching for server interface AJAX calls performed by nCombo.
			Server call caching is disabled by default.
		*/
		cacheServerCalls: function(bool) {
			$n._cacheSeverCalls = bool;
		}
	},
	
	/**
		Grab allows you to include external scripts, CSS stylesheets and templates into your JavaScript.
		Some grab methods allow you to load resources either synchronously or asynchronously.
	*/
	grab: $loader.grab,
	
	serverInterfaceDescription: {},
	
	_callReturn: function(data) {
		var id = data.id;
		if($n._callTracker[id]) {
			if($n._callTracker[id].timeout) {
				clearTimeout($n._callTracker[id].timeout);
			}
			if(!data.noValue && $n._callTracker[id].callback) {
				var finish = data.close ? true : false;
				$n._callTracker[id].callback(data.error, data.value, finish);
			}
			if(data.close) {
				delete $n._callTracker[id];
			}
		}
	},
	
	trackRequest: function(id, callback) {
		$n._callTracker[id] = {callback: callback};
	},
	
	_eventReceived: function(event) {
		if(event.remote) {
			$n.remote(event.host, event.port, event.secure, event.wsEndpoint).ns(event.ns)._triggerWatchers(event.event, event.data);
		} else {
			$n.local.ns(event.ns)._triggerWatchers(event.event, event.data);
		}
	},
	
	_asRemoteClientURL: function(host, port, secure, wsEndpoint) {
		return (secure ? 'https://' : 'http://') + host + ":" + port + wsEndpoint;
	},
	
	_remoteClientMap: {}
};

$n.NS = function(namespace, wsSocket) {
	var self = this;
	self._namespace = namespace;
	self.socketIO = wsSocket;
	self._serverWatchMap = {};
	
	self.watch = function(event, handler, ackCallback) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to watch local event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
		
		var id = $n._genID();
		if(!self._serverWatchMap.hasOwnProperty(event)) {
			self._serverWatchMap[event] = [];
		}
		self._serverWatchMap[event].push(handler);
		
		var ackHandler = function(err) {
			if(err) {
				delete self._serverWatchMap[event];
			}
			cb(err);
		}
		
		var request = {
			id: id,
			ns: self._namespace,
			event: event
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(id, ackHandler);
			$n.socketIO.emit('watchLocal', request);
		} else {
			cb();
		}
	}
	
	self.unwatch = function(event, handler, ackCallback) {
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to unwatch local event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
		
		var i;
		var id = $n._genID();
		var unwatchRequest = {
			id: id,
			ns: self._namespace,
			event: event
		};
		
		if(!event) {
			self._serverWatchMap = {};
			$n.trackRequest(id, cb);
			self.socketIO.emit('unwatchLocal', unwatchRequest);
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				delete self._serverWatchMap[event];
				$n.trackRequest(id, cb);
				self.socketIO.emit('unwatchLocal', unwatchRequest);
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					return element != handler;
				});
				if(self._serverWatchMap[event].length < 1) {
					$n.trackRequest(id, cb);
					self.socketIO.emit('unwatchLocal', unwatchRequest);
				} else {
					cb();
				}
			} else {
				cb();
			}
		}
	}
	
	self._getWatcher = function(event, handler) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		if(self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				if(watchers[i] == handler) {
					return watchers[i];
				}
			}
		}
		return null;
	}
	
	self.isWatching = function(event, handler) {
		return self._getWatcher(event, handler) ? true : false;
	}
	
	self._triggerWatchers = function(event, data) {
		if(self._serverWatchMap && self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				watchers[i].call(null, data);
			}
		}
	}
}

$n.RemoteNS = function(host, port, secure, wsEndpoint, namespace, wsSocket) {
	var self = this;
	self._namespace = namespace;
	self.socketIO = wsSocket;
	self._serverWatchMap = {};
	
	self.watch = function(event, handler, ackCallback) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to watch remote event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
		
		var id = $n._genID();
		
		if(!self._serverWatchMap.hasOwnProperty(event)) {
			self._serverWatchMap[event] = [];
		}
		
		self._serverWatchMap[event].push(handler);
		
		var ackHandler = function(err) {
			if(err) {
				delete self._serverWatchMap[event];
			}
			cb(err);
		}
		
		var request = {
			id: id,
			remote: true,
			host: host,
			port: port,
			secure: secure,
			wsEndpoint: wsEndpoint,
			ns: self._namespace,
			event: event
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(id, ackHandler);
			self.socketIO.emit('watchRemote', request);
		} else {
			cb();
		}
	}
	
	self.unwatch = function(event, handler, ackCallback) {
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to watch remote event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
	
		var i;
		var id = $n._genID();
		var unwatchRequest = {
			id: id,
			remote: true,
			host: host,
			port: port,
			secure: secure,
			wsEndpoint: wsEndpoint,
			ns: self._namespace,
			event: event
		};
		
		if(!event) {
			self._serverWatchMap = {};
			$n.trackRequest(id, cb);
			self.socketIO.emit('unwatchRemote', unwatchRequest);
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				delete self._serverWatchMap[event];
				$n.trackRequest(id, cb);
				self.socketIO.emit('unwatchRemote', unwatchRequest);
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					return element != handler;
				});
				if(self._serverWatchMap[event].length < 1) {
					$n.trackRequest(id, cb);
					self.socketIO.emit('unwatchRemote', unwatchRequest);
				} else {
					cb();
				}
			} else {
				cb();
			}
		}
	}
	
	self._getWatcher = function(event, handler) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		if(self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				if(watchers[i] == handler) {
					return watchers[i];
				}
			}
		}
		return null;
	}
	
	self.isWatching = function(event, handler) {
		return self._getWatcher(event, handler) ? true : false;
	}
	
	self._triggerWatchers = function(event, data) {
		if(self._serverWatchMap && self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				watchers[i].call(null, data);
			}
		}
	}
}

$n.remote = function(host, port, secure, wsEndpoint) {
	if(!wsEndpoint) {
		wsEndpoint = $n._wsEndpoint;
	}
	
	secure = secure || false;
	
	var url = $n._asRemoteClientURL(host, port, secure, wsEndpoint);
	
	if(!$n._remoteClientMap.hasOwnProperty(url)) {
		$n._remoteClientMap[url] = new (function(host, port, secure, wsEndpoint) {
			var self = this;
			self._namespaces = {};
			
			self.ns = function(namespace) {
				if(!self._namespaces[namespace]) {
					self._namespaces[namespace] = new $n.RemoteNS(host, port, secure, wsEndpoint, namespace, $n.socketIO);
				}
				return self._namespaces[namespace];
			}
			
			self._mainNamespace = self.ns('__main');
			
			self.exec = function() {
				var serverInterface = arguments[0];
				var method = arguments[1];
				var id = $n._genID();
				var callback = null;
				var timeout = null;
				
				var request = {
					id: id,
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					sim: serverInterface,
					method: method
				};
				
				if(arguments[3]) {
					request.data = arguments[2];
					callback = arguments[3];
				} else if(arguments[2] !== undefined) {
					if(arguments[2] instanceof Function) {
						callback = arguments[2];
					} else {
						request.data = arguments[2];
					}
				}
				if(callback) {
					timeout = setTimeout(function() {
						if($n._callTracker[id]) {
							delete $n._callTracker[id];
						}
						if(callback) {
							callback('Remote exec call timed out', null, true);
						}
					}, $n._timeout);
				}
				
				$n._callTracker[id] = {callback: callback, timeout: timeout};
				
				$n.socketIO.emit('remoteCall', request);
			}
			
			self.watch = function() {
				self._mainNamespace.watch.apply(null, arguments);
			}
			
			self.unwatch = function() {
				self._mainNamespace.unwatch.apply(null, arguments);
			}
		})(host, port, secure, wsEndpoint);
	}
	
	return $n._remoteClientMap[url];
}
	
$n.local = new (function($n) {
	var self = this;
	self._namespaces = {};
	self._mainNamespace = null;
	
	self.ns = function(namespace) {
		if(!self._namespaces[namespace]) {
			self._namespaces[namespace] = new $n.NS(namespace, $n.socketIO);
		}
		return self._namespaces[namespace];
	}
	
	self.init = function() {
		self._mainNamespace = self.ns('__main');
	}
	
	self.exec = function() {
		var serverInterface = arguments[0];
		var method = arguments[1];
		var id = $n._genID();
		var callback = null;
		var timeout = null;
		
		var request = {
			id: id,
			sim: serverInterface,
			method: method
		};
		
		if(arguments[3]) {
			request.data = arguments[2];
			callback = arguments[3];
		} else if(arguments[2] !== undefined) {
			if(arguments[2] instanceof Function) {
				callback = arguments[2];
			} else {
				request.data = arguments[2];
			}
		}
		if(callback) {
			timeout = setTimeout(function() {
				if($n._callTracker[id]) {
					delete $n._callTracker[id];
				}
				if(callback) {
					callback('Local exec call timed out', null, true);
				}
			}, $n._timeout);
		}
		
		$n._callTracker[id] = {callback: callback, timeout: timeout};
		
		$n.socketIO.emit('localCall', request);
	}
	
	self.watch = function() {
		self._mainNamespace.watch.apply(null, arguments);
	}
	
	self.unwatch = function() {
		self._mainNamespace.unwatch.apply(null, arguments);
	}
	
	self.isWatching = function() {
		return self._mainNamespace.isWatching.apply(null, arguments);
	}
})($n);

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item, start) {
		if(!start) {
			start = 0;
		}
		var len = this.length;
		var i;
		for(i=start; i<len; i++) {
			if(this[i] === item) {
				return i;
			}
		}
		return -1;
	}
}

$n.init();