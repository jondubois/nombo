var http = require('http');
var https = require('https');
var pathManager = require('nombo/pathmanager');
var scriptManager = require('nombo/scriptmanager');
var Uglifier = require('nombo/uglifier').Uglifier;
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var cachemere = require('cachemere');
var handlebars = require('handlebars');
var stepper = require('stepper');
var ws = require('nombo/webservice');
var gateway = require('nombo/gateway');
var mime = require('mime');
var path = require('path');
var pathManager = require('nombo/pathmanager');
var EventEmitter = require('events').EventEmitter;
var SmartCacheManager = require("./smartcachemanager").SmartCacheManager;
var socketCluster = require('socketcluster-server');
var ncom = require('ncom');
var less = require('less');
var retry = require('retry');
var domain = require('domain');
var conf = require('nombo/configmanager');

var Worker = function (options) {
	var self = this;
	
	self._errorDomain = domain.create();
	self._errorDomain.on('error', function () {
		self.errorHandler.apply(self, arguments);
	});
	self._errorDomain.add(self);
	
	self.start = self._errorDomain.bind(self._start);
	self._errorDomain.run(function () {
		self._init(options);
	});
};

Worker.prototype = Object.create(EventEmitter.prototype);

Worker.prototype._init = function (options) {
	var self = this;
	
	// Low level middleware
	self.MIDDLEWARE_HTTP = 'http';
	self.MIDDLEWARE_IO = 'io';
	
	// Core middleware
	self.MIDDLEWARE_GET = 'get';
	self.MIDDLEWARE_POST = 'post';
	
	self.MIDDLEWARE_RPC = 'rpc';
	
	self.EVENT_WORKER_START = 'workerstart';
	self.EVENT_LEADER_START = 'leaderstart';
	self.EVENT_SOCKET_CONNECT = 'socketconnect';
	self.EVENT_SOCKET_DISCONNECT = 'socketdisconnect';
	self.EVENT_SESSION_DESTROY = 'sessiondestroy';
	
	self._options = options;
	
	self._options.secure = self._options.protocol == 'https';
	
	self.id = self._options.workerId;
	self.isLeader = self._options.lead;
	
	self._httpRequestCount = 0;
	self._ioRequestCount = 0;
	self._httpRPM = 0;
	self._ioRPM = 0;
	
	self._bundles = self._options.bundles;
	self._bundledResources = self._options.bundledResources;
	
	self._resourceSizes = {};
	
	self._paths = self._options.paths;
	
	pathManager.init(self._paths.frameworkURL, self._paths.frameworkDirPath, self._paths.appDirPath, 
		self._paths.appURL, self._paths.rootTemplateURL);
		
	pathManager.setBaseURL(self._paths.appURL);
	scriptManager.init(self._paths.frameworkURL, self._paths.appURL, self._options.minifyMangle);
	scriptManager.setBaseURL(self._paths.appURL);
	
	self._errorDomain.add(cachemere);
	
	cachemere.init({
		mapper: pathManager.urlToPath,
		maxSize: self._options.cacheMaxSize,
		maxEntrySize: self._options.cacheMaxEntrySize,
		cacheFilter: self._options.cacheFilter
	});
	
	var i;
	
	for (i in self._bundles) {
		cachemere.set(i, self._bundles[i], 'text/javascript');
	}
	
	self._uglifier = new Uglifier({
		mangle: self._options.minifyMangle,
		timeout: self._options.minifyTimeout
	});
	
	self._errorDomain.add(self._uglifier);
	
	for (i in self._options.resourceSizes) {
		self._resourceSizes[i] = self._options.resourceSizes[i];
	}
	
	self._rootTemplateBody = fs.readFileSync(self._paths.frameworkClientDirPath + '/index.html', 'utf8');
	self._rootTemplate = handlebars.compile(self._rootTemplateBody);
	self._fullAuthResources = {};
	
	self._cacheVersion = self._options.cacheVersion;
	self._smartCacheManager = new SmartCacheManager(self._cacheVersion);
	
	self._defaultScriptType = 'text/javascript';
	self._defaultStyleType = 'text/css';
	self._defaultStyleRel = 'stylesheet';
	
	self._ssidRegex = new RegExp('(^|; *)(' + self._options.appDef.sessionCookieName + '=)([^;]*)');
	
	self.allowFullAuthResource(self._paths.spinJSURL);
	self.allowFullAuthResource(self._paths.frameworkURL + 'smartcachemanager.js');
	self.allowFullAuthResource(self._paths.frameworkSocketClientURL);
	self.allowFullAuthResource(self._paths.frameworkURL + 'session.js');
	self.allowFullAuthResource(self._paths.frameworkClientURL + 'assets/logo.png');
	self.allowFullAuthResource(self._paths.frameworkClientURL + 'scripts/failedconnection.js');
	self.allowFullAuthResource(self._paths.frameworkClientURL + 'scripts/cookiesdisabled.js');
	self.allowFullAuthResource(self._paths.frameworkClientURL + 'scripts/notaccessible.js');
	self.allowFullAuthResource(self._paths.frameworkClientURL + 'scripts/notfound.js');
	self.allowFullAuthResource(self._paths.frameworkURL + 'loader.js');
	self.allowFullAuthResource(self._paths.statusURL);
	
	self._retryOptions = {
		retries: 10,
		factor: 2,
		minTimeout: 1000,
		maxTimeout: 120000,
		randomize: false
	};
	
	self._fileUploader = require('nombo/fileuploader');
	
	self._clusterEngine = require(self._options.clusterEngine);
	
	self._middleware = {};
	
	self._middleware[self.MIDDLEWARE_HTTP] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_HTTP].addFunction(self._prepareHTTPHandler);
	
	self._middleware[self.MIDDLEWARE_IO] = stepper.create({context: self});
	
	self._errorDomain.add(self._middleware[self.MIDDLEWARE_IO]);
	
	self._responseNotSentValidator = function (req, res) {
		return req && res && !res.finished;
	};
	
	self._httpMethodJunction = function (req, res) {
		if (req.method == 'POST') {
			self._middleware[self.MIDDLEWARE_POST].run(req, res)
		} else {
			self._middleware[self.MIDDLEWARE_GET].run(req, res)
		}
	};
	
	self._rout = function (req, res, next) {
		cachemere.fetch(req, function (err, resource) {
			var exp = new Date(Date.now() + self._options.clientCacheLife * 1000).toUTCString();
			resource.headers['Cache-Control'] = self._options.clientCacheType;
			resource.headers['Pragma'] = self._options.clientCacheType;
			resource.headers['Expires'] = exp;
			resource.output(res);
		});
	};
	
	self._middleware[self.MIDDLEWARE_GET] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_GET].setTail(self._rout);
	
	self._middleware[self.MIDDLEWARE_GET].setValidator(self._responseNotSentValidator);
	
	self._routStepper = stepper.create({context: self});
	self._routStepper.addFunction(self._statusRequestHandler);
	self._routStepper.addFunction(self._getParamsHandler);
	self._routStepper.addFunction(self._sessionHandler);
	self._routStepper.addFunction(self._cacheVersionHandler);
	self._routStepper.setTail(self._httpMethodJunction);
	
	self._middleware[self.MIDDLEWARE_POST] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_POST].setTail(function () {
		if (self._options.allowUploads) {
			self._fileUploader.upload.apply(self._fileUploader, arguments);
		}
	});
	
	self._middleware[self.MIDDLEWARE_HTTP].setTail(self._routStepper);
	
	self._middleware[self.MIDDLEWARE_RPC] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_RPC].setTail(gateway.exec);
	
	self._middleware[self.MIDDLEWARE_IO].setTail(self._middleware[self.MIDDLEWARE_RPC]);
	
	mime.define({
		'text/css': ['less'],
		'text/html': ['handlebars']
	});
	
	self._privateExtensions = self._options.privateExtensions;
	if (self._privateExtensions) {
		self._privateExtensionRegex = new RegExp('[.](' + self._privateExtensions.join('|').replace(/[.]/g, '[.]') + ')$');
	} else {
		self._privateExtensionRegex = /$a/;
	}
	self._customSIMExtension = self._options.customSIMExtension;
	
	self._cacheCookieRegex = new RegExp('(^|; *)' + self._options.appDef.cacheCookieName + '=1');
	
	self._ioClusterClient = new self._clusterEngine.IOClusterClient({
		workerPort: self._options.workerPort,
		stores: self._options.stores,
		dataKey: self._options.dataKey,
		clusterKey: self._options.clusterKey,
		connectTimeout: self._options.connectTimeout,
		dataExpiry: self._options.sessionTimeout,
		addressSocketLimit: self._options.addressSocketLimit
	});

	self._errorDomain.add(self._ioClusterClient);
	
	self._ioClusterClient.on('sessiondestroy', function (sessionId) {
		self.emit(self.EVENT_SESSION_DESTROY, sessionId);
	});
};

