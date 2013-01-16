var http = require('http'),
	https = require('https'),
	path = require('path'),
	pathManager = require('ncombo/pathmanager'),
	mime = require('mime'),
	fs = require('fs'),
	url = require('url'),
	querystring = require('querystring'),
	ndata = require('ndata'),
	io = require('socket.io'),
	nDataStore = require('socket.io-ndata'),
	nmix = require('nmix'),
	conf = require('ncombo/configmanager'),
	gateway = require('ncombo/gateway'),
	handlebars = require('./client/libs/handlebars'),
	cache = require('ncombo/cache'),
	ws = require('ncombo/webservice'),
	portScanner = require('portscanner'),
	EventEmitter = require('events').EventEmitter,
	json = require('json'),
	crypto = require('crypto'),
	stepper = require('stepper'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	browserify = require('browserify'),
	scriptManager = require('ncombo/scriptmanager'),
	cssBundler = require('ncombo/css-bundler'),
	templateBundler = require('ncombo/template-bundler'),
	SmartCacheManager = require("./smartcachemanager").SmartCacheManager,
	chokidar = require('chokidar'),
	retry = require('retry');

var _maxTimeout = 120000;
var _extendRetryOperation = function(operation) {
	if(!operation._timeouts.length) {
		operation._timeouts[0] = _maxTimeout;
	}
}

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var AbstractDataClient = function(dataClient, keyTransformFunction) {
	var self = this;
	
	self.set = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.set.apply(dataClient, arguments);
	}
	
	self.add = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.add.apply(dataClient, arguments);
	}
	
	self.get = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.get.apply(dataClient, arguments);
	}
	
	self.count = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.count.apply(dataClient, arguments);
	}
	
	self.remove = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.remove.apply(dataClient, arguments);
	}
	
	self.pop = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.pop.apply(dataClient, arguments);
	}
	
	self.hasKey = function() {
		arguments[0] = keyTransformFunction(arguments[0]);
		dataClient.hasKey.apply(dataClient, arguments);
	}
	
	self.run = function() {
		dataClient.run.apply(dataClient, arguments);
	}
}

var SessionEmitter = function(sessionID, namespace, socketManager, dataClient, retryTimeout) {
	var self = this;
	self._namespace = namespace;
	
	self.emit = function(event, data) {
		var eventObject = {
			ns: self._namespace,
			event: event,
			data: data
		}
		
		self.emitRaw(eventObject);
	}
	
	self.emitRaw = function(eventData) {
		dataClient.get('__opensessions.#(' + sessionID + ')', function(err, socks) {
			if(err) {
				console.log('   nCombo Error - Failed to get active socket list');
			} else {
				var i;
				for(i in socks) {
					socketManager.socket(i).emit('event', eventData);
				}
			}
		});
	}
}

var Session = nmix(function(sessionID, socketManager, dataClient, retryTimeout) {
	var self = this;
	self._listeners = {};
	
	self._getDataKey = function(key) {
		if(key) {
			return '__sessiondata.#(' + self.id + ').#(' + key + ')';
		} else {
			return '__sessiondata.#(' + self.id + ')';
		}
	}
	
	self._getEventKey = function(event) {
		if(event) {
			return '__sessionevent.#(' + self.id + ').#(' + event + ')';
		} else {
			return '__sessionevent.#(' + self.id + ')';
		}
	}
	
	self.initMixin(AbstractDataClient, dataClient, self._getDataKey);
	
	self.EVENT_DESTROY = 'destroy';
	
	self.id = sessionID;
	
	self._emitterNamespace = new SessionEmitter(self.id, '__main', socketManager, dataClient, retryTimeout);
	self._namespaces = {'__main': self._emitterNamespace};
	
	self.emit = function(event, data) {
		self._emitterNamespace.emit(event, data);
	}
	
	self._emit = function(event, data, callback) {
		dataClient.broadcast(self._getEventKey(event), data, callback);
	}
	
	self.setAuth = function(data, callback) {
		dataClient.set('__sessionauth.#(' + self.id + ')', data, callback);
	}

	self.getAuth = function(callback) {
		dataClient.get('__sessionauth.#(' + self.id + ')', callback);
	}

	self.clearAuth = function(callback) {
		dataClient.remove('__sessionauth.#(' + self.id + ')', callback);
	}
	
	self.on = function(event, listener, ackCallback) {
		dataClient.watch(self._getEventKey(event), listener, ackCallback);
	}
	
	self.once = function(event, listener, ackCallback) {
		dataClient.watchExclusive(self._getEventKey(event), listener, ackCallback);
	}
	
	self.removeListener = function(event, listener, ackCallback) {
		dataClient.unwatch(self._getEventKey(event), listener, ackCallback);
	}
	
	self.ns = function(namespace) {
		if(!self._namespaces[namespace]) {
			self._namespaces[namespace] = new SessionEmitter(self.id, namespace, dataClient, socketManager, retryTimeout);
		}
		return self._namespaces[namespace];
	}
	
	self._addSocket = function(socket, callback) {
		dataClient.set('__opensessions.#(' + self.id + ').#(' + socket.id + ')', 1, callback);
	}
	
	self.getSockets = function(callback) {
		dataClient.get('__opensessions.#(' + self.id + ')', function(err, data) {
			if(err) {
				callback(err);
			} else {
				var socks = [];
				var i;
				for(i in data) {
					socks.push(socketManager.socket(i));
				}
				callback(null, socks);
			}
		});
	}
	
	self.countSockets = function(callback) {
		dataClient.count('__opensessions.#(' + self.id + ')', callback);
	}
	
	self._removeSocket = function(socket, callback) {		
		var operation = retry.operation(self._retryOptions);
		operation.attempt(function() {
			dataClient.remove('__opensessions.#(' + self.id + ').#(' + socket.id + ')', function(err) {
				_extendRetryOperation(operation);
				if(operation.retry(err)) {
					return;
				}
				callback && callback();
			});
		});
	}
	
	self._destroy = function(callback) {		
		var destroySessionDataOp = retry.operation(self._retryOptions);
		destroySessionDataOp.attempt(function() {
			dataClient.remove(self._getDataKey(), function(err) {
				_extendRetryOperation(destroySessionDataOp);
				destroySessionDataOp.retry(err);
			});
		});
		
		var removeSessionOp = retry.operation(self._retryOptions);
		removeSessionOp.attempt(function() {
			dataClient.remove('__opensessions.#(' + self.id + ')', function(err) {
				_extendRetryOperation(removeSessionOp);
				removeSessionOp.retry(err);
			});
		});
		
		var clearAuthOp = retry.operation(self._retryOptions);
		clearAuthOp.attempt(function() {
			self.clearAuth(function(err) {
				_extendRetryOperation(clearAuthOp);
				clearAuthOp.retry(err);
			});
		});
		
		var emitSessionDestroyOp = retry.operation(self._retryOptions);
		emitSessionDestroyOp.attempt(function() {
			self._emit(self.EVENT_DESTROY, null, function(err) {
				_extendRetryOperation(emitSessionDestroyOp);
				if(emitSessionDestroyOp.retry(err)) {
					return;
				}
				self.removeListener(self.EVENT_DESTROY, null, callback);
			});
		});
	}
});

