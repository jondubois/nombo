/**
	This script provides the core client-side functionality of nCombo.
*/
var $n = {
	MAX_ID: Math.pow(2, 53) - 2,
	socket: null,
	_timeout: 10000,
	_appURL: null,
	_curID: 1,
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
	_plugins: {},
	
	initIO: function() {
		$n.socket = NCOMBO_SOCKET;
		$n.local = new $n.LocalInterface($n.socket);
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
		$n._releaseMode = appDefinition.releaseMode;
		$n._timeout = appDefinition.timeout;
		
		// global variables from session.js
		$n._autoSession = NCOMBO_AUTO_SESSION;
		$n._cacheVersion = NCOMBO_CACHE_VERSION;
		
		$n.initIO();
		
		$n.ready(function() {
			if(appDefinition.angular && appDefinition.angularMainTemplate) {
				$(document.body).html($n.grab.app.template(appDefinition.angularMainTemplate).toString());
				if(appDefinition.angularMainModule) {
					angular.bootstrap(document, [appDefinition.angularMainModule]);
				} else {
					angular.bootstrap(document);
				}			
			}
		});
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
	
	_asRemoteClientURL: function(host, port, secure) {
		return (secure ? 'https://' : 'http://') + host + ":" + port;
	},
	
	_remoteClientMap: {}
};

$n.LocalInterface = function(wsSocket, namespace) {
	var self = this;
	self.namespace = namespace || '__nc';
	self.socket = wsSocket.ns(self.namespace);
	self._serverWatchMap = {};
	
	self.ns = function (namespace) {
		return new $n.LocalInterface(self.socket, namespace);
	}
	
	self.exec = function () {
		var serverInterface = arguments[0];
		var method = arguments[1];
		var callback = null;
		
		var request = {
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
		
		self.socket.emit('localCall', request, callback);
	}
	
	self.watch = function (event, handler) {
		self.socket.on(event, handler);
	}
	
	self.unwatch = function (event, handler) {
		if (event && handler) {
			self.socket.removeListener(event, handler);
		} else {
			self.socket.removeAllListeners(event);
		}
	}
	
	self.watchers = function (event) {
		self.socket.listeners(event);
	}
}

$n.RemoteNS = function(host, port, secure, namespace, wsSocket) {
	var self = this;
	self._namespace = namespace;
	self.socket = wsSocket;
	self._serverWatchMap = {};
	
	self.watch = function(event, handler, ackCallback) {
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
			ns: self._namespace,
			event: event
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(id, ackHandler);
			self.socket.emit('watchRemote', request);
		} else {
			cb();
		}
	}
	
	self.watchOnce = function(event, handler, ackCallback) {
		if(self.isWatching(event, handler)) {
			self._serverWatchMap[event] = [handler];
			ackCallback && ackCallback();
		} else {
			self.watch(event, handler, ackCallback);
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
			ns: self._namespace,
			event: event
		};
		
		if(!event) {
			self._serverWatchMap = {};
			$n.trackRequest(id, cb);
			self.socket.emit('unwatchRemote', unwatchRequest);
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				delete self._serverWatchMap[event];
				$n.trackRequest(id, cb);
				self.socket.emit('unwatchRemote', unwatchRequest);
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					return element != handler;
				});
				if(self._serverWatchMap[event].length < 1) {
					$n.trackRequest(id, cb);
					self.socket.emit('unwatchRemote', unwatchRequest);
				} else {
					cb();
				}
			} else {
				cb();
			}
		}
	}
	
	self._getWatcher = function(event, handler) {
		if(!event) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		if(self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			if(handler) {
				var len = watchers.length;
				var i;
				for(i=0; i<len; i++) {
					if(watchers[i] == handler) {
						return watchers[i];
					}
				}
			} else {
				return watchers;
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

$n.remote = function(host, port, secure) {
	secure = secure || false;
	
	var url = $n._asRemoteClientURL(host, port, secure);
	
	if(!$n._remoteClientMap.hasOwnProperty(url)) {
		$n._remoteClientMap[url] = new (function(host, port, secure) {
			var self = this;
			self._namespaces = {};
			
			self.ns = function(namespace) {
				if(!self._namespaces[namespace]) {
					self._namespaces[namespace] = new $n.RemoteNS(host, port, secure, namespace, $n.socket);
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
				
				$n.socket.emit('remoteCall', request);
			}
			
			self.watch = function() {
				self._mainNamespace.watch.apply(null, arguments);
			}
			
			self.watchOnce = function() {
				self._mainNamespace.watchOnce.apply(null, arguments);
			}
			
			self.unwatch = function() {
				self._mainNamespace.unwatch.apply(null, arguments);
			}
		})(host, port, secure);
	}
	
	return $n._remoteClientMap[url];
}

/*
	registerPlugin(name, plugin)
	Register a client-side plugin.
	
	@param {String} name The name of the plugin.
	@param {Object} plugin A plugin Object or Function to associate with the specified plugin name
*/
$n.registerPlugin = function(name, plugin) {
	if($n._plugins[name] == null) {
		$n._plugins[name] = plugin;
	} else {
		throw new Error('A plugin with the name "' + name + '" already exists.');
	}
}

/*
	plugin(name)
	Access a plugin with the specified name.
	
	@param {String} name The name of the plugin.
*/
$n.plugin = function(name) {
	if($n._plugins[name] == null) {
		throw new Error('The requested "' + name + '" plugin could not be found.');
	}
	return $n._plugins[name];
}

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

if (!Object.create) {
	Object.create = (function () {
		function F() {};

		return function (o) {
			if(arguments.length != 1) {
				throw new Error('Object.create implementation only accepts one parameter.');
			}
			F.prototype = o;
			return new F();
		}
	})();
}

$n.init();