Worker.prototype.handleCacheUpdate = function (url, content, size) {
	this._resourceSizes[url] = size;
	cachemere.set(url, content);
};

Worker.prototype.handleMasterEvent = function () {
	this.emit.apply(this, arguments);
};

Worker.prototype.ready = function () {
	this.emit(this.EVENT_WORKER_START);
	process.send({type: 'ready'});
};

Worker.prototype._handleConnection = function (socket) {
	var self = this;
	
	self._errorDomain.add(socket);
	var remoteAddress = socket.address;
	var nSocket = socket.ns('__nc');
	
	// Handle local server interface call
	nSocket.on('rpc', function (request, response) {
		self._ioRequestCount++;
		var req = new IORequest(request, nSocket, socket.session, socket.global, remoteAddress, self._options.secure);
		var res = new IOResponse(request, response);

		self._middleware[self.MIDDLEWARE_IO].run(req, res);
	});
	
	socket.on('close', function () {
		self.emit(self.EVENT_SOCKET_DISCONNECT, socket);
		self._errorDomain.remove(socket);
	});
	
	self.emit(self.EVENT_SOCKET_CONNECT, socket);
};

Worker.prototype._calculateStatus = function () {
	var perMinuteFactor = 60 / this._options.workerStatusInterval;
	this._httpRPM = this._httpRequestCount * perMinuteFactor;
	this._ioRPM = this._ioRequestCount * perMinuteFactor;
	this._httpRequestCount = 0;
	this._ioRequestCount = 0;
};