var GlobalEmitter = function(namespace, socketManager, dataClient) {
	var self = this;
	self._namespace = namespace;
	
	self._getSessionEventKey = function(sessionID, key) {
		if(key) {
			return '__sessionevent.#(' + sessionID + ').#(' + key + ')';
		} else {
			return '__sessionevent.#(' + sessionID + ')';
		}
	}
	
	self.broadcast = function(event, data) {
		if(!self._namespace || !event) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		dataClient.get('__opensessions', function(err, sessions) {
			if(err) {
				console.log('   nCombo Error - Failed to get active session list');
			} else {
				var i;
				for(i in sessions) {
					dataClient.broadcast(self._getSessionEventKey(i, self._namespace + '.' + event), data);
				}
			}
		});
	}
	
	self.emit = function(sessionID, event, data) {
		dataClient.get('__opensessions.#(' + sessionID + ')', function(err, socks) {
			if(err) {
				console.log('   nCombo Error - Failed to get active socket list');
			} else {
				dataClient.broadcast(self._getSessionEventKey(sessionID, self._namespace + '.' + event), data);
			}
		});
	}
}

var Global = nmix(function(socketManager, dataClient, frameworkDirPath, appDirPath) {
	var self = this;
	
	self._getDataKey = function(key) {
		return '__globaldata.#(' + key + ')';
	}
	
	self.initMixin(AbstractDataClient, dataClient, self._getDataKey);
	
	var _frameworkDirPath = frameworkDirPath;
	var _appDirPath = appDirPath;
	
	self.dataClient = dataClient;
	
	self._emitterNamespace = new GlobalEmitter('__main', socketManager, dataClient);
	self._namespaces = {'__main': self._emitterNamespace};
	
	self.getFrameworkPath = function() {
		return _frameworkDirPath;
	}
	
	self.getAppPath = function() {
		return _appDirPath;
	}
	
	self.emit = function(sessionID, event, data) {
		self._emitterNamespace.emit(sessionID, event, data);
	}
	
	self.broadcast = function(event, data) {
		self._emitterNamespace.broadcast(event, data);
	}
	
	self.dispatch = function(event, data) {
		dataClient.broadcast(event, data);
	}
	
	self.on = function(event, listener, ackCallback) {
		dataClient.watch(event, listener, ackCallback);
	}
	
	self.once = function(event, listener, ackCallback) {
		dataClient.watchExclusive(event, listener, ackCallback);
	}
	
	self.removeListener = function(event, listener, ackCallback) {
		dataClient.unwatch(event, listener, ackCallback);
	}
	
	self.ns = function(namespace) {
		if(!self._namespaces[namespace]) {
			self._namespaces[namespace] = new GlobalEmitter(namespace, socketManager, dataClient);
		}
		return self._namespaces[namespace];
	}
});

var IORequest = function(req, socket, session, global, remoteAddress, secure) {
	var self = this;
	var i;
	for(i in req) {
		self[i] = req[i];
	}
	self.session = session;
	self.global = global;
	self.remote = self.remote || false;
	self.xdomain = socket.handshake.xdomain;
	self.remoteAddress = remoteAddress;
	self.secure = secure;
	self.socket = socket;
}

var IOResponse = function(req, socket, session, global, remoteAddress, secure) {
	var self = this;
	var i;
	for(i in req) {
		self[i] = req[i];
	}
	self.socket = socket;
	self.open = true;
	
	self._emitReturn = function(data) {
		if(self.open) {
			self.socket.emit('return', data);
		} else {
			throw new Error("Exception: IO response has already been closed");
		}
		if(data.close) {
			self.open = false;
		}
	}
	
	self.write = function(data) {
		self._emitReturn({id: self.id, value: data});
	}
	
	self.end = function(data) {
		self._emitReturn({id: self.id, value: data, close: 1});
	}
	
	self.warn = function(data) {
		var err;
		if(data instanceof Error) {
			err = {name: data.name, message: data.message, stack: data.stack};			
		} else {
			err = data;
		}
		self._emitReturn({id: self.id, error: err});
	}
	
	self.error = function(data) {
		var err;
		if(data instanceof Error) {
			err = {name: data.name, message: data.message, stack: data.stack};			
		} else {
			err = data;
		}
		self._emitReturn({id: self.id, error: err, close: 1});
	}
	
	self.kill = function() {
		self._emitReturn({id: self.id, close: 1, noValue: 1});
	}
}

