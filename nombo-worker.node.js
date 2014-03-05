var http = require('http');
var https = require('https');
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
var cheerio = require('cheerio');
var retry = require('retry');
var domain = require('domain');
var async = require('async');
var less = require('less');

var Worker = function (options) {
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
	self.EVENT_WORKER_EXIT = 'exit';
	self.EVENT_SOCKET_CONNECT = 'socketconnect';
	self.EVENT_SOCKET_DISCONNECT = 'socketdisconnect';
	self.EVENT_SESSION_DESTROY = 'sessiondestroy';
	
	self._errorDomain = domain.create();
	self._errorDomain.on('error', function () {
		self.errorHandler.apply(self, arguments);
		if (self._options.rebootWorkerOnError) {
			self.emit(self.EVENT_WORKER_EXIT);
		}
	});
	
	self.start = self._errorDomain.bind(self._start);
	self._errorDomain.run(function () {
		self._init(options);
	});
};

Worker.prototype = Object.create(EventEmitter.prototype);

Worker.prototype._init = function (options) {
	var self = this;
	
	self._options = options;
	self._options.secure = self._options.protocol == 'https';
	
	self.id = self._options.workerId;
	self.isLeader = self._options.lead;
	
	self._httpRequestCount = 0;
	self._ioRequestCount = 0;
	self._httpRPM = 0;
	self._ioRPM = 0;
	
	self._customPreps = {};
	
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
	cachemere.on('notice', self.noticeHandler.bind(self));
	
	var appFilesURLRegex = new RegExp('^' + self._options.appDef.appFilesURL);
	
	var defaultCacheClassifier = function (url) {
		if (appFilesURLRegex.test(url)) {
			return cachemere.CACHE_TYPE_WEAK;
		}
		return cachemere.CACHE_TYPE_STRONG;
	};
	
	cachemere.init({
		mapper: pathManager.urlToPath,
		maxSize: self._options.serverCacheMaxSize,
		maxEntrySize: self._options.serverCacheMaxEntrySize,
		cacheLife: self._options.serverCacheLife,
		classifier: defaultCacheClassifier
	});
	
	var i;
	for (i in self._bundles) {
		cachemere.setRaw(i, self._bundles[i], 'text/javascript', true);
	}
	
	self._uglifier = new Uglifier({
		mangle: self._options.minifyMangle,
		timeout: self._options.minifyTimeout * 1000
	});
	
	self._errorDomain.add(self._uglifier);
	self._uglifier.on('notice', self.noticeHandler.bind(self));
	
	for (i in self._options.resourceSizes) {
		self._resourceSizes[i] = self._options.resourceSizes[i];
	}
	
	self._publicResources = {};
	
	self._cacheVersion = self._options.cacheVersion;
	self._smartCacheManager = new SmartCacheManager(self._cacheVersion);
	
	self._defaultScriptType = 'text/javascript';
	self._defaultStyleType = 'text/css';
	self._defaultStyleRel = 'stylesheet';
	
	self._ssidRegex = new RegExp('(^|; *)(' + self._options.appDef.sessionCookieName + '=)([^;]*)');
	
	self.setPublicResource(self._paths.spinJSURL);
	self.setPublicResource(self._paths.frameworkURL + 'smartcachemanager.js');
	self.setPublicResource(self._paths.frameworkSocketClientURL);
	self.setPublicResource(self._paths.frameworkURL + 'session.js');
	self.setPublicResource(self._paths.frameworkClientURL + 'assets/logo.png');
	self.setPublicResource(self._paths.failedConnectionURL);
	self.setPublicResource(self._paths.cookiesDisabledURL);
	self.setPublicResource(self._paths.frameworkURL + 'loader.js');
	self.setPublicResource(self._paths.loadScriptURL);
	self.setPublicResource(self._paths.statusURL);
	
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
	self._middleware[self.MIDDLEWARE_HTTP].addFunction(self._statusRequestHandler);
	
	self._middleware[self.MIDDLEWARE_IO] = stepper.create({context: self});
	
	self._errorDomain.add(self._middleware[self.MIDDLEWARE_IO]);
	
	self._fetchFile = function (req, res, next) {
		cachemere.fetch(req, function (err, resource) {
			if (req.params.cv) {
				var exp = new Date(Date.now() + self._options.clientCacheLife * 1000).toUTCString();
				resource.headers['Cache-Control'] = self._options.clientCacheType;
				resource.headers['Pragma'] = self._options.clientCacheType;
				resource.headers['Expires'] = exp;
			}
			resource.output(res);
		});
	};
	
	self._middleware[self.MIDDLEWARE_GET] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_GET].setTail(self._fetchFile);
	
	self._httpMethodJunction = function (req, res) {
		if (req.method == 'POST') {
			self._middleware[self.MIDDLEWARE_POST].run(req, res);
		} else {
			self._middleware[self.MIDDLEWARE_GET].run(req, res);
		}
	};
	
	self._mainStepper = stepper.create({context: self});
	self._mainStepper.addFunction(self._getParamsHandler);
	self._mainStepper.addFunction(self._sessionHandler);
	self._mainStepper.addFunction(self._cacheVersionHandler);
	self._mainStepper.setTail(self._httpMethodJunction);
	
	self._middleware[self.MIDDLEWARE_POST] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_POST].setTail(function () {
		if (self._options.allowUploads) {
			self._fileUploader.upload.apply(self._fileUploader, arguments);
		}
	});
	
	self._middleware[self.MIDDLEWARE_HTTP].setTail(self._mainStepper);
	
	self._middleware[self.MIDDLEWARE_RPC] = stepper.create({context: self});
	self._middleware[self.MIDDLEWARE_RPC].setTail(gateway.exec);
	
	self._middleware[self.MIDDLEWARE_IO].setTail(self._middleware[self.MIDDLEWARE_RPC]);
	
	mime.define({
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
		stores: self._options.stores,
		dataKey: self._options.dataKey,
		connectTimeout: self._options.connectTimeout,
		dataExpiry: self._options.sessionTimeout,
		heartRate: self._options.sessionHeartRate,
		addressSocketLimit: self._options.addressSocketLimit
	});

	self._errorDomain.add(self._ioClusterClient);
	
	self._ioClusterClient.on('sessiondestroy', function (sessionId) {
		self.emit(self.EVENT_SESSION_DESTROY, sessionId);
	});
	
	if (self._options.useLessCSS) {
		self.setPrep('css', function (resource, callback) {
			if (typeof resource.content != 'string') {
				resource.content = resource.content.toString();
			}
			less.render(resource.content, callback);
		});
	}
};

