var http = require('http'),
	https = require('https'),
	path = require('path'),
	pathManager = require('ncombo/pathmanager'),
	mime = require('mime'),
	fs = require('fs'),
	url = require('url'),
	querystring = require('querystring'),
	io = require('socket.io'),
	IOClusterServer = require('iocluster').IOClusterServer,
	IOClusterClient = require('iocluster').IOClusterClient,
	nmix = require('nmix'),
	conf = require('ncombo/configmanager'),
	gateway = require('ncombo/gateway'),
	handlebars = require('handlebars'),
	cache = require('ncombo/cache'),
	ws = require('ncombo/webservice'),
	portScanner = require('portscanner'),
	EventEmitter = require('events').EventEmitter,
	json = require('json'),
	crypto = require('crypto'),
	stepper = require('stepper'),
	browserify = require('browserify'),
	scriptManager = require('ncombo/scriptmanager'),
	cssBundler = require('ncombo/css-bundler'),
	templateBundler = require('ncombo/template-bundler'),
	SmartCacheManager = require("./smartcachemanager").SmartCacheManager,
	watchr = require('watchr'),
	domain = require('domain'),
	retry = require('retry');

var _maxTimeout = 120000;
var _extendRetryOperation = function(operation) {
	if(!operation._timeouts.length) {
		operation._timeouts[0] = _maxTimeout;
	}
}

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

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

var IOResponse = function(req, socket, global, remoteAddress, secure) {
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
	self.MIDDLEWARE_REMOTE_WATCH = 'remoteWatch';
	self.MIDDLEWARE_REMOTE_UNWATCH = 'remoteUnwatch';
	
	self.MIDDLEWARE_SESSION_DESTROY = 'sessionDestroy';
	
	self.EVENT_WORKER_START = 'workerstart';
	self.EVENT_LEADER_START = 'leaderstart';
	self.EVENT_SOCKET_CONNECT = 'socketconnect';
	self.EVENT_SOCKET_DISCONNECT = 'socketdisconnect';
	self.EVENT_SOCKET_FAIL = 'socketfail';
	self.EVENT_FAIL = 'fail';
	
	self.isMaster = cluster.isMaster;
	self.isWorker = cluster.isWorker;
	
	self.id = -1;
	self.isLeader = false;
	
	self._cacheVersion = 0;
	self._smartCacheManager = null;
	
	self._options = {
		port: 8000,
		release: false,
		title: 'nCombo App',
		angular: false,
		angularMainModule: null,
		angularMainTemplate: 'index.html',
		protocol: 'http',
		protocolOptions: {},
		transports: ['websocket'],
		logLevel: 1,
		workers: numCPUs,
		timeout: 10000,
		sessionTimeout: [60000, 60000],
		cacheLife: 2592000000,
		cacheType: 'private',
		cacheVersion: null,
		origins: '*:*',
		autoSession: true,
		publicResources: true,
		minifyMangle: false,
		matchOriginProtocol: true,
		maxConnectionsPerAddress: 0,
		pollingDuration: 30000,
		heartbeatInterval: 25000,
		heartbeatTimeout: 60000,
		allowUploads: false,
		baseURL: null
	};
	
	self._retryOptions = {
		retries: 10,
		factor: 2,
		minTimeout: 1000,
		maxTimeout: _maxTimeout,
		randomize: false
	};
	
	self._connectedAddresses = {};
	
	self._frameworkURL = '/~framework/';
	
	self._frameworkDirPath = __dirname;
	self._frameworkClientDirPath = self._frameworkDirPath + '/client';
	self._frameworkClientURL = self._frameworkURL + 'client/';
	
	self._frameworkModulesURL = self._frameworkURL + 'node_modules/';
	
	self._appDirPath = path.dirname(require.main.filename);
	self._appName = path.basename(self._appDirPath);
	
	self._appLoadScriptPath = self._appDirPath + '/scripts/load.js';
	self._frameworkLoadScriptPath = self._frameworkClientDirPath + '/scripts/load.js';
	
	self._loadScriptURL = null;
	
	self._ssidRegex = null;
	var slashSequenceRegex = /\/+/g;
	
	self._setBaseURL = function(url) {
		self._appExternalURL = ('/' + url + '/').replace(slashSequenceRegex, '/');
		self._appInternalURL = '/';
		self._timeCacheExternalURL = self._appExternalURL + '~timecache';
		self._timeCacheInternalURL = self._appInternalURL + '~timecache';
		
		self._ioResourceExternalURL = self._appExternalURL + 'socket.io';
		self._ioResourceInternalURL = self._appInternalURL + 'socket.io';
		
		pathManager.setBaseURL(self._appExternalURL);
		scriptManager.setBaseURL(self._appExternalURL);
	}
	
	self._setBaseURL(self._appName);
	
	self._frameworkSocketIOClientURL = self._appExternalURL + 'socket.io/socket.io.js';
	
	self._appScriptsURLRegex = new RegExp('^/scripts(\/|$)');
	
	pathManager.init(self._frameworkURL, self._frameworkDirPath, self._appDirPath, self._appExternalURL);
	
	self._retryTimeout = 10000;
	
	self._ioClusterServer = null;
	self._ioClusterClient = null;
	
	self.global = null;
	
	self._config = conf.parseConfig(__dirname + '/config.node.json');
	
	self._prerouter = require('ncombo/router/prerouter.node.js');
	self._headerAdder = require('ncombo/router/headeradder.node.js');
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
	self._resourceSizes = {};
	
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
	
	self.errorHandler = function(err) {
		self.emit(self.EVENT_FAIL, err);
		if(err.stack) {
			console.log(err.stack);
		} else {
			console.log(err);
		}
	}
	
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
			var result = cookieString.match(self._ssidRegex);
			if(result) {
				return result[2];
			}
		}
		return null;
	}
	
	self._redirect = function(req, res, url) {
		res.writeHead(301, {'Location': self._options.protocol + '://' + req.headers.host + url});
		res.end();
	}
	
	var startSlashRegex = /^\//;
	
	self._getAppDef = function(useInternalURLs) {
		var appDef = {};
		if(useInternalURLs) {
			appDef.appURL = self._appInternalURL;
			appDef.ioResource = self._ioResourceExternalURL;
		} else {
			appDef.appURL = self._appExternalURL;
			appDef.ioResource = self._ioResourceExternalURL.replace(startSlashRegex, '');
		}
		
		appDef.frameworkURL = self._frameworkURL;
		appDef.virtualURL = appDef.appURL + '~virtual/';
		appDef.appStyleBundleURL = appDef.virtualURL + 'styles.css';
		appDef.appTemplateBundleURL = appDef.virtualURL + 'templates.js';
		appDef.appLibBundleURL = appDef.virtualURL + 'libs.js';
		appDef.appScriptBundleURL = appDef.virtualURL + 'scripts.js';
		appDef.frameworkClientURL = self._frameworkClientURL;
		appDef.frameworkLibsURL = self._frameworkClientURL + 'libs/';
		appDef.frameworkAssetsURL = self._frameworkClientURL + 'assets/';
		appDef.pluginsURL = self._frameworkClientURL + 'plugins/';
		appDef.frameworkScriptsURL = self._frameworkClientURL + 'scripts/';
		appDef.loadScriptURL = self._loadScriptURL;
		appDef.frameworkStylesURL = self._frameworkClientURL + 'styles/';
		appDef.appScriptsURL = appDef.appURL + 'scripts/';
		appDef.appLibsURL = appDef.appURL + 'libs/';
		appDef.appStylesURL = appDef.appURL + 'styles/';
		appDef.appTemplatesURL = appDef.appURL + 'templates/';
		appDef.appAssetsURL = appDef.appURL + 'assets/';
		appDef.appFilesURL = appDef.appURL + 'files/';
		appDef.wsEndpoint = self._wsEndpoint;
		appDef.releaseMode = self._options.release;
		appDef.timeout = self._options.timeout;
		appDef.resourceSizeMap = self._resourceSizes;
		appDef.angular = self._options.angular;
		appDef.angularMainTemplate = self._options.angularMainTemplate;
		appDef.angularMainModule = self._options.angularMainModule;
		
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
		var encoding = self._getReqEncoding(req);
		
		res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST');
		res.setHeader('Access-Control-Allow-Origin', '*');
		
		if(self._options.release && cache.has(encoding, req.url)) {
			self._respond(req, res, cache.get(encoding, req.url), 'text/html', true);
		} else {
			var includeString = self._getScriptTag(self._frameworkURL + 'smartcachemanager.js', 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._timeCacheExternalURL, 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._spinJSURL, 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._frameworkSocketIOClientURL, 'text/javascript') + "\n\t";
			includeString += self._getScriptTag(self._appExternalURL + self._frameworkURL + 'session.js', 'text/javascript');
			
			var htmlAttr = '';
			var bodyAttr = '';
			
			if(self._options.angular) {
				htmlAttr = ' xmlns:ng="http://angularjs.org"';
				bodyAttr = ' ng-cloak';
			} else {
				htmlAttr = ' xmlns="http://www.w3.org/1999/xhtml"';
			}
			
			var html = self._rootTemplate({
					title: self._options.title,
					includes: new handlebars.SafeString(includeString),
					htmlAttr: htmlAttr,
					bodyAttr: bodyAttr
					});
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
		
		if(req.url == self._timeCacheInternalURL) {
			var now = (new Date()).getTime();
			var expiry = new Date(now + self._options.cacheLife);
			res.setHeader('Content-Type', 'text/javascript');
			res.setHeader('Set-Cookie', '__' + self._appExternalURL + 'nccached=0; Path=/');
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
				var skipCache = (url == self._frameworkURL + 'smartcachemanager.js');
				
				if(skipCache || url == self._frameworkSocketIOClientURL || url == self._frameworkURL + 'session.js'
						|| self.isFullAuthResource(url)) {
					
					if(self._options.release && cache.has(encoding, url)) {
						self._respond(req, res, cache.get(encoding, url), null, skipCache);
					} else {
						fs.readFile(filePath, function(err, data) {
							if(err) {
								res.writeHead(500);
								res.end('Failed to start session');
							} else {
								var cacheVersion;
								if(self._options.release) {
									cacheVersion = self._cacheVersion;
								} else {
									cacheVersion = (new Date()).getTime();
								}
							
								if(url == self._frameworkURL + 'smartcachemanager.js') {
									var template = handlebars.compile(data.toString());
									data = template({cacheVersion: '*/ = ' + cacheVersion + ' /*'});
								} else if(url == self._frameworkURL + 'session.js') {
									var appDef = self._getAppDef();
									
									if(self._resourceSizes[appDef.appStyleBundleURL] <= 0) {
										delete appDef.appStyleBundleURL;
									}
									if(self._resourceSizes[appDef.appLibBundleURL] <= 0) {
										delete appDef.appLibBundleURL;
									}
									if(self._resourceSizes[appDef.appTemplateBundleURL] <= 0) {
										delete appDef.appTemplateBundleURL;
									}
									if(self._resourceSizes[appDef.appScriptBundleURL] <= 0) {
										delete appDef.appScriptBundleURL;
									}
									
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
						req.session = self._ioClusterClient.session(sid);
						next();
					} else if(!self._options.publicResources && self._options.autoSession) {
						res.writeHead(500);
						res.end('File cannot be accessed outside of a session');
					} else {
						next();
					}
				}
			}
		}
	}
	
	self._rewriteHTTPRequest = function(req) {
		req.url = pathManager.simplify(req.url);
	}
	
	self._prepareHTTPHandler = function(req, res, next) {
		res.connection && res.connection.setNoDelay(true);
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
	self._tailGetStepper.addFunction(self._headerAdder.run);
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
		if(req.params.ck && self._appScriptsURLRegex.test(req.url)) {
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
	self._middleware[self.MIDDLEWARE_POST].setTail(function() {
		if(self._options.allowUploads) {
			self._fileUploader.upload.apply(this, arguments);
		}
	});
	
	self._middleware[self.MIDDLEWARE_HTTP].setTail(self._routStepper);
	
	self._middleware[self.MIDDLEWARE_LOCAL_EXEC] = stepper.create();
	self._middleware[self.MIDDLEWARE_LOCAL_EXEC].setTail(gateway.exec);
	
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
	
	self.useScript = function(url, index) {
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
			if(index == null) {
				self._clientScripts.push(obj);
			} else {
				self._clientScripts.splice(index, 0, obj);
			}
			self._clientScriptMap[normalURL] = true;
		}
	}
	
	self.useStyle = function(url) {
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
	
	self.bundle.app.lib = function(name, index) {
		self.useScript(self._appInternalURL + 'libs/' + name, index);
	}
	
	self.bundle.app.template = function(name) {
		self.useTemplate(self._appInternalURL + 'templates/' + name);
	}
	
	self.bundle.app.style = function(name) {
		self.useStyle(self._appInternalURL + 'styles/' + name);
	}
	
	self.bundle.app.asset = function(name) {
		var stats = fs.statSync(self._appDirPath + '/assets/' + name);
		var url = pathManager.expand(self._appInternalURL + 'assets/' + name);
		self._resourceSizes[url] = stats.size;
		self._bundledResources.push(url);
	}
	
	self.bundle.framework.lib = function(name, index) {
		self.useScript(self._frameworkClientURL + 'libs/' + name, index);
	}
	
	self.bundle.framework.script = function(name, index) {
		self.useScript(self._frameworkClientURL + 'scripts/' + name, index);
	}
	
	self.bundle.framework.plugin = function(name, index) {
		self.useScript(self._frameworkClientURL + 'plugins/' + name, index);
	}
	
	self.bundle.framework.style = function(name) {
		self.useStyle(self._frameworkClientURL + 'styles/' + name);
	}
	
	self.bundle.framework.asset = function(name) {
		self._bundledResources.push(self._frameworkClientURL + 'assets/' + name);
	}
	
	self.useStyle(self._frameworkClientURL + 'styles/ncombo.css');
	self.useScript(self._frameworkClientURL + 'libs/jquery.js');
	self.useScript(self._frameworkClientURL + 'libs/handlebars.js');
	self.useScript(self._frameworkClientURL + 'libs/json2.js');
	self.useScript(self._frameworkURL + 'ncombo-client.js');
	
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
	
	var _start = function(options) {
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
			angularMainModule: function() {
				return (typeof arguments[0] == 'string') ? null : 'expecting a string';
			},
			angularMainTemplate: function() {
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
			},
			heartbeatTimeout: function() {
				return isInt(arguments[0]) ? null : 'expecting an integer';
			},
			baseURL: function() {
				return (typeof arguments[0] == 'string') ? null : 'expecting a string';
			}
		}
		
		self._validateOptions(options, optionValidationMap);
		
		var cacheLifeIsSet = false;
		
		if(options) {
			if(options.hasOwnProperty('cacheLife')) {
				cacheLifeIsSet = true;
			}
			var i;
			for(i in options) {
				self._options[i] = options[i];
			}
		}
		
		if(!self._options.release && !cacheLifeIsSet) {
			self._options.cacheLife = 86400000;
		}
		
		if(self._options.baseURL) {
			self._setBaseURL(self._options.baseURL);
		}
		
		self._ssidRegex = new RegExp('(__' + self._appExternalURL + 'ncssid=)([^;]*)');
		
		self._options.appDirPath = self._appDirPath;
		var appDef = self._getAppDef(true);
		self._options.minifyURLs = [appDef.appScriptsURL, appDef.appLibsURL, appDef.frameworkClientURL + 'scripts/load.js', self._frameworkURL + 'ncombo-client.js', 
				self._frameworkURL + 'loader.js'];
		
		self.allowFullAuthResource(self._spinJSURL);
		self.allowFullAuthResource(self._frameworkSocketIOClientURL);
		self.allowFullAuthResource(self._frameworkClientURL + 'assets/logo.png');
		self.allowFullAuthResource(self._frameworkClientURL + 'scripts/failedconnection.js');
		self.allowFullAuthResource(self._frameworkClientURL + 'scripts/cookiesdisabled.js');

		self.allowFullAuthResource(self._frameworkURL + 'loader.js');
		
		if(self._options.angular) {
			self.bundle.framework.lib('angular.js', 0);
			self._options.angularMainTemplate && self.bundle.app.template(self._options.angularMainTemplate);
		}
		scriptManager.init(self._frameworkURL, self._appExternalURL, self._options.minifyMangle);
		
		var begin = function() {
			self._options.cacheVersion = self._cacheVersion;
			self._prerouter.init(self._options);
			var j;
			
			if(self._options.release) {
				for(j in self._minifiedScripts) {
					cache.set(cache.ENCODING_PLAIN, j, self._minifiedScripts[j]);
					self._cacheResponder.setUnrefreshable(j);
				}
			}
			
			for(j in self._bundles) {
				cache.set(cache.ENCODING_PLAIN, j, self._bundles[j]);
				self._cacheResponder.setUnrefreshable(j);
			}
			
			self._router.init(self._privateExtensionRegex);
			self._preprocessor.init(self._options);
			self._headerAdder.init(self._options);
			
			self._ioClusterClient = new IOClusterClient(dataPort, dataKey, self.isMaster);
			
			self._ioClusterClient.on('ready', function() {				
				self._io = io.listen(self._server, {'log level': 1, 'io cluster': self._ioClusterClient});
				
				var oldRequestListeners = self._server.listeners('request').splice(0);
				self._server.removeAllListeners('request');
				var oldUpgradeListeners = self._server.listeners('upgrade').splice(0);
				self._server.removeAllListeners('upgrade');
				
				self._server.on('request', self._rewriteHTTPRequest);
				self._server.on('upgrade', self._rewriteHTTPRequest);
				
				var i;
				for(i in oldRequestListeners) {
					self._server.on('request', oldRequestListeners[i]);
				}
				for(i in oldUpgradeListeners) {
					self._server.on('upgrade', oldUpgradeListeners[i]);
				}
				
				self._server.listen(self._options.port);
				
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
					
					handshakeData.ssid = self._parseSID(handshakeData.headers.cookie);
					
					self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH].setValidator(authCallback);
					self._middleware[self.MIDDLEWARE_SOCKET_IO_AUTH].setTail(function() {
						callback(null, true);
					});
					
					if(handshakeData.ssid) {
						var session = self._ioClusterClient.session(handshakeData.ssid);
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
				
				self._io.set('resource', self._ioResourceInternalURL);
				self._io.set('browser client minification', self._options.release);
				self._io.set('log level', self._options.logLevel);
				self._io.set('transports', self._options.transports);
				self._io.set('origins', self._options.origins);
				self._io.set('polling duration', Math.round(self._options.pollingDuration / 1000));
				self._io.set('heartbeat interval', Math.round(self._options.heartbeatInterval / 1000));
				self._io.set('heartbeat timeout', Math.round(self._options.heartbeatTimeout / 1000));
				self._io.set('match origin protocol', self._options.matchOriginProtocol);
				
				if(self._options.maxConnectionsPerAddress > 0) {				
					self._io.set('authorization', function(handshakeData, callback) {
						var remoteAddr = handshakeData.address.address;
						
						self._ioClusterClient.getAddressSockets(remoteAddr, function(err, sockets) {
							if(sockets.length < self._options.maxConnectionsPerAddress) {
								handleHandshake(handshakeData, callback);
							} else {
								callback("Reached connection limit for the address '" + remoteAddr + "'", false);
							}
						});
					});
				} else {
					self._io.set('authorization', function(handshakeData, callback) {
						handleHandshake(handshakeData, callback);
					});
				}
				
				self._wsSocks = self._io.of(self._wsEndpoint);
				self.global = self._ioClusterClient.global();
			
				gateway.setReleaseMode(self._options.release);
				ws.setReleaseMode(self._options.release);
				ws.setTimeout(self._options.timeout);
				
				var handleConnection = function(err, socket) {
					var remoteAddress = socket.handshake.address;
					var auth = socket.handshake.auth;
					
					self.emit(self.EVENT_SOCKET_CONNECT, socket);
					
					var failFlag = false;					
					var session = self._ioClusterClient.session(socket.ssid);
					
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
					
					// handle local server interface call
					socket.on('localCall', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, secure);
						var res = new IOResponse(request, socket);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_LOCAL_EXEC]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// handle remote interface call
					socket.on('remoteCall', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, request.secure);
						var res = new IOResponse(request, socket);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_REMOTE_EXEC]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// watch remote server events
					socket.on('watchRemote', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, request.secure);
						var res = new IOResponse(request, socket);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_REMOTE_WATCH]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					// unwatch remote server events
					socket.on('unwatchRemote', function(request) {
						var req = new IORequest(request, socket, session, self.global, remoteAddress, secure);
						var res = new IOResponse(request, socket);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].setTail(self._middleware[self.MIDDLEWARE_REMOTE_UNWATCH]);
						self._middleware[self.MIDDLEWARE_SOCKET_IO].run(req, res);
					});
					
					socket.on('disconnect', function() {
						self.emit(self.EVENT_SOCKET_DISCONNECT, socket);
						self._ioClusterClient.unbind(socket);
					});
				}
				
				self._wsSocks.on('connection', function(socket) {					
					if(socket.handshake.sskey) {
						socket.ssid = remoteAddress.address + '-' + socket.handshake.sskey;
					} else {
						socket.ssid = socket.handshake.ssid || socket.id;
					}
					socket.address = socket.handshake.address;
					
					self._ioClusterClient.bind(socket, handleConnection);
				});
				
				shasum.update(dataKey);
				var hashedKey = shasum.digest('hex');
				ws.init(hashedKey);
				gateway.init(self._appDirPath + '/sims/', self._customSIMExtension);
				
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
			
			var workers = [];
			var bundles = {};
			
			var i;
			var stylePaths = [];
			
			for(i in self._clientStyles) {
				stylePaths.push(self._clientStyles[i].path);
			}
			
			var styleDirs = [pathManager.urlToPath(appDef.frameworkStylesURL), pathManager.urlToPath(appDef.appStylesURL)];
			
			var styleBundle = cssBundler({watchDirs: styleDirs, files: stylePaths, watch: !self._options.release});
			self._smartCacheManager = new SmartCacheManager(self._cacheVersion);
			
			if(fs.existsSync(self._appLoadScriptPath)) {
				self._loadScriptURL = pathManager.pathToURL(self._appLoadScriptPath);
			} else {
				self._loadScriptURL = pathManager.pathToURL(self._frameworkLoadScriptPath);
			}
			
			var newURL;
			var externalAppDef = self._getAppDef();
			var pathToRoot = '../..';
			
			var cssURLFilter = function(url, rootDir) {
				rootDir = pathManager.toUnixSep(rootDir);
				newURL = pathToRoot + pathManager.pathToURL(rootDir) + '/' + url;
				newURL = pathManager.toUnixSep(path.normalize(newURL));
				if(self._options.release) {
					newURL = self._smartCacheManager.setURLCacheVersion(newURL);
				}
				
				return newURL;
			}
			
			var updateCSSBundle = function() {
				var cssBundle = styleBundle.bundle(cssURLFilter);
				if(self._options.release) {
					cssBundle = styleBundle.minify(cssBundle);
				}
				if(workers) {
					var i;
					var size = Buffer.byteLength(cssBundle, 'utf8');
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appStyleBundleURL, content: cssBundle, size: size});
					}
				}
				bundles[appDef.appStyleBundleURL] = cssBundle;
			}
			
			var templatePaths = [];
			
			for(i in self._clientTemplates) {
				templatePaths.push(self._clientTemplates[i].path);
			}
			
			var templateDirs = [pathManager.urlToPath(appDef.appTemplatesURL)];
			var templateBundle = templateBundler({watchDirs: templateDirs, files: templatePaths, watch: !self._options.release});
			
			var updateTemplateBundle = function() {
				var htmlBundle = templateBundle.bundle();
				if(workers) {
					var i;
					var size = Buffer.byteLength(htmlBundle, 'utf8');
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appTemplateBundleURL, content: htmlBundle, size: size});
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
			
			var makeLibBundle = function() {
				var libArray = [];
				var i;
				for(i in jsLibCodes) {
					if(jsLibCodes[i]) {
						libArray.push(jsLibCodes[i]);
					}
				}
				var libBundle = libArray.join('\n');
				if(self._options.release) {
					libBundle = scriptManager.minify(libBundle);
				}
				bundles[appDef.appLibBundleURL] = libBundle;
				
				if(workers) {
					var size = Buffer.byteLength(libBundle, 'utf8');
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appLibBundleURL, content: libBundle, size: size});
					}
				}
			}
			
			var updateLibBundle = function(event, filePath) {
				if(event == 'delete') {
					jsLibCodes[filePath] = null;
				} else if((event == 'create' || event == 'update') && jsLibCodes.hasOwnProperty(filePath)) {
					jsLibCodes[filePath] = fs.readFileSync(filePath, 'utf8');
				}
				makeLibBundle();
			}
			
			var bundleOptions = {debug: !self._options.release, watch: !self._options.release, exports: 'require'};
			var scriptBundle = browserify(bundleOptions);
			scriptBundle.addEntry(pathManager.urlToPath(appDef.appScriptsURL + 'index.js'));
			
			var updateScriptBundle = function(callback) {
				var jsBundle = scriptBundle.bundle();
				if(self._options.release) {
					jsBundle = scriptManager.minify(jsBundle);
				}
				bundles[appDef.appScriptBundleURL] = jsBundle;
				
				if(workers) {
					var i;
					var size = Buffer.byteLength(jsBundle, 'utf8');
					for(i in workers) {
						workers[i].send({action: 'update', url: appDef.appScriptBundleURL, content: jsBundle, size: size});
					}
				}
				callback && callback();
			}
			
			var initBundles = function(callback) {
				updateCSSBundle();
				updateTemplateBundle();
				makeLibBundle();
				updateScriptBundle(callback);
			}
			
			var autoRebundle = function() {		
				// The master process does not handle requests so it's OK to do sync operations at runtime
				styleBundle.on('bundle', function() {
					updateCSSBundle();
				});
				
				templateBundle.on('bundle', function() {
					updateTemplateBundle();
				});
				
				watchr.watch({
					paths: [pathManager.urlToPath(appDef.frameworkLibsURL), pathManager.urlToPath(appDef.appLibsURL)],
					listener: updateLibBundle
				});
				
				scriptBundle.on('bundle', function() {
					updateScriptBundle();
				});
			}
			
			var minifiedScripts = scriptManager.minifyScripts(self._options.minifyURLs);
			
			var leaderId = -1;
			var firstTime = true;
			
			portScanner.checkPortStatus(self._options.port, 'localhost', function(err, status) {
				if(err || status == 'open') {
					console.log('   nCombo Error - Port ' + self._options.port + ' is already taken');
					process.exit();
				} else {
					portScanner.findAPortNotInUse(self._options.port + 1, self._options.port + 1000, 'localhost', function(error, datPort) {
						console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching nData server');
						
						if(error) {
							console.log('   nCombo Error - Failed to acquire new port; try relaunching');
							process.exit();
						}
						
						dataPort = datPort;
						var pass = crypto.randomBytes(32).toString('hex');
						
						self._ioClusterServer = new IOClusterServer(dataPort, pass);
						self._ioClusterServer.on('ready', function() {
							var i;
							
							var workerReadyHandler = function(data, worker) {
								workers.push(worker);
								if(worker.id == leaderId) {
									worker.send({action: 'emit', event: self.EVENT_LEADER_START});
								}
								if(workers.length >= self._options.workers && firstTime) {									
									console.log('   ' + self.colorText('[Active]', 'green') + ' nCombo server started');
									console.log('            Port: ' + self._options.port);
									console.log('            Mode: ' + (self._options.release ? 'Release' : 'Debug'));
									if(self._options.release) {
										console.log('            Version: ' + self._cacheVersion);
									}
									console.log('            Number of workers: ' + self._options.workers);
									console.log();
									firstTime = false;
								}
							}
							
							var launchWorker = function(lead) {
								var i;
								var resourceSizes = {};
								for(i in bundles) {
									resourceSizes[i] = Buffer.byteLength(bundles[i], 'utf8');
								}
								
								var styleAssetSizeMap = styleBundle.getAssetSizeMap();
								for(i in styleAssetSizeMap) {
									// Prepend with the relative path to root from style bundle url (styles will be inserted inside <style></style> tags in root document)
									resourceSizes[externalAppDef.virtualURL + '../..' + i] = styleAssetSizeMap[i];
								}
								
								var worker = cluster.fork();
								worker.send({
									action: 'init',
									workerId: worker.id,
									dataPort: dataPort,
									dataKey: pass,
									cacheVersion: self._cacheVersion,
									loadScript: self._loadScriptURL,
									minifiedScripts: minifiedScripts,
									bundles: bundles,
									resourceSizes: resourceSizes,
									lead: lead ? 1 : 0
								});
								
								worker.on('message', function workerHandler(data) {
									worker.removeListener('message', workerHandler);
									if(data.action == 'ready') {
										if(lead) {
											leaderId = worker.id;
										}
										workerReadyHandler(data, worker);
									}
								});
								
								return worker;
							}
								
							var launchWorkers = function() {
								initBundles(function() {
									var i;
									
									if(self._options.workers > 0) {
										launchWorker(true);
										
										for(i=1; i<self._options.workers; i++) {
											launchWorker();
										}
										
										!self._options.release && autoRebundle();
									}
								});
							}
							
							cluster.on('exit', function(worker, code, signal) {
								var message = '   Worker ' + worker.id + ' died - Exit code: ' + code;
								
								if(signal) {
									message += ', signal: ' + signal;
								}
								
								var newWorkers = [];
								var i;
								for(i in workers) {
									if(workers[i].id != worker.id) {
										newWorkers.push(workers[i]);
									}
								}
								
								workers = newWorkers;
								
								var lead = worker.id == leaderId;
								leaderId = -1;
								
								console.log(message);
								
								if(self._options.release) {
									console.log('   Respawning worker');
									launchWorker(lead);
								} else {
									if(workers.length <= 0) {
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
					self.id = data.workerId;
					self.isLeader = data.lead;
					self._bundles = data.bundles;
					
					var i;
					for(i in data.resourceSizes) {
						self._resourceSizes[pathManager.expand(i)] = data.resourceSizes[i];
					}
					
					self._minifiedScripts = data.minifiedScripts;
					self._loadScriptURL = data.loadScript;
					self._cacheVersion = data.cacheVersion;
					self._smartCacheManager = new SmartCacheManager(self._cacheVersion);
					begin();
				} else if(data.action == 'update') {
					self._resourceSizes[data.url] = data.size;
					cache.clearMatches(new RegExp(cache.ENCODING_SEPARATOR + data.url + '$'));
					cache.set(cache.ENCODING_PLAIN, data.url, data.content);					
				} else if(data.action == 'emit') {
					self.emit(data.event, data.data);
				}
			}
			
			process.on('message', handler);
		}
	}
	
	if(self._options.release) {
		var workerDomain = domain.create();
		
		workerDomain.on('error', self.errorHandler);
		self.start = workerDomain.bind(_start);
	} else {
		self.start = _start;
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

var ncombo = new nCombo();

var nComboDomain = domain.create();
nComboDomain.on('error', ncombo.errorHandler);
nComboDomain.add(ncombo);

module.exports = ncombo;