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
	self.EVENT_LEADER_START = 'leaderstart';
	
	self._errorDomain = domain.create();
	self._errorDomain.on('error', function () {
		self.errorHandler.apply(self, arguments);
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
	
	self._options = {
		port: 8000,
		workers: null,
		stores: null,
		release: false,
		title: 'Nombo App',
		protocol: 'http',
		protocolOptions: null,
		spinner: true,
		spinnerOptions: null,
		transports: ['polling', 'websocket'],
		logLevel: 1,
		connectTimeout: 10,
		sessionTimeout: 1200,
		minifyTimeout: 120,
		clientCacheLife: 2592000,
		clientCacheType: 'public',
		cacheFilter: null,
		cacheMaxEntrySize: 10000000,
		cacheMaxSize: 1000000000,
		versionFile: null,
		origins: '*:*',
		publicResources: false,
		minifyMangle: false,
		matchOriginProtocol: true,
		addressSocketLimit: null,
		pollingDuration: 30,
		heartbeatInterval: 25,
		heartbeatTimeout: 60,
		workerStatusInterval: 10,
		allowUploads: false,
		hostAddress: null,
		balancerCount: null,
		customSIMExtension: 'node.js',
		privateExtensions: ['node.js', 'node.json', 'node.txt'],
		clusterEngine: 'iocluster'
	};

	var i;
	for (i in options) {
		self._options[i] = options[i];
	}
	
	if (self._options.logLevel > 3) {
		process.env.DEBUG = 'engine*';
	} else if (self._options.logLevel > 2) {
		process.env.DEBUG = 'engine';
	}
	
	if (self._options.protocolOptions) {
		var protoOpts = self._options.protocolOptions;
		if (protoOpts.key instanceof Buffer) {
			protoOpts.key = protoOpts.key.toString();
		}
		if (protoOpts.cert instanceof Buffer) {
			protoOpts.cert = protoOpts.cert.toString();
		}
		if (protoOpts.pfx instanceof Buffer) {
			protoOpts.pfx = protoOpts.pfx.toString();
		}
	}
	
	if (!self._options.stores || self._options.stores.length < 1) {
		self._options.stores = [{port: self._options.port + 2}];
	}
	
	if (self._options.workers) {
		for (i in self._options.workers) {
			if (self._options.workers[i].port == null) {
				throw new Error('One or more worker object is missing a port property');
			}
		}
	} else {
		self._options.workers = [{port: self._options.port + 3}];
	}
	
	if (!self._options.balancerCount) {
		self._options.balancerCount = self._options.workers.length;
	}
	
	self._extRegex = /[.][^\/\\]*$/;
	self._slashSequenceRegex = /\/+/g;
	self._startSlashRegex = /^\//;

	self._clientCoreLibMap = {};
	self._clientCoreLibs = [];
	self._clientScriptMap = {};
	self._clientScripts = [];
	self._clientStyles = [];
	self._clientTemplates = [];

	self._bundledResources = [];
	self._resourceSizes = {};

	self._paths = {};

	self._paths.frameworkURL = '/~framework/';

	self._paths.frameworkDirPath = __dirname;
	self._paths.frameworkClientDirPath = self._paths.frameworkDirPath + '/client';
	self._paths.frameworkClientURL = self._paths.frameworkURL + 'client/';

	self._paths.frameworkModulesURL = self._paths.frameworkURL + 'node_modules/';

	self._paths.appDirPath = path.dirname(require.main.filename);
	self._paths.appWorkerControllerPath = self._paths.appDirPath + '/worker.node.js';
	
	if (self._options.versionFile == null) {
		self._paths.versionFilePath = self._paths.appDirPath + '/version.node.txt';
	} else {
		self._paths.versionFilePath = self._options.versionFile;
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
	
	self._appName = path.basename(self._paths.appDirPath);
	self._options.appName = self._appName;
	
	self._cacheCookieName = 'n/' + self._appName + '/cached';
	self._sessionCookieName = 'n/' + this._appName + '/ssid';
	
	pathManager.init(self._paths.frameworkURL, self._paths.frameworkDirPath, self._paths.appDirPath, self._paths.appURL);

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
	
	self.useScript = function (url, index) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};

		if (!self._clientScriptMap[normalURL]) {
			if (self._extRegex.test(url)) {
				obj.url = normalURL;
				obj.path = filePath;
			} else {
				obj.url = url + '.js';
				obj.path = filePath + '.js';
			}
			if (index == null) {
				self._clientScripts.push(obj);
			} else {
				self._clientScripts.splice(index, 0, obj);
			}
			self._clientScriptMap[normalURL] = true;
		}
	};

	self.useStyle = function (url) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};
		if (self._extRegex.test(normalURL)) {
			obj.url = normalURL;
			obj.path = filePath;
		} else {
			obj.url = url + '.css';
			obj.path = filePath + '.css';
		}
		self._clientStyles.push(obj);
	};

	self.useTemplate = function (url) {
		var normalURL = self._normalizeURL(url);
		var filePath = pathManager.urlToPath(normalURL);
		var obj = {};
		if (self._extRegex.test(normalURL)) {
			obj.url = normalURL;
			obj.path = filePath;
		} else {
			obj.url = url + '.html';
			obj.path = filePath + '.html';
		}

		self._clientTemplates.push(obj);
	};

	self.bundle = {};
	self.bundle.app = {};
	self.bundle.framework = {};
	self.bundle.script = self.useScript;
	self.bundle.style = self.useStyle;
	self.bundle.template = self.useTemplate;

	self.bundle.asset = function (path) {
		var stats = fs.statSync(path);
		var url = self._paths.appURL + 'assets/' + name;
		self._resourceSizes[url] = stats.size;
		self._bundledResources.push(url);
	};

	self.bundle.app.lib = function (name, index) {
		self.useScript(self._paths.appURL + 'libs/' + name, index);
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
		self.useScript(self._paths.frameworkClientURL + 'libs/' + name, index);
	};

	self.bundle.framework.script = function (name, index) {
		self.useScript(self._paths.frameworkClientURL + 'scripts/' + name, index);
	};

	self.bundle.framework.plugin = function (name, index) {
		self.useScript(self._paths.frameworkClientURL + 'plugins/' + name, index);
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

	pathManager.setBaseURL(self._paths.appURL);

	self._paths.frameworkSocketClientURL = self._paths.frameworkModulesURL + 'socketcluster-client/socketcluster.js';

	self._minAddressSocketLimit = 20;
	self._dataExpiryAccuracy = 5000;

	if (self._options.addressSocketLimit == null) {
		var limit = self._options.sessionTimeout / 40;
		if (limit < self._minAddressSocketLimit) {
			limit = self._minAddressSocketLimit;
		}
		self._options.addressSocketLimit = limit;
	}

	self._clusterEngine = require(self._options.clusterEngine);
	if (!self._options.release && self._options.clientCacheLife == null) {
		self._options.clientCacheLife = 86400;
	}

	self._colorCodes = {
		red: 31,
		green: 32,
		yellow: 33
	};

	console.log('   ' + self.colorText('[Busy]', 'yellow') + ' Launching Nombo server');
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	self.useStyle(self._paths.frameworkClientURL + 'styles/nombo.css');
	self._useCoreLib(self._paths.frameworkClientURL + 'libs/jquery.js');
	self._useCoreLib(self._paths.frameworkModulesURL + 'handlebars/dist/handlebars.js');
	self._useCoreLib(self._paths.frameworkClientURL + 'libs/json2.js');
	self._useCoreLib(self._paths.frameworkURL + 'nombo-client.js');
};