Worker.prototype.getPaths = function () {
	var paths = {};
	for (var i in this._paths) {
		paths[i] = this._paths[i];
	}
	return paths;
};

Worker.prototype.handleCacheUpdate = function (url, content, size) {
	this._resourceSizes[url] = size;
	cachemere.setRaw(url, content, null, true);
};

Worker.prototype.handleCacheVersionUpdate = function (cacheVersion) {
	this._cacheVersion = cacheVersion;
	this._smartCacheManager.setCacheVersion(this._cacheVersion);
	
	// Force Cachemere to update the root HTML - Preprocessing will make use of the new cache version.
	cachemere.set({
		url: this._paths.appURL
	});
};

Worker.prototype.handleMasterEvent = function () {
	this.emit.apply(this, arguments);
};

Worker.prototype.ready = function () {
	this.emit(this.EVENT_WORKER_START);
};

Worker.prototype._handleConnectionNotReady = function (socket) {
	var self = this;
	
	self._errorDomain.add(socket);
	socket.emit('fail', 'Server is not ready. Please try again later');
	socket.close();
	
	socket.on('close', function () {
		self._errorDomain.remove(socket);
	});
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
	
	var appDef = {};
	
	for (var def in self._options.appDef) {
		appDef[def] = self._options.appDef[def];
	};
	
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
			debug: self._options.release ? 'false' : 'true',
			spinner: self._options.spinner ? 'true' : 'false',
			spinnerOptions: JSON.stringify(self._options.spinnerOptions)
		});
		return result;
	};
	
	specialPreps[self._paths.appURL] = function (data) {
		var scriptTags = [];
		scriptTags.push(self._createScriptTag(self._paths.freshnessURL, 'text/javascript', true));
		scriptTags.push(self._createScriptTag(self._paths.frameworkURL + 'smartcachemanager.js', 'text/javascript'));
		scriptTags.push(self._createScriptTag(self._paths.spinJSURL, 'text/javascript'));
		scriptTags.push(self._createScriptTag(self._paths.frameworkSocketClientURL, 'text/javascript'));
		scriptTags.push(self._createScriptTag(self._paths.frameworkURL + 'loader.js', 'text/javascript'));
		scriptTags.push(self._createScriptTag(self._paths.loadScriptURL, 'text/javascript'));
		scriptTags.push(self._createScriptTag(self._paths.frameworkURL + 'session.js', 'text/javascript'));
		
		var $ = cheerio.load(data.content.toString());
		
		if (!$('title').length) {
			$('head').append('<title>' + self._options.title + '</title>');
		}
		for (var i in scriptTags) {
			$('head').append(scriptTags[i]);
		}
		return $.html();
	};
	
	var cssAbsoluteRegex = /^([\/\\]|https?:\/\/)/;
	var cssImportRegex = /([^A-Za-z0-9\/]|^) *@import +["']([^"']+)["']/g;
	var cssURLRegex = /([^A-Za-z0-9]|^)url[(][ ]*["']?([^"')]*)["']?[ ]*[)]/g;

	var cssImportURLRegex = /["'][^"']+/;

	var urlToAbsolutePath = function (currentDirPath, url) {
		var absolutePath;
		if (cssAbsoluteRegex.test(url)) {
			absolutePath = pathManager.urlToPath(url);
		} else {
			absolutePath = currentDirPath + url;
		}
		return pathManager.toUnixSep(path.normalize(absolutePath));
	};

	var flattenCSS = function (filePath, content, callback, importMap, importedMap, rootPath) {
		var isRoot = false;
		
		if (importMap == null) {
			importMap = {};
		}
		if (importedMap == null) {
			importedMap = {};
		}
		if (rootPath == null) {
			isRoot = true;
			rootPath = filePath;
		}
		
		var currentDir = path.dirname(filePath) + '/';
		
		var rebaseURLs = function (fileContent) {
			return fileContent.replace(cssURLRegex, function (match, first, second) {
				var subPath = urlToAbsolutePath(currentDir, second);
				return first + 'url("' + pathManager.pathToURL(subPath) + '")';
			});
		};
		
		var importTasks = [];
		var imports = content.match(cssImportRegex);
		var matches, relURL, importPath;
		
		for (var i in imports) {
			matches = imports[i].match(cssImportURLRegex);
			if (matches) {
				relURL = matches[0].slice(1);
				importPath = urlToAbsolutePath(currentDir, relURL);
				
				(function (importPath) {
					importTasks.push(function (cb) {
						fs.readFile(importPath, {encoding: 'utf8'}, function (err, data) {
							if (err) {
								cb(err);
							} else {
								flattenCSS(importPath, data, cb, importMap, importedMap, rootPath);
							}
						});
					});
				})(importPath);
			}
		}
		
		if (importTasks.length > 0) {
			async.parallel(importTasks, function (err, results) {
				if (err) {
					callback(err);
				} else {
					content = content.replace(cssImportRegex, function (match, first, second) {
						var subPath = urlToAbsolutePath(currentDir, second);
						
						var importedContent;
						if (importMap[subPath]) {
							importedContent = importMap[subPath];
							delete importMap[subPath];
						} else {
							importedContent = '';
						}
						return importedContent;
					});
					
					content = rebaseURLs(content);
					
					importMap[filePath] = content;
					importedMap[filePath] = content;
					
					var dependencies = [];
					if (isRoot) {
						for (var j in importedMap) {
							if (j != filePath) {
								dependencies.push(j);
							}
						}
					}
					callback(null, content, dependencies);
				}
			});
		} else {
			content = rebaseURLs(content);
			importMap[filePath] = content;
			importedMap[filePath] = content;
			
			var dependencies = [];
			if (isRoot) {
				for (var j in importedMap) {
					if (j != filePath) {
						dependencies.push(j);
					}
				}
			}
			callback(null, content, dependencies);
		}
	};
	
	var mainBundles = {};
	mainBundles[self._options.appDef.frameworkCoreBundleURL] = 1;
	mainBundles[self._options.appDef.appLibBundleURL] = 1;
	mainBundles[self._options.appDef.appScriptBundleURL] = 1;
	mainBundles[self._options.appDef.appStyleBundleURL] = 1;
	mainBundles[self._options.appDef.appTemplateBundleURL] = 1;
	
	var activeMinifications = {};
	
	var extPreps = {
		js: function (resource, callback) {
			var content;
			
			if (specialPreps[resource.url]) {
				content = specialPreps[resource.url](resource);
			} else {
				content = resource.content.toString();
			}
			if (scriptManager.isJSModule(resource.url)) {
				content = scriptManager.moduleWrap(resource.url, content);
			}
			if (self._options.release) {
				var minifyOptions = {
					url: resource.url,
					content: content
				};
				if (mainBundles[resource.url]) {
					minifyOptions.noTimeout = true;
					self._uglifier.minifyJS(minifyOptions, function (err, minifiedContent) {
						if (err) {
							if (err instanceof Error) {
								err = err.message;
							}
							self.noticeHandler(err + ': ' + resource.url);
							callback(null, content);
						} else {
							callback(null, minifiedContent);
						}
					});
				} else {
					callback(null, content);
					self._uglifier.minifyJS(minifyOptions, function (err, minifiedContent, freshest) {
						if (freshest) {
							if (err) {
								if (err instanceof Error) {
									err = err.message;
								}
								self.noticeHandler(err + ': ' + resource.url);
							} else {
								cachemere.set({
									url: resource.url,
									content: minifiedContent,
									mime: 'text/javascript',
									preprocessed: true
								});
							}
						}
					});
				}
			} else {
				return content;
			}
		},
		css: function (resource, callback) {
			var filePath = pathManager.urlToPath(resource.url);
			var resContent;
			if (typeof resource.content == 'string') {
				resContent = resource.content;
			} else {
				resContent = resource.content.toString();
			}
			
			flattenCSS(filePath, resContent, function (err, content, dependencies) {
				if (err) {
					self.errorHandler(err);
				} else {
					cachemere.setDeps(resource.url, dependencies);
					
					if (self._options.release) {
						var minifyOptions = {
							url: resource.url,
							content: content
						};
						if (mainBundles[resource.url]) {
							minifyOptions.noTimeout = true;
							self._uglifier.minifyCSS(minifyOptions, function (err, minifiedContent) {
								if (err) {
									if (err instanceof Error) {
										err = err.message;
									}
									self.noticeHandler(err + ': ' + resource.url);
									callback(null, content);
								} else {
									callback(null, minifiedContent);
								}
							});
						} else {
							callback(null, content);
							self._uglifier.minifyCSS(minifyOptions, function (err, minifiedContent, freshest) {
								if (freshest) {
									if (err) {
										if (err instanceof Error) {
											err = err.message;
										}
										self.noticeHandler(err + ': ' + resource.url);
									} else {
										cachemere.set({
											url: resource.url,
											content: minifiedContent,
											mime: 'text/css',
											preprocessed: true
										});
									}
								}
							});
						}
					} else {
						callback(null, content);
					}
				}
			});
		}
	};
	
	var extRegex = /[.]([^.]+)$/;
	self._prepProvider = function (url) {
		var matches = url.match(extRegex);
		if (matches) {
			var ext = matches[1];
			
			if (self._customPreps[ext]) {
				self._customPreps[ext];
				return function (resource, callback) {
					self._customPreps[ext](resource, function (err, content) {
						if (!err && extPreps[ext]) {
							resource.content = content;
							extPreps[ext](resource, callback);
						} else {
							callback(err, content);
						}
					});
				};
			}
			
			if (extPreps[ext]) {
				return extPreps[ext];
			}
			return false;
		} else if (specialPreps[url]) {
			return specialPreps[url];
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
		sourcePort: self._options.port,
		ioClusterClient: self._ioClusterClient,
		transports: self._options.transports,
		pingTimeout: self._options.heartbeatTimeout,
		pingInterval: self._options.heartbeatInterval,
		upgradeTimeout: self._options.connectTimeout,
		hostname: self._options.hostname,
		secure: self._options.protocol == 'https',
		appName: self._options.appName
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
	
	var serverNotReady = self._handleConnectionNotReady.bind(self);
	self._socketServer.on('connection', serverNotReady);
	gateway.init(self._paths.appDirPath + '/sims/', self._customSIMExtension);
	
	self._getFavicon(function (err, data) {
		if (err) {
			throw new Error('Failed to get favicon due to the following error: ' + (err.message || err));
		} else {
			var favURL = '/favicon.ico';
			cachemere.setRaw(favURL, data, 'image/gif', true);
			self.setPublicResource(favURL);
			cachemere.on('ready', function () {
				self._socketServer.removeListener('connection', serverNotReady);
				self._socketServer.on('connection', self._handleConnection.bind(self));
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

Worker.prototype.setPrep = function (fileExt, prep) {
	this._customPreps[fileExt] = prep;
};

Worker.prototype.errorHandler = function (err) {
	this.emit('error', err);
};

Worker.prototype.noticeHandler = function (notice) {
	if (notice.message != null) {
		notice = notice.message;
	}
	this.emit('notice', notice);
};

Worker.prototype.setCacheClassifier = function (classifier) {
	cachemere.setClassifier(classifier);
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

Worker.prototype.setPublicResource = function (url) {
	this._publicResources[url] = true;
};

Worker.prototype.unsetPublicResource = function (url) {
	if (this._publicResources.hasOwnProperty(url)) {
		delete this._publicResources[url];
	}
};

Worker.prototype.isPublicResource = function (url) {
	return this._publicResources.hasOwnProperty(url);
};

Worker.prototype._statusRequestHandler = function (req, res, next) {
	if (req.url == this._paths.statusURL) {
		var self = this;
		
		var buffers = [];
		req.on('data', function (chunk) {
			buffers.push(chunk);
		});
		
		req.on('end', function () {
			var statusReq = null;
			try {
				statusReq = JSON.parse(Buffer.concat(buffers).toString());
			} catch (e) {}
			
			if (statusReq && statusReq.dataKey == self._options.dataKey) {
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
		if (self.isPublicResource(url)) {
			cachemere.fetch(req, function (err, resource) {
				if (req.params.cv) {
					var exp = new Date(Date.now() + self._options.clientCacheLife * 1000).toUTCString();
					resource.headers['Cache-Control'] = self._options.clientCacheType;
					resource.headers['Pragma'] = self._options.clientCacheType;
					resource.headers['Expires'] = exp;
				}
				resource.output(res);
			});
		} else {
			if (sid) {
				req.session = this._ioClusterClient.session(sid);
				next();
			} else if (!this._options.publicResources && url != self._paths.freshnessURL) {
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				var notice = 'File at URL ' + url + ' cannot be accessed outside of a session';
				res.end(notice);
				self.noticeHandler(notice);
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