var nCombo = function() {
	var self = this;
	
	// low level middleware
	self.MIDDLEWARE_HTTP = 'http';
	self.MIDDLEWARE_SOCKET_IO = 'socketIO';
	self.MIDDLEWARE_SOCKET_IO_AUTH = 'socketIOAuth';
	
	// core middleware
	self.MIDDLEWARE_GET = 'get';
	self.MIDDLEWARE_POST = 'post';
	
	self.MIDDLEWARE_LOCAL_EXEC = 'localCall';
	self.MIDDLEWARE_REMOTE_EXEC = 'remoteCall';
	self.MIDDLEWARE_LOCAL_WATCH = 'localWatch';
	self.MIDDLEWARE_REMOTE_WATCH = 'remoteWatch';
	self.MIDDLEWARE_LOCAL_UNWATCH = 'localUnwatch';
	self.MIDDLEWARE_REMOTE_UNWATCH = 'remoteUnwatch';
	
	self.MIDDLEWARE_SESSION_DESTROY = 'sessionDestroy';
	
	self.EVENT_WORKER_START = 'workerstart';
	self.EVENT_LEADER_START = 'leaderstart';
	self.EVENT_SOCKET_CONNECT = 'socketconnect';
	self.EVENT_SOCKET_DISCONNECT = 'socketdisconnect';
	self.EVENT_SOCKET_FAIL = 'socketfail';
	self.EVENT_FAIL = 'fail';
	
	self._cacheVersion = 0;
	self._smartCacheManager = null;
	
	self.isLeader = false;
	self.workerIndex = -1;
	
	self._options = {
		port: 8000,
		release: false,
		title: 'nCombo App',
		protocol: 'http',
		protocolOptions: {},
		transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'],
		logLevel: 1,
		workers: numCPUs,
		timeout: 10000,
		sessionTimeout: [60000, 60000],
		cacheLife: 2592000000,
		cacheType: 'private',
		cacheVersion: null,
		origins: '*:*',
		autoMinify: true,
		autoSession: true,
		matchOriginProtocol: true,
		maxConnectionsPerAddress: 0,
		pollingDuration: 30000,
		heartbeatInterval: 25000
	}
	
	self._retryOptions = {
		retries: 10,
		factor: 2,
		minTimeout: 1000,
		maxTimeout: _maxTimeout,
		randomize: false
	};
	
	self._connectedAddresses = {};
	
	self._frameworkURL = '/~framework/';
	self._frameworkURLRegex = new RegExp('^' + self._frameworkURL);
	
	self._frameworkDirPath = __dirname;
	self._frameworkClientDirPath = self._frameworkDirPath + '/client';
	self._frameworkClientURL = self._frameworkURL + 'client/';
	
	self._frameworkModulesURL = self._frameworkURL + 'node_modules/';
	
	self._appDirPath = path.dirname(require.main.filename);
	pathManager.init(self._frameworkURL, self._frameworkDirPath, self._appDirPath);
	
	self._appURL = '/';
	
	self._retryTimeout = 10000;
	
	self._dataServer = null;
	self.global = null;
	
	self._config = conf.parseConfig(__dirname + '/config.node.json');
	
	self._prerouter = require('ncombo/router/prerouter.node.js');
	self._cacheResponder = require('ncombo/router/cacheresponder.node.js');
	self._router = require('ncombo/router/router.node.js');
	self._preprocessor = require('ncombo/router/preprocessor.node.js');
	self._compressor = require('ncombo/router/compressor.node.js');
	self._responder = require('ncombo/router/responder.node.js');
	
	self._fileUploader = require('ncombo/fileuploader');
	
	self._rootTemplateURL = self._frameworkClientURL + 'index.html';
	self._rootTemplateBody = fs.readFileSync(self._frameworkClientDirPath + '/index.html', 'utf8');
	self._rootTemplate = handlebars.compile(self._rootTemplateBody);
	
	self._clientScriptMap = {};
	self._clientScripts = [];
	self._clientStyles = [];
	self._clientTemplates = [];
	self._extRegex = /[.][^\/\\]*$/;
	
	self._wsEndpoint = self._config.webServiceEndpoint;
	
	self._defaultScriptType = 'text/javascript';
	self._defaultStyleType = 'text/css';
	self._defaultStyleRel = 'stylesheet';
	
	self._server = null;
	self._io = null;
	self._prepareCallbacks = [];
	
	self._failedWorkerCleanups = {};
	self._minifiedScripts = null;
	self._bundles = null;
	self._bundledResources = [];
	
	self._spinJSURL = self._frameworkClientURL + 'libs/spin.js';
	
	var colorCodes = {
		red: 31,
		green: 32,
		yellow: 33
	}
	
	self.colorText = function(message, color) {
		if(colorCodes[color]) {
			return '\033[0;' + colorCodes[color] + 'm' + message + '\033[0m';
		} else if(color) {
			return '\033[' + color + 'm' + message + '\033[0m';
		}
		return message;
	}
	
	self._successText = self.colorText('[Success]', 'green');
	self._errorText = self.colorText('[Error]', 'red');
	self._warningText = self.colorText('[Warning]', 'yellow');
	
	self._faviconHandler = function(req, res, next) {
		var iconPath = self._appDirPath + '/assets/favicon.gif';
		
		if(req.url == '/favicon.ico') {
			fs.readFile(iconPath, function(err, data) {
				if(err) {
					if(err.code == 'ENOENT') {
						iconPath = self._frameworkClientDirPath + '/assets/favicon.gif';
						fs.readFile(iconPath, function(err, data) {
							if(err) {
								if(err.code == 'ENOENT') {
									res.writeHead(404);
									res.end();
								} else {
									res.writeHead(500);
									res.end();
								}
							} else {
								self._setFileResponseHeaders(res, iconPath);
								res.writeHead(200);
								res.end(data);
							}
						});
					} else {
						res.writeHead(500);
						res.end();
					}
				} else {
					self._setFileResponseHeaders(res, iconPath);
					res.writeHead(200);
					res.end(data);
				}
			});
		} else {
			next();
		}
	}
	
	self._getParamsHandler = function(req, res, next) {
		var urlParts = url.parse(req.url);
		var query = urlParts.query;
		req.url = urlParts.pathname;
		req.params = querystring.parse(query);
		next();
	}
	
	self._parseSID = function(cookieString) {
		if(cookieString) {
			var result = cookieString.match(/(__ncssid=)([^;]*)/);
			if(result) {
				return result[2]
			}
		}
		return null;
	}
	
	self._parseSocketID = function(cookieString) {
		if(cookieString) {
			var result = cookieString.match(/(__ncsoid=)([^;]*)/);
			if(result) {
				return result[2]
			}
		}
		return null;
	}
	
	self._redirect = function(req, res, url) {
		res.writeHead(301, {'Location': self._options.protocol + '://' + req.headers.host + url});
		res.end();
	}
	
	self._getAppDef = function() {
		var appDef = {};
		appDef.frameworkURL = self._frameworkURL;
		appDef.appURL = self._appURL;
		appDef.virtualURL = '/~virtual/';
		appDef.appStyleBundleURL = appDef.virtualURL + 'styles.css';
		appDef.appTemplateBundleURL = appDef.virtualURL + 'templates.js';
		appDef.appLibBundleURL = appDef.virtualURL + 'libs.js';
		appDef.appScriptBundleURL = appDef.virtualURL + 'scripts.js';
		appDef.frameworkClientURL = self._frameworkClientURL;
		appDef.frameworkLibsURL = self._frameworkClientURL + 'libs/';
		appDef.frameworkAssetsURL = self._frameworkClientURL + 'assets/';
		appDef.pluginsURL = self._frameworkClientURL + 'plugins/';
		appDef.frameworkScriptsURL = self._frameworkClientURL + 'scripts/';
		appDef.loadScriptURL = appDef.frameworkScriptsURL + 'load.js';
		appDef.frameworkStylesURL = self._frameworkClientURL + 'styles/';
		appDef.appScriptsURL = self._appURL + 'scripts/';
		appDef.appLibsURL = self._appURL + 'libs/';
		appDef.appStylesURL = self._appURL + 'styles/';
		appDef.appTemplatesURL = self._appURL + 'templates/';
		appDef.appAssetsURL = self._appURL + 'assets/';
		appDef.appFilesURL = self._appURL + 'files/';
		appDef.wsEndpoint = self._wsEndpoint;
		appDef.releaseMode = self._options.release;
		appDef.timeout = self._options.timeout;
		
		return appDef;
	}
	
	self._fullAuthResources = {};
	
	self.allowFullAuthResource = function(url) {
		self._fullAuthResources[url] = true;
	}
	
	self.denyFullAuthResource = function(url) {
		if(self._fullAuthResources.hasOwnProperty(url)) {
			delete self._fullAuthResources[url];
		}
	}
	
	self.isFullAuthResource = function(url) {
		return self._fullAuthResources.hasOwnProperty(url);
	}
	
	self._writeSessionStartScreen = function(req, res) {
		var filePath = '/~sessionstart';
		var encoding = self._getReqEncoding(req);
		var cacheKey = encoding + ':' + req.url;
		
		res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST');
		res.setHeader('Access-Control-Allow-Origin', '*');
		
		if(self._options.release && cache.has(cacheKey)) {
			self._respond(req, res, cache.get(cacheKey), 'text/html', true);
		} else {
			var includeString = self._getScriptTag(self._frameworkURL + 'smartcachemanager.js', 'text/javascript') + "\n\t";
			includeString += self._getScriptTag('/~timecache', 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._spinJSURL, 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._frameworkModulesURL + 'socket.io-client/dist/socket.io.min.js', 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._frameworkURL + 'session.js', 'text/javascript');
			
			var html = self._rootTemplate({title: self._options.title, includes: new handlebars.SafeString(includeString)});
			self._respond(req, res, html, 'text/html', true);
		}
	}
	
	self._getReqEncoding = function(req) {
		var acceptEncoding = req.headers['accept-encoding'] || '';
		
		var encoding;
		if(acceptEncoding.match(/\bgzip\b/)) {
			encoding = 'gzip';
		} else if (acceptEncoding.match(/\bdeflate\b/)) {
			encoding = 'deflate';
		} else {
			encoding = '';
		}
		return encoding;
	}
	
	self._sessionHandler = function(req, res, next) {
		req.global = self.global;
		
		if(req.url == '/~timecache') {
			var now = (new Date()).getTime();
			var expiry = new Date(now + self._options.cacheLife);
			res.setHeader('Content-Type', 'text/javascript');
			res.setHeader('Set-Cookie', '__nccached=0;');
			res.setHeader('Cache-Control', 'private');
			res.setHeader('Pragma', 'private');
			res.setHeader('Expires', expiry.toUTCString());
			res.writeHead(200);
			var script = '/* Check if cached */';
			res.end(script);
		} else {
			var sid = self._parseSID(req.headers.cookie);
			var url;
			
			if(req.url == '/') {
				url = self._rootTemplateURL;
			} else {
				url = req.url;
			}
			
			var filePath = pathManager.urlToPath(url);
			
			if(url == self._rootTemplateURL) {
				self._writeSessionStartScreen(req, res);
			} else {
				var encoding = self._getReqEncoding(req);
				var cacheKey = encoding + ':' + url;
				
				var skipCache = (url == self._frameworkURL + 'smartcachemanager.js');
				
				if(skipCache || url == self._frameworkURL + 'node_modules/socket.io-client/dist/socket.io.min.js' || url == self._frameworkURL + 'session.js'
						|| self.isFullAuthResource(url)) {
					
					if(self._options.release && cache.has(cacheKey)) {
						self._respond(req, res, cache.get(cacheKey), null, skipCache);
					} else {
						fs.readFile(filePath, function(err, data) {
							if(err) {
								res.writeHead(500);
								res.end('Failed to start session');
							} else {						
								if(url == self._frameworkURL + 'smartcachemanager.js') {
									var template = handlebars.compile(data.toString());
									data = template({cacheVersion: '*/ = ' + self._cacheVersion + ' /*'});
								} else if(url == self._frameworkURL + 'session.js') {
									var appDef = self._getAppDef();
									var template = handlebars.compile(data.toString());
									data = template({
											endpoint: self._wsEndpoint, 
											port: self._options.port,
											frameworkURL: self._frameworkURL,
											frameworkClientURL: self._frameworkClientURL, 
											autoSession: self._options.autoSession ? 1 : 0,
											timeout: self._options.timeout,
											appDef: JSON.stringify(appDef),
											resources: JSON.stringify(self._bundledResources),
											debug: self._options.release ? 'false' : 'true'
											});
								}
								self._respond(req, res, data, null, skipCache);
							}
						});
					}
				} else {
					if(sid) {
						req.session = new Session(sid, self._wsSocks, self._dataClient, self._retryTimeout);
						next();
					} else if(self._options.autoSession) {
						res.writeHead(500);
						res.end('File cannot be accessed outside of a session');
					} else {
						next();
					}
				}
			}
		}
	}
	
	self._prepareHTTPHandler = function(req, res, next) {
		res.connection.setNoDelay(true);
		next();
	}
	
	self._middleware = {};
	
	self._middleware[self.MIDDLEWARE_HTTP] = stepper.create();
	self._middleware[self.MIDDLEWARE_HTTP].addFunction(self._prepareHTTPHandler);
	
	self._middleware[self.MIDDLEWARE_SOCKET_IO] = stepper.create();
	self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH] = stepper.create(null, true);
	
	self._responseNotSentValidator = function(req, res) {
		return req && res && !res.finished;
	}
	
	self._tailGetStepper = stepper.create();
	self._tailGetStepper.addFunction(self._prerouter.run);
	self._tailGetStepper.addFunction(self._cacheResponder.run);
	self._tailGetStepper.addFunction(self._router.run);
	self._tailGetStepper.addFunction(self._preprocessor.run);
	self._tailGetStepper.addFunction(self._compressor.run);
	self._tailGetStepper.setTail(self._responder.run);
	
	self._respond = function(req, res, data, mimeType, skipCache) {
		if(!req.hasOwnProperty('rout')) {
			req.rout = {};
		}
		
		if(typeof data == 'string') {
			req.rout.buffer = new Buffer(data);
		} else {
			req.rout.buffer = data;
		}
		
		if(mimeType) {
			req.rout.mimeType = mimeType;
		}
		
		if(skipCache) {
			req.rout.skipCache = 1;
		}
		
		self._tailGetStepper.run(req, res);
	}
	
	self.cacheEscapeHandler = function(req, res, next) {
		if(req.params.ck && /^\/app\/scripts\//.test(req.url)) {
			delete req.params.ck;
		}
		next();
	}
	
	self._httpMethodJunction = function(req, res) {
		if(req.method == 'POST') {
			self._middleware[self.MIDDLEWARE_POST].run(req, res)
		} else {
			self._middleware[self.MIDDLEWARE_GET].run(req, res)
		}
	}
	
	self._tailGetStepper.setValidator(self._responseNotSentValidator);
	
	self._middleware[self.MIDDLEWARE_GET] = stepper.create();
	self._middleware[self.MIDDLEWARE_GET].addFunction(self.cacheEscapeHandler);
	self._middleware[self.MIDDLEWARE_GET].setTail(self._tailGetStepper);
	self._middleware[self.MIDDLEWARE_GET].setValidator(self._responseNotSentValidator);
	
	self._routStepper = stepper.create();
	self._routStepper.addFunction(self._faviconHandler);
	self._routStepper.addFunction(self._getParamsHandler);
	self._routStepper.addFunction(self._sessionHandler);
	self._routStepper.setTail(self._httpMethodJunction);
	
	self._middleware[self.MIDDLEWARE_POST] = stepper.create();
	self._middleware[self.MIDDLEWARE_POST].setTail(self._fileUploader.upload);
	
	self._middleware[self.MIDDLEWARE_HTTP].setTail(self._routStepper);
	
	self._middleware[self.MIDDLEWARE_LOCAL_EXEC] = stepper.create();
	self._middleware[self.MIDDLEWARE_LOCAL_EXEC].setTail(gateway.exec);
	
	self._middleware[self.MIDDLEWARE_LOCAL_WATCH] = stepper.create();
	self._middleware[self.MIDDLEWARE_LOCAL_WATCH].setTail(gateway.watch);
	
	self._middleware[self.MIDDLEWARE_LOCAL_UNWATCH] = stepper.create();
	self._middleware[self.MIDDLEWARE_LOCAL_UNWATCH].setTail(gateway.unwatch);
	
	self._middleware[self.MIDDLEWARE_REMOTE_EXEC] = stepper.create();
	self._middleware[self.MIDDLEWARE_REMOTE_EXEC].setTail(ws.exec);
	
	self._middleware[self.MIDDLEWARE_REMOTE_WATCH] = stepper.create();
	self._middleware[self.MIDDLEWARE_REMOTE_WATCH].setTail(ws.watch);
	
	self._middleware[self.MIDDLEWARE_REMOTE_UNWATCH] = stepper.create();
	self._middleware[self.MIDDLEWARE_REMOTE_UNWATCH].setTail(ws.unwatch);
	
	self._middleware[self.MIDDLEWARE_SESSION_DESTROY] = stepper.create();
	
	self._clientIncludes = self._config.clientIncludes;
	
	mime.define({
		'text/css': ['less'],
		'text/html': ['handlebars']
	});
	
	self._privateExtensions = self._config.privateExtensions;
	if(self._privateExtensions) {
		self._privateExtensionRegex = new RegExp('[.](' + self._privateExtensions.join('|').replace(/[.]/g, '[.]') + ')$');
	} else {
		self._privateExtensionRegex = /$a/;
	}
	self._config.privateExtensionRegex = self._privateExtensionRegex;
	
	self._customSIMExtension =  self._config.customSIMExtension;
	
	self._wsSocks = null;
		
	self._normalizeURL = function(url) {
		url = path.normalize(url);
		return url.replace(/\\/g, '/');
	}
	
	self.useScript = function(url, type) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};
		if(!self._clientScriptMap[normalURL]) {
			if(self._extRegex.test(url)) {
				obj['url'] = normalURL;
				obj['path'] = filePath;
			} else {
				obj['url'] = url + '.js';
				obj['path'] = filePath + '.js';
			}
			if(type) {
				obj['type'] = type;
			}
			self._clientScripts.push(obj);
			self._clientScriptMap[normalURL] = true;
		}
	}
	
	self.useStyle = function(url, type, rel) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};
		if(self._extRegex.test(normalURL)) {
			obj['url'] = normalURL;
			obj['path'] = filePath;
		} else {
			obj['url'] = url + '.css';
			obj['path'] = filePath + '.css';
		}
		
		if(type) {
			obj['type'] = type;
		}
		if(rel) {
			obj['rel'] = rel;
		}
		self._clientStyles.push(obj);
	}
	
	self.useTemplate = function(url) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};
		if(self._extRegex.test(normalURL)) {
			obj['url'] = normalURL;
			obj['path'] = filePath;
		} else {
			obj['url'] = url + '.html';
			obj['path'] = filePath + '.html';
		}
		
		self._clientTemplates.push(obj);
	}
	
	self.bundle = {};	
	self.bundle.app = {};
	self.bundle.framework = {};
	
	self.bundle.script = self.useScript;
	self.bundle.style = self.useStyle;
	self.bundle.template = self.useTemplate;
	
	self.bundle.app.lib = function(name) {
		self.useScript(self._appURL + 'libs/' + name);
	}
	
	self.bundle.app.template = function(name) {
		self.useTemplate(self._appURL + 'templates/' + name);
	}
	
	self.bundle.app.style = function(name) {
		self.useStyle(self._appURL + 'styles/' + name);
	}
	
	self.bundle.app.asset = function(name) {
		self._bundledResources.push(self._appURL + 'assets/' + name);
	}
	
	self.bundle.framework.lib = function(name) {
		self.useScript(self._frameworkClientURL + 'libs/' + name);
	}
	
	self.bundle.framework.script = function(name) {
		self.useScript(self._frameworkClientURL + 'scripts/' + name);
	}
	
	self.bundle.framework.plugin = function(name) {
		self.useScript(self._frameworkClientURL + 'plugins/' + name);
	}
	
	self.bundle.framework.style = function(name) {
		self.useStyle(self._frameworkClientURL + 'styles/' + name);
	}
	
	self.bundle.framework.asset = function(name) {
		self._bundledResources.push(self._frameworkClientURL + 'assets/' + name);
	}
	
	self.useScript(self._frameworkClientURL + 'libs/jquery.js');
	self.useScript(self._frameworkClientURL + 'libs/handlebars.js');
	self.useScript(self._frameworkClientURL + 'libs/json2.js');
	
	self.useScript(self._frameworkURL + 'ncombo-client.js');
	self.useScript(self._frameworkURL + 'init.js');
	
	var i, nurl;
	for(i in self._clientIncludes) {
		nurl = path.normalize(self._frameworkURL + self._clientIncludes[i]);
		self.useScript(nurl);
	}
	
	self._setFileResponseHeaders = function(res, filePath, mimeType, forceRefresh) {	
		if(!mimeType) {
			mimeType = mime.lookup(filePath);
		}
		
		if(self._options.release && !forceRefresh) {
			var now = new Date();
			var expiry = new Date(now.getTime() + self._options.cacheLife);
			
			res.setHeader('Cache-Control', self._options.cacheType);
			res.setHeader('Pragma', self._options.cacheType);
			res.setHeader('Expires', expiry.toUTCString());
		} else {
			res.setHeader('Cache-Control', 'no-cache');
			res.setHeader('Pragma', 'no-cache');
		}
		
		res.setHeader('Content-Type', mimeType);
	}
	
	self._getScriptCodeTag = function(code, type) {
		if(!type) {
			type = self._defaultScriptType;
		}
		return '<script type="' + type + '">' + code + '</script>';
	}
	
	self._getScriptTag = function(url, type) {
		url = self._normalizeURL(url);
		if(self._options.release) {
			url = self._smartCacheManager.setURLCacheVersion(url);
		}
		return '<script type="' + type + '" src="' + url + '"></script>';
	}
	
	self._getStyleTag = function(url, type) {
		url = self._normalizeURL(url);
		var rel = scriptDefObject.rel;
		if(!rel) {
			rel = self._defaultStyleRel;
		}
		return '<link rel="' + rel + '" type="' + type + '" href="' + url + '" />';
	}
	
	self._cleanupWorker = function(pid) {
		var getWorkerDataOp = retry.operation(self._retryOptions);
		getWorkerDataOp.attempt(function() {
			self._dataClient.get('__workers.#(' + pid + ')', function(err, data) {
				_extendRetryOperation(getWorkerDataOp);
				if(getWorkerDataOp.retry(err)) {
					return;
				}
				
				if(data) {
					var i;
					for(i in data.sockets) {
						(function(sockID) {
							var removeOpenSocketOp = retry.operation(self._retryOptions);
							removeOpenSocketOp.attempt(function() {
								self._dataClient.remove('__opensockets.#(' + sockID + ')', function(err) {
									_extendRetryOperation(removeOpenSocketOp);
									removeOpenSocketOp.retry(err);
								});
							});
						})(i);
					}
					
					for(i in data.sessions) {
						(function(sid) {
							var removeOpenSessionOp = retry.operation(self._retryOptions);
							removeOpenSessionOp.attempt(function() {
								self._dataClient.remove('__opensessions.#(' + sid + ')', function(err) {
									_extendRetryOperation(removeOpenSessionOp);
									removeOpenSessionOp.retry(err);
								});
							});
						})(i);
					}
				}
				
				var removeWorkerSocketsOp = retry.operation(self._retryOptions);
				removeWorkerSocketsOp.attempt(function() {
					self._dataClient.remove('__workers.#(' + pid + ')', function(err) {
						_extendRetryOperation(removeWorkerSocketsOp);
						removeWorkerSocketsOp.retry(err);
					});
				});
			});
		});
	}
	
	self._validateOptions = function(options, validationMap) {
		var i, err;
		for(i in options) {
			if(validationMap.hasOwnProperty(i) && options.hasOwnProperty(i)) {
				err = validationMap[i](options[i]);
				if(err) {
					throw new Error("The specified '" + i + "' option value is invalid " + err);
				}
			}
		}
	}
	
	self.start = function(options) {
		var dataPort, dataKey;
		var shasum = crypto.createHash('sha256');
		
		var isInt = function(input) {
			return /^[0-9]+$/.test(input);
		}
		
		var optionValidationMap = {
			port: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			title: function() {
				return (typeof arguments[0] == 'string') ? null : 'expecting a string';
			},
			protocol: function() {
				return (arguments[0] == 'http' || arguments[0] == 'https') ? null : "must be either 'http' or 'https'";
			},
			transports: function() {
				return arguments[0] instanceof Array ? null : 'expecting an array';
			},
			logLevel: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			workers: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			timeout: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			sessionTimeout: function() {
				if(isInt(arguments[0]) || (arguments[0] instanceof Array && arguments[0].length == 2 && isInt(arguments[0][0]) && isInt(arguments[0][1]))) {
					return null;
				}
				return 'expecting an integer or an array of integers in the form [timeoutMilliseconds, addMaxRandomness]';
			},
			cacheLife: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			cacheType: function() {
				return (arguments[0] == 'private' || arguments[0] == 'public') ? null : "must be either 'private' or 'public'";
			},
			cacheVersion: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			origins: function() {
				return (typeof arguments[0] == 'string') ? null : 'expecting a string';
			},
			maxConnectionsPerAddress: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			pollingDuration: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			heartbeatInterval: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			}
		}
		
		self._validateOptions(options, optionValidationMap);
		
		if(options) {
			var i;
			for(i in options) {
				self._options[i] = options[i];
			}
		}
		
		self._options.appDirPath = self._appDirPath;
		var appDef = self._getAppDef();
		self._options.minifyURLs = [appDef.appScriptsURL, appDef.appLibsURL, appDef.frameworkClientURL + 'scripts/load.js', self._frameworkURL + 'ncombo-client.js', 
				self._frameworkURL + 'loader.js'];
		
		self.allowFullAuthResource(self._spinJSURL);
		self.allowFullAuthResource(self._frameworkClientURL + 'assets/logo.png');
		self.allowFullAuthResource(self._frameworkClientURL + 'scripts/failedconnection.js');
		self.allowFullAuthResource(self._frameworkClientURL + 'styles/ncombo.css');
		self.allowFullAuthResource(self._frameworkURL + 'loader.js');
		
		var begin = function() {
			self._options.cacheVersion = self._cacheVersion;
			self._prerouter.init(self._options);
			if(self._options.release) {
				self._cacheResponder.cacheMap(self._minifiedScripts);
			}
			
			self._cacheResponder.cacheMap(self._bundles, true);
			
			self._router.init(self._privateExtensionRegex);
			self._preprocessor.init(self._options);
			
			self._dataClient = ndata.createClient(dataPort, dataKey);
			var nStore = new nDataStore({client: self._dataClient, useExistingServer: true});
			
			self._dataClient.on('ready', function() {
				self._server.listen(self._options.port);
				self._io = io.listen(self._server, {'log level': 1});
				
				var handleHandshake = function(handshakeData, callback) {
					if(handshakeData.query.data) {
						handshakeData.data = json.parse(handshakeData.query.data);
					} else {
						handshakeData.data = {};
					}
					
					if(handshakeData.query.sskey) {
						handshakeData.sskey = handshakeData.query.sskey;
					}
					
					handshakeData.getAuth = function() {
						return handshakeData.auth;
					}
					handshakeData.setAuth = function(value) {
						handshakeData.auth = value;
					}
					
					var authCallback = function() {
						if(arguments[0] == handshakeData) {
							return true;
						}
						if(!arguments[1]) {
							callback(arguments[0], false);
							return false;
						}
						return true;
					}
					
					self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH].setValidator(authCallback);
					self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH].setTail(function() {
						callback(null, true);
					});
					
					var ssid = self._parseSID(handshakeData.headers.cookie);
					if(ssid) {
						var session = new Session(ssid, self._wsSocks, self._dataClient, self._retryTimeout);
						session.getAuth(function(err, data) {
							if(err) {
								callback('Failed to retrieve auth data', false);
							} else {
								handshakeData.setAuth(data);
								
								self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH].run(handshakeData);
							}
						});
					} else {
						self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH].run(handshakeData);
					}
				}
				
				self._io.set('store', nStore);
				self._io.set('log level', self._options.logLevel);
				self._io.set('transports', self._options.transports);
				self._io.set('origins', self._options.origins);
				self._io.set('polling duration', Math.round(self._options.pollingDuration / 1000));
				self._io.set('heartbeat interval', Math.round(self._options.heartbeatInterval / 1000));
				self._io.set('heartbeat timeout', Math.round(self._options.heartbeatInterval / 500) + 10);
				self._io.set('match origin protocol', self._options.matchOriginProtocol);
				
				if(self._options.maxConnectionsPerAddress > 0) {
					var remoteAddr;
					self._io.set('authorization', function(handshakeData, callback) {
						remoteAddr = handshakeData.address.address;
						self._dataClient.get('__connectedaddresses', function(err, addressCountMap) {
							if(!addressCountMap || !addressCountMap.hasOwnProperty(remoteAddr) || addressCountMap[remoteAddr] < self._options.maxConnectionsPerAddress) {
								handleHandshake(handshakeData, callback);
							} else {
								callback("reached connection limit for the address '" + remoteAddr + "'", false);
							}
						});
					});
				} else {
					self._io.set('authorization', function(handshakeData, callback) {
						handleHandshake(handshakeData, callback);
					});
				}
				
				self._wsSocks = self._io.of(self._wsEndpoint);
				self.global = new Global(self._wsSocks, self._dataClient, pathManager.getFrameworkPath(), pathManager.getAppPath());
			
				gateway.setReleaseMode(self._options.release);
				ws.setReleaseMode(self._options.release);
				ws.setTimeout(self._options.timeout);
				
				self._wsSocks.on('connection', function(socket) {
					self.emit(self.EVENT_SOCKET_CONNECT, socket);
				
					var remoteAddress = socket.handshake.address;
					var auth = socket.handshake.auth;
					var sid;
					
					if(socket.handshake.sskey) {
						sid = remoteAddress.address + '-' + socket.handshake.sskey;
					} else {
						sid = self._parseSID(socket.handshake.headers.cookie) || socket.id;
					}
					
					var addAddressQuery = 'function(DataMap) { \
						if(DataMap.hasKey("__connectedaddresses.#(' + remoteAddress.address + ')")) { \
							var curValue = DataMap.get("__connectedaddresses.#(' + remoteAddress.address + ')"); \
							DataMap.set("__connectedaddresses.#(' + remoteAddress.address + ')", curValue + 1); \
						} else { \
							DataMap.set("__connectedaddresses.#(' + remoteAddress.address + ')", 1) \
						} \
					}';
					
					self._dataClient.run(addAddressQuery);
					
					var failFlag = false;
					
					self._dataClient.set('__workers.#(' + cluster.worker.process.pid + ').sockets.#(' + socket.id + ')', 1, function(err) {
						if(err && !failFlag) {
							self.emit(self.EVENT_SOCKET_FAIL, socket);
							failFlag = true;
							socket.disconnect();
							console.log('   nCombo Error - Failed to initiate socket');
						}
					});
					
					self._dataClient.set('__workers.#(' + cluster.worker.process.pid + ').sessions.#(' + sid + ')', 1, function(err) {
						if(err && !failFlag) {
							self.emit(self.EVENT_SOCKET_FAIL, socket);
							failFlag = true;
							socket.disconnect();
							console.log('   nCombo Error - Failed to initiate socket');
						}
					});
					
					self._dataClient.set('__opensockets.#(' + socket.id + ')', 1, function(err) {
						if(err) {
							if(!failFlag) {
								self.emit(self.EVENT_SOCKET_FAIL, socket);
								failFlag = true;
								socket.disconnect();
								console.log('   nCombo Error - Failed to initiate socket');
							}
						}
					});
					
					var session = new Session(sid, self._wsSocks, self._dataClient, self._retryTimeout);
					
					if(auth !== undefined) {
						session.setAuth(auth, function(err) {
							if(err && !failFlag) {
								self.emit(self.EVENT_SOCKET_FAIL, socket);
								failFlag = true;
								socket.disconnect();
								console.log('   nCombo Error - Failed to save auth data');
							}
					});
					}
					
					session._addSocket(socket, function(err) {
						if(err && !failFlag) {
							self.emit(self.EVENT_SOCKET_FAIL, socket);
							failFlag = true;
							socket.disconnect();
							console.log('   nCombo Error - Failed to initiate session');
						}
					});
					
					// handle local server interface call
					socket.on('localCall', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, secure);
						var res = new IOResponse(request, socket, session, self.global, remoteAddress, secure);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_LOCAL_EXEC]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// handle remote interface call
					socket.on('remoteCall', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, request.secure);
						var res = new IOResponse(request, socket, session, self.global, remoteAddress, secure);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_REMOTE_EXEC]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// watch local server events
					socket.on('watchLocal', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, secure);
						var res = new IOResponse(request, socket, session, self.global, remoteAddress, secure);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_LOCAL_WATCH]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// unwatch local server events
					socket.on('unwatchLocal', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, secure);
						var res = new IOResponse(request, socket, session, self.global, remoteAddress, secure);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_LOCAL_UNWATCH]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// watch remote server events
					socket.on('watchRemote', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, request.secure);
						var res = new IOResponse(request, socket, session, self.global, remoteAddress, secure);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_REMOTE_WATCH]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// unwatch remote server events
					socket.on('unwatchRemote', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, secure);
						var res = new IOResponse(request, socket, session, self.global, remoteAddress, secure);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_REMOTE_UNWATCH]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					var removeOpenSocket = function(callback) {
						var operation = retry.operation(self._retryOptions);
						operation.attempt(function() {
							self._dataClient.remove('__opensockets.#(' + socket.id + ')', function(err) {
								_extendRetryOperation(operation);
								if(operation.retry(err)) {
									return;
								}
								
								callback && callback();
							});
						});
					}
					
					var removeWorkerSocket = function() {
						var operation = retry.operation(self._retryOptions);
						operation.attempt(function() {
							self._dataClient.remove('__workers.#(' + cluster.worker.process.pid + ').sockets.#(' + socket.id + ')', function(err) {
								_extendRetryOperation(operation);
								operation.retry(err);
							});
						});
					}
					
					var removeWorkerSession = function() {
						var operation = retry.operation(self._retryOptions);
						operation.attempt(function() {
							self._dataClient.remove('__workers.#(' + cluster.worker.process.pid + ').sessions.#(' + sid + ')', function(err) {
								_extendRetryOperation(operation);
								operation.retry(err);
							});
						});
					}
					
					var cleanupSession = function() {
						var countSocketsOp = retry.operation(self._retryOptions);
						countSocketsOp.attempt(function() {
							session.countSockets(function(err, data) {
								_extendRetryOperation(countSocketsOp);
								if(countSocketsOp.retry(err)) {
									return;
								}
								
								if(data < 1) {
									self._middleware[self.MIDDLEWARE_SESSION_DESTROY].setTail(function() {
										var destroySessionOp = retry.operation(self._retryOptions);
										destroySessionOp.attempt(function() {
											session._destroy(function(err) {
												_extendRetryOperation(destroySessionOp);
												if(destroySessionOp.retry(err)) {
													return;
												}
												
												gateway.unwatchAll(session);
												ws.destroy(session);
												removeWorkerSession();
											});
										});
									});
									self._middleware[self.MIDDLEWARE_SESSION_DESTROY].run(session);
								}
							});
						});
					}
					
					socket.on('disconnect', function() {
						self.emit(self.EVENT_SOCKET_DISCONNECT, socket);
						
						var jsQuery = 'function(DataMap) { \
							if(DataMap.hasKey("__connectedaddresses.#(' + remoteAddress.address + ')")) { \
								var newValue = DataMap.get("__connectedaddresses.#(' + remoteAddress.address + ')") - 1; \
								if(newValue <= 0) { \
									DataMap.remove("__connectedaddresses.#(' + remoteAddress.address + ')"); \
									return 0; \
								} else { \
									DataMap.set("__connectedaddresses.#(' + remoteAddress.address + ')", newValue); \
									return newValue; \
								} \
							} else { \
								return 0; \
							} \
						}';
						
						var timeout;
						if(typeof self._options.sessionTimeout == 'number') {
							timeout = self._options.sessionTimeout;
						} else {
							timeout = self._options.sessionTimeout[0] + Math.random() * self._options.sessionTimeout[1];
						}						
						
						setTimeout(function() {
							session._removeSocket(socket, cleanupSession);
						}, timeout);
						
						var disconnectAddressOp = retry.operation(self._retryOptions);
						disconnectAddressOp.attempt(function() {
							self._dataClient.run(jsQuery, function(err) {
								_extendRetryOperation(disconnectAddressOp);
								disconnectAddressOp.retry(err);
							});
						});
						
						removeOpenSocket();
						removeWorkerSocket();
					});
				});
				
				shasum.update(dataKey);
				var hashedKey = shasum.digest('hex');
				ws.init(hashedKey);
				gateway.init(self._appDirPath + '/sims/', self._dataClient, self._customSIMExtension);
				
				self.emit(self.EVENT_WORKER_START);
				process.send({action: 'ready'});
			});
		}
		
		if(cluster.isMaster) {
			console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching nCombo server');
			if(!self._options.release) {
				process.stdin.resume();
				process.stdin.setEncoding('utf8');
			}
			
			if(self._options.cacheVersion == null) {
				self._cacheVersion = (new Date()).getTime();
			} else {
				self._cacheVersion = self._options.cacheVersion;
			}
			
			var bundles = {};
			
			var i;
			var stylePaths = [];
			
			for(i in self._clientStyles) {
				stylePaths.push(self._clientStyles[i].path);
			}
			
			var styleBundle = cssBundler({files: stylePaths, watch: !self._options.release});
			self._smartCacheManager = new SmartCacheManager(self._cacheVersion);
			
			var newURL;
			var appDirRegex = new RegExp('^' + pathManager.toUnixSep(self._appDirPath));
			var frameworkStylesPath = pathManager.toUnixSep(pathManager.urlToPath(appDef.frameworkStylesURL)).replace(/\/*$/, '');
			var frameworkStylesDirRegex = new RegExp('^' + frameworkStylesPath);
			
			var cssURLFilter = function(url, rootDir) {
				rootDir = pathManager.toUnixSep(rootDir);
				if(appDirRegex.test(rootDir)) {
					newURL = path.relative(path.dirname(appDef.appStyleBundleURL), appDef.appStylesURL) + '/' + url;
				} else {
					newURL = path.relative(path.dirname(appDef.appStyleBundleURL), appDef.frameworkStylesURL) + '/' + rootDir.replace(frameworkStylesDirRegex, '') + '/' + url;
				}
				newURL = pathManager.toUnixSep(path.normalize(newURL));
				if(self._options.release) {
					newURL = self._smartCacheManager.setURLCacheVersion(newURL);
				}
				return newURL;
			}
			
			var updateCSSBundle = function(workers) {
				var cssBundle = styleBundle.bundle(cssURLFilter);
				if(workers) {
					var i;
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appStyleBundleURL, content: cssBundle});
					}
				}
				bundles[appDef.appStyleBundleURL] = cssBundle;
			}
			
			var templatePaths = [];
			
			for(i in self._clientTemplates) {
				templatePaths.push(self._clientTemplates[i].path);
			}
			
			var templateBundle = templateBundler({files: templatePaths, watch: !self._options.release});
			
			var updateTemplateBundle = function(workers) {
				var htmlBundle = templateBundle.bundle();
				if(workers) {
					var i;
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appTemplateBundleURL, content: htmlBundle});
					}
				}
				bundles[appDef.appTemplateBundleURL] = htmlBundle;
			}
			
			var libPaths = [];
			var jsLibCodes = {};
			
			for(i in self._clientScripts) {
				libPaths.push(self._clientScripts[i].path);
				jsLibCodes[self._clientScripts[i].path] = fs.readFileSync(self._clientScripts[i].path, 'utf8');
			}
			
			var makeLibBundle = function(workers) {
				var libArray = [];
				var i;
				for(i in jsLibCodes) {
					libArray.push(jsLibCodes[i]);
				}
				var libBundle = libArray.join('\n');
				if(self._options.release) {
					libBundle = scriptManager.minify(libBundle);
				}
				bundles[appDef.appLibBundleURL] = libBundle;
				
				if(workers) {
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appLibBundleURL, content: libBundle});
					}
				}
			}
			
			var updateLibBundle = function(filePath, workers) {
				jsLibCodes[filePath] = fs.readFileSync(filePath, 'utf8');
				makeLibBundle(workers);
			}
			
			var bundleOptions = {};
			bundleOptions.watch = !self._options.release;
			bundleOptions.debug = !self._options.release;
			bundleOptions.exports = 'require';
			
			var scriptBundle = browserify(bundleOptions);
			scriptBundle.addEntry(self._appDirPath + appDef.appScriptsURL + 'index.js');
			
			var updateScriptBundle = function(workers) {
				var jsBundle = scriptBundle.bundle();
				if(self._options.release) {
					jsBundle = scriptManager.minify(jsBundle);
				}
				bundles[appDef.appScriptBundleURL] = jsBundle;
				
				if(workers) {
					var i;
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appScriptBundleURL, content: jsBundle});
					}
				}
			}
			
			var initBundles = function() {
				updateCSSBundle();
				updateTemplateBundle();
				makeLibBundle();
				updateScriptBundle();
			}
			
			var autoRebundle = function(workers) {			
				// The master process does not handle requests so it's OK to do sync operations at runtime
				styleBundle.on('bundle', function() {
					updateCSSBundle(workers);
				});
				
				templateBundle.on('bundle', function() {
					updateTemplateBundle(workers);
				});
				
				var libRebundler = function(filePath) {
					updateLibBundle(filePath, workers);
				}
					
				var libWatcher = chokidar.watch(libPaths);
				libWatcher.on('change', libRebundler);
				libWatcher.on('unlink', libRebundler);
				
				scriptBundle.on('bundle', function() {
					updateScriptBundle(workers);
				});
			}
			
			var minifiedScripts = scriptManager.minifyScripts(self._options.minifyURLs);			
			
			portScanner.checkPortStatus(self._options.port, 'localhost', function(err, status) {
				if(err || status == 'open') {
					console.log('   nCombo Error - Port ' + self._options.port + ' is already taken');
					process.exit();
				} else {
					portScanner.findAPortNotInUse(self._options.port + 1, self._options.port + 1000, 'localhost', function(error, datPort) {
						console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching nData server');
						
						var workerIndex = 0;
						
						if(error) {
							console.log('   nCombo Error - Failed to acquire new port; try relaunching');
							process.exit();
						}
						
						dataPort = datPort;
						var pass = crypto.randomBytes(32).toString('hex');
						
						self._dataServer = ndata.createServer(dataPort, pass);
						self._dataServer.on('ready', function() {
							var i;
							var worker = null;
							var activeWorkers = 0;
							
							self._dataClient = ndata.createClient(dataPort, pass);
							
							var workerReadyHandler = function(data, worker, workers) {
								if(++activeWorkers >= self._options.workers) {
									var i;
									for(i in workers) {
										workers[i].send({action: 'emit', event: self.EVENT_LEADER_START});
									}
									console.log('   ' + self.colorText('[Active]', 'green') + ' nCombo server started on port ' + self._options.port + ' - Number of workers: ' + self._options.workers);
								}
							}
							
							var launchWorker = function() {
								worker = cluster.fork();
								worker.send({action: 'init', workerIndex: workerIndex++, dataPort: dataPort, dataKey: pass, cacheVersion: self._cacheVersion, minifiedScripts: minifiedScripts, bundles: bundles});
								return worker;
							}
							
							var launchWorkers = function() {
								initBundles();
								var i;
								var workers = [];
								for(i=0; i<self._options.workers; i++) {
									worker = launchWorker();
									worker.on('message', function workerHandler(data) {
										worker.removeListener('message', workerHandler);
										if(data.action == 'ready') {
											workerReadyHandler(data, worker, workers);
										}
									});
									workers.push(worker);
								}
								autoRebundle(workers);
							}
							
							cluster.on('exit', function(worker, code, signal) {
								console.log('   Worker ' + worker.process.pid + ' died');
								self._cleanupWorker(worker.process.pid);
								
								activeWorkers--;
								if(self._options.release) {
									console.log('   Respawning worker');
									launchWorker();
								} else {
									if(activeWorkers <= 0) {
										console.log('   All workers are dead - nCombo is shutting down');
										process.exit();
									}
								}
							});
							
							launchWorkers();
						});
					});
				}
			});
		} else {
			var secure = false;
			
			if(self._options.protocol == 'http') {
				self._server = http.createServer(self._middleware[self.MIDDLEWARE_HTTP].run);
			} else if(self._options.protocol == 'https') {
				secure = true;
				if(self._options.protocolOptions) {
					self._server = https.createServer(self._options.protocolOptions, self._middleware[self.MIDDLEWARE_HTTP].run);
				} else {
					throw "The protocolOptions option must be set when https is used";
				}
			} else {
				throw "The " + self._options.protocol + " protocol is not supported";
			}
			
			var handler = function(data) {
				if(data.action == 'init') {
					dataPort = data.dataPort;
					dataKey = data.dataKey;
					self.workerIndex = data.workerIndex;
					self.isLeader = data.workerIndex == self._options.workers - 1;
					self._bundles = data.bundles;
					self._minifiedScripts = data.minifiedScripts;
					self._cacheVersion = data.cacheVersion;
					self._smartCacheManager = new SmartCacheManager(self._cacheVersion);
					begin();
				} else if(data.action == 'update') {
					self._cacheResponder.cache(data.url, data.content, true);
				} else if(data.action == 'emit') {
					if(data.event == self.EVENT_LEADER_START) {
						self.isLeader && self.emit(data.event, data.data);
					} else {
						self.emit(data.event, data.data);
					}
				}
			}
			
			process.on('message', handler);
		}
		
		if(self._options.release) {
			process.on('uncaughtException', function(err) {
				self.emit(self.EVENT_FAIL, err);
				if(err.stack) {
					console.log(err.stack);
				} else {
					console.log(err);
				}
			});
		}
	}
	
	self.addMiddleware = function(type, callback) {
		if(!self._middleware.hasOwnProperty(type)) {
			console.log("   Middleware type '" + type + "' is invalid");
		}
		
		self._middleware[type].addFunction(callback);
	}
	
	self.removeMiddleware = function(type, callback) {
		if(self._middleware[type].getLength() > 0) {
			self._middleware[type].remove(callback);
		}
	}
}

nCombo.prototype.__proto__ = EventEmitter.prototype;

module.exports = new nCombo();