Worker.prototype.getStatus = function () {	
	return {
		clientCount: this._socketServer.clientsCount,
		httpRPM: this._httpRPM,
		ioRPM: this._ioRPM
	};
};

Worker.prototype._getFavicon = function (callback) {
	var self = this;
	var iconPath = self._paths.appDirPath + '/assets/favicon.gif';
	
	fs.readFile(iconPath, function (err, data) {
		if (err) {
			if (err.code == 'ENOENT') {
				iconPath = self._paths.frameworkClientDirPath + '/assets/favicon.gif';
				fs.readFile(iconPath, function (err, data) {
					callback(err, data)
				});
			} else {
				callback(err)
			}
		} else {
			callback(null, data)
		}
	});
};

Worker.prototype._start = function () {
	var self = this;
	
	self._includeString = self._createScriptTag(self._paths.freshnessURL, 'text/javascript', true) + "\n\t";
	self._includeString += self._createScriptTag(self._paths.frameworkURL + 'smartcachemanager.js', 'text/javascript') + "\n\t";
	self._includeString += self._createScriptTag(self._paths.spinJSURL, 'text/javascript') + "\n\t";
	self._includeString += self._createScriptTag(self._paths.frameworkSocketClientURL, 'text/javascript') + "\n\t";
	self._includeString += self._createScriptTag(self._paths.frameworkURL + 'session.js', 'text/javascript');
	
	var htmlAttr = '';
	var bodyAttr = '';
	
	if (self._options.angular) {
		htmlAttr += ' xmlns:ng="http://angularjs.org"';
		bodyAttr = ' ng-cloak';
	} else {
		htmlAttr += ' xmlns="http://www.w3.org/1999/xhtml"';
	}
	
	var rootHTML = self._rootTemplate({
		title: self._options.title,
		includes: new handlebars.SafeString(self._includeString),
		htmlAttr: htmlAttr,
		bodyAttr: bodyAttr
	});
	
	cachemere.set('/', rootHTML, 'text/html');
	
	var appDef = self._options.appDef;
	
	if (self._resourceSizes[appDef.appStyleBundleURL] <= 0) {
		delete appDef.appStyleBundleURL;
	}
	if (self._resourceSizes[appDef.frameworkCoreBundleURL] <= 0) {
		delete appDef.frameworkCoreBundleURL;
	}
	if (self._resourceSizes[appDef.appLibBundleURL] <= 0) {
		delete appDef.appLibBundleURL;
	}
	if (self._resourceSizes[appDef.appTemplateBundleURL] <= 0) {
		delete appDef.appTemplateBundleURL;
	}
	if (self._resourceSizes[appDef.appScriptBundleURL] <= 0) {
		delete appDef.appScriptBundleURL;
	}
	
	var specialPreps = {};
	
	specialPreps[self._paths.frameworkURL + 'session.js'] = function (data) {
		var template = handlebars.compile(data.content.toString());
		var result = template({
			port: self._options.port,
			frameworkURL: self._paths.frameworkURL,
			frameworkClientURL: self._paths.frameworkClientURL,
			timeout: self._options.connectTimeout * 1000,
			appDef: JSON.stringify(appDef),
			resources: JSON.stringify(self._bundledResources),
			debug: self._options.release ? 'false' : 'true'
		});
		return result;
	};
	
	var versionDeepCSSURLs = function (content) {
		if (self._options.release) {
			content = content.replace(/@import +["']([^"']+)["']/g, function (match, first) {
				return '@import "' + self._smartCacheManager.setURLCacheVersion(first) + '"';
			});
			
			content = content.replace(/([^A-Za-z0-9]|^)url[(][ ]*["']?([^"')]*)["']?[ ]*[)]/g, function (match, first, second) {
				return first + 'url("' + self._smartCacheManager.setURLCacheVersion(second) + '")';
			});
		}
		return content;
	};
	
	var extPreps = {
		js: function (resource, callback) {
			var code;
			
			if (specialPreps[resource.url]) {
				code = specialPreps[resource.url](resource);
			} else {
				code = resource.content.toString();
			}
			if (scriptManager.isJSModule(resource.url)) {
				code = scriptManager.moduleWrap(resource.url, code);
			}
			if (self._options.release) {
				self._uglifier.minify(code, function (err, minifiedCode) {
					if (err) {
						if (err instanceof Error) {
							err = err.message;
						}
						self.noticeHandler(err);
						callback(null, code);
					} else {
						callback(null, minifiedCode);
					}
				});
			} else {
				return code;
			}
		},
		css: function (resource) {
			return versionDeepCSSURLs(resource.content.toString());
		},
		less: function (resource, callback) {
			data = versionDeepCSSURLs(resource.content.toString());
			less.render(data, callback);
		}
	};
	
	var extRegex = /[.]([^.]+)$/;
	self._prepProvider = function (url) {
		var matches = url.match(extRegex);
		if (matches) {
			var ext = matches[1];
			if (extPreps[ext]) {
				return extPreps[ext];
			}
			return false;
		}
		return false;
	};
	
	cachemere.setPrepProvider(self._prepProvider);
	
	self._server = http.createServer(self._middleware[self.MIDDLEWARE_HTTP].run);
	
	self._httpRequestCount = 0;
	self._ioRequestCount = 0;
	self._httpRPM = 0;
	self._ioRPM = 0;
	
	setInterval(this._calculateStatus.bind(this), this._options.workerStatusInterval * 1000);
	
	self._socketServer = socketCluster.attach(self._server, {
		appName: self._options.appName,
		sourcePort: self._options.port,
		ioClusterClient: self._ioClusterClient,
		transports: self._options.transports,
		pingTimeout: self._options.heartbeatTimeout,
		pingInterval: self._options.heartbeatInterval,
		upgradeTimeout: self._options.connectTimeout,
		logLevel: self._options.logLevel,
		hostAddress: self._options.hostAddress,
		secure: self._options.protocol == 'https'
	});
	
	self._socketServer.on('notice', self.noticeHandler.bind(self));
	self._errorDomain.add(self._socketServer);
	
	var oldRequestListeners = self._server.listeners('request').splice(0);
	self._server.removeAllListeners('request');
	var oldUpgradeListeners = self._server.listeners('upgrade').splice(0);
	self._server.removeAllListeners('upgrade');
	
	var boundCountHTTPRequest = self._countHTTPRequest.bind(self);
	self._server.on('request', boundCountHTTPRequest);
	self._server.on('upgrade', boundCountHTTPRequest);
	
	var i;
	for (i in oldRequestListeners) {
		self._server.on('request', oldRequestListeners[i]);
	}
	for (i in oldUpgradeListeners) {
		self._server.on('upgrade', oldUpgradeListeners[i]);
	}
	self._server.listen(self._options.workerPort);
	self.global = self._ioClusterClient.global();

	gateway.setReleaseMode(self._options.release);
	
	self._socketServer.on('connection', self._handleConnection.bind(self));
	gateway.init(self._paths.appDirPath + '/sims/', self._customSIMExtension);
	
	self._getFavicon(function (err, data) {
		if (err) {
			throw new Error('Failed to get favicon due to the following error: ' + (err.message || err));
		} else {
			cachemere.set('/favicon.ico', data, 'image/gif');
			cachemere.on('ready', function () {
				self._socketServer.on('ready', self.ready.bind(self));
			});
		}
	});
};

