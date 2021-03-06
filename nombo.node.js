var fs = require('fs');
var url = require('url');
var watchify = require('watchify');
var cssBundler = require('nombo/css-bundler');
var templateBundler = require('nombo/template-bundler');
var SmartCacheManager = require("./smartcachemanager").SmartCacheManager;
var watchr = require('watchr');
var path = require('path');
var pathManager = require('nombo/pathmanager');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain');
var fork = require('child_process').fork;
var requireify = require('requireify');

var Master = function (options) {
	var self = this;

	self.EVENT_FAIL = 'fail';
	self.EVENT_NOTICE = 'notice';
	self.EVENT_INFO = 'info';
	self.EVENT_LEADER_START = 'leaderstart';
	
	self._errorDomain = domain.create();
	self._errorDomain.on('error', function (err) {
		self.errorHandler(err, 'master');
	});
	self._errorDomain.add(self);

	self.start = self._errorDomain.bind(self._start);
	self._errorDomain.run(function () {
		self._init(options);
		self._masterBootstrap = require(self._paths.appDirPath + '/master.node');
		self._masterBootstrap.run(self);
	});
};

Master.prototype = Object.create(EventEmitter.prototype);

Master.prototype._init = function (options) {
	var self = this;
	
	var backslashRegex = /\\/g;
	var appDirPath = path.dirname(require.main.filename).replace(backslashRegex, '/');
	
	self.options = {
		port: 8000,
		workers: null,
		stores: null,
		release: false,
		rebootWorkerOnError: true,
		title: 'Nombo App',
		protocol: 'http',
		protocolOptions: null,
		spinner: true,
		spinnerOptions: null,
		autoReconnect: true,
		autoReconnectOptions: {
			delay: 10,
			randomness: 10
		},
		useLessCSS: false,
		transports: ['polling', 'websocket'],
		logLevel: 1,
		connectTimeout: 10,
		sessionTimeout: 1200,
		sessionHeartRate: 4,
		minifyTimeout: 120,
		clientCacheLife: 2592000,
		clientCacheType: 'public',
		serverCacheMaxEntrySize: 10000000,
		serverCacheMaxSize: 500000000,
		serverCacheLife: 3600,
		versionFile: null,
		origins: '*:*',
		publicResources: false,
		minifyMangle: false,
		matchOriginProtocol: true,
		addressSocketLimit: null,
		socketEventLimit: 100,
		pollingDuration: 30,
		heartbeatInterval: 25,
		heartbeatTimeout: 60,
		workerStatusInterval: 10,
		allowUploads: false,
		propagateErrors: true,
		host: 'localhost',
		balancerCount: null,
		customSIMExtension: 'node.js',
		privateExtensions: ['node.js', 'node.json', 'node.txt'],
		clusterEngine: 'iocluster',
		bundleUpdateDelay: 1000,
		appName: null
	};
	
	self._active = false;

	var i;
	for (i in options) {
		self.options[i] = options[i];
	}
	
	if (self.options.logLevel > 3) {
		process.env.DEBUG = 'engine*';
	} else if (self.options.logLevel > 2) {
		process.env.DEBUG = 'engine';
	}
	
	if (self.options.protocolOptions) {
		var protoOpts = self.options.protocolOptions;
		if (protoOpts.key instanceof Buffer) {
			protoOpts.key = protoOpts.key.toString();
		}
		if (protoOpts.cert instanceof Buffer) {
			protoOpts.cert = protoOpts.cert.toString();
		}
		if (protoOpts.pfx instanceof Buffer) {
			protoOpts.pfx = protoOpts.pfx.toString();
		}
		if (protoOpts.passphrase == null) {
			var privKeyEncLine = protoOpts.key.split('\n')[1];
			if (privKeyEncLine.toUpperCase().indexOf('ENCRYPTED') > -1) {
				var message = 'The supplied private key is encrypted and cannot be used without a passphrase - ' +
					'Please provide a valid passphrase as a property to protocolOptions';
				throw new Error(message);
			}
			process.exit();
		}
	}
	
	if (self.options.stores) {
		var newStores = [];
		var curStore;
		
		for (i in self.options.stores) {
			curStore = self.options.stores[i];
			if (typeof curStore == 'number') {
				curStore = {port: curStore};
			} else {
				if (curStore.port == null) {
					throw new Error('One or more store objects is missing a port property');
				}
			}
			newStores.push(curStore);
		}
		self.options.stores = newStores;
	}
	
	if (!self.options.stores || self.options.stores.length < 1) {
		self.options.stores = [{port: self.options.port + 2}];
	}
	
	if (self.options.workers) {
		var newWorkers = [];
		var curWorker;

		for (i in self.options.workers) {
			curWorker = self.options.workers[i];
			if (typeof curWorker == 'number') {
				curWorker = {port: curWorker};
			} else {
				if (curWorker.port == null) {
					throw new Error('One or more worker objects is missing a port property');
				}
			}
			newWorkers.push(curWorker);
		}
		self.options.workers = newWorkers;
	} else {
		self.options.workers = [{port: self.options.port + 3}];
	}
	
	if (!self.options.balancerCount) {
		self.options.balancerCount = Math.floor(self.options.workers.length / 2);
		if (self.options.balancerCount < 1) {
			self.options.balancerCount = 1;
		}
	}
	
	self._extRegex = /[.][^\/\\]*$/;
	self._slashSequenceRegex = /\/+/g;
	self._startSlashRegex = /^\//;

	self._clientCoreLibMap = {};
	self._clientCoreLibs = [];
	self._clientLibMap = {};
	self._clientLibs = [];
	self._clientStyles = [];
	self._clientTemplates = [];

	self._bundledResources = [];
	self._resourceSizes = {};

	self._paths = {};

	self._paths.frameworkURL = '/~framework/';

	self._paths.frameworkDirPath = __dirname.replace(backslashRegex, '/');
	self._paths.frameworkClientDirPath = self._paths.frameworkDirPath + '/client';
	self._paths.frameworkClientURL = self._paths.frameworkURL + 'client/';
	self._paths.frameworkModulesURL = self._paths.frameworkURL + 'node_modules/';

	self._paths.appDirPath = appDirPath;
	
	self._paths.appScriptsPath = self._paths.appDirPath + '/scripts';
	self._paths.frameworkScriptsPath = self._paths.frameworkClientDirPath + '/scripts';
	self._paths.relativeFrameworkScriptsPath = path.relative(self._paths.appScriptsPath, self._paths.frameworkScriptsPath)
		.replace(backslashRegex, '/');
	
	self._paths.appWorkerControllerPath = self._paths.appDirPath + '/worker.node.js';
	self._paths.appBalancerControllerPath = self._paths.appDirPath + '/balancer.node.js';
	
	if (self.options.versionFile == null) {
		self._paths.versionFilePath = self._paths.appDirPath + '/version.node.txt';
	} else {
		self._paths.versionFilePath = self.options.versionFile;
	}

	self._paths.appLoadScriptPath = self._paths.appDirPath + '/scripts/load.js';
	self._paths.appCookiesDisabledPath = self._paths.appDirPath + '/scripts/cookiesdisabled.js';
	self._paths.appFailedConnectionPath = self._paths.appDirPath + '/scripts/failedconnection.js';
	
	self._paths.frameworkLoadScriptPath = self._paths.frameworkClientDirPath + '/scripts/load.js';
	self._paths.frameworkCookiesDisabledPath = self._paths.frameworkClientDirPath + '/scripts/cookiesdisabled.js';
	self._paths.frameworkFailedConnectionPath = self._paths.frameworkClientDirPath + '/scripts/failedconnection.js';

	self._paths.spinJSURL = self._paths.frameworkClientURL + 'libs/spin.js';
	self._paths.appURL = '/';
	self._paths.freshnessURL = self._paths.appURL + '~freshness';
	self._paths.statusURL = self._paths.appURL + '~status';
	
	self._paths.rootTemplateURL = self._paths.appURL + 'index.html';
	
	self._paths.virtualURL = self._paths.appURL + '~virtual/';
	self._paths.appStyleBundleURL = self._paths.virtualURL + 'styles.css';
	self._paths.appTemplateBundleURL = self._paths.virtualURL + 'templates.js';
	self._paths.frameworkCoreBundleURL = self._paths.virtualURL + 'core.js';
	self._paths.appLibBundleURL = self._paths.virtualURL + 'libs.js';
	self._paths.appScriptBundleURL = self._paths.virtualURL + 'scripts.js';
	self._paths.frameworkLibsURL = self._paths.frameworkClientURL + 'libs/';
	self._paths.frameworkAssetsURL = self._paths.frameworkClientURL + 'assets/';
	self._paths.frameworkPluginsURL = self._paths.frameworkClientURL + 'plugins/';
	self._paths.frameworkScriptsURL = self._paths.frameworkClientURL + 'scripts/';
	self._paths.frameworkStylesURL = self._paths.frameworkClientURL + 'styles/';
	self._paths.appScriptsURL = self._paths.appURL + 'scripts/';
	self._paths.appLibsURL = self._paths.appURL + 'libs/';
	self._paths.appStylesURL = self._paths.appURL + 'styles/';
	self._paths.appTemplatesURL = self._paths.appURL + 'templates/';
	self._paths.appAssetsURL = self._paths.appURL + 'assets/';
	self._paths.appFilesURL = self._paths.appURL + 'files/';
	
	if (self.options.appName) {
		self._appName = self.options.appName;
	} else {
		self._appName = path.basename(self._paths.appDirPath);
	}
	self.options.appName = self._appName;

	self._cacheCookieName = 'n/' + self._appName + '/cached';
	self._sessionCookieName = 'n/' + self._appName + '/ssid';
	
	pathManager.init(self._paths.frameworkURL, self._paths.frameworkDirPath, self._paths.appDirPath, self._paths.appURL);
	pathManager.setBaseURL(self._paths.appURL);
	
	if (fs.existsSync(self._paths.appLoadScriptPath)) {
		self._paths.loadScriptURL = pathManager.pathToURL(self._paths.appLoadScriptPath);
	} else {
		self._paths.loadScriptURL = pathManager.pathToURL(self._paths.frameworkLoadScriptPath);
	}
	if (fs.existsSync(self._paths.appCookiesDisabledPath)) {
		self._paths.cookiesDisabledURL = pathManager.pathToURL(self._paths.appCookiesDisabledPath);
	} else {
		self._paths.cookiesDisabledURL = pathManager.pathToURL(self._paths.frameworkCookiesDisabledPath);
	}
	if (fs.existsSync(self._paths.appFailedConnectionPath)) {
		self._paths.failedConnectionURL = pathManager.pathToURL(self._paths.appFailedConnectionPath);
	} else {
		self._paths.failedConnectionURL = pathManager.pathToURL(self._paths.frameworkFailedConnectionPath);
	}
	
	self.getPaths = function () {
		var paths = {};
		for (var i in self._paths) {
			paths[i] = self._paths[i];
		}
		return paths;
	};

	self._useCoreLib = function (url, index) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};

		if (!self._clientCoreLibMap[normalURL]) {
			if (self._extRegex.test(url)) {
				obj.url = normalURL;
				obj.path = filePath;
			} else {
				obj.url = url + '.js';
				obj.path = filePath + '.js';
			}
			if (index == null) {
				self._clientCoreLibs.push(obj);
			} else {
				self._clientCoreLibs.splice(index, 0, obj);
			}
			self._clientCoreLibMap[normalURL] = true;
		}
	};
	
	self.useLib = function (url, index) {
		var url = self._normalizeURL(url);
		if (!self._extRegex.test(url)) {
			url = url + '.js';
		}
		var filePath = pathManager.urlToPath(url);
		
		if (fs.existsSync(filePath)) {
			var obj = {};
			if (!self._clientLibMap[url]) {
				obj.url = url;
				obj.path = filePath;
				if (index == null) {
					self._clientLibs.push(obj);
				} else {
					self._clientLibs.splice(index, 0, obj);
				}
				self._clientLibMap[url] = true;
			}
		} else {
			var error = 'Cannot add ' + url + ' to lib bundle - File not found';
			self.errorHandler(error, 'master');
		}
	};

	self.useStyle = function (url) {
		var url = self._normalizeURL(url);
		if (!self._extRegex.test(url)) {
			url = url + '.css';
		}
		var filePath = pathManager.urlToPath(url);
		
		if (fs.existsSync(filePath)) {
			var obj = {};
			obj.url = url;
			obj.path = filePath;
			self._clientStyles.push(obj);
		} else {
			var error = 'Cannot add ' + url + ' to style bundle - File not found';
			self.errorHandler(error, 'master');
		}
	};

	self.useTemplate = function (url) {
		var url = self._normalizeURL(url);
		if (!self._extRegex.test(url)) {
			url = url + '.html';
		}
		var filePath = pathManager.urlToPath(url);
		
		if (fs.existsSync(filePath)) {
			var obj = {};
			obj.url = url;
			obj.path = filePath;

			self._clientTemplates.push(obj);
		} else {
			var error = 'Cannot add ' + url + ' to template bundle - File not found';
			self.errorHandler(error, 'master');
		}
	};

	self.bundle = {};
	self.bundle.app = {};
	self.bundle.framework = {};
	self.bundle.lib = self.useLib;
	self.bundle.style = self.useStyle;
	self.bundle.template = self.useTemplate;

	self.bundle.asset = function (path) {
		var stats = fs.statSync(path);
		var url = self._paths.appURL + 'assets/' + name;
		self._resourceSizes[url] = stats.size;
		self._bundledResources.push(url);
	};

	self.bundle.app.lib = function (name, index) {
		self.useLib(self._paths.appURL + 'libs/' + name, index);
	};
	
	self.bundle.app.template = function (name) {
		self.useTemplate(self._paths.appURL + 'templates/' + name);
	};

	self.bundle.app.style = function (name) {
		self.useStyle(self._paths.appURL + 'styles/' + name);
	};

	self.bundle.app.asset = function (name) {
		var stats = fs.statSync(self._paths.appDirPath + '/assets/' + name);
		var url = self._paths.appURL + 'assets/' + name;
		self._resourceSizes[url] = stats.size;
		self._bundledResources.push(url);
	};

	self.bundle.framework.lib = function (name, index) {
		self.useLib(self._paths.frameworkClientURL + 'libs/' + name, index);
	};

	self.bundle.framework.plugin = function (name, index) {
		self.useLib(self._paths.frameworkClientURL + 'plugins/' + name, index);
	};

	self.bundle.framework.style = function (name) {
		self.useStyle(self._paths.frameworkClientURL + 'styles/' + name);
	};

	self.bundle.framework.asset = function (name) {
		var stats = fs.statSync(self._paths.frameworkClientDirPath + '/assets/' + name);
		var url = self._paths.frameworkClientURL + 'assets/' + name;
		self._resourceSizes[url] = stats.size;
		self._bundledResources.push(url);
	};

	self._paths.frameworkSocketClientURL = self._paths.frameworkModulesURL + 'socketcluster-client/socketcluster.js';

	self._minAddressSocketLimit = 20;
	self._dataExpiryAccuracy = 5000;

	if (self.options.addressSocketLimit == null) {
		var limit = self.options.sessionTimeout / 40;
		if (limit < self._minAddressSocketLimit) {
			limit = self._minAddressSocketLimit;
		}
		self.options.addressSocketLimit = limit;
	}

	self._clusterEngine = require(self.options.clusterEngine);
	if (!self.options.release && self.options.clientCacheLife == null) {
		self.options.clientCacheLife = 86400;
	}

	self._colorCodes = {
		red: 31,
		green: 32,
		yellow: 33
	};

	console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching Nombo server');
	
	process.stdin.on('error', function (err) {
		self.noticeHandler(err, {type: 'master'});
	});
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	self.useStyle(self._paths.frameworkClientURL + 'styles/nombo.css');
	self._useCoreLib(self._paths.frameworkClientURL + 'libs/jquery.js');
	self._useCoreLib(self._paths.frameworkModulesURL + 'handlebars/dist/handlebars.js');
	self._useCoreLib(self._paths.frameworkClientURL + 'libs/json2.js');
	self._useCoreLib(self._paths.frameworkURL + 'nombo-client.js');
};

