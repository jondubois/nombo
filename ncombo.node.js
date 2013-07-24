var LoadBalancer = require('loadbalancer');
var fs = require('fs');
var url = require('url');
var browserify = require('browserify');
var scriptManager = require('ncombo/scriptmanager');
var cssBundler = require('ncombo/css-bundler');
var templateBundler = require('ncombo/template-bundler');
var SmartCacheManager = require("./smartcachemanager").SmartCacheManager;
var watchr = require('watchr');
var path = require('path');
var pathManager = require('ncombo/pathmanager');
var portScanner = require('portscanner');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain');
var fork = require('child_process').fork;
var Master = function () {
	var self = this;
	this.EVENT_FAIL = 'fail';
	this.errorDomain = domain.create();
	this.errorDomain.on('error', function () {
		self.errorHandler.apply(self, arguments);
	});
	this.errorDomain.add(this);
	this.start = this.errorDomain.bind(this._start);
};
Master.prototype = Object.create(EventEmitter.prototype);
Master.prototype.errorHandler = function(err) {
	this.emit(this.EVENT_FAIL, err);
	if(err.stack) {
		console.log(err.stack);
	} else {
		console.log(err);
	}
};
Master.prototype._start = function (options) {
	var self = this;
	
	this._options = {
		port: 8000,
		workerPorts: [9000],
		release: false,
		title: 'nCombo App',
		angular: false,
		angularMainModule: null,
		angularMainTemplate: 'index.html',
		protocol: 'http',
		protocolOptions: {},
		transports: ['polling', 'websocket'],
		logLevel: 1,
		connectTimeout: 10,
		handshakeTimeout: 10,
		sessionTimeout: 1200,
		cacheLife: 2592000,
		cacheType: 'private',
		cacheVersion: null,
		origins: '*:*',
		autoSession: true,
		publicResources: true,
		minifyMangle: false,
		matchOriginProtocol: true,
		addressSocketLimit: null,
		pollingDuration: 30,
		heartbeatInterval: 25,
		heartbeatTimeout: 60,
		allowUploads: false,
		baseURL: null,
		clusterEngine: 'iocluster'
	};
	
	for (var i in options) {
		this._options[i] = options[i];
	}
	
	self._extRegex = /[.][^\/\\]*$/;
	self._slashSequenceRegex = /\/+/g;
	self._startSlashRegex = /^\//;
		self._bundledResources = [];	self._resourceSizes = {};	
	self._paths = {};
	
	self._paths.frameworkURL = '/~framework/';
	
	self._paths.frameworkDirPath = __dirname;
	self._paths.frameworkClientDirPath = self._paths.frameworkDirPath + '/client';
	self._paths.frameworkClientURL = self._paths.frameworkURL + 'client/';
	
	self._paths.frameworkModulesURL = self._paths.frameworkURL + 'node_modules/';
	
	self._paths.appDirPath = path.dirname(require.main.filename);
	self._paths.appWorkerControllerPath = self._paths.appDirPath + '/worker.node';
	
	self._paths.appLoadScriptPath = self._paths.appDirPath + '/scripts/load.js';
	self._paths.frameworkLoadScriptPath = self._paths.frameworkClientDirPath + '/scripts/load.js';
	self._paths.rootTemplateURL = self._paths.frameworkClientURL + 'index.html';
	
	self._paths.spinJSURL = self._paths.frameworkClientURL + 'libs/spin.js';
	
	self._appName = path.basename(self._paths.appDirPath);
	
	self._paths.appExternalURL = ('/' + (self._appName || this._options.baseURL) + '/').replace(self._slashSequenceRegex, '/');
	self._paths.appInternalURL = '/';
	self._paths.timeCacheExternalURL = self._paths.appExternalURL + '~timecache';
	self._paths.timeCacheInternalURL = self._paths.appInternalURL + '~timecache';
	
	pathManager.init(self._paths.frameworkURL, self._paths.frameworkDirPath, self._paths.appDirPath, self._paths.appExternalURL);
	
	if(this._options.angular) {
		self.bundle.framework.lib('angular.js', 0);
		this._options.angularMainTemplate && self.bundle.app.template(this._options.angularMainTemplate);
	}
	scriptManager.init(self._paths.frameworkURL, self._paths.appExternalURL, this._options.minifyMangle);
	
	pathManager.setBaseURL(this._paths.appExternalURL);
	scriptManager.setBaseURL(this._paths.appExternalURL);	
	self._paths.frameworkSocketIOClientURL = self._paths.frameworkModulesURL + 'socketcluster-client/socketcluster.js';
	
	self._minAddressSocketLimit = 30;
	self._dataExpiryAccuracy = 5000;
	
	if(this._options.addressSocketLimit == null) {
		var limit = this._options.sessionTimeout / 10;
		if(limit < self._minAddressSocketLimit) {
			limit = self._minAddressSocketLimit;
		}
		this._options.addressSocketLimit = limit;
	}
	
	var appDef = self._getAppDef(true);
	this._options.minifyURLs = [appDef.appScriptsURL, appDef.appLibsURL, appDef.frameworkClientURL + 'scripts/load.js', 
			self._paths.frameworkURL + 'ncombo-client.js', self._paths.frameworkURL + 'loader.js', 
			self._paths.frameworkURL + 'smartcachemanager.js'];
	
	self._clientScriptMap = {};
	self._clientScripts = [];
	self._clientStyles = [];
	self._clientTemplates = [];
	
	self._clusterEngine = require(this._options.clusterEngine);
	if(!this._options.release && this._options.cacheLife == null) {
		this._options.cacheLife = 86400;
	}
	
	self._colorCodes = {
		red: 31,
		green: 32,
		yellow: 33
	};
	
	console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching nCombo server');
	if(!this._options.release) {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
	}
	
	if (this._options.cacheVersion == null) {
		this._options.cacheVersion = (new Date()).getTime();
	}
	
	self.useStyle(self._paths.frameworkClientURL + 'styles/ncombo.css');
	self.useScript(self._paths.frameworkClientURL + 'libs/jquery.js');
	self.useScript(self._paths.frameworkModulesURL + 'handlebars/dist/handlebars.js');
	self.useScript(self._paths.frameworkClientURL + 'libs/json2.js');
	self.useScript(self._paths.frameworkURL + 'ncombo-client.js');
	
	var bundles = {};
	self._workers = [];
	
	var stylePaths = [];
	
	for (var i in self._clientStyles) {
		stylePaths.push(self._clientStyles[i].path);
	}
	
	var styleDirs = [pathManager.urlToPath(appDef.frameworkStylesURL), pathManager.urlToPath(appDef.appStylesURL)];
	
	var styleBundle = cssBundler({watchDirs: styleDirs, files: stylePaths, watch: !this._options.release});
	self._smartCacheManager = new SmartCacheManager(this._options.cacheVersion);
	
	if (fs.existsSync(self._paths.appLoadScriptPath)) {
		self._paths.loadScriptURL = pathManager.pathToURL(self._paths.appLoadScriptPath);
	} else {
		self._paths.loadScriptURL = pathManager.pathToURL(self._paths.frameworkLoadScriptPath);
	}
	
	var newURL;
	var externalAppDef = self._getAppDef();
	var pathToRoot = '../..';
	
	var cssURLFilter = function (url, rootDir) {
		rootDir = pathManager.toUnixSep(rootDir);
		newURL = pathToRoot + pathManager.pathToURL(rootDir) + '/' + url;
		newURL = pathManager.toUnixSep(path.normalize(newURL));
		if (self._options.release) {
			newURL = self._smartCacheManager.setURLCacheVersion(newURL);
		}
		
		return newURL;
	};
	
	var updateCSSBundle = function() {
		var cssBundle = styleBundle.bundle(cssURLFilter);
		if (self._options.release) {
			cssBundle = styleBundle.minify(cssBundle);
		}
		var size = Buffer.byteLength(cssBundle, 'utf8');
		var data;
		for (var i in self._workers) {
			data = {
				url: appDef.appStyleBundleURL,
				content: cssBundle,
				size: size
			};
			self._workers[i].send({action: 'updateCache', data: data});
		}
		bundles[appDef.appStyleBundleURL] = cssBundle;
	};
	
	var templatePaths = [];
	
	for (i in self._clientTemplates) {
		templatePaths.push(self._clientTemplates[i].path);
	}
	
	var templateDirs = [pathManager.urlToPath(appDef.appTemplatesURL)];
	var templateBundle = templateBundler({watchDirs: templateDirs, files: templatePaths, watch: !this._options.release});
	
	var updateTemplateBundle = function() {
		var htmlBundle = templateBundle.bundle();
		var size = Buffer.byteLength(htmlBundle, 'utf8');
		var data;
		for (var i in self._workers) {
			data = {
				url: appDef.appTemplateBundleURL,
				content: htmlBundle,
				size: size
			};
			self._workers[i].send({action: 'updateCache', data: data});
		}
		bundles[appDef.appTemplateBundleURL] = htmlBundle;
	};
	
	var libPaths = [];
	var jsLibCodes = {};
	
	for (i in self._clientScripts) {
		libPaths.push(self._clientScripts[i].path);
		jsLibCodes[self._clientScripts[i].path] = fs.readFileSync(self._clientScripts[i].path, 'utf8');
	}
	
	var makeLibBundle = function() {
		var libArray = [];
		var i;
		for (i in jsLibCodes) {
			if (jsLibCodes[i]) {
				libArray.push(jsLibCodes[i]);
			}
		}
		var libBundle = libArray.join('\n');
		if (self._options.release) {
			libBundle = scriptManager.minify(libBundle);
		}
		bundles[appDef.appLibBundleURL] = libBundle;
		
		var size = Buffer.byteLength(libBundle, 'utf8');
		var data;
		for (var i in self._workers) {
			data = {
				url: appDef.appLibBundleURL,
				content: libBundle,
				size: size
			};
			self._workers[i].send({action: 'updateCache', data: data});
		}
	};
	
	var updateLibBundle = function (event, filePath) {
		if (event == 'delete') {
			jsLibCodes[filePath] = null;
		} else if((event == 'create' || event == 'update') && jsLibCodes.hasOwnProperty(filePath)) {
			jsLibCodes[filePath] = fs.readFileSync(filePath, 'utf8');
		}
		makeLibBundle();
	};
	
	var bundleOptions = {debug: !this._options.release, watch: !this._options.release, exports: 'require'};
	var scriptBundle = browserify(bundleOptions);
	scriptBundle.addEntry(pathManager.urlToPath(appDef.appScriptsURL + 'index.js'));
	
	var updateScriptBundle = function (callback) {
		var jsBundle = scriptBundle.bundle();
		if (self._options.release) {
			jsBundle = scriptManager.minify(jsBundle);
		}
		bundles[appDef.appScriptBundleURL] = jsBundle;
		var size = Buffer.byteLength(jsBundle, 'utf8');
		var data;
		for (var i in self._workers) {
			data = {
				url: appDef.appScriptBundleURL,
				content: jsBundle,
				size: size
			};
			self._workers[i].send({action: 'updateCache', data: data});
		}
		callback && callback();
	};
	
	var initBundles = function (callback) {
		updateCSSBundle();
		updateTemplateBundle();
		makeLibBundle();
		updateScriptBundle(callback);
	};
	
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
	};
	
	var minifiedScripts = scriptManager.minifyScripts(this._options.minifyURLs);
	
	var leaderId = -1;
	var firstTime = true;
	
	portScanner.checkPortStatus(this._options.port, 'localhost', function (err, status) {
		if (err || status == 'open') {
			console.log('   nCombo Error - Port ' + self._options.port + ' is already taken');
			process.exit();
		} else {			
			self._balancer = fork(__dirname + '/ncombo-balancer.node.js');
			
			portScanner.findAPortNotInUse(self._options.port + 1, self._options.port + 998, 'localhost', function (error, datPort) {
				console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching cluster engine');
				
				if (error) {
					console.log('   nCombo Error - Failed to acquire new port; try relaunching');
					process.exit();
				}
				
				dataPort = datPort;
				var pass = crypto.randomBytes(32).toString('hex');
				
				self._ioClusterServer = new self._clusterEngine.IOClusterServer({
					port: dataPort,
					secretKey: pass,
					expiryAccuracy: self._dataExpiryAccuracy
				});
				
				self._ioClusterServer.on('ready', function() {
					var i;
					var workerReadyHandler = function (data, worker) {
						self._workers.push(worker);
						if (worker.id == leaderId) {
							worker.send({action: 'emit', event: self.EVENT_LEADER_START});
						}
						if (self._workers.length >= self._options.workerPorts.length && firstTime) {									
							console.log('   ' + self.colorText('[Active]', 'green') + ' nCombo server started');
							console.log('            Port: ' + self._options.port);
							console.log('            Mode: ' + (self._options.release ? 'Release' : 'Debug'));
							if (self._options.release) {
								console.log('            Version: ' + self._options.cacheVersion);
							}
							console.log('            Number of workers: ' + self._options.workerPorts.length);
							console.log();
							firstTime = false;
							
							self._balancer.send({
								action: 'init',
								data: {
									sourcePort: self._options.port,
									destPorts: self._options.workerPorts
								}
							});
						}
					};
					
					var launchWorker = function (port, lead) {
						var i;
						var resourceSizes = {};
						for (i in bundles) {
							resourceSizes[i] = Buffer.byteLength(bundles[i], 'utf8');
						}
						
						var styleAssetSizeMap = styleBundle.getAssetSizeMap();
						for (i in styleAssetSizeMap) {
							// Prepend with the relative path to root from style bundle url (styles will be inserted inside <style></style> tags in root document)
							resourceSizes[externalAppDef.virtualURL + '../..' + i] = styleAssetSizeMap[i];
						}
						
						var worker = fork(__dirname + '/worker-bootstrap.node');
						
						var workerOpts = self._cloneObject(self._options);						workerOpts.appDef = self._getAppDef();
						workerOpts.paths = self._paths;
						workerOpts.workerId = worker.id;						workerOpts.workerPort = port;
						workerOpts.dataPort = dataPort;
						workerOpts.dataKey = pass;
						workerOpts.minifiedScripts = minifiedScripts;
						workerOpts.bundles = bundles;
						workerOpts.bundledResources = self._bundledResources;
						workerOpts.resourceSizes = resourceSizes;
						workerOpts.lead = lead ? 1 : 0;
						
						worker.send({
							action: 'init',
							data: workerOpts
						});
						
						worker.on('message', function workerHandler(data) {
							worker.removeListener('message', workerHandler);
							if (data.action == 'ready') {
								if (lead) {
									leaderId = worker.id;
								}
								workerReadyHandler(data, worker);
							}
						});												worker.on('exit', function (code, signal) {							var message = '   Worker ' + worker.id + ' died - Exit code: ' + code;														if (signal) {								message += ', signal: ' + signal;							}														var newWorkers = [];							var i;							for (i in self._workers) {								if (self._workers[i].id != worker.id) {									newWorkers.push(self._workers[i]);								}							}														self._workers = newWorkers;														var lead = worker.id == leaderId;							leaderId = -1;														console.log(message);														if (self._options.release) {								console.log('   Respawning worker');								launchWorker(lead);							} else {								if (self._workers.length <= 0) {									console.log('   All workers are dead - nCombo is shutting down');									process.exit();								}							}						});
						
						return worker;
					};
					
					var launchWorkers = function() {
						initBundles(function() {
							var len = self._options.workerPorts.length;
							if (len > 0) {
								launchWorker(self._options.workerPorts[0], true);
								for (var i=1; i<len; i++) {
									launchWorker(self._options.workerPorts[i]);
								}
								!self._options.release && autoRebundle();
							}
						});
					};
					
					launchWorkers();
				});
			});
		}
	});
};
Master.prototype._cloneObject = function (object) {
	var clone = {};
	for (var i in object) {
		clone[i] = object[i];
	}
	return clone;
};
Master.prototype.colorText = function (message, color) {
	if (this._colorCodes[color]) {
		return '\033[0;' + this._colorCodes[color] + 'm' + message + '\033[0m';
	} else if (color) {
		return '\033[' + color + 'm' + message + '\033[0m';
	}
	return message;
};
Master.prototype._getAppDef = function(useInternalURLs) {
	var appDef = {};	
	if(useInternalURLs) {
		appDef.appURL = this._paths.appInternalURL;
	} else {
		appDef.appURL = this._paths.appExternalURL;
	}
	
	appDef.frameworkURL = this._paths.frameworkURL;
	appDef.virtualURL = appDef.appURL + '~virtual/';
	appDef.appStyleBundleURL = appDef.virtualURL + 'styles.css';
	appDef.appTemplateBundleURL = appDef.virtualURL + 'templates.js';
	appDef.appLibBundleURL = appDef.virtualURL + 'libs.js';
	appDef.appScriptBundleURL = appDef.virtualURL + 'scripts.js';
	appDef.frameworkClientURL = this._paths.frameworkClientURL;
	appDef.frameworkLibsURL = this._paths.frameworkClientURL + 'libs/';
	appDef.frameworkAssetsURL = this._paths.frameworkClientURL + 'assets/';
	appDef.pluginsURL = this._paths.frameworkClientURL + 'plugins/';
	appDef.frameworkScriptsURL = this._paths.frameworkClientURL + 'scripts/';
	appDef.loadScriptURL = this._paths.loadScriptURL;
	appDef.frameworkStylesURL = this._paths.frameworkClientURL + 'styles/';
	appDef.appScriptsURL = appDef.appURL + 'scripts/';
	appDef.appLibsURL = appDef.appURL + 'libs/';
	appDef.appStylesURL = appDef.appURL + 'styles/';
	appDef.appTemplatesURL = appDef.appURL + 'templates/';
	appDef.appAssetsURL = appDef.appURL + 'assets/';
	appDef.appFilesURL = appDef.appURL + 'files/';
	appDef.releaseMode = this._options.release;
	appDef.timeout = this._options.connectTimeout * 1000;
	appDef.resourceSizeMap = this._resourceSizes;
	appDef.angular = this._options.angular;
	appDef.angularMainTemplate = this._options.angularMainTemplate;
	appDef.angularMainModule = this._options.angularMainModule;
	
	return appDef;
};
Master.prototype._normalizeURL = function (url) {
	url = path.normalize(url);
	return url.replace(/\\/g, '/');
};
Master.prototype.useScript = function (url, index) {
	var normalURL = this._normalizeURL(url);
	var filePath = pathManager.urlToPath(normalURL);
	var obj = {};	
	if(!this._clientScriptMap[normalURL]) {
		if (this._extRegex.test(url)) {
			obj['url'] = normalURL;
			obj['path'] = filePath;
		} else {
			obj['url'] = url + '.js';
			obj['path'] = filePath + '.js';
		}
		if (index == null) {
			this._clientScripts.push(obj);
		} else {
			this._clientScripts.splice(index, 0, obj);
		}
		this._clientScriptMap[normalURL] = true;
	}
};
Master.prototype.useStyle = function (url) {
	var normalURL = this._normalizeURL(url);
	var filePath = pathManager.urlToPath(normalURL);
	var obj = {};
	if (this._extRegex.test(normalURL)) {
		obj['url'] = normalURL;
		obj['path'] = filePath;
	} else {
		obj['url'] = url + '.css';
		obj['path'] = filePath + '.css';
	}
	this._clientStyles.push(obj);
};
Master.prototype.useTemplate = function (url) {
	var normalURL = this._normalizeURL(url);
	var filePath = pathManager.urlToPath(normalURL);
	var obj = {};
	if (this._extRegex.test(normalURL)) {
		obj['url'] = normalURL;
		obj['path'] = filePath;
	} else {
		obj['url'] = url + '.html';
		obj['path'] = filePath + '.html';
	}
	
	this._clientTemplates.push(obj);
};
Master.prototype.bundle = {};	
Master.prototype.bundle.app = {};
Master.prototype.bundle.framework = {};
Master.prototype.bundle.script = Master.prototype.useScript;
Master.prototype.bundle.style = Master.prototype.useStyle;
Master.prototype.bundle.template = Master.prototype.useTemplate;
Master.prototype.bundle.asset = function (path) {
	var stats = fs.statSync(path);
	var url = pathManager.expand(this._paths.appInternalURL + 'assets/' + name);
	this._resourceSizes[url] = stats.size;
	this._bundledResources.push(url);
};
Master.prototype.bundle.app.lib = function (name, index) {
	this.useScript(this._paths.appInternalURL + 'libs/' + name, index);
};
Master.prototype.bundle.app.template = function (name) {
	this.useTemplate(this._paths.appInternalURL + 'templates/' + name);
};
Master.prototype.bundle.app.style = function (name) {
	this.useStyle(this._paths.appInternalURL + 'styles/' + name);
};
Master.prototype.bundle.app.asset = function (name) {
	var stats = fs.statSync(this._paths.appDirPath + '/assets/' + name);
	var url = pathManager.expand(this._paths.appInternalURL + 'assets/' + name);
	this._resourceSizes[url] = stats.size;
	this._bundledResources.push(url);
};
Master.prototype.bundle.framework.lib = function (name, index) {
	this.useScript(this._paths.frameworkClientURL + 'libs/' + name, index);
};
Master.prototype.bundle.framework.script = function (name, index) {
	this.useScript(this._paths.frameworkClientURL + 'scripts/' + name, index);
};
Master.prototype.bundle.framework.plugin = function (name, index) {
	this.useScript(this._paths.frameworkClientURL + 'plugins/' + name, index);
};
Master.prototype.bundle.framework.style = function (name) {
	this.useStyle(this._paths.frameworkClientURL + 'styles/' + name);
};
Master.prototype.bundle.framework.asset = function (name) {
	var stats = fs.statSync(this._paths.frameworkClientDirPath + '/assets/' + name);
	var url = pathManager.expand(this._paths.frameworkClientURL + 'assets/' + name);
	this._resourceSizes[url] = stats.size;
	this._bundledResources.push(url);
};
module.exports = new Master();