Worker.prototype.getHTTPRate = function () {
	return this._httpRPM;
};

Worker.prototype.getIORate = function () {
	return this._ioRPM;
};

Worker.prototype.errorHandler = function (err) {
	this.emit('error', err);
};

Worker.prototype.noticeHandler = function (notice) {
	this.emit('notice', notice);
};

Worker.prototype.addMiddleware = function (type, callback) {
	if (!this._middleware.hasOwnProperty(type)) {
		throw new Error("Middleware type '" + type + "' is invalid");
	}
	this._middleware[type].addFunction(callback);
};

Worker.prototype.removeMiddleware = function (type, callback) {
	if (this._middleware[type].getLength() > 0) {
		this._middleware[type].remove(callback);
	}
};

Worker.prototype.allowFullAuthResource = function (url) {
	this._fullAuthResources[url] = true;
};

Worker.prototype.denyFullAuthResource = function (url) {
	if (this._fullAuthResources.hasOwnProperty(url)) {
		delete this._fullAuthResources[url];
	}
};

Worker.prototype.isFullAuthResource = function (url) {
	return this._fullAuthResources.hasOwnProperty(url);
};

Worker.prototype._statusRequestHandler = function (req, res, next) {
	if (req.url == this._paths.statusURL) {
		var self = this;
		
		var buffers = [];
		req.on('data', function (chunk) {
			buffers.push(chunk);
		});
		req.on('end', function () {
			var statusReq = JSON.parse(Buffer.concat(buffers).toString());
			if (statusReq.dataKey == self._options.dataKey) {
				var status = JSON.stringify(self.getStatus());
				res.writeHead(200, {
					'Content-Type': 'application/json'
				});
				res.end(status);
			} else {
				res.writeHead(401, {
					'Content-Type': 'application/json'
				});
				res.end();
			}
		});
	} else {
		next();
	}
};