Master.prototype.errorHandler = function (err, origin) {
	if (err.stack == null) {
		if (!(err instanceof Object)) {
			err = new Error(err);
		}
		err.stack = err.message;
	}
	if (origin instanceof Object) {
		err.origin = origin;
	} else {
		err.origin = {
			type: origin
		};
	}
	err.time = Date.now();

	this.emit(this.EVENT_FAIL, err);
	this.log(err.stack);
};

Master.prototype.noticeHandler = function (notice, origin) {
	if (notice.stack == null) {
		if (!(notice instanceof Object)) {
			notice = new Error(notice);
		}
		notice.stack = notice.message;
	}
	if (origin instanceof Object) {
		notice.origin = origin;
	} else {
		notice.origin = {
			type: origin
		};
	}
	notice.time = Date.now();
	
	this.emit(this.EVENT_NOTICE, notice);
	
	if (this.options.logLevel > 1) {
		this.log(notice.stack);
	}
};

Master.prototype.triggerInfo = function (info, origin) {
	if (this._active) {
		if (!(origin instanceof Object)) {
			origin = {
				type: origin
			};
		}
		var infoData = {
			origin: origin,
			info: info,
			time: Date.now()
		};
		this.emit(this.EVENT_INFO, infoData);
		this.log(info, infoData.time);
	}
};

