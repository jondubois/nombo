/**
	This script provides the core client-side functionality of Nombo.
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
	
	initIO: function () {
		$n.socket = NOMBO_SOCKET;
		$n.local = new $n.LocalInterface($n.socket);
	},
    
	init: function () {
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
		
		// global variable from session.js
		$n._cacheVersion = NOMBO_CACHE_VERSION;
		
		$n.initIO();
	},
	
	getAppDefinition: $loader.getAppDefinition,
	
	session: {		
		end: function (callback) {
			NOMBO_SESSION_MANAGER.endSession(callback);
		}
	},
	
	_genID: function () {
		$n._curID++;
		$n._curID = $n._curID % $n.MAX_ID;
		return 'l' + $n._curID;
	},
	
	_globalEval: $loader.grab._globalEval,
	
	EventEmitter: $loader.EventEmitter,
	
	getBasicType: function (variable) {
		var classType = {}.toString
		var typeRegex = /[^0-9A-Za-z]*([A-Z][a-zA-Z0-9]*)/;
		var typeString = classType.call(variable);
		return typeString.match(typeRegex)[1];
	},
	
	/**
		Bind a callback function to Nombo's ready event. The specified function will be called when Nombo is ready to begin processing.
	*/
	ready: $loader.grab.ready,
	
	/**
		Bind a callback function to Nombo's fail event. The specified function will be called when Nombo fails to load a resource.
		The callback can accept a parameter which indicates the URL of the resource which failed to load.
	*/
	fail:  $loader.grab.fail,
	
	/**
		This object holds error functions to handle various client-side error types that can occur within the system.
		Each function handles a specific type of error and can accept any suitable number of parameters
		in order to generate the appropriate error message.
	*/
	errors: {
		serverInterfaceError: function (message) {
			return "ServerInterfaceError: " + message;
		},
		
		loadError: function (resourceURL) {
			return "LoadError: Failed to load resource: " + resourceURL;
		}
	},
	
	/**
		Get the URL of Nombo's root directory.
	*/
	getRootURL: function () {
		return $n._frameworkURL;
	},
	
	/**
		Navigate to another script.
	*/
	navigateToScript: function (scriptName) {
		location.href = $n._scriptsRouterURL + (scriptName ? "?" + scriptName : "");
	},
	
	caching: {
		/**
			Enable/disable default caching for server interface AJAX calls performed by Nombo.
			Server call caching is disabled by default.
		*/
		cacheServerCalls: function (bool) {
			$n._cacheSeverCalls = bool;
		}
	},
	
	/**
		Grab allows you to include external scripts, CSS stylesheets and templates into your JavaScript.
		Some grab methods allow you to load resources either synchronously or asynchronously.
	*/
	grab: $loader.grab,
	
	serverInterfaceDescription: {},
	
	_asRemoteClientURL: function (host, port, secure) {
		return (secure ? 'https://' : 'http://') + host + ":" + port;
	},
	
	_remoteClientMap: {}
};

$n.LocalInterface = function (wsSocket, namespace) {
	$n.EventEmitter.call(this);

	var self = this;
	var mainNamespace = '__';
	var simNamespace = '__nc';
	this.sock = wsSocket;
	var mainSocket = wsSocket.ns(mainNamespace);
	var simSocket = wsSocket.ns(simNamespace);
	
	self.namespace = namespace || mainNamespace;
	self.connected = wsSocket.connected;
	
	wsSocket.on('disconnect', function () {
		self.connected = false;
		self.emit('disconnect');
	});
	
	wsSocket.on('connect', function () {
		self.connected = true;
		self.emit('connect');
	});
	
	wsSocket.on('error', function (err) {
		self.emit('error', err);
	});
	
	self.ns = function (namespace) {
		return new $n.LocalInterface(wsSocket, namespace);
	};
	
	self.exec = function () {
		var serverInterface = arguments[0];
		var method = arguments[1];
		var callback = null;
		
		var request = {
			sim: serverInterface,
			method: method
		};
		
		if (arguments[3]) {
			request.data = arguments[2];
			callback = arguments[3];
		} else if (arguments[2] !== undefined) {
			if (arguments[2] instanceof Function) {
				callback = arguments[2];
			} else {
				request.data = arguments[2];
			}
		}
		
		simSocket.emit('rpc', request, callback);
	};
	
	self.watch = function (event, handler) {
		mainSocket.on(event, handler);
	};
	
	self.watchOnce = function (event, handler) {
		mainSocket.once(event, handler);
	};
	
	self.unwatch = function (event, handler) {
		if (event && handler) {
			mainSocket.removeListener(event, handler);
		} else {
			mainSocket.removeAllListeners(event);
		}
	};
	
	self.watchers = function (event) {
		mainSocket.listeners(event);
	};
};