Worker.prototype._cacheVersionHandler = function (req, res, next) {
	if (req.url == this._paths.freshnessURL) {
		var cacheVersion;
		if (this._options.release) {
			cacheVersion = this._cacheVersion;
		} else {
			cacheVersion = Date.now();
		}
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Pragma', 'no-cache');
		
		var script;
		var cookie = req.headers.cookie;
		
		var ifNoneMatch = req.headers['if-none-match'];
		if (ifNoneMatch == cacheVersion) {
			res.setHeader('ETag', cacheVersion);
			script = 'var NOMBO_CACHE_VERSION = "' + cacheVersion + '";\n';
			script += 'var NOMBO_IS_FRESH = false;';
		} else if (cookie && this._cacheCookieRegex.test(cookie)) {
			script = '/* Cached app */';
			res.setHeader('ETag', cacheVersion);
		} else {
			script = 'var NOMBO_CACHE_VERSION = "' + cacheVersion + '";\n';
			script += 'var NOMBO_IS_FRESH = true;';
		}
		res.writeHead(200);
		res.end(script);
	} else {
		next();
	}
};

Worker.prototype._sessionHandler = function (req, res, next) {
	var self = this;
	
	req.global = self.global;
	
	var sid = self._parseSSID(req.headers.cookie);
	var url = req.url;
	
	if (url == '/') {
		cachemere.fetch(req, function (err, resource) {
			resource.headers['Access-Control-Allow-Methods'] = 'OPTIONS, HEAD, GET, POST';
			resource.headers['Access-Control-Allow-Origin'] = '*';
			resource.output(res);
		});
	} else {		
		if (self.isFullAuthResource(url)) {
			cachemere.fetch(req, function (err, resource) {
				var exp = new Date(Date.now() + self._options.clientCacheLife * 1000).toUTCString();
				resource.headers['Cache-Control'] = self._options.clientCacheType;
				resource.headers['Pragma'] = self._options.clientCacheType;
				resource.headers['Expires'] = exp;
				resource.output(res);
			});
		} else {
			if (sid) {
				req.session = this._ioClusterClient.session(sid);
				next();
			} else if (!this._options.publicResources && url != self._paths.freshnessURL) {
				res.writeHead(500);
				res.end('File cannot be accessed outside of a session');
			} else {
				next();
			}
		}
	}
};

