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
	_appTemplatesURL: null,
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
    
	init: function(appDefinition) {
		$n._frameworkURL = appDefinition.frameworkURL;
		$n._appURL = appDefinition.appURL;
		$n._jsLibsURL = appDefinition.jsLibsURL;
		$n._frameworkStylesURL = appDefinition.frameworkStylesURL;
		$n._scriptsRouterURL = location.href.replace(/\?.*/, '');
		$n._appScriptsURL = appDefinition.appScriptsURL;
		$n._appStylesURL = appDefinition.appStylesURL;
		$n._appTemplatesURL = appDefinition.appTemplatesURL;
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
	
	getAuthData: function() {
		return NCOMBO_SESSION_MANAGER.getAuthData.apply(NCOMBO_SESSION_MANAGER, arguments);
	},
	
	startSession: function() {
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
	
	endSession: function(callback) {
		NCOMBO_SESSION_MANAGER.endSession(callback);
	},
	
	_genID: function() {
		$n._curID++;
		$n._curID = $n._curID % $n.MAX_ID;
		return 'l' + $n._curID;
	},
	
	_globalEval: $loader.grab._globalEval,
	
	/**
		Convert a class (function) into a mixin-extendable class. This will give the class internal access to an
		initMixin(mixinClass, args) method and a callMixinMethod(mixinClass, method, args) which will allow the current
		class to manipulate base mixins.
	*/
	mixin: function(mainClass) {
		var mixinHolder = function() {
			this.__internalMixinMethods = {};
			
			this.initMixin = function(MixinClass) {
				var args = Array.prototype.slice.call(arguments, 1);
				
				if(args) {
					MixinClass.apply(this, args);
				} else {
					MixinClass.apply(this);
				}
				
				var mixedInInstance = {};
				this.__internalMixinMethods[MixinClass] = mixedInInstance;
				
				var value, index;
				for(index in this) {
					value = this[index];
					if(value instanceof Function) {
						mixedInInstance[index] = value;
					}
				}
			}
			
			this.callMixinMethod = function(MixinClass, method) {
				var args = Array.prototype.slice.call(arguments, 2);
				if(args) {
					return this.__internalMixinMethods[MixinClass][method].apply(this, args);
				} else {
					return this.__internalMixinMethods[MixinClass][method].apply(this);
				}
			}
			
			this.applyMixinMethod = function(MixinClass, method, args) {
				if(args && !(args instanceof Array)) {
					throw 'Exception: The args parameter of the callMixinMethod function must be an Array';
				}
				return this.__internalMixinMethods[MixinClass][method].apply(this, args);
			}
			
			this.instanceOf = function(classReference) {
				return this instanceof classReference || this.__internalMixinMethods.hasOwnProperty(classReference);
			}
		}
		mixinHolder.apply(mainClass.prototype);
		
		return mainClass;
	},
	
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
	
	EventEmitter: function() {
		var self = this;		
		self._eventMap = {};
		
		self.on = function() {
			var event = arguments[0];
			var handler = arguments[1];
			
			if(!self._eventMap.hasOwnProperty(event)) {
				self._eventMap[event] = [];
			}
			self._eventMap[event].push(handler);
		}
		
		self.off = function() {
			var event = arguments[0];
			var handler = arguments[1];
			
			if(self._eventMap[event]) {
				if(handler) {
					var i;
					var newArray = [];
					for(i in self._eventMap[event]) {
						if(self._eventMap[event][i] != handler) {
							newArray.push(self._eventMap[event][i]);
						}
					}
					if(newArray.length > 0) {
						self._eventMap[event] = newArray;
					} else {
						delete self._eventMap[event];
					}
				} else {
					delete self._eventMap[event];
				}
			}
		}
		
		self.once = function() {
			var event = arguments[0];
			var handler = arguments[1];
			
			var hdlr = function(data) {
				self.off(event, hdlr);
				handler(data);
			}
			
			self.on(event, hdlr);
		}
		
		self.emit = function() {
			var event = arguments[0];
			var data = arguments[1];
			
			if(self._eventMap[event]) {
				var events = self._eventMap[event].slice();
				var i;
				var len = events.length;
				for(i=0; i<len; i++) {
					events[i](data);
				}
			}
		}
		
		self.numListeners = function(event) {
			if(self._eventMap[event]) {
				var count = 0;
				var i;
				for(i in self._eventMap[event]) {
					count++;
				}
				return count;
			}
			return 0;
		}
	},
	
	/**
		This object holds error functions to handle various client-side error types that can occur within the system.
		Each function handles a specific type of error and can accept any suitable number of parameters
		in order to generate the appropriate error message.
	*/
	errors: {	
		loadTemplateError: function(message) {
			return "LoadTemplateError: Could not load one or more templates because of the following AJAX error: " + message;
		},
		
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
	
	res: {
		app: {
			_templates: {},
		
			template: function(name) {
				if(!$n.res.app.hasTemplate(name)) {
					throw 'Exception: The ' + name + ' template is not available';
				}
				return $n.res.app._templates[name].clone();
			},
		
			hasTemplate: function(name) {
				return $n.res.app._templates.hasOwnProperty(name);
			},
		
			addTemplate: function(name, template) {
				$n.res.app._templates[name] = template;
			},
		
			removeTemplate: function() {
				if($n.res.app._templates.hasOwnProperty(name)) {
					delete $n.res.app._templates[name];
				}
			}
		}
	},
	
	/**
		Grab allows you to include external scripts, CSS stylesheets and templates into your JavaScript.
		Some grab methods allow you to load resources either synchronously or asynchronously.
	*/
	grab: $loader.grab,
	
	serverInterfaceDescription: {},
	
	_callReturn: function(data) {
		var cid = data.cid;
		if($n._callTracker[cid]) {
			if($n._callTracker[cid].timeout) {
				clearTimeout($n._callTracker[cid].timeout);
			}
			if(!data.noValue && $n._callTracker[cid].callback) {
				var finish = data.close ? true : false;
				$n._callTracker[cid].callback(data.error, data.value, finish);
			}
			if(data.close) {
				delete $n._callTracker[cid];
			}
		}
	},
	
	trackRequest: function(cid, callback) {
		$n._callTracker[cid] = {callback: callback};
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
		
		var cid = $n._genID();
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
			ns: self._namespace,
			event: event,
			cid: cid
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(cid, ackHandler);
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
		var cid = $n._genID();
		var unwatchRequest = {cid: cid, requests: []};
		
		if(!event) {
			for(i in self._serverWatchMap) {
				unwatchRequest.requests.push({ns: self._namespace, event: i});
			}
			self._serverWatchMap = {};
			if(unwatchRequest.requests.length > 0) {
				$n.trackRequest(cid, cb);
				self.socketIO.emit('unwatchLocal', unwatchRequest);
			} else {
				cb();
			}
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				unwatchRequest.requests.push({ns: self._namespace, event: event});
				delete self._serverWatchMap[event];
				if(unwatchRequest.requests.length > 0) {
					$n.trackRequest(cid, cb);
					self.socketIO.emit('unwatchLocal', unwatchRequest);
				} else {
					cb();
				}
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					if(element == handler) {
						unwatchRequest.requests.push({ns: self._namespace, event: event});
						return false;
					}
					return true;
				});
				if(unwatchRequest.requests.length > 0 && self._serverWatchMap[event].length < 1) {
					$n.trackRequest(cid, cb);
					self.socketIO.emit('unwatchLocal', unwatchRequest);
				} else {
					cb();
				}
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
		
		var cid = $n._genID();
		
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
			remote: true,
			host: host,
			port: port,
			secure: secure,
			wsEndpoint: wsEndpoint,
			ns: self._namespace,
			event: event,
			cid: cid
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(cid, ackHandler);
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
		var cid = $n._genID();
		var unwatchRequest = {cid: cid, requests: []};
		
		if(!event) {
			for(i in self._serverWatchMap) {
				unwatchRequest.requests.push({
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					ns: self._namespace,
					event: i
				});
			}
			self._serverWatchMap = {};
			if(unwatchRequest.requests.length > 0) {
				$n.trackRequest(cid, cb);
				self.socketIO.emit('unwatchRemote', unwatchRequest);
			} else {
				cb()
			}
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				unwatchRequest.requests.push({
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					ns: self._namespace,
					event: event
				});
				delete self._serverWatchMap[event];
				if(unwatchRequest.requests.length > 0) {
					$n.trackRequest(cid, cb);
					self.socketIO.emit('unwatchRemote', unwatchRequest);
				} else {
					cb();
				}
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					if(element == handler) {
						unwatchRequest.requests.push({
							remote: true,
							host: host,
							port: port,
							secure: secure,
							wsEndpoint: wsEndpoint,
							ns: self._namespace,
							event: event
						});
						
						return false;
					}
					return true;
				});
				if(unwatchRequest.requests.length > 0 && self._serverWatchMap[event].length < 1) {
					$n.trackRequest(cid, cb);
					self.socketIO.emit('unwatchRemote', unwatchRequest);
				} else {
					cb();
				}
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

$n.Template = $n.mixin(function() {
	var self = this;
	self.initMixin($n.EventEmitter);
	self._renderer = null;
	self._text = null;
	self._loaded = false;
	self._name = null;
	self._extRegex = /[.][^\/\\]*$/;
	
	self.getName = function() {
		return self._name;
	}
	
	self.grab = function(name, fresh) {
		self._name = name;
		
		var tmplDirURL = $n._appTemplatesURL;
		
		if(self._extRegex.test(name)) {
			var url = tmplDirURL + name;
		} else {
			var url = tmplDirURL + name + '.html';
		}
		
		$n.grab._loadDeepResourceToCache(url, fresh, function(err, result) {
			if(err) {
				self.emit('error', self);
			} else {
				$n.grab._resourcesGrabbed.push(url);
				self._loaded = true;
				self._text = result.data;
				self._renderer = Handlebars.compile(self._text);
				
				$n.res.app.addTemplate(name, self);
				self.emit('load', self);
				
				if(!$n.grab.isGrabbing()) {
					$n.grab._triggerReady();
				}
			}
		});
	}
	
	self.make = function(name, content) {
		self._name = name;
		self._text = content;
		self._renderer = Handlebars.compile(self._text);
		self._loaded = true;
	}
	
	self.clone = function() {
		var templ = new $n.Template();
		templ.make(self._name, self._text);
		return templ;
	}
	
	self.on = function(event, listener) {
		if((event == 'load' || event == 'error') && self._loaded) {
			listener(self);
		} else {
			self.callMixinMethod($n.EventEmitter, 'on', event, listener);
		}
	}
	
	self.load = function(listener)	{
		self.on('load', listener);
	}
	
	self.error = function(listener)	{
		self.on('error', listener);
	}
	
	self.render = function(data) {
		if(!self._loaded) {
			throw 'The template has not been loaded';
		}
		return self._renderer(data);
	}
	
	self.getText = function() {
		return self._text;
	}
	
	self.getRenderer = function() {
		return self._renderer;
	}
	
	self.isLoaded = function() {
		return self._loaded;
	}
});

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
				var data = null;
				var cid = $n._genID();
				var callback = null;
				var timeout = null;
				
				if(arguments[3]) {
					data = arguments[2];
					callback = arguments[3];
				} else if(arguments[2]) {
					if(arguments[2] instanceof Function) {
						callback = arguments[2];
					} else {
						data = arguments[2];
					}
				}
				if(callback) {
					timeout = setTimeout(function() {
						if($n._callTracker[cid]) {
							delete $n._callTracker[cid];
						}
						if(callback) {
							callback('Remote exec call timed out', null, true);
						}
					}, $n._timeout);
				}
				
				$n._callTracker[cid] = {callback: callback, timeout: timeout};
				
				var request = {
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					si: serverInterface,
					method: method,
					data: data,
					cid: cid
				};
				
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
		var data = null;
		var cid = $n._genID();
		var callback = null;
		var timeout = null;
		
		if(arguments[3]) {
			data = arguments[2];
			callback = arguments[3];
		} else if(arguments[2]) {
			if(arguments[2] instanceof Function) {
				callback = arguments[2];
			} else {
				data = arguments[2];
			}
		}
		if(callback) {
			timeout = setTimeout(function() {
				if($n._callTracker[cid]) {
					delete $n._callTracker[cid];
				}
				if(callback) {
					callback('Local exec call timed out', null, true);
				}
			}, $n._timeout);
		}
		
		$n._callTracker[cid] = {callback: callback, timeout: timeout};
		
		var request = {
			si: serverInterface,
			method: method,
			data: data,
			cid: cid
		};
		
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

$n.grab.app.template = function(name, fresh) {
	if($n.res.app.hasTemplate(name)) {
		return $n.res.app.template(name);
	}
	
	var templ = new $n.Template();
	templ.grab(name, fresh);
	
	return templ;
}
