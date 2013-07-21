var http = require('http');
var https = require('https');
var pathManager = require('ncombo/pathmanager');
var scriptManager = require('ncombo/scriptmanager');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var cache = require('ncombo/cache');
var handlebars = require('handlebars');
var stepper = require('stepper');
var cache = require('ncombo/cache');
var crypto = require('crypto');
var ws = require('ncombo/webservice');
var gateway = require('ncombo/gateway');
var mime = require('mime');
var path = require('path');
var pathManager = require('ncombo/pathmanager');
var EventEmitter = require('events').EventEmitter;
var SmartCacheManager = require("./smartcachemanager").SmartCacheManager;
var socketCluster = require('socketcluster');
var retry = require('retry');
var domain = require('domain');
var conf = require('ncombo/configmanager');

var Worker = function (options) {
	var self = this;
	
	this.errorDomain = domain.create();
	this.errorDomain.on('error', function () {
		self.errorHandler.apply(self, arguments);
	});
	this.errorDomain.add(this);
	
	this.start = this.errorDomain.bind(this._start);
	this.init = this.errorDomain.run(function() {
		self._init(options);
	});
};

Worker.prototype = Object.create(EventEmitter.prototype);

Worker.prototype._init = function (options) {
	var self = this;
	
	// low level middleware
	this.MIDDLEWARE_HTTP = 'http';
	this.MIDDLEWARE_IO = 'io';
	
	// core middleware
	this.MIDDLEWARE_GET = 'get';
	this.MIDDLEWARE_POST = 'post';
	
	this.MIDDLEWARE_LOCAL_CALL = 'localCall';
	
	this.EVENT_WORKER_START = 'workerstart';
	this.EVENT_LEADER_START = 'leaderstart';
	this.EVENT_SOCKET_CONNECT = 'socketconnect';
	this.EVENT_SOCKET_DISCONNECT = 'socketdisconnect';
	this.EVENT_SOCKET_FAIL = 'socketfail';
	this.EVENT_SESSION_DESTROY = 'sessiondestroy';
	this.EVENT_FAIL = 'fail';
	
	this._options = options;
	
	this._options.secure = this._options.protocol == 'https';
	
	this.id = this._options.workerId;
	this.isLeader = this._options.lead;
	this._bundles = this._options.bundles;
	this._bundledResources = this._options.bundledResources;
	
	this._resourceSizes = {};
	this._minifiedScripts = this._options.minifiedScripts;
	
	this._prerouter = require('ncombo/router/prerouter.node.js');
	this._headerAdder = require('ncombo/router/headeradder.node.js');
	this._cacheResponder = require('ncombo/router/cacheresponder.node.js');
	this._router = require('ncombo/router/router.node.js');
	this._preprocessor = require('ncombo/router/preprocessor.node.js');
	this._compressor = require('ncombo/router/compressor.node.js');
	this._responder = require('ncombo/router/responder.node.js');
	
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
	
	this._paths = this._options.paths;
	
	pathManager.init(this._paths.frameworkURL, this._paths.frameworkDirPath, this._paths.appDirPath, this._paths.appExternalURL);
	pathManager.setBaseURL(this._paths.appExternalURL);
	scriptManager.init(self._paths.frameworkURL, self._paths.appExternalURL, this._options.minifyMangle);
	scriptManager.setBaseURL(this._paths.appExternalURL);
	
	var i;
	for (i in this._options.resourceSizes) {
		this._resourceSizes[pathManager.expand(i)] = this._options.resourceSizes[i];
	}
	
	this._rootTemplateBody = fs.readFileSync(this._paths.frameworkClientDirPath + '/index.html', 'utf8');
	this._rootTemplate = handlebars.compile(this._rootTemplateBody);
	this._fullAuthResources = {};
	
	this._cacheVersion = this._options.cacheVersion;
	this._smartCacheManager = new SmartCacheManager(this._cacheVersion);
	
	this._defaultScriptType = 'text/javascript';
	this._defaultStyleType = 'text/css';
	this._defaultStyleRel = 'stylesheet';
	
	this._ssidRegex = new RegExp('(__' + this._paths.appExternalURL + 'ncssid=)([^;]*)');
	
	this.allowFullAuthResource(this._paths.spinJSURL);
	this.allowFullAuthResource(this._paths.frameworkSocketIOClientURL);
	this.allowFullAuthResource(this._paths.frameworkClientURL + 'assets/logo.png');
	this.allowFullAuthResource(this._paths.frameworkClientURL + 'scripts/failedconnection.js');
	this.allowFullAuthResource(this._paths.frameworkClientURL + 'scripts/cookiesdisabled.js');

	this.allowFullAuthResource(this._paths.frameworkURL + 'loader.js');
	
	this._retryOptions = {
		retries: 10,
		factor: 2,
		minTimeout: 1000,
		maxTimeout: 120000,
		randomize: false
	};
	
	this._fileUploader = require('ncombo/fileuploader');
	
	this._clusterEngine = require(this._options.clusterEngine);
	
	this._config = conf.parseConfig(__dirname + '/config.node.json');
	
	self._middleware = {};
	
	self._middleware[self.MIDDLEWARE_HTTP] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_HTTP].addFunction(self._prepareHTTPHandler);
	
	self._middleware[self.MIDDLEWARE_IO] = stepper.create({context: self});
	
	self._responseNotSentValidator = function(req, res) {
		return req && res && !res.finished;
	}
	
	self._tailGetStepper = stepper.create({context: self});
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
	
	self._middleware[self.MIDDLEWARE_GET] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_GET].addFunction(self.cacheEscapeHandler);
	self._middleware[self.MIDDLEWARE_GET].setTail(self._tailGetStepper);
	self._middleware[self.MIDDLEWARE_GET].setValidator(self._responseNotSentValidator);
	
	self._routStepper = stepper.create({context: self});
	self._routStepper.addFunction(self._faviconHandler);
	self._routStepper.addFunction(self._getParamsHandler);
	self._routStepper.addFunction(self._sessionHandler);
	self._routStepper.setTail(self._httpMethodJunction);
	
	self._middleware[self.MIDDLEWARE_POST] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_POST].setTail(function() {
		if(self._options.allowUploads) {
			self._fileUploader.upload.apply(self._fileUploader, arguments);
		}
	});
	
	self._middleware[self.MIDDLEWARE_HTTP].setTail(self._routStepper);
	
	self._middleware[self.MIDDLEWARE_LOCAL_CALL] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_LOCAL_CALL].setTail(gateway.exec);
	
	mime.define({
		'text/css': ['less'],
		'text/html': ['handlebars']
	});
	
	this._privateExtensions = this._config.privateExtensions;
	if(this._privateExtensions) {
		this._privateExtensionRegex = new RegExp('[.](' + this._privateExtensions.join('|').replace(/[.]/g, '[.]') + ')$');
	} else {
		this._privateExtensionRegex = /$a/;
	}
	self._customSIMExtension =  self._config.customSIMExtension;
	
	this._prerouter.init(this._options);
	self._router.init(self._privateExtensionRegex);
	self._preprocessor.init(self._options);
	self._headerAdder.init(self._options);
	
	self._ioClusterClient = new self._clusterEngine.IOClusterClient({
		port: this._options.dataPort,
		secretKey: this._options.dataKey,
		handshakeExpiry: this._options.handshakeTimeout,
		dataExpiry: this._options.sessionTimeout,
		addressSocketLimit: this._options.addressSocketLimit
	});
	
	self._ioClusterClient.on('sessiondestroy', function (sessionId) {
		self.emit(self.EVENT_SESSION_DESTROY, sessionId);
	});
};