Master.prototype.errorHandler = function (err) {
	this.emit(this.EVENT_FAIL, err);
	if (err.stack) {
		console.log(err.stack);
	} else {
		console.log(err);
	}
};

Master.prototype.noticeHandler = function (notice) {
	this.emit(this.EVENT_NOTICE, notice);
	console.log(notice.message);
};

Master.prototype._start = function () {
	var self = this;
	
	var appDef = self._getAppDef();

	var bundles = {};
	self._workers = [];

	var stylePaths = [];

	for (var i in self._clientStyles) {
		stylePaths.push(self._clientStyles[i].path);
	}

	var styleDirs = [pathManager.urlToPath(appDef.frameworkStylesURL), pathManager.urlToPath(appDef.appStylesURL)];

	var styleBundle = cssBundler({
		watchDirs: styleDirs,
		files: stylePaths,
		watch: true
	});

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

	var updateCSSBundle = function () {
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
	};

	var templatePaths = [];

	for (i in self._clientTemplates) {
		templatePaths.push(self._clientTemplates[i].path);
	}

	var templateDirs = [pathManager.urlToPath(appDef.appTemplatesURL)];
	var templateBundle = templateBundler({
		watchDirs: templateDirs,
		files: templatePaths,
		watch: true
	});

	var updateTemplateBundle = function () {
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
		if (event == 'delete') {
			jsCoreLibCodes[filePath] = null;
		} else if ((event == 'create' || event == 'update') && jsCoreLibCodes.hasOwnProperty(filePath)) {
			jsCoreLibCodes[filePath] = fs.readFileSync(filePath, 'utf8');
		}
		makeCoreBundle();
	};
	
	var libFilePaths = [];
	
	for (i in self._clientScripts) {
		libFilePaths.push(self._clientScripts[i].path);
	}
	
	var libBundleOptions = {
		entries: libFilePaths,
		noParse: libFilePaths
	};
	
	self._libBundle = watchify(libBundleOptions);
	
	var updateLibBundle = function (callback) {
		self._libBundle.bundle({debug: !self._options.release}, function (err, jsBundle) {
			if (err) {
				self._errorDomain.emit('error', err);
				callback && callback();
			} else {
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
		entries: [pathManager.urlToPath(appDef.appScriptsURL + 'index.js')]
	};
	
	var scriptBundle = watchify(scriptBundleOptions);
	scriptBundle.transform(requireify);
	
	var updateScriptBundle = function (callback) {
		scriptBundle.bundle({debug: !self._options.release}, function (err, jsBundle) {
			if (err) {
				self._errorDomain.emit('error', err);
				callback && callback();
			} else {
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
		
		self._libBundle.on('update', function () {
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
				sourcePort: self._options.port,
				workers: self._options.workers,
				hostAddress: self._options.hostAddress,
				balancerCount: self._options.balancerCount,
				protocol: self._options.protocol,
				protocolOptions: self._options.protocolOptions,
				checkStatusTimeout: self._options.connectTimeout * 1000,
				statusURL: self._paths.statusURL,
				statusCheckInterval: self._options.workerStatusInterval * 1000
			}
		});
	};
	
	var launchLoadBalancer = function () {
		if (self._balancer) {
			self._errorDomain.remove(self._balancer);
		}
		
		var balancerErrorHandler = function (err) {
			if (err.stack) {
				err.origin = {
					type: 'balancer'
				};
			}
			self.errorHandler(err);
		};
		
		var balancerNoticeHandler = function (noticeMessage) {
			var notice = {
				message: noticeMessage,
				origin: {
					type: 'balancer'
				}
			};
			self.noticeHandler(notice);
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
			
			if (!firstTime) {
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
			
			if (self._workers.length >= self._options.workers.length && firstTime) {
				console.log('   ' + self.colorText('[Active]', 'green') + ' Nombo server started');
				console.log('            Port: ' + self._options.port);
				console.log('            Mode: ' + (self._options.release ? 'Release' : 'Debug'));
				console.log('            Master PID: ' + process.pid);
				console.log('            Balancer count: ' + self._options.balancerCount);
				console.log('            Worker count: ' + self._options.workers.length);
				console.log('            Store count: ' + self._options.stores.length);
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
				
				if (self._options.release) {
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
			}
		};

		var launchWorker = function (workerData, lead) {
			var workerErrorHandler = function (err) {
				if (err.stack) {
					err.origin = {
						type: 'worker',
						pid: worker.pid
					};
				}
				self.errorHandler(err);
			};
			
			var workerNoticeHandler = function (noticeMessage) {
				var notice = {
					message: noticeMessage,
					origin: {
						type: 'worker',
						pid: worker.pid
					}
				};
				self.noticeHandler(notice);
			};
		
			var worker = fork(__dirname + '/nombo-worker-bootstrap.node');
			worker.on('error', workerErrorHandler);
			
			if (!workerData.id) {
				workerData.id = workerIdCounter++;
			}
			
			worker.id = workerData.id;
			worker.data = workerData;

			var workerOpts = self._cloneObject(self._options);
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
				self.errorHandler(new Error(message));

				console.log('   Respawning worker');
				launchWorker(workerData, lead);
			});

			return worker;
		};

		var launchWorkers = function () {
			initBundles(function () {
				var len = self._options.workers.length;
				if (len > 0) {
					var i;
					for (i in bundles) {
						self._resourceSizes[i] = Buffer.byteLength(bundles[i], 'utf8');
					}

					var styleAssetSizeMap = styleBundle.getAssetSizeMap();
					for (i in styleAssetSizeMap) {
						self._resourceSizes[i] = styleAssetSizeMap[i];
					}
			
					launchWorker(self._options.workers[0], true);
					for (i = 1; i < len; i++) {
						launchWorker(self._options.workers[i]);
					}
					autoRebundle();
				}
			});
		};
		
		if (self._options.release) {
			self._updateCacheVersion(launchWorkers);
		} else {
			launchWorkers();
		}
	};

	var stores = self._options.stores;
	var pass = crypto.randomBytes(32).toString('hex');
	
	var launchIOCluster = function () {
		self._ioCluster = new self._clusterEngine.IOCluster({
			stores: stores,
			dataKey: pass,
			expiryAccuracy: self._dataExpiryAccuracy,
			secure: self._options.protocol == 'https'
		});
		
		self._ioCluster.on('error', function (err) {
			if (err.stack) {
				err.origin = {
					type: 'store'
				}
			}
			self.errorHandler(err);
		});
	};
	
	launchIOCluster();
	self._ioCluster.on('ready', ioClusterReady);
};

Master.prototype._updateCacheVersion = function (callback) {
	var self = this;
	
	fs.readFile(self._paths.versionFilePath, function (err, data) {
		if (err) {
			if (err instanceof Error) {
				err = err.message;
			}
			var noticeMessage = 'Failed to read cache version from versionFile at ' + self._paths.versionFilePath + '. Error: ' + err;
			var notice = {
				message: noticeMessage,
				origin: {
					type: 'master'
				}
			};
			self.noticeHandler(notice);
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

	appDef.appURL = this._paths.appURL;
	appDef.frameworkURL = this._paths.frameworkURL;
	appDef.sessionCookieName = this._sessionCookieName;
	appDef.cacheCookieName = this._cacheCookieName;
	appDef.virtualURL = appDef.appURL + '~virtual/';
	appDef.appStyleBundleURL = appDef.virtualURL + 'styles.css';
	appDef.appTemplateBundleURL = appDef.virtualURL + 'templates.js';
	appDef.frameworkCoreBundleURL = appDef.virtualURL + 'core.js';
	appDef.appLibBundleURL = appDef.virtualURL + 'libs.js';
	appDef.appScriptBundleURL = appDef.virtualURL + 'scripts.js';
	appDef.freshnessURL = this._paths.freshnessURL;
	appDef.frameworkClientURL = this._paths.frameworkClientURL;
	appDef.frameworkLibsURL = this._paths.frameworkClientURL + 'libs/';
	appDef.frameworkAssetsURL = this._paths.frameworkClientURL + 'assets/';
	appDef.pluginsURL = this._paths.frameworkClientURL + 'plugins/';
	appDef.frameworkScriptsURL = this._paths.frameworkClientURL + 'scripts/';
	appDef.loadScriptURL = this._paths.loadScriptURL;
	appDef.cookiesDisabledURL = this._paths.cookiesDisabledURL;
	appDef.failedConnectionURL = this._paths.failedConnectionURL;
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

	return appDef;
};

Master.prototype._normalizeURL = function (url) {
	url = path.normalize(url);
	return url.replace(/\\/g, '/');
};

module.exports.Master = Master;