$n.LocalInterface.prototype = Object.create($n.EventEmitter.prototype);

$n.RemoteInterface = function (url, namespace, wsSocket) {
	$n.EventEmitter.call(this);

	var self = this;
	var mainNamespace = '__';
	var simNamespace = '__nc';
	
	if (!wsSocket) {
		wsSocket = NOMBO_SOCKET_ENGINE.connect({
			url: url,
			forceJSONP: true
		});
	}
	
	self.connected = wsSocket.connected;
	
	wsSocket.on('disconnect', function () {
		self.connected = false;
		self.emit('disconnect');
	});
	
	wsSocket.on('connect', function () {
		self.connected = true;
		self.emit('connect');
	});
	
	wsSocket.on('error', function (err) {
		self.emit('error', err);
	});
	
	var mainSocket = wsSocket.ns(mainNamespace);
	var simSocket = wsSocket.ns(simNamespace);
	
	self.namespace = namespace || mainNamespace;
	
	self.ns = function (namespace) {
		return new $n.RemoteInterface(url, namespace, wsSocket);
	};
	
	self.exec = function () {
		var serverInterface = arguments[0];
		var method = arguments[1];
		var callback = null;
		
		var request = {
			sim: serverInterface,
			method: method
		};
		
		if (arguments[3]) {
			request.data = arguments[2];
			callback = arguments[3];
		} else if (arguments[2] !== undefined) {
			if (arguments[2] instanceof Function) {
				callback = arguments[2];
			} else {
				request.data = arguments[2];
			}
		}
		
		simSocket.emit('rpc', request, callback);
	};
	
	self.watch = function (event, handler) {
		mainSocket.on(event, handler);
	};
	
	self.watchOnce = function (event, handler) {
		mainSocket.once(event, handler);
	};
	
	self.unwatch = function (event, handler) {
		if (event && handler) {
			mainSocket.removeListener(event, handler);
		} else {
			mainSocket.removeAllListeners(event);
		}
	};
	
	self.watchers = function (event) {
		mainSocket.listeners(event);
	};
};

$n.RemoteInterface.prototype = Object.create($n.EventEmitter.prototype);

$n.remote = function (host, port, secure) {
	secure = secure || false;
	
	var url = $n._asRemoteClientURL(host, port, secure);
	
	if (!$n._remoteClientMap.hasOwnProperty(url)) {
		$n._remoteClientMap[url] = new $n.RemoteInterface(url);
	}
	
	return $n._remoteClientMap[url];
};

$n.destroyRemote = function (host, port, secure) {
	var url = $n._asRemoteClientURL(host, port, secure);
	delete $n._remoteClientMap[url];
};

/*
	registerPlugin(name, plugin)
	Register a client-side plugin.
	
	@param {String} name The name of the plugin.
	@param {Object} plugin A plugin Object or Function to associate with the specified plugin name
*/
$n.registerPlugin = function (name, plugin) {
	if ($n._plugins[name] == null) {
		$n._plugins[name] = plugin;
	} else {
		throw new Error('A plugin with the name "' + name + '" already exists.');
	}
};

/*
	plugin(name)
	Access a plugin with the specified name.
	
	@param {String} name The name of the plugin.
*/
$n.plugin = function (name) {
	if ($n._plugins[name] == null) {
		throw new Error('The requested "' + name + '" plugin could not be found.');
	}
	return $n._plugins[name];
};

$n.init();