Master.prototype._start = function () {
	var self = this;
	
	var appDef = self._getAppDef();
	
	var bundles = {};
	self._workers = [];
	self._active = false;

	var stylePaths = [];

	for (var i in self._clientStyles) {
		stylePaths.push(self._clientStyles[i].path);
	}

	var styleDirs = [pathManager.urlToPath(appDef.frameworkStylesURL), pathManager.urlToPath(appDef.appStylesURL)];

	var styleBundle = cssBundler({
		watchDirs: styleDirs,
		files: stylePaths,
		watch: true,
		updateDelay: self.options.bundleUpdateDelay
	});

	var updateCSSBundle = function () {
		self.triggerInfo('Updating styles bundle...', 'master');
		var cssBundle = styleBundle.bundle();
		var size = Buffer.byteLength(cssBundle, 'utf8');
		var data = {
			url: appDef.appStyleBundleURL,
			content: cssBundle,
			size: size
		};
		for (var i in self._workers) {
			self._workers[i].send({
				type: 'updateCache',
				data: data
			});
		}
		bundles[appDef.appStyleBundleURL] = cssBundle;
		self.triggerInfo('Updated styles bundle', 'master');
	};

	var templatePaths = [];

	for (i in self._clientTemplates) {
		templatePaths.push(self._clientTemplates[i].path);
	}
	var templateDirs = [pathManager.urlToPath(appDef.appTemplatesURL)];
	
	var templateBundle = templateBundler({
		watchDirs: templateDirs,
		files: templatePaths,
		watch: true,
		updateDelay: self.options.bundleUpdateDelay
	});

	var updateTemplateBundle = function () {
		self.triggerInfo('Updating templates bundle...', 'master');
		var htmlBundle = templateBundle.bundle();
		var size = Buffer.byteLength(htmlBundle, 'utf8');
		var data;
		for (var i in self._workers) {
			data = {
				url: appDef.appTemplateBundleURL,
				content: htmlBundle,
				size: size
			};
			self._workers[i].send({
				type: 'updateCache',
				data: data
			});
		}
		bundles[appDef.appTemplateBundleURL] = htmlBundle;
		self.triggerInfo('Updated templates bundle', 'master');
	};

	var jsCoreLibCodes = {};
	
	for (i in self._clientCoreLibs) {
		jsCoreLibCodes[self._clientCoreLibs[i].path] = fs.readFileSync(self._clientCoreLibs[i].path, 'utf8');
	}
	
	var makeCoreBundle = function () {
		var libArray = [];
		var i;
		for (i in jsCoreLibCodes) {
			if (jsCoreLibCodes[i]) {
				libArray.push(jsCoreLibCodes[i]);
			}
		}
		var coreLibBundle = libArray.join('\n');
		bundles[appDef.frameworkCoreBundleURL] = coreLibBundle;

		var size = Buffer.byteLength(coreLibBundle, 'utf8');
		var data;
		for (var i in self._workers) {
			data = {
				url: appDef.frameworkCoreBundleURL,
				content: coreLibBundle,
				size: size
			};
			self._workers[i].send({
				type: 'updateCache',
				data: data
			});
		}
	};

	var updateCoreBundle = function (event, filePath) {
		self.triggerInfo('Updating core bundle...', 'master');
		if (event == 'delete') {
			jsCoreLibCodes[filePath] = null;
		} else if ((event == 'create' || event == 'update') && jsCoreLibCodes.hasOwnProperty(filePath)) {
			jsCoreLibCodes[filePath] = fs.readFileSync(filePath, 'utf8');
		}
		makeCoreBundle();
		self.triggerInfo('Updated core bundle', 'master');
	};
	
	var libFilePaths = [];
	
	for (i in self._clientLibs) {
		libFilePaths.push(self._clientLibs[i].path);
	}
	
	var libBundleOptions = {
		entries: libFilePaths,
		noParse: libFilePaths
	};
	
	var libBundle = watchify(libBundleOptions);
	
	var updateLibBundle = function (callback) {
		self.triggerInfo('Updating libs bundle...', 'master');
		libBundle.bundle({debug: !self.options.release}, function (err, jsBundle) {
			if (err) {
				self._errorDomain.emit('error', err);
				callback && callback();
			} else {
				self.triggerInfo('Updated libs bundle', 'master');
				bundles[appDef.appLibBundleURL] = jsBundle;
				var size = Buffer.byteLength(jsBundle, 'utf8');
				var data;
				for (var i in self._workers) {
					data = {
						url: appDef.appLibBundleURL,
						content: jsBundle,
						size: size
					};
					self._workers[i].send({
						type: 'updateCache',
						data: data
					});
				}
				callback && callback();
			}
		});
	};
	
	var scriptBundleOptions = {
		basedir: self._paths.appScriptsPath,
		entries: [pathManager.urlToPath(appDef.appScriptsURL + 'index.js')]
	};
	
	var scriptBundle = watchify(scriptBundleOptions);	
	scriptBundle.transform(requireify);
	
	var updateScriptBundle = function (callback) {
		self.triggerInfo('Updating scripts bundle...', 'master');
		scriptBundle.bundle({debug: !self.options.release}, function (err, jsBundle) {
			if (err) {
				self._errorDomain.emit('error', err);
				callback && callback();
			} else {
				self.triggerInfo('Updated scripts bundle', 'master');
				bundles[appDef.appScriptBundleURL] = jsBundle;
				var size = Buffer.byteLength(jsBundle, 'utf8');
				var data;
				for (var i in self._workers) {
					data = {
						url: appDef.appScriptBundleURL,
						content: jsBundle,
						size: size
					};
					self._workers[i].send({
						type: 'updateCache',
						data: data
					});
				}
				callback && callback();
			}
		});
	};

	var initBundles = function (callback) {
		updateCSSBundle();
		updateTemplateBundle();
		makeCoreBundle();
		updateLibBundle(function () {
			updateScriptBundle(callback);
		});
	};

	var autoRebundle = function () {
		styleBundle.on('update', function () {
			updateCSSBundle();
		});

		templateBundle.on('update', function () {
			updateTemplateBundle();
		});

		watchr.watch({
			paths: [pathManager.urlToPath(appDef.frameworkLibsURL)],
			listener: updateCoreBundle
		});
		
		libBundle.on('update', function () {
			updateLibBundle();
		});

		scriptBundle.on('update', function () {
			updateScriptBundle();
		});
	};

	var leaderId = -1;
	var firstTime = true;

	var workersActive = false;
	
	var initLoadBalancer = function () {
		self._balancer.send({
			type: 'init',
			data: {
				dataKey: pass,
				sourcePort: self.options.port,
				workers: self.options.workers,
				host: self.options.host,
				balancerCount: self.options.balancerCount,
				protocol: self.options.protocol,
				protocolOptions: self.options.protocolOptions,
				checkStatusTimeout: self.options.connectTimeout * 1000,
				statusURL: self._paths.statusURL,
				statusCheckInterval: self.options.workerStatusInterval * 1000,
				appBalancerControllerPath: self._paths.appBalancerControllerPath
			}
		});
	};
	
	var launchLoadBalancer = function () {
		if (self._balancer) {
			self._errorDomain.remove(self._balancer);
		}
		
		var balancerErrorHandler = function (err) {
			self.errorHandler(err, {type: 'balancer'});
		};
		
		var balancerNoticeHandler = function (noticeMessage) {
			self.noticeHandler(noticeMessage, {type: 'balancer'});
		};
		
		self._balancer = fork(__dirname + '/nombo-balancer.node.js');
		self._balancer.on('error', balancerErrorHandler);
		self._balancer.on('notice', balancerNoticeHandler);

		self._balancer.on('exit', launchLoadBalancer);
		self._balancer.on('message', function (m) {
			if (m.type == 'error') {
				balancerErrorHandler(m.data);
			} else if (m.type == 'notice') {
				balancerNoticeHandler(m.data);
			}
		});
		
		if (workersActive) {
			initLoadBalancer();
		}
	};
	
	launchLoadBalancer();
	
	console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching cluster engine');
	
	var workerIdCounter = 1;
	
	var ioClusterReady = function () {
		var i;
		var workerReadyHandler = function (data, worker) {
			self._workers.push(worker);
			if (worker.id == leaderId) {
				worker.send({
					type: 'emit',
					event: self.EVENT_LEADER_START
				});
			}
			
			if (self._active) {
				self.log('Worker ' + worker.data.id + ' was respawned on port ' + worker.data.port);
			}
			
			if (self._workers.length >= self.options.workers.length) {
				if (firstTime) {
					console.log('   ' + self.colorText('[Active]', 'green') + ' Nombo server started');
					console.log('            Port: ' + self.options.port);
					console.log('            Mode: ' + (self.options.release ? 'Release' : 'Debug'));
					console.log('            Master PID: ' + process.pid);
					console.log('            Balancer count: ' + self.options.balancerCount);
					console.log('            Worker count: ' + self.options.workers.length);
					console.log('            Store count: ' + self.options.stores.length);
					console.log();
					firstTime = false;
					
					if (!workersActive) {
						initLoadBalancer();
						workersActive = true;
					}
					
					process.on('SIGUSR2', function () {
						for (var i in self._workers) {
							self._workers[i].kill();
						}
					});
					
					if (self.options.release) {
						watchr.watch({
							paths: [self._paths.versionFilePath],
							listener: function (event, filePath) {
								var oldCacheVersion = self._cacheVersion;
								self._updateCacheVersion(function () {
									if (self._cacheVersion != oldCacheVersion) {
										var data = {
											cacheVersion: self._cacheVersion
										};
										for (var i in self._workers) {
											self._workers[i].send({
												type: 'updateCacheVersion',
												data: data
											});
										}
									}
								});
							}
						});
					}
				} else {
					var workersData = [];
					var i;
					for (i in self._workers) {
						workersData.push(self._workers[i].data);
					}
					self._balancer.send({
						type: 'setWorkers',
						data: workersData
					});
				}
				self._active = true;
			}
		};

		var launchWorker = function (workerData, lead) {
			var workerErrorHandler = function (err) {
				var origin = {
					type: 'worker',
					pid: worker.pid
				};
				self.errorHandler(err, origin);
			};
			
			var workerNoticeHandler = function (noticeMessage) {
				var origin = {
					type: 'worker',
					pid: worker.pid
				};
				self.noticeHandler(noticeMessage, origin);
			};
		
			var worker = fork(__dirname + '/nombo-worker-bootstrap.node');
			worker.on('error', workerErrorHandler);
			
			if (!workerData.id) {
				workerData.id = workerIdCounter++;
			}
			
			worker.id = workerData.id;
			worker.data = workerData;

			var workerOpts = self._cloneObject(self.options);
			workerOpts.appDef = self._getAppDef();
			workerOpts.paths = self._paths;
			workerOpts.workerId = worker.id;
			workerOpts.workerPort = workerData.port;
			workerOpts.cacheVersion = self._cacheVersion;
			workerOpts.stores = stores;
			workerOpts.dataKey = pass;
			workerOpts.bundles = bundles;
			workerOpts.bundledResources = self._bundledResources;
			workerOpts.resourceSizes = self._resourceSizes;
			workerOpts.lead = lead ? 1 : 0;

			worker.send({
				type: 'init',
				data: workerOpts
			});

			worker.on('message', function workerHandler(m) {
				if (m.type == 'ready') {
					if (lead) {
						leaderId = worker.id;
					}
					workerReadyHandler(m, worker);
				} else if (m.type == 'error') {
					workerErrorHandler(m.data);
				} else if (m.type == 'notice') {
					workerNoticeHandler(m.data);
				}
			});

			worker.on('exit', function (code, signal) {
				self._errorDomain.remove(worker);
				var message = '   Worker ' + worker.id + ' died - Exit code: ' + code;

				if (signal) {
					message += ', signal: ' + signal;
				}

				var workersData = [];
				var newWorkers = [];
				var i;
				for (i in self._workers) {
					if (self._workers[i].id != worker.id) {
						newWorkers.push(self._workers[i]);
						workersData.push(self._workers[i].data);
					}
				}						

				self._workers = newWorkers;
				self._balancer.send({
					type: 'setWorkers',
					data: workersData
				});

				var lead = worker.id == leaderId;
				leaderId = -1;
				self.errorHandler(new Error(message), {type: 'master'});

				self.log('Respawning worker ' + worker.id);
				launchWorker(workerData, lead);
			});

			return worker;
		};

		var launchWorkers = function () {
			initBundles(function () {
				var len = self.options.workers.length;
				if (len > 0) {
					var i;
					for (i in bundles) {
						self._resourceSizes[i] = Buffer.byteLength(bundles[i], 'utf8');
					}

					var styleAssetSizeMap = styleBundle.getAssetSizeMap();
					for (i in styleAssetSizeMap) {
						self._resourceSizes[i] = styleAssetSizeMap[i];
					}
			
					launchWorker(self.options.workers[0], true);
					for (i = 1; i < len; i++) {
						launchWorker(self.options.workers[i]);
					}
					autoRebundle();
				}
			});
		};
		
		if (self.options.release) {
			self._updateCacheVersion(launchWorkers);
		} else {
			launchWorkers();
		}
	};

	var stores = self.options.stores;
	var pass = crypto.randomBytes(32).toString('hex');
	
	var launchIOCluster = function () {
		self._ioCluster = new self._clusterEngine.IOCluster({
			stores: stores,
			dataKey: pass,
			expiryAccuracy: self._dataExpiryAccuracy
		});
		
		self._ioCluster.on('error', function (err) {
			self.errorHandler(err, {type: 'store'});
		});
	};
	
	launchIOCluster();
	self._ioCluster.on('ready', ioClusterReady);
};

