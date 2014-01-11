/*
	Important polyfills for compatibility with older browsers.
	
	Array.prototype.indexOf
	Object.create
	Function.prototype.bind
*/

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (item, start) {
		if (!start) {
			start = 0;
		}
		var len = this.length;
		var i;
		for (i=start; i<len; i++) {
			if (this[i] === item) {
				return i;
			}
		}
		return -1;
	}
}

if (!Object.create) {
	Object.create = (function () {
		function F() {};

		return function (o) {
			if (arguments.length != 1) {
				throw new Error('Object.create implementation only accepts one parameter.');
			}
			F.prototype = o;
			return new F();
		}
	})();
}

if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
					aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

var $loader = {
	_ie: false,
	_ieVersion: null,
	_embedCounter: null,
	
	_modules: {},
	
	_loaderStart: null,
	_cacheVersion: NOMBO_CACHE_VERSION,
	
	_appDefinition: null,
	_resources: null,
	_resourceIDs: null,
	_resourcesLoaded: null,
	
	_deepResources: null,
	_deepResourcesLoaded: null,
	
	_resourcesLoadedMap: null,
	
	_waitForReadyInterval: null,
	_attempts: null,
	
	_booting: true,
	_domReady: false,

	ready: function (callback) {
		if ($loader._domReady) {
			callback($loader._appDefinition);
		} else {
			$loader.on('ready', callback);
			
			if (!$loader._waitForReadyInterval) {
				$loader._waitForReadyInterval = setInterval($loader._waitForReady, 20);
			}
		}
	},
	
	progress: function (callback) {
		$loader.on('progress', callback);
	},
	
	init: function (appDefinition, resources, skipPreload) {
		$loader._resources = [];
		$loader._appDefinition = appDefinition;
		
		if ($loader._appDefinition.appStyleBundleURL) {
			$loader._resources.push($loader._appDefinition.appStyleBundleURL);
		}
		if ($loader._appDefinition.frameworkCoreBundleURL) {
			$loader._resources.push($loader._appDefinition.frameworkCoreBundleURL);
		}
		if ($loader._appDefinition.appLibBundleURL) {
			$loader._resources.push($loader._appDefinition.appLibBundleURL);
		}
		if ($loader._appDefinition.appTemplateBundleURL) {
			$loader._resources.push($loader._appDefinition.appTemplateBundleURL);
		}
		if ($loader._appDefinition.appScriptBundleURL) {
			$loader._resources.push($loader._appDefinition.appScriptBundleURL);
		}
		
		if (resources) {
			$loader._resources = $loader._resources.concat(resources);
		}
		$loader._appDefinition.resources = $loader._resources;
		
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
			$loader._ie = true;
			$loader._ieVersion = new Number(RegExp.$1);
		}
		
		$loader.grab.init(appDefinition);
		$loader.grab.scriptTag($loader._appDefinition.loadScriptURL, 'text/javascript');
	},
	
	EventEmitter: function () {
		var self = this;		
		self._eventMap = {};
		
		self.on = function () {
			var event = arguments[0];
			var handler = arguments[1];
			
			if (!self._eventMap.hasOwnProperty(event)) {
				self._eventMap[event] = [];
			}
			self._eventMap[event].push(handler);
		}
		
		self.off = function () {
			var event = arguments[0];
			var handler = arguments[1];
			
			if (self._eventMap[event]) {
				if (handler) {
					var i;
					var newArray = [];
					for (i in self._eventMap[event]) {
						if (self._eventMap[event][i] != handler) {
							newArray.push(self._eventMap[event][i]);
						}
					}
					if (newArray.length > 0) {
						self._eventMap[event] = newArray;
					} else {
						delete self._eventMap[event];
					}
				} else {
					delete self._eventMap[event];
				}
			}
		}
		
		self.once = function () {
			var event = arguments[0];
			var handler = arguments[1];
			
			var hdlr = function (data) {
				self.off(event, hdlr);
				handler(data);
			}
			
			self.on(event, hdlr);
		}
		
		self.emit = function () {
			var event = arguments[0];
			var data = arguments[1];
			
			if (self._eventMap[event]) {
				var events = self._eventMap[event].slice();
				var i;
				var len = events.length;
				for (i=0; i<len; i++) {
					events[i](data);
				}
			}
		}
		
		self.numListeners = function (event) {
			if (self._eventMap[event]) {
				var count = 0;
				var i;
				for (i in self._eventMap[event]) {
					count++;
				}
				return count;
			}
			return 0;
		}
	},
	
	getAppDefinition: function () {
		return $loader._appDefinition;
	},
	
	_embedAllResources: function () {
		$loader.grab._processEmbedQueue();
	},
	
	_waitForReady: function () {
		var head = document.getElementsByTagName('head')[0];
		
		if (head && document.body) {
			$loader._domReady = true;
			clearInterval($loader._waitForReadyInterval);
			$loader.emit('ready', $loader._appDefinition);
		}
	},
	
	_globalEval: function (src, sourceURL) {
		if (sourceURL) {
			src += '\n//# sourceURL=' + sourceURL + '\n';
		}
		if (window.execScript) {
			window.execScript(src);
		} else {
			window.eval.call(window, src);
		}
	},
	
	_resourceEmbedQueue: [],
	
	loadAll: function (callback) {
		var i;
		var numLoaded = 0;
		var triggeredLoadAllFail = false;
		var len = $loader._resources.length;
		for (i=0; i<len; i++) {
			$loader.grab._loadResource($loader._resources[i], function (err) {
				if (err) {
					if (!triggeredLoadAllFail) {
						triggeredLoadAllFail = true;
						$loader._loadAllFail();
					}
				} else {
					if (++numLoaded >= $loader._resources.length) {
						$loader._booting = false;
						callback && callback();
						$loader.emit('loadall');
					}
				}
			});
		}
	},
	
	_loadAllFail: function () {
		$loader.emit('loadallfail');
	},
	
	finish: function () {
		if ($loader.grab._options.releaseMode) {
			NOMBO_SESSION_MANAGER.markAsCached();
		}
		$loader._embedAllResources();
	},
	
	ajax: function (settings) {
		var type;
		if (settings.type) {
			type = settings.type;
		} else {
			type = "GET";
		}
	
		var xmlhttp = $loader._getHTTPReqObject();
		if (settings.progress && navigator.userAgent.indexOf("Opera") < 0) {
			xmlhttp.onprogress = settings.progress;
		}
		xmlhttp.open(type, settings.url, true);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					if (settings.success) {
						settings.success(xmlhttp.responseText);
					}
				} else {
					if (settings.error) {
						settings.error(xmlhttp.statusText);
					} else {
						throw "Failed to load resource: " + url;
					}
				}
			}
		}
		xmlhttp.send(null);
	},
	
	_getHTTPReqObject: function () {
		var xmlhttp = null;
		
		if ($loader._ie && $loader._ieVersion < 7) {
			try {
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (exceptionA) {
				try {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (exceptionB) {
					xmlhttp = null;
				}
			}
		}
		
		if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
			try {
				xmlhttp = new XMLHttpRequest();
			} catch (e) {
				xmlhttp = null;
			}
		}
		
		if (!xmlhttp) {
			throw "Could not instantiate XMLHttpRequest";
		}
		
		return xmlhttp;
	},
	
	grab: new (function () {
		var self = this;
		
		this._options = {};
		this._callbacks = {
			ready: [],
			fail: []
		};
		this._activeScripts = new Object();
		this._activeCSS = new Object();
		this._resources = [];
		this._resourcesLoaded = [];
		this._resourcesGrabbed = [];
		this._resourcesLoadedMap = {};
		this._loadableResourceMap = {};
		this._deepResources = {};
		this._deepResourcesLoaded = {};
		this._scriptCodes = {};
		this._styleCodes = {};
		this._embedQueue = [];
		this._windowsFileSepRegex = /\\/g;
		this._extRegex = /[.][^\/\\]*$/;
		this._jsExtRegex = /[.]js$/;
		this._mainScriptPrefixRegex = /^([.]\/|\/)/;
		this._cssURLRegex = /([^A-Za-z0-9]|^)url[(][ ]*["']?([^"')]*)["']?[ ]*[)]/g;
		this._resourceSizeTotal = 0;
		
		this.init = function (options) {
			self._options = options;
			var resourceSizeMap = options.resourceSizeMap;
			for (i in resourceSizeMap) {
				self._resourceSizeTotal += resourceSizeMap[i];
			}
		};
		
		this.toUnixSep = function (filePath) {
			return filePath.replace(this._windowsFileSepRegex, '/');
		};
		
		this._triggerReady = function () {
			var callbacks = self._callbacks['ready'];
			self._callbacks['ready'] = [];
			if (callbacks.length > 0) {
				self._execReadyCallbacks(callbacks);
			}
		};
	
		this._execReadyCallbacks = function (callbacks) {
			var len = callbacks.length;
			var i;
		
			for (i=len-1; i>=0; i--) {
				callbacks[i]();
			}
		};
	
		this._triggerFail = function (url) {
			var len = self._callbacks['fail'].length;
			var i;
			for (i=0; i<len; i++) {
				 self._callbacks['fail'][i](url);
			}
		};
		
		/**
			Bind a callback function to Nombo's ready event. The specified function will be called when Nombo is ready to begin processing.
		*/
		this.ready = function (callback) {
			if (!self.isGrabbing()) {
				callback();
			} else {
				self._callbacks['ready'].push(callback);
			}
		};

		/**
			Bind a callback function to Nombo's fail event. The specified function will be called when Nombo fails to load a resource.
			The callback can accept a parameter which indicates the URL of the resource which failed to load.
		*/
		this.fail = function (callback) {
			self._callbacks['fail'].push(callback);
		};
		
		this._addFileExtension = function (url, defaultExtension) {
			if (self._extRegex.test(url)) {
				return url;
			}
			return url + '.' + defaultExtension;
		};
		
		this.app = {
			script: function (name) {
				return self.script(name);
			},
			
			lib: function (name, callback) {				
				if (self._extRegex.test(name)) {
					var resourceName = self._options.appLibsURL + name;
				} else {
					var resourceName = self._options.appLibsURL + name + '.js';
				}
				self.lib(resourceName, callback);
			},
			
			style: function (name, callback) {				
				if (self._extRegex.test(name)) {
					var resourceName = self._options.appStylesURL + name;
				} else {
					var resourceName = self._options.appStylesURL + name + '.css';
				}
				self.style(resourceName, callback);
			},
			
			template: function (name) {
				var tmplDirURL = $loader._appDefinition.appTemplatesURL;
				
				if (self._extRegex.test(name)) {
					var resourceName = tmplDirURL + name;
				} else {
					var resourceName = tmplDirURL + name + '.html';
				}
				
				return self.template(resourceName);
			},
			
			templateURL: function (name) {
				name = self._addFileExtension(name, 'html');
				return self.url($loader._appDefinition.appTemplatesURL + name);
			},
			
			styleURL: function (name) {
				name = self._addFileExtension(name, 'css');
				return self.url(self._options.appStylesURL + name);
			},
			
			assetURL: function (nameWithExtension, fresh) {
				return self.url(self._options.appAssetsURL + nameWithExtension, fresh);
			},
			
			fileURL: function (nameWithExtension, fresh) {
				return self.url(self._options.appFilesURL + nameWithExtension, fresh);
			}
		};
		
		this.framework = {
			script: function (name) {
				name = name.replace(self._mainScriptPrefixRegex, '');
				return self.script(self._options.relativeFrameworkScriptsPath + '/' + name);
			},
			
			lib: function (name, callback) {				
				if (self._extRegex.test(name)) {
					var resourceName = self._options.frameworkLibsURL + name;
				} else {
					var resourceName = self._options.frameworkLibsURL + name + '.js';
				}
				self.lib(resourceName, callback);
			},
			
			style: function (name, callback) {				
				if (self._extRegex.test(name)) {
					var resourceName = self._options.frameworkStylesURL + name;
				} else {
					var resourceName = self._options.frameworkStylesURL + name + '.css';
				}
				self.style(resourceName, callback);
			},
			
			plugin: function (name, callback) {
				if (self._extRegex.test(name)) {
					var resourceName = self._options.pluginsURL + name;
				} else {
					var resourceName = self._options.pluginsURL + name + '.js';
				}
				self.lib(resourceName, callback);
			},
			
			styleURL: function (name) {
				name = self._addFileExtension(name, 'css');
				return self.url(self._options.frameworkStylesURL + name);
			},
			
			assetURL: function (nameWithExtension, fresh) {
				return self.url(self._options.frameworkAssetsURL + nameWithExtension, fresh);
			}
		},
		
		this.script = function (resourceName) {
			resourceName = self.toUnixSep(resourceName);
			
			if (!self._extRegex.test(name)) {
				resourceName += '.js';
			}
			
			var requireName = '/' + resourceName.replace(self._mainScriptPrefixRegex, '')
				.replace(self._jsExtRegex, '');
			
			var bundledModule = require(requireName);
			
			if (bundledModule != null) {
				return bundledModule;
			}
			
			if (self._loadableResourceMap.hasOwnProperty(resourceName)) {
				return self._loadableResourceMap[resourceName];
			}
			var scr = new $loader.Script(resourceName);
			scr.loader.grab();
			self._loadableResourceMap[resourceName] = scr;
			
			return scr;
		};
		
		this.lib = function (resourceName, callback) {			
			if (self._activeScripts[resourceName]) {
				callback(null, resourceName);
			} else {
				self.loadAndEmbedScript(resourceName, callback);
				self._activeScripts[resourceName] = true;
			}
		};
		
		this.style = function (resourceName, callback) {			
			if (self._activeCSS[resourceName]) {
				callback(null, resourceName);
			} else {
				self.loadAndEmbedCSS(resourceName, callback);
				self._activeCSS[resourceName] = true;
			}
		};
		
		this.template = function (resourceName) {
			if (self._loadableResourceMap.hasOwnProperty(resourceName)) {
				return self._loadableResourceMap[resourceName];
			}
			var templ = new $loader.Template(resourceName);
			templ.loader.grab();
			self._loadableResourceMap[resourceName] = templ;
			return templ;
		};
		
		this.url = function (url, fresh) {
			if (fresh) {
				return url;
			} else {
				return NOMBO_CACHE_MANAGER.setURLCacheVersion(url);
			}
		};
		
		/**
			Get the the image at the given URL and start downloading it.
		*/
		this.image = function () {
			var url = arguments[0];
			var callback = null;
			var fresh = null;
			if (arguments[1] instanceof Function) {
				callback = arguments[1];
			} else {
				fresh = arguments[1];
				if (arguments[2]) {
					callback = arguments[2];
				}
			}
			
			var img = new Image();
			
			if (callback) {				
				img.onload = function () {
					callback(null, url);
				}
			}
			
			img.src = self.url(url, fresh);
			return img;
		};
		
		this._processEmbedQueue = function () {
			var curTag;
			if (self._embedQueue.length > 0) {
				curTag = self._embedQueue[0];
				if (curTag.ready) {
					self._embedQueue.shift();
					if (curTag.type == 'link') {
						if (!$loader._ie || $loader._ieVersion > 8) {
							self.styleTag(self._styleCodes[curTag.url], 'text/css');
						} else {
							self.linkTag(curTag.url, 'text/css', 'stylesheet', curTag.query);
						}
						self._resourcesGrabbed.push(curTag.url);
						if (curTag.callback) {
							curTag.callback(curTag.error, curTag.url);
						}
						if (!self.isGrabbing()) {
							self._triggerReady();
						}
						self._processEmbedQueue();
					} else if (curTag.type == 'script') {
						if (curTag.error) {
							self._resourcesGrabbed.push(curTag.url);
							if (curTag.callback) {
								curTag.callback(curTag.error, curTag.url);
							}
							if (!self.isGrabbing()) {
								self._triggerReady();
							}
							self._processEmbedQueue();
						} else {
							$loader._globalEval(self._scriptCodes[curTag.url], curTag.url);
							
							self._resourcesGrabbed.push(curTag.url);
							if (curTag.callback) {
								curTag.callback(curTag.error, curTag.url);
							}
							if (!self.isGrabbing()) {
								self._triggerReady();
							}
							self._processEmbedQueue();
						}
					}
				}
			}
		};
		
		this._loadResource = function (url, callback) {
			var ext = url.match(/[.][^.]*$/);
			var tagData;
			
			if (ext[0] == '.js') {
				tagData = {type: 'script', url: url, ready: false};
				self._loadTagResource(tagData, callback);
			} else if (ext[0] == '.css') {
				tagData = {type: 'link', url: url, ready: false};
				self._loadTagResource(tagData, callback);
			} else {
				self._loadDeepResourceToCache(url, false, function (err, data) {
					self._resourcesGrabbed.push(url);
					callback(err, data);
				});
			}
		};
		
		this._loadTagResource = function (tagData, callback) {
			self._embedQueue.push(tagData);
			self._loadDeepResourceToCache(tagData.url, false, function (err, data) {
				tagData.ready = true;
				tagData.error = err;
				callback(err, data);
			});
		};
		
		this.loadAndEmbedScript = function (url, callback) {
			var tagData = {type: 'script', url: url, callback: callback, error: null, ready: false};
			self._embedQueue.push(tagData);
			self._loadDeepResourceToCache(url, false, function (err) {
				tagData.ready = true;
				tagData.error = err;
				self._processEmbedQueue();
			});
		};
		
		this.loadAndEmbedCSS = function (url, callback) {		
			var tagData = {type: 'link', url: url, callback: callback, error: null, ready: false}
			self._embedQueue.push(tagData);
			self._loadDeepResourceToCache(url, false, function (err) {
				tagData.ready = true;
				tagData.error = err;
				self._processEmbedQueue();
			});
		};
		
		/**
			Insert a script tag into the current document as it is being constructed.
			The id & callback parameters are optional.
		*/
		this.scriptTag = function (url, type, id, callback, query) {	
			var head = document.getElementsByTagName('head')[0];
			
			var script = document.createElement('script');
			
			if (!$loader._ie || parseInt($loader._ieVersion) > 8) {
				if (callback) {
					script.onload = function () {
						callback(null, url);
					};
				}
			} else {
				if (callback) {
					script.onreadystatechange = function () {
						if (this.readyState == 'complete' || this.readyState == 'loaded') {
							script.onreadystatechange = null;
							callback(null, url);
						}
					};
				}
			}
			
			if (id) {
				script.id = id;
			}
			script.type = type;
			
			if (query) {
				script.src = url + '?' + query;
			} else {
				script.src = NOMBO_CACHE_MANAGER.setURLCacheVersion(url);
			}
			
			head.appendChild(script);
		};
		
		/**
			Insert a link tag into the current document as it is being constructed.
			The id & callback parameters are optional.
		*/
		this.linkTag = function (url, type, rel, query, id) {
			var head = document.getElementsByTagName('head')[0];
			
			var curScripts = document.getElementsByTagName('script');
			var firstScript = null;
			var firstIndex = 0;
			
			if (curScripts) {
				var len = curScripts.length;
				while(firstIndex < len && curScripts[firstIndex].parentNode != head) {
					firstIndex++;
				}
				if (firstIndex < len) {
					firstScript = curScripts[firstIndex];
				}
			}
			
			var link = document.createElement('link');
			
			if (id) {
				link.id = id;
			}
			link.rel = rel;
			link.type = type;
			if (query) {
				link.href = url + '?' + query;
			} else {
				link.href = NOMBO_CACHE_MANAGER.setURLCacheVersion(url);
			}
			
			if (firstScript) {
				head.insertBefore(link, firstScript);
			} else {
				var curLinks = document.getElementsByTagName('link');
				var lastLink = null;
				var lastIndex = curLinks.length - 1;
				if (curLinks) {
					while(lastIndex >= 0 && curLinks[lastIndex].parentNode != head) {
						lastIndex--;
					}
					if (lastIndex >= 0) {
						lastLink = curLinks[lastIndex];
					}
				}
				
				if (lastLink) {
					if (lastLink.nextSibling) {
						head.insertBefore(link, lastLink.nextSibling);
					} else {
						head.appendChild(link);
					}
				} else {
					head.appendChild(link);
				}
			}
		};
		
		this.styleTag = function (code, type, id) {
			var head = document.getElementsByTagName('head')[0];
			
			var curScripts = document.getElementsByTagName('script');
			var firstScript = null;
			var firstIndex = 0;
			
			if (curScripts) {
				var len = curScripts.length;
				while(firstIndex < len && curScripts[firstIndex].parentNode != head) {
					firstIndex++;
				}
				if (firstIndex < len) {
					firstScript = curScripts[firstIndex];
				}
			}
			
			var style = document.createElement('style');
			
			if (id) {
				style.id = id;
			}
			style.type = type;
			style.innerHTML = code;
			
			if (firstScript) {
				head.insertBefore(style, firstScript);
			} else {
				var curStyles = document.getElementsByTagName('style');
				var lastStyle = null;
				var lastIndex = curStyles.length - 1;
				if (curStyles) {
					while(lastIndex >= 0 && curStyles[lastIndex].parentNode != head) {
						lastIndex--;
					}
					if (lastIndex >= 0) {
						lastStyle = curStyles[lastIndex];
					}
				}
				
				if (lastStyle) {
					if (lastStyle.nextSibling) {
						head.insertBefore(style, lastStyle.nextSibling);
					} else {
						head.appendChild(style);
					}
				} else {
					head.appendChild(style);
				}
			}
		};
		
		this.isGrabbing = function () {
			return self._resourcesGrabbed.length < self._resources.length;
		};
		
		this._progressTracker = {};
		this._updateProgressStatus = function (url, loaded) {
			if (self._options.resourceSizeMap.hasOwnProperty(url)) {
				self._progressTracker[url] = loaded;
				
				var i;
				var progressMap = self._progressTracker;
				var status = {loaded: 0, total: self._resourceSizeTotal};
				
				for (i in progressMap) {
					status.loaded += progressMap[i];
				}
				$loader.emit('progress', status);
			}
		};
		
		this._versionDeepCSSURLs = function (content) {
			content = content.replace(this._cssURLRegex, function (match, first, second) {
				var newURL = NOMBO_CACHE_MANAGER.setURLCacheVersion(second);
				return first + 'url("' + newURL + '")';
			});
			
			return content;
		};
		
		this._loadDeepResourceToCache = function (url, fresh, callback, rootURL) {
			url = url.replace(/[?].*/, '');
			if (!self._resourcesLoadedMap[url]) {
				if (!rootURL || url == rootURL) {
					rootURL = url;
					self._resources.push(url);
					self._deepResources[rootURL] = [];
					self._deepResources[rootURL].push(url);
					
					self._deepResourcesLoaded[rootURL] = [];
				}
				
				if (/[.](png|jpg|gif)$/.test(url)) {
					// images
					var img = new Image();
					img.onload = function () {
						var resourceData = img;
						self._resourcesLoadedMap[url] = true;
						self._deepResourcesLoaded[rootURL].push(url);
						if ($loader._booting) {
							self._updateProgressStatus(url, self._options.resourceSizeMap[url]);
						}
						
						if (self._deepResourcesLoaded[rootURL].length >= self._deepResources[rootURL].length) {
							self._resourcesLoaded.push(rootURL);
							if (callback) {
								callback(null, {url: rootURL, data: resourceData});
							}
						}
					};
					
					img.onerror = function () {
						self._triggerFail(url);
						if (callback) {
							callback('Failed to load resource at url: ' + url);
						}
					};
					
					var tempURL = self.url(url, fresh);
					img.src = tempURL;
				} else {
					var tempURL = self.url(url, fresh);
					var ajaxSettings = {
						url: tempURL,
						type: "GET",
						success: function (data) {
							self._updateProgressStatus(url, self._options.resourceSizeMap[url]);
							var resourceData = data;
							
							self._resourcesLoadedMap[url] = true;
							self._deepResourcesLoaded[rootURL].push(url);
							var urls, nonLoadedURLs;
							if (/[.](css)$/.test(url)) {
								resourceData = self._versionDeepCSSURLs(resourceData);
								urls = self._parseDeepCSSURLs(resourceData, url);
								
								nonLoadedURLs = [];
								
								var i, curURL;
								var len = urls.length;
								for (i=0; i<len; i++) {
									curURL = urls[i];
									
									if (!self._resourcesLoadedMap[curURL]) {
										self._deepResources[rootURL].push(curURL);
										nonLoadedURLs.push(curURL);
									}
								}
								
								len = nonLoadedURLs.length;
								
								for (i=0; i<len; i++) {
									self._loadDeepResourceToCache(nonLoadedURLs[i], fresh, callback, rootURL);
								}
								
								self._styleCodes[url] = resourceData;
							} else if (/[.]js$/.test(url)) {
								self._scriptCodes[url] = resourceData;
							}
							
							if (self._deepResourcesLoaded[rootURL].length >= self._deepResources[rootURL].length) {
								self._resourcesLoaded.push(rootURL);
								if (callback) {
									callback(null, {url: rootURL, data: resourceData});
								}
							}
						},
						
						error: function () {
							self._triggerFail(url);
							if (callback) {
								callback('Failed to load resource at url: ' + url);
							}
						}
					};
					
					if ($loader._booting) {
						ajaxSettings.progress = function (e) {
							self._updateProgressStatus(url, e.loaded);
						}
					}
					
					// all text-based files
					$loader.ajax(ajaxSettings);
				}
			}
		};
		
		this._parseDeepCSSURLs = function (fileContent, fileURL) {
			var urlMap = {};
			var urls = [];
			var fileDirURL = fileURL.match(/^(.*)\//)[0];
			
			var chunks = self._parseFunctionCalls(fileContent, ['url']);
			
			var imports = fileContent.match(/@import +["'][^"']+["']/g);
			if (imports) {
				chunks = chunks.concat(imports);
			}
			
			var isolateURL = /(^url[(][ ]*["']?|["']?[)]$|^@import[ ]*["']|["']$)/g;
			var absolute = /^(https?:[/][/]|[\/\\])/;
			
			var i, curURL;
			var len = chunks.length;
			for (i=0; i<len; i++) {
				curURL = chunks[i].replace(isolateURL, '');
				if (curURL != "" && !urlMap.hasOwnProperty(curURL)) {
					if (!absolute.test(curURL)) {
						urls.push(fileDirURL + curURL);
					} else {
						urls.push(curURL);
					}
					urlMap[curURL] = true;
				}
			}
				
			return urls;
		};
		
		this._parseFunctionCalls = function (string, functionNames) {
			var functionCalls = [];
			var functionsRegex = new RegExp('(([^A-Za-z0-9]|^)' + functionNames.join(' *[(]|([^A-Za-z0-9]|^)') + ' *[(])', 'gm');
			var startPos = 0;
			var i, ch, len, curFunc, bt;
			while(true) {
				startPos = string.search(functionsRegex);
				if (startPos < 0) {
					break;
				}
				
				if (string.charAt(startPos) == '(') {
					startPos++;
				}
				
				curFunc = '';
				len = string.length;
				bt = 0;
				for (i=startPos; i<len; i++) {
					ch = string.charAt(i);
					curFunc += ch;
					
					if (ch == '(') {
						bt++;
					} else if (ch == ')') {
						if (--bt == 0) {
							functionCalls.push(curFunc.replace(/^[^A-Za-z0-9]/, ''));
							break;
						}
					}
				}
				string = string.substr(startPos + 2);
			}
			return functionCalls;
		};
	})
};

$loader.EventEmitter.apply($loader);

$loader.ResourceLoader = function (resourceName, resourceWrapper) {
	var self = this;
	
	$loader.EventEmitter.call(self);
	
	self.name = resourceName;
	self.loaded = false;
	
	self.load = function (listener)	{
		if (self.loaded) {
			listener(self);
		} else {
			self.on('load', listener);
		}
		return resourceWrapper;
	}
	
	self.error = function (listener)	{
		self.on('error', listener);
		return resourceWrapper;
	}
};

$loader.ResourceLoader.prototype = Object.create($loader.EventEmitter.prototype);

$loader.Script = function (resourceName) {
	var self = this;
	self.loader = new $loader.ResourceLoader(resourceName, self);
	
	if (!$loader._modules.hasOwnProperty(resourceName)) {
		$loader._modules[resourceName] = self;
	}
	
	self.loader.grab = function () {
		var moduleLoaded = function (err) {
			if (err) {
				self.loader.emit('error', self);
			} else {				
				if (!self.loader.loaded) {
					self.loader.emit('load');
					self.loader.loaded = true;
				}
			}
		}
		
		if ($loader.grab._activeScripts[self.loader.name]) {
			moduleLoaded();
		} else {
			$loader.grab.loadAndEmbedScript(self.loader.name, moduleLoaded);
			$loader.grab._activeScripts[self.loader.name] = true;
		}
	}
}

$loader.Template = function (resourceName) {
	var self = this;
	self.loader = new $loader.ResourceLoader(resourceName, self);
	
	self.loader.renderer = null;
	self.loader.text = null;
	self.loader.extRegex = /[.][^\/\\]*$/;
	
	self.getName = function () {
		return self.loader.name;
	}
	
	self.isLoaded = function () {
		return self.loader.loaded;
	}
	
	self.loader.grab = function () {
		$loader.grab._loadDeepResourceToCache(self.loader.name, false, function (err, result) {
			if (err) {
				self.loader.emit('error', self);
			} else {
				$loader.grab._resourcesGrabbed.push(self.loader.name);
				self.loader.loaded = true;
				self.loader.text = result.data;
				self.loader.renderer = Handlebars.compile(self.loader.text);
				
				self.loader.emit('load', self);
				
				if (!$loader.grab.isGrabbing()) {
					$loader.grab._triggerReady();
				}
			}
		});
	}
	
	self.make = function (content) {
		self.loader.text = content;
		self.loader.renderer = Handlebars.compile(self.loader.text);
		self.loader.loaded = true;
	}
	
	self.clone = function () {
		var templ = new $loader.Template(self.loader.name);
		templ.make(self.loader.text);
		return templ;
	}
	
	self.render = function (data) {
		if (!self.loader.loaded) {
			throw 'The template has not been loaded';
		}
		return self.loader.renderer(data);
	}
	
	self.toString = function () {
		if (!self.loader.loaded) {
			throw 'The template has not been loaded';
		}
		return self.loader.text;
	}
	
	self.getRenderer = function () {
		return self.loader.renderer;
	}
}