Worker.prototype.handleCacheUpdate = function (url, content, size) {
	this._resourceSizes[url] = size;
	cache.clearMatches(new RegExp(cache.ENCODING_SEPARATOR + url + '$'));
	cache.set(cache.ENCODING_PLAIN, url, content);	
};

Worker.prototype.handleMasterEvent = function (event, data) {
	this.emit(event, data);
};

Worker.prototype.ready = function () {
	this.emit(this.EVENT_WORKER_START);
	process.send({action: 'ready'});
};

Worker.prototype._handleConnection = function (socket) {
	var self = this;
	
	var nComboNamespace = '__nc';
	
	socket.global = socket.global.ns(nComboNamespace);
	socket.session = socket.session.ns(nComboNamespace);
	
	var remoteAddress = socket.address;
	var auth = socket.auth;
	
	self.emit(self.EVENT_SOCKET_CONNECT, socket);
	
	if(auth !== undefined) {
		socket.session.setAuth(auth, function(err) {
			if(err) {
				self.emit(self.EVENT_SOCKET_FAIL, socket, err);
				socket.close();
				console.log('   nCombo Error - Failed to save auth data');
			}
		});
	}
	
	// handle local server interface call
	socket.on('localCall', function(request, response) {
		var req = new IORequest(request, socket, socket.session, self.global, remoteAddress, self._options.secure);
		var res = new IOResponse(request, response);
		self._middleware[self.MIDDLEWARE_IO].setTail(self._middleware[self.MIDDLEWARE_LOCAL_CALL]);
		self._middleware[self.MIDDLEWARE_IO].run(req, res);
	});
	
	socket.on('close', function() {
		self.emit(self.EVENT_SOCKET_DISCONNECT, socket);
	});
};