Master.prototype.log = function (message, time) {
	if (time == null) {
		time = Date.now();
	}
	console.log(time + ' - ' + message);
};

Master.prototype._updateCacheVersion = function (callback) {
	var self = this;
	
	fs.readFile(self._paths.versionFilePath, function (err, data) {
		if (err) {
			if (err instanceof Error) {
				err = err.message;
			}
			var noticeMessage = 'Failed to read cache version from versionFile at ' + self._paths.versionFilePath + '. Error: ' + err;
			self.noticeHandler(noticeMessage, {type: 'master'});
		} else {
			self._cacheVersion = parseInt(data);
		}
		if (!self._cacheVersion && self._cacheVersion != 0) {
			self._cacheVersion = Date.now();
		}
		
		callback(self._cacheVersion);
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

Master.prototype._getAppDef = function () {
	var appDef = {};
	
	for (var i in this._paths) {
		appDef[i] = this._paths[i];
	}

	appDef.appURL = this._paths.appURL;
	appDef.frameworkURL = this._paths.frameworkURL;
	appDef.sessionCookieName = this._sessionCookieName;
	appDef.cacheCookieName = this._cacheCookieName;
	appDef.releaseMode = this.options.release;
	appDef.timeout = this.options.connectTimeout * 1000;
	appDef.resourceSizeMap = this._resourceSizes;
	appDef.autoReconnect = this.options.autoReconnect;
	appDef.autoReconnectOptions = this.options.autoReconnectOptions;

	return appDef;
};

Master.prototype._normalizeURL = function (url) {
	url = path.normalize(url);
	return url.replace(/\\/g, '/');
};

module.exports.Master = Master;