Worker.prototype._countHTTPRequest = function (req) {
	this._httpRequestCount++;
};

Worker.prototype._prepareHTTPHandler = function (req, res, next) {
	var self = this;
	
	var errorDomain = domain.create();
	errorDomain.on('error', function (err) {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		if (err.stack) {
			res.end(err.message);
		} else {
			res.end(err);
		}
		self._errorDomain.emit('error', err);
	});
	errorDomain.run(function () {
		res.connection && res.connection.setNoDelay(true);
		next();
	});
};

Worker.prototype._getParamsHandler = function (req, res, next) {
	var urlParts = url.parse(req.url);
	var query = urlParts.query;
	req.url = urlParts.pathname;
	req.params = querystring.parse(query);
	next();
};

Worker.prototype._parseSSID = function (cookieString) {
	if (cookieString) {
		var result = cookieString.match(this._ssidRegex);
		if (result) {
			return result[3];
		}
	}
	return null;
};

Worker.prototype._normalizeURL = function (url) {
	url = path.normalize(url);
	return url.replace(/\\/g, '/');
};

Worker.prototype._createScriptCodeTag = function (code, type) {
	if (!type) {
		type = this._defaultScriptType;
	}
	return '<script type="' + type + '">' + code + '</script>';
};

Worker.prototype._createScriptTag = function (url, type, noCacheVersion) {
	url = this._normalizeURL(url);
	if (this._options.release && !noCacheVersion) {
		url = this._smartCacheManager.setURLCacheVersion(url);
	}
	return '<script type="' + type + '" src="' + url + '"></script>';
};

Worker.prototype._createStyleTag = function (url, type) {
	url = this._normalizeURL(url);
	if (this._options.release) {
		url = this._smartCacheManager.setURLCacheVersion(url);
	}
	return '<link rel="' + this._defaultStyleRel + '" type="' + type + '" href="' + url + '" />';
};

function IORequest(req, socket, session, global, remoteAddress, secure) {
	var i;
	for (i in req) {
		this[i] = req[i];
	}
	this.session = session;
	this.global = global;
	this.remote = this.remote || false;
	this.remoteAddress = remoteAddress;
	this.secure = secure;
	this.socket = socket;
};

function IOResponse(req, res) {
	var self = this;
	var i;
	for (i in req) {
		self[i] = req[i];
	}
	
	self.end = function (data) {
		res.end(data);
	}
	
	self.error = function (error, data) {
		res.error(error, data);
	}
};

module.exports = Worker;