Worker.prototype._start = function () {
	var self = this;
	
	if(self._options.protocol == 'http') {
		self._server = http.createServer(self._middleware[self.MIDDLEWARE_HTTP].run);
	} else if(self._options.protocol == 'https') {
		if(self._options.protocolOptions) {
			self._server = https.createServer(self._options.protocolOptions, self._middleware[self.MIDDLEWARE_HTTP].run);
		} else {
			throw new Error("The protocolOptions option must be set when https is used");
		}
	} else {
		throw new Error("The " + self._options.protocol + " protocol is not supported");
	}
	
	var shasum = crypto.createHash('sha256');
	
	this._socketServer = socketCluster.attach(this._server, {
		ioClusterClient: this._ioClusterClient,
		transports: this._options.transports,
		pingTimeout: this._options.heartbeatTimeout,
		pingInterval: this._options.heartbeatInterval,
		upgradeTimeout: this._options.handshakeTimeout
	});
	
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
	
	self._server.listen(self._options.workerPort);
	self.global = self._ioClusterClient.global();

	gateway.setReleaseMode(self._options.release);
	ws.setReleaseMode(self._options.release);
	ws.setTimeout(self._options.connectTimeout * 1000);
	
	this._socketServer.on('connection', self._handleConnection.bind(self));
	
	var salt = crypto.randomBytes(32).toString('hex');
	shasum.update(this._options.dataKey + salt);
	var hashedKey = shasum.digest('hex');
	ws.init(hashedKey);
	gateway.init(self._paths.appDirPath + '/sims/', self._customSIMExtension);
	
	this.ready();
};

Worker.prototype.errorHandler = function(err) {
	this.emit(this.EVENT_FAIL, err);
	if(err.stack) {
		console.log(err.stack);
	} else {
		console.log(err);
	}
};

Worker.prototype.addMiddleware = function(type, callback) {
	if(!this._middleware.hasOwnProperty(type)) {
		console.log("   Middleware type '" + type + "' is invalid");
	}
	this._middleware[type].addFunction(callback);
};

Worker.prototype.removeMiddleware = function(type, callback) {
	if(this._middleware[type].getLength() > 0) {
		this._middleware[type].remove(callback);
	}
};

Worker.prototype.allowFullAuthResource = function(url) {
	this._fullAuthResources[url] = true;
};

Worker.prototype.denyFullAuthResource = function(url) {
	if(this._fullAuthResources.hasOwnProperty(url)) {
		delete this._fullAuthResources[url];
	}
};

Worker.prototype.isFullAuthResource = function(url) {
	return this._fullAuthResources.hasOwnProperty(url);
};

Worker.prototype._writeSessionStartScreen = function(req, res) {
	var encoding = this._getReqEncoding(req);
	
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST');
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	if(this._options.release && cache.has(encoding, req.url)) {
		this._respond(req, res, cache.get(encoding, req.url), 'text/html', true);
	} else {
		var includeString = this._createScriptTag(this._paths.frameworkURL + 'smartcachemanager.js', 'text/javascript') + "\n\t";
		includeString += this._createScriptTag(this._paths.timeCacheExternalURL, 'text/javascript') + "\n\t";
		includeString += this._createScriptTag(this._paths.spinJSURL, 'text/javascript') + "\n\t";
		includeString += this._createScriptTag(this._paths.frameworkSocketIOClientURL, 'text/javascript') + "\n\t";
		includeString += this._createScriptTag(this._paths.appExternalURL + this._paths.frameworkURL + 'session.js', 'text/javascript');
		
		var htmlAttr = '';
		var bodyAttr = '';
		
		if(this._options.angular) {
			htmlAttr = ' xmlns:ng="http://angularjs.org"';
			bodyAttr = ' ng-cloak';
		} else {
			htmlAttr = ' xmlns="http://www.w3.org/1999/xhtml"';
		}
		
		var html = this._rootTemplate({
			title: this._options.title,
			includes: new handlebars.SafeString(includeString),
			htmlAttr: htmlAttr,
			bodyAttr: bodyAttr
		});
		this._respond(req, res, html, 'text/html', true);
	}
};

Worker.prototype._getReqEncoding = function(req) {
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
};

Worker.prototype._sessionHandler = function(req, res, next) {
	var self = this;
	
	req.global = this.global;
	
	if(req.url == this._paths.timeCacheInternalURL) {
		var now = (new Date()).getTime();
		var expiry = new Date(now + this._options.cacheLife * 1000);
		res.setHeader('Content-Type', 'text/javascript');
		res.setHeader('Set-Cookie', '__' + this._paths.appExternalURL + 'nccached=0; Path=/');
		res.setHeader('Cache-Control', 'private');
		res.setHeader('Pragma', 'private');
		res.setHeader('Expires', expiry.toUTCString());
		res.writeHead(200);
		var script = '/* Check if cached */';
		res.end(script);
	} else {
		var sid = this._parseSSID(req.headers.cookie);
		var url;
		
		if(req.url == '/') {
			url = this._paths.rootTemplateURL;
		} else {
			url = req.url;
		}
		
		var filePath = pathManager.urlToPath(url);
		
		if(url == this._paths.rootTemplateURL) {
			this._writeSessionStartScreen(req, res);
		} else {
			var encoding = this._getReqEncoding(req);
			var skipCache = (url == this._paths.frameworkURL + 'smartcachemanager.js');
			
			if(skipCache || url == this._paths.frameworkSocketIOClientURL || url == this._paths.frameworkURL + 'session.js'
					|| this.isFullAuthResource(url)) {
				
				if(this._options.release && cache.has(encoding, url)) {
					this._respond(req, res, cache.get(encoding, url), null, skipCache);
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
						
							if(url == self._paths.frameworkURL + 'smartcachemanager.js') {
								var template = handlebars.compile(data.toString());
								data = template({cacheVersion: '*/ = ' + cacheVersion + ' /*'});
							} else if(url == self._paths.frameworkURL + 'session.js') {
								var appDef = self._options.appDef;
								
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
									port: self._options.port,
									frameworkURL: self._paths.frameworkURL,
									frameworkClientURL: self._paths.frameworkClientURL,
									autoSession: self._options.autoSession ? 1 : 0,
									timeout: self._options.connectTimeout * 1000,
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
					req.session = this._ioClusterClient.session(sid);
					next();
				} else if(!this._options.publicResources && this._options.autoSession) {
					res.writeHead(500);
					res.end('File cannot be accessed outside of a session');
				} else {
					next();
				}
			}
		}
	}
};

Worker.prototype._rewriteHTTPRequest = function(req) {
	req.url = pathManager.simplify(req.url);
};

Worker.prototype._prepareHTTPHandler = function(req, res, next) {
	res.connection && res.connection.setNoDelay(true);
	next();
};

Worker.prototype._faviconHandler = function(req, res, next) {
	var self = this;
	var iconPath = this._paths.appDirPath + '/assets/favicon.gif';
	
	if(req.url == '/favicon.ico') {
		fs.readFile(iconPath, function(err, data) {
			if(err) {
				if(err.code == 'ENOENT') {
					iconPath = self._paths.frameworkClientDirPath + '/assets/favicon.gif';
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
							self._applyFileResponseHeaders(res, iconPath);
							res.writeHead(200);
							res.end(data);
						}
					});
				} else {
					res.writeHead(500);
					res.end();
				}
			} else {
				self._applyFileResponseHeaders(res, iconPath);
				res.writeHead(200);
				res.end(data);
			}
		});
	} else {
		next();
	}
};

Worker.prototype._getParamsHandler = function(req, res, next) {
	var urlParts = url.parse(req.url);
	var query = urlParts.query;
	req.url = urlParts.pathname;
	req.params = querystring.parse(query);
	next();
};

Worker.prototype._parseSSID = function(cookieString) {
	if(cookieString) {
		var result = cookieString.match(this._ssidRegex);
		if(result) {
			return result[2];
		}
	}
	return null;
};

Worker.prototype._applyFileResponseHeaders = function(res, filePath, mimeType, forceRefresh) {
	if(!mimeType) {
		mimeType = mime.lookup(filePath);
	}
	
	if(this._options.release && !forceRefresh) {
		var now = new Date();
		var expiry = new Date(now.getTime() + this._options.cacheLife * 1000);
		
		res.setHeader('Cache-Control', this._options.cacheType);
		res.setHeader('Pragma', this._options.cacheType);
		res.setHeader('Expires', expiry.toUTCString());
	} else {
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Pragma', 'no-cache');
	}
	
	res.setHeader('Content-Type', mimeType);
};

Worker.prototype._normalizeURL = function (url) {
	url = path.normalize(url);
	return url.replace(/\\/g, '/');
};

Worker.prototype._createScriptCodeTag = function(code, type) {
	if(!type) {
		type = this._defaultScriptType;
	}
	return '<script type="' + type + '">' + code + '</script>';
};

Worker.prototype._createScriptTag = function(url, type) {
	url = this._normalizeURL(url);
	if(this._options.release) {
		url = this._smartCacheManager.setURLCacheVersion(url);
	}
	return '<script type="' + type + '" src="' + url + '"></script>';
};

Worker.prototype._createStyleTag = function(url, type) {
	url = this._normalizeURL(url);
	if(this._options.release) {
		url = this._smartCacheManager.setURLCacheVersion(url);
	}
	return '<link rel="' + this._defaultStyleRel + '" type="' + type + '" href="' + url + '" />';
};

function IORequest(req, socket, session, global, remoteAddress, secure) {
	var i;
	for(i in req) {
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
	for(i in req) {
		self[i] = req[i];
	}
	
	self.end = function(data) {
		res.end(data);
	}
	
	self.error = function(error, data) {
		res.error(error, data);
	}
};

module.exports = Worker;