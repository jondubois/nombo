var $loader = {
	_ie: false,
	_ieVersion: null,
	_embedCounter: null,
	
	_modules: {},
	
	_loaderStart: null,
	_cacheVersion: NCOMBO_CACHE_VERSION,
	
	_appDefinition: null,
	_resources: null,
	_resourceIDs: null,
	_resourcesLoaded: null,
	
	_deepResources: null,
	_deepResourcesLoaded: null,
	
	_resourcesLoadedMap: null,
	
	_waitForReadyInterval: null,
	_attempts: null,
	
	_skipPreload: null,
	_timeout: 10000,
	_booting: true,

	ready: function(callback) {
		$loader.on('ready', callback);
		
		if(!$loader._waitForReadyInterval) {
			$loader._waitForReadyInterval = setInterval($loader._waitForReady, 20);
		}
	},
	
	progress: function(callback) {
		$loader.on('progress', callback);
	},
	
	init: function(appDefinition, resources, skipPreload) {
		$loader._resources = [];
		$loader._appDefinition = appDefinition;
		if($loader._appDefinition.appStyleBundleURL) {
			$loader._resources.push($loader._appDefinition.appStyleBundleURL);
		}
		if($loader._appDefinition.appLibBundleURL) {
			$loader._resources.push($loader._appDefinition.appLibBundleURL);
		}
		if($loader._appDefinition.appTemplateBundleURL) {
			$loader._resources.push($loader._appDefinition.appTemplateBundleURL);
		}
		if($loader._appDefinition.appScriptBundleURL) {
			$loader._resources.push($loader._appDefinition.appScriptBundleURL);
		}
		
		if(resources) {
			$loader._resources = $loader._resources.concat(resources);
		}
		
		if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
			$loader._ie = true;
			$loader._ieVersion = new Number(RegExp.$1);
		}
		
		$loader.grab.init(appDefinition);
		$loader._skipPreload = skipPreload;
		if(skipPreload) {
			$loader._waitForReadyInterval = setInterval($loader._waitForReady, 20);
		} else {
			$loader.grab.scriptTag($loader._appDefinition.loadScriptURL, 'text/javascript');
		}
	},
	
	mixin: function(MainClass) {
		var proto = MainClass.prototype;
		proto.__internalMixinMethods = {};
		
		proto.initMixin = function(MixinClass) {
			var args = Array.prototype.slice.call(arguments, 1);
			var i, value;
			
			var protoClone = {};
			for(i in proto) {
				protoClone[i] = proto[i];
			}
			
			for(i in MixinClass.prototype) {
				this[i] = MixinClass.prototype[i];
			}
			
			// using different calls for browser compatibility reasons
			if(args) {
				MixinClass.apply(this, args);
			} else {
				MixinClass.apply(this);
			}
			
			var mixinMethods = {};
			
			for(i in this) {
				value = this[i];
				if(value instanceof Function) {
					mixinMethods[i] = value;
				}
			}
			
			for(i in protoClone) {
				value = protoClone[i];
				if(i != '__internalMixinMethods') {
					this[i] = value;
				}
			}
			
			this.__internalMixinMethods[MixinClass] = mixinMethods;
		}
		
		proto.callMixinMethod = function(MixinClass, method) {
			var args = Array.prototype.slice.call(arguments, 2);
			if(args) {
				return this.__internalMixinMethods[MixinClass][method].apply(this, args);
			} else {
				return this.__internalMixinMethods[MixinClass][method].apply(this);
			}
		}
		
		proto.applyMixinMethod = function(MixinClass, method, args) {
			if(args && !(args instanceof Array)) {
				throw 'Exception: The args parameter of the applyMixinMethod function must be an Array';
			}
			return this.__internalMixinMethods[MixinClass][method].apply(this, args);
		}
		
		proto.instanceOf = function(classReference) {
			return this instanceof classReference || this.__internalMixinMethods.hasOwnProperty(classReference);
		}
		
		return MainClass;
	},
	
	EventEmitter: function() {
		var self = this;		
		self._eventMap = {};
		
		self.on = function() {
			var event = arguments[0];
			var handler = arguments[1];
			
			if(!self._eventMap.hasOwnProperty(event)) {
				self._eventMap[event] = [];
			}
			self._eventMap[event].push(handler);
		}
		
		self.off = function() {
			var event = arguments[0];
			var handler = arguments[1];
			
			if(self._eventMap[event]) {
				if(handler) {
					var i;
					var newArray = [];
					for(i in self._eventMap[event]) {
						if(self._eventMap[event][i] != handler) {
							newArray.push(self._eventMap[event][i]);
						}
					}
					if(newArray.length > 0) {
						self._eventMap[event] = newArray;
					} else {
						delete self._eventMap[event];
					}
				} else {
					delete self._eventMap[event];
				}
			}
		}
		
		self.once = function() {
			var event = arguments[0];
			var handler = arguments[1];
			
			var hdlr = function(data) {
				self.off(event, hdlr);
				handler(data);
			}
			
			self.on(event, hdlr);
		}
		
		self.emit = function() {
			var event = arguments[0];
			var data = arguments[1];
			
			if(self._eventMap[event]) {
				var events = self._eventMap[event].slice();
				var i;
				var len = events.length;
				for(i=0; i<len; i++) {
					events[i](data);
				}
			}
		}
		
		self.numListeners = function(event) {
			if(self._eventMap[event]) {
				var count = 0;
				var i;
				for(i in self._eventMap[event]) {
					count++;
				}
				return count;
			}
			return 0;
		}
	},
	
	getAppDefinition: function() {
		return $loader._appDefinition;
	},
	
	_embedAllResources: function() {
		$loader.grab._processEmbedQueue();
	},
	
	_waitForReady: function() {
		var head = document.getElementsByTagName('head')[0];
		
		if(head && document.body) {
			clearInterval($loader._waitForReadyInterval);
			if($loader._skipPreload) {
				$loader.loadAll(function() {
					$loader._embedAllResources();
				});
			} else {
				$loader._startLoading();
			}
		}
	},
	
	_startLoading: function() {
		var settings = {};
		var i;
		for(i in $loader._appDefinition) {
			settings[i] = $loader._appDefinition[i];
		}
		settings.resources = $loader._resources;
		$loader.emit('ready', settings);
	},
	
	_globalEval: function(src, sourceURL) {
		if(sourceURL) {
			src += '\n//@ sourceURL=' + sourceURL + '\n';
		}
		if(window.execScript) {
			window.execScript(src);
		} else {
			window.eval.call(window, src);
		}
	},
	
	_resourceEmbedQueue: [],
	
	loadAll: function(callback) {
		var i;
		var numLoaded = 0;
		var triggeredLoadAllFail = false;
		for(i in $loader._resources) {
			$loader.grab._loadResource($loader._resources[i], function(err) {
				if(err) {
					if(!triggeredLoadAllFail) {
						triggeredLoadAllFail = true;
						$loader._loadAllFail();
					}
				} else {
					if(++numLoaded >= $loader._resources.length) {
						$loader._booting = false;
						callback && callback();
						$loader.emit('loadall');
					}
				}
			});
		}
	},
	
	_loadAllFail: function() {
		$loader.emit('loadallfail');
	},
	
	finish: function() {
		if($loader.grab._options.releaseMode) {
			NCOMBO_SESSION_MANAGER.markAsCached();
		}
		$loader._embedAllResources();
	},
	
	ajax: function(settings) {
		var type;
		if(settings.type) {
			type = settings.type;
		} else {
			type = "GET";
		}
	
		var xmlhttp = $loader._getHTTPReqObject();
		if(settings.progress && xmlhttp.hasOwnProperty('onprogress') && navigator.userAgent.indexOf("Opera") > -1) {
			xmlhttp.onprogress = settings.progress; >
		}
		xmlhttp.open(type, settings.url, true);
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == 4) {
				if(xmlhttp.status == 200) {
					if(settings.success) {
						settings.success(xmlhttp.responseText);
					}
				} else {
					if(settings.error) {
						settings.error(xmlhttp.statusText);
					} else {
						throw "Failed to load resource: " + url;
					}
				}
			}
		}
		xmlhttp.send(null);
	},
	
	_getHTTPReqObject: function() {
		var xmlhttp = null;
		
		if($loader._ie && $loader._ieVersion < 7) {
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
		
		if(!xmlhttp) {
			throw "Could not instantiate XMLHttpRequest";
		}
		
		return xmlhttp;
	},
	
	grab: {
		_options: {},
		_callbacks: {
			ready: [],
			fail: []
		},
		_activeScripts: new Object(),
		_activeCSS: new Object(),
		_resources: [],
		_resourcesLoaded: [],
		_resourcesGrabbed: [],
		_deepResources: [],
		_deepResourcesLoaded: [],
		_resourcesLoadedMap: {},
		_loadableResourceMap: {},
		_deepResources: {},
		_deepResourcesLoaded: {},
		_scriptCodes: {},
		_styleCodes: {},
		_embedQueue: [],
		_extRegex: /[.][^\/\\]*$/,
		_lessExtRegex: /[.]less$/,
		_resourceSizeTotal: 0,
		
		init: function(options) {
			$loader.grab._options = options;
			var resourceSizeMap = options.resourceSizeMap;
			for(i in resourceSizeMap) {
				$loader.grab._resourceSizeTotal += resourceSizeMap[i];
			}
		},
		
		_triggerReady: function() {
			var callbacks = $loader.grab._callbacks['ready'];
			$loader.grab._callbacks['ready'] = [];
			if(callbacks.length > 0) {
				$loader.grab._execReadyCallbacks(callbacks);
			}
		},
	
		_execReadyCallbacks: function(callbacks) {
			var len = callbacks.length;
			var i;
		
			for(i=len-1; i>=0; i--) {
				callbacks[i]();
			}
		},
	
		_triggerFail: function(url) {
			var len = $loader.grab._callbacks['fail'].length;
			var i;
			for(i=0; i<len; i++) {
				 $loader.grab._callbacks['fail'][i](url);
			}
		},
		
		/**
			Bind a callback function to nCombo's ready event. The specified function will be called when nCombo is ready to begin processing.
		*/
		ready: function(callback) {
			if(!$loader.grab.isGrabbing()) {
				callback();
			} else {
				$loader.grab._callbacks['ready'].push(callback);
			}
		},

		/**
			Bind a callback function to nCombo's fail event. The specified function will be called when nCombo fails to load a resource.
			The callback can accept a parameter which indicates the URL of the resource which failed to load.
		*/
		fail: function(callback) {
			$loader.grab._callbacks['fail'].push(callback);
		},
		
		_addFileExtension: function(url, defaultExtension) {
			if($loader.grab._extRegex.test(url)) {
				return url;
			}
			return url + '.' + defaultExtension;
		},
		
		app: {
			script: function(name) {
				var scriptName = name;
				if(!$loader.grab._extRegex.test(name)) {
					scriptName += '.js';
				}
				
				var requireName = '/' + scriptName;
				
				if(require.modules.hasOwnProperty(requireName)) {
					return require(requireName);
				} else {
					var resourceName = $loader.grab._options.appScriptsURL + scriptName;
					return $loader.grab.script(resourceName);
				}
			},
			
			lib: function(name, callback) {				
				if($loader.grab._extRegex.test(name)) {
					var resourceName = $loader.grab._options.appLibsURL + name;
				} else {
					var resourceName = $loader.grab._options.appLibsURL + name + '.js';
				}
				$loader.grab.lib(resourceName, callback);
			},
			
			style: function() {
				var name = arguments[0];
				var callback = null;
				var fresh = false;
				if(arguments[1] instanceof Function) {
					callback = arguments[1];
				} else {
					fresh = arguments[1];
					if(arguments[2]) {
						callback = arguments[2];
					}
				}
				
				if($loader.grab._extRegex.test(name)) {
					var resourceName = $loader.grab._options.appStylesURL + name;
				} else {
					var resourceName = $loader.grab._options.appStylesURL + name + '.css';
				}
				$loader.grab.style(resourceName, fresh, callback);
			},
			
			template: function(name, fresh) {
				var tmplDirURL = $loader._appDefinition.appTemplatesURL;
				
				if($loader.grab._extRegex.test(name)) {
					var resourceName = tmplDirURL + name;
				} else {
					var resourceName = tmplDirURL + name + '.html';
				}
				
				return $loader.grab.template(resourceName, fresh);
			},
			
			templateURL: function(name, fresh) {
				name = $loader.grab._addFileExtension(name, 'html');
				return $loader.grab.url($loader._appDefinition.appTemplatesURL + name, fresh);
			},
			
			styleURL: function(name, fresh) {
				name = $loader.grab._addFileExtension(name, 'css');
				return $loader.grab.url($loader.grab._options.appStylesURL + name, fresh);
			},
			
			assetURL: function(nameWithExtension, fresh) {
				return $loader.grab.url($loader.grab._options.appAssetsURL + nameWithExtension, fresh);
			},
			
			fileURL: function(nameWithExtension, fresh) {
				return $loader.grab.url($loader.grab._options.appFilesURL + nameWithExtension, fresh);
			}
		},
		
		framework: {
			lib: function(name, callback) {				
				if($loader.grab._extRegex.test(name)) {
					var resourceName = $loader.grab._options.frameworkLibsURL + name;
				} else {
					var resourceName = $loader.grab._options.frameworkLibsURL + name + '.js';
				}
				$loader.grab.lib(resourceName, callback);
			},
			
			style: function() {
				var name = arguments[0];
				var callback = null;
				var fresh = false;
				if(arguments[1] instanceof Function) {
					callback = arguments[1];
				} else {
					fresh = arguments[1];
					if(arguments[2]) {
						callback = arguments[2];
					}
				}
				
				if($loader.grab._extRegex.test(name)) {
					var resourceName = $loader.grab._options.frameworkStylesURL + name;
				} else {
					var resourceName = $loader.grab._options.frameworkStylesURL + name + '.css';
				}
				$loader.grab.style(resourceName, fresh, callback);
			},
			
			plugin: function(name, callback) {
				if($loader.grab._extRegex.test(name)) {
					var resourceName = $loader.grab._options.pluginsURL + name;
				} else {
					var resourceName = $loader.grab._options.pluginsURL + name + '.js';
				}
				$loader.grab.lib(resourceName, callback);
			},
			
			script: function(name) {
				if($loader.grab._extRegex.test(name)) {
					var resourceName = $loader.grab._options.frameworkScriptsURL + name;
				} else {
					var resourceName = $loader.grab._options.frameworkScriptsURL + name + '.js';
				}
				return $loader.grab.script(resourceName);
			},
			
			styleURL: function(name, fresh) {
				name = $loader.grab._addFileExtension(name, 'css');
				return $loader.grab.url($loader.grab._options.frameworkStylesURL + name, fresh);
			},
			
			assetURL: function(nameWithExtension, fresh) {
				return $loader.grab.url($loader.grab._options.frameworkAssetsURL + nameWithExtension, fresh);
			}
		},
		
		script: function(resourceName) {
			if($loader.grab._loadableResourceMap.hasOwnProperty(resourceName)) {
				return $loader.grab._loadableResourceMap[resourceName];
			}
			var scr = new $loader.Script(resourceName);
			scr.loader.grab();
			$loader.grab._loadableResourceMap[resourceName] = scr;
			return scr;
		},
		
		lib: function(resourceName, callback) {			
			if($loader.grab._activeScripts[resourceName]) {
				callback(null, resourceName);
			} else {
				$loader.grab.loadAndEmbedScript(resourceName, callback);
				$loader.grab._activeScripts[resourceName] = true;
			}
		},
		
		template: function(resourceName, fresh) {
			if($loader.grab._loadableResourceMap.hasOwnProperty(resourceName) && !fresh) {
				return $loader.grab._loadableResourceMap[resourceName];
			}
			var templ = new $loader.Template(resourceName);
			templ.loader.grab(fresh);
			$loader.grab._loadableResourceMap[resourceName] = templ;
			return templ;
		},
		
		style: function() {
			var resourceName = arguments[0];
			var callback = null;
			var fresh = false;
			if(arguments[1] instanceof Function) {
				callback = arguments[1];
			} else {
				fresh = arguments[1];
				if(arguments[2]) {
					callback = arguments[2];
				}
			}
			
			if($loader.grab._activeCSS[resourceName] && !fresh) {
				callback(null, resourceName);
			} else {
				$loader.grab.loadAndEmbedCSS(resourceName, fresh, callback);
				$loader.grab._activeCSS[resourceName] = true;
			}
		},
		
		url: function(url, fresh) {
			if(fresh) {
				return smartCacheManager.setCacheKiller(url);
			} else {
				return smartCacheManager.setURLCacheVersion(url);
			}
		},
		
		/**
			Get the the image at the given URL and start downloading it.
		*/
		image: function() {
			var url = arguments[0];
			var callback = null;
			var fresh = false;
			if(arguments[1] instanceof Function) {
				callback = arguments[1];
			} else {
				fresh = arguments[1];
				if(arguments[2]) {
					callback = arguments[2];
				}
			}
			
			var img = new Image();
			
			if(callback) {
				var timedOut = false;
				var timeout = setTimeout(function() {
					timedOut = true;
					callback('Failed to load resource at URL: ' + url);
				}, $loader._timeout);
				
				img.onload = function() {
					if(!timedOut) {
						clearTimeout(timeout);
						callback(null, url);
					}
				}
			}
			
			if(fresh) {
				img.src = smartCacheManager.setCacheKiller(url);
			} else {
				img.src = smartCacheManager.setURLCacheVersion(url);
			}
			return img;
		},
		
		_processEmbedQueue: function() {
			var curTag;
			if($loader.grab._embedQueue.length > 0) {
				curTag = $loader.grab._embedQueue[0];
				if(curTag.ready) {
					$loader.grab._embedQueue.shift();
					if(curTag.type == 'link') {
						if(curTag.url == $loader._appDefinition.appStyleBundleURL && (!$loader._ie || $loader._ieVersion > 8)) {
							$loader.grab.styleTag($loader.grab._styleCodes[curTag.url], 'text/css');
						} else {
							$loader.grab.linkTag(curTag.url, 'text/css', 'stylesheet', curTag.query);
						}
						$loader.grab._resourcesGrabbed.push(curTag.url);
						if(curTag.callback) {
							curTag.callback(curTag.error, curTag.url);
						}
						if(!$loader.grab.isGrabbing()) {
							$loader.grab._triggerReady();
						}
						$loader.grab._processEmbedQueue();
					} else if(curTag.type == 'script') {
						if(curTag.error) {
							$loader.grab._resourcesGrabbed.push(curTag.url);
							if(curTag.callback) {
								curTag.callback(curTag.error, curTag.url);
							}
							if(!$loader.grab.isGrabbing()) {
								$loader.grab._triggerReady();
							}
							$loader.grab._processEmbedQueue();
						} else {
							if(curTag.url == $loader._appDefinition.appScriptBundleURL) {
								$loader._globalEval($loader.grab._scriptCodes[curTag.url]);
							} else {
								$loader._globalEval($loader.grab._scriptCodes[curTag.url], curTag.url);
							}
							$loader.grab._resourcesGrabbed.push(curTag.url);
							if(curTag.callback) {
								curTag.callback(curTag.error, curTag.url);
							}
							if(!$loader.grab.isGrabbing()) {
								$loader.grab._triggerReady();
							}
							$loader.grab._processEmbedQueue();
						}
					}
				}
			}
		},
		
		_loadTag: function(tagData, callback) {
			$loader.grab._embedQueue.push(tagData);
			
			$loader.grab._loadDeepResourceToCache(tagData.url, false, function(err, data) {
				tagData.ready = true;
				tagData.error = err;
				callback(err, data);
			});
		},
		
		_loadResource: function(url, callback) {
			var ext = url.match(/[.][^.]*$/);
			var tagData;			
			
			if(ext[0] == '.js') {
				tagData = {type: 'script', url: url, callback: function(){}, ready: false};
				$loader.grab._loadTag(tagData, callback);
			} else if(ext[0] == '.css' || ext[0] == '.less') {
				tagData = {type: 'link', url: url, callback: function(){}, ready: false};
				$loader.grab._loadTag(tagData, callback);
			} else {
				$loader.grab._loadDeepResourceToCache(url, false, function(err, data) {
					$loader.grab._resourcesGrabbed.push(url);
					callback(err, data);
				});
			}
		},
		
		loadAndEmbedScript: function(url, callback) {
			var tagData = {type: 'script', url: url, callback: callback, error: null, ready: false};
			$loader.grab._embedQueue.push(tagData);
			$loader.grab._loadDeepResourceToCache(url, false, function(err) {
				tagData.ready = true;
				tagData.error = err;
				$loader.grab._processEmbedQueue();
			});
		},
		
		loadAndEmbedCSS: function() {
			var url = arguments[0];
			var callback = null;
			var fresh = false;
			if(arguments[1] instanceof Function) {
				callback = arguments[1];
			} else {
				fresh = arguments[1];
				if(arguments[2]) {
					callback = arguments[2];
				}
			}
			
			var ck = null;
			if(fresh) {
				ck = smartCacheManager.getCacheKillerParam();
			}
			
			var tagData = {type: 'link', url: url, callback: callback, error: null, ready: false, query: ck}
			$loader.grab._embedQueue.push(tagData);
			$loader.grab._loadDeepResourceToCache(url, ck, function(err) {
				tagData.ready = true;
				tagData.error = err;
				$loader.grab._processEmbedQueue();
			});
		},
		
		/**
			Insert a script tag into the current document as it is being constructed.
			The id & callback parameters are optional.
		*/
		scriptTag: function(url, type, id, callback, query) {		
			var head = document.getElementsByTagName('head')[0];
			
			var script = document.createElement('script');
			
			var timedOut = false;
			var timeout = null;
			if(callback) {
				timeout = setTimeout(function() {
					timedOut = true;
					callback('Failed to embed script tag at URL: ' + url);
				}, $loader._timeout);
			}
			
			if(!$loader._ie || parseInt($loader._ieVersion) > 8) {
				if(callback) {
					script.onload = function() {
						if(!timedOut) {
							if(timeout) {
								clearTimeout(timeout);
							}
							callback(null, url);
						}
					};
				}
			} else {
				if(callback) {
					script.onreadystatechange = function() {
						if(this.readyState == 'complete' || this.readyState == 'loaded') {
							if(!timedOut) {
								if(timeout) {
									clearTimeout(timeout);
								}
								script.onreadystatechange = null;
								callback(null, url);
							}
						}
					};
				}
			}
			
			if(id) {
				script.id = id;
			}
			script.type = type;
			
			if(query) {
				script.src = url + '?' + query;
			} else {
				script.src = smartCacheManager.setURLCacheVersion(url);
			}
			
			head.appendChild(script);
		},
		
		/**
			Insert a link tag into the current document as it is being constructed.
			The id & callback parameters are optional.
		*/
		linkTag: function(url, type, rel, query, id) {
			var head = document.getElementsByTagName('head')[0];
			
			var curScripts = document.getElementsByTagName('script');
			var firstScript = null;
			var firstIndex = 0;
			
			if(curScripts) {
				var len = curScripts.length;
				while(firstIndex < len && curScripts[firstIndex].parentNode != head) {
					firstIndex++;
				}
				if(firstIndex < len) {
					firstScript = curScripts[firstIndex];
				}
			}
			
			var link = document.createElement('link');
			
			if(id) {
				link.id = id;
			}
			link.rel = rel;
			link.type = type;
			if(query) {
				link.href = url + '?' + query;
			} else {
				link.href = smartCacheManager.setURLCacheVersion(url);
			}
			
			if(firstScript) {
				head.insertBefore(link, firstScript);
			} else {
				var curLinks = document.getElementsByTagName('link');
				var lastLink = null;
				var lastIndex = curLinks.length - 1;
				if(curLinks) {
					while(lastIndex >= 0 && curLinks[lastIndex].parentNode != head) {
						lastIndex--;
					}
					if(lastIndex >= 0) {
						lastLink = curLinks[lastIndex];
					}
				}
				
				if(lastLink) {
					if(lastLink.nextSibling) {
						head.insertBefore(link, lastLink.nextSibling);
					} else {
						head.appendChild(link);
					}
				} else {
					head.appendChild(link);
				}
			}
		},
		
		styleTag: function(code, type, id) {
			var head = document.getElementsByTagName('head')[0];
			
			var curScripts = document.getElementsByTagName('script');
			var firstScript = null;
			var firstIndex = 0;
			
			if(curScripts) {
				var len = curScripts.length;
				while(firstIndex < len && curScripts[firstIndex].parentNode != head) {
					firstIndex++;
				}
				if(firstIndex < len) {
					firstScript = curScripts[firstIndex];
				}
			}
			
			var style = document.createElement('style');
			
			if(id) {
				style.id = id;
			}
			style.type = type;
			style.innerHTML = code;
			
			if(firstScript) {
				head.insertBefore(style, firstScript);
			} else {
				var curStyles = document.getElementsByTagName('style');
				var lastStyle = null;
				var lastIndex = curStyles.length - 1;
				if(curStyles) {
					while(lastIndex >= 0 && curStyles[lastIndex].parentNode != head) {
						lastIndex--;
					}
					if(lastIndex >= 0) {
						lastStyle = curStyles[lastIndex];
					}
				}
				
				if(lastStyle) {
					if(lastStyle.nextSibling) {
						head.insertBefore(style, lastStyle.nextSibling);
					} else {
						head.appendChild(style);
					}
				} else {
					head.appendChild(style);
				}
			}
		},
		
		isGrabbing: function() {
			return $loader.grab._resourcesGrabbed.length < $loader.grab._resources.length;
		},
		
		_progressTracker: {},
		_updateProgressStatus: function(url, loaded) {
			if($loader.grab._options.resourceSizeMap.hasOwnProperty(url)) {
				$loader.grab._progressTracker[url] = loaded;
				
				var i;
				var progressMap = $loader.grab._progressTracker;
				var status = {loaded: 0, total: $loader.grab._resourceSizeTotal};
				
				for(i in progressMap) {
					status.loaded += progressMap[i];
				}
				
				$loader.emit('progress', status);
			}
		},
		
		_loadDeepResourceToCache: function(url, fresh, callback, rootURL) {
			url = url.replace(/[?].*/, '');
			if(!$loader.grab._resourcesLoadedMap[url]) {
				var resourceData = null;
				
				if(!rootURL || url == rootURL) {
					rootURL = url;
					$loader.grab._resources.push(url);
					$loader.grab._deepResources[rootURL] = [];
					$loader.grab._deepResources[rootURL].push(url);
					
					$loader.grab._deepResourcesLoaded[rootURL] = [];
				}
				
				if(/[.](png|jpg|gif)$/.test(url)) {
					// images
					var img = new Image();
					img.onload = function() {
						if(url == rootURL) {
							resourceData = img;
						}
						$loader.grab._resourcesLoadedMap[url] = true;
						$loader.grab._deepResourcesLoaded[rootURL].push(url);
						if($loader._booting) {
							$loader.grab._updateProgressStatus(url, $loader.grab._options.resourceSizeMap[url]);
						}
						
						if($loader.grab._deepResourcesLoaded[rootURL].length >= $loader.grab._deepResources[rootURL].length) {
							$loader.grab._resourcesLoaded.push(rootURL);
							if(callback) {
								callback(null, {url: rootURL, data: resourceData});
							}
						}
					};
					
					img.onerror = function() {
						$loader.grab._triggerFail(url);
						if(callback) {
							callback('Failed to load resource at url: ' + url);
						}
					};
					
					var tempURL;
					
					if(fresh) {
						tempURL = smartCacheManager.setCacheKillerParam(url, fresh);
					} else {
						tempURL = smartCacheManager.setURLCacheVersion(url);
					}
					
					img.src = tempURL;
				} else {
					var tempURL;
					if(fresh) {
						tempURL = smartCacheManager.setCacheKillerParam(url, fresh);
					} else {
						tempURL = smartCacheManager.setURLCacheVersion(url);
					}
					
					var ajaxSettings = {
						url: tempURL,
						type: "GET",
						success: function(data) {
							$loader.grab._updateProgressStatus(url, $loader.grab._options.resourceSizeMap[url]);
							if(url == rootURL) {
								resourceData = data;
							}
							
							$loader.grab._resourcesLoadedMap[url] = true;
							$loader.grab._deepResourcesLoaded[rootURL].push(url);
							var urls, nonLoadedURLs;
							if(/[.](css|less)$/.test(url)) {
								nonLoadedURLs = [];
								urls = $loader.grab._parseDeepCSSURLs(data, url);
								
								var i, curURL;
								var len = urls.length;
								for(i=0; i<len; i++) {
									curURL = urls[i];
									
									if(!$loader.grab._resourcesLoadedMap[curURL]) {
										$loader.grab._deepResources[rootURL].push(curURL);
										nonLoadedURLs.push(curURL);
									}
								}
								
								len = nonLoadedURLs.length;
								
								for(i=0; i<len; i++) {
									$loader.grab._loadDeepResourceToCache(nonLoadedURLs[i], fresh, callback, rootURL);
								}
								
								$loader.grab._styleCodes[url] = data;
							} else if(/[.]js$/.test(url)) {
								$loader.grab._scriptCodes[url] = data;
							}
							
							if($loader.grab._deepResourcesLoaded[rootURL].length >= $loader.grab._deepResources[rootURL].length) {
								$loader.grab._resourcesLoaded.push(rootURL);
								if(callback) {
									callback(null, {url: rootURL, data: resourceData});
								}
							}
						},
						
						error: function() {
							$loader.grab._triggerFail(url);
							if(callback) {
								callback('Failed to load resource at url: ' + url);
							}
						}
					};
					
					if($loader._booting) {
						ajaxSettings.progress = function(e) {
							$loader.grab._updateProgressStatus(url, e.loaded);
						}
					}
					
					// all text-based files
					$loader.ajax(ajaxSettings);
				}
			}
		},
		
		_parseDeepCSSURLs: function(fileContent, fileURL) {
			var urlMap = {};
			var urls = [];
			var fileDirURL = fileURL.match(/^(.*)\//)[0];
			
			var chuncks = $loader.grab._parseFunctionCalls(fileContent, ['url']);
			
			var imports = fileContent.match(/@import +["'][^"']+["']/g);
			if(imports) {
				chuncks = chuncks.concat(imports);
			}
			
			var isolateURL = /(^url[(][ ]*["']?|["']?[)]$|^@import[ ]*["']|["']$)/g;
			var absolute = /^https?:[/][/]/;
			
			var i, curURL;
			var len = chuncks.length;
			for(i=0; i<len; i++) {
				curURL = chuncks[i].replace(isolateURL, '');
				if(curURL != "" && !urlMap.hasOwnProperty(curURL)) {
					if(!absolute.test(curURL)) {
						urls.push(fileDirURL + curURL);
					} else {
						urls.push(curURL);
					}
					urlMap[curURL] = true;
				}
			}
				
			return urls;
		},
		
		_parseFunctionCalls: function(string, functionNames) {
			var functionCalls = [];
			var functionsRegex = new RegExp('(([^A-Za-z0-9]|^)' + functionNames.join(' *[(]|([^A-Za-z0-9]|^)') + ' *[(])', 'gm');
			var startPos = 0;
			var i, ch, len, curFunc, bt;
			while(true) {
				startPos = string.search(functionsRegex);
				if(startPos < 0) {
					break;
				}
				
				if(string.charAt(startPos) == '(') {
					startPos++;
				}
				
				curFunc = '';
				len = string.length;
				bt = 0;
				for(i=startPos; i<len; i++) {
					ch = string.charAt(i);
					curFunc += ch;
					
					if(ch == '(') {
						bt++;
					} else if(ch == ')') {
						if(--bt == 0) {
							functionCalls.push(curFunc.replace(/^[^A-Za-z0-9]/, ''));
							break;
						}
					}
				}
				string = string.substr(startPos + 2);
			}
			return functionCalls;
		}
	}
}

$loader.EventEmitter.apply($loader);

$loader.ResourceLoader = $loader.mixin(function(resourceName, resourceWrapper) {
	var self = this;
	self.initMixin($loader.EventEmitter);
	
	self.name = resourceName;
	self.loaded = false;
	
	self.load = function(listener)	{
		if(self.loaded) {
			listener(self);
		} else {
			self.on('load', listener);
		}
		return resourceWrapper;
	}
	
	self.error = function(listener)	{
		self.on('error', listener);
		return resourceWrapper;
	}
});

$loader.Script = function(resourceName) {
	var self = this;
	self.loader = new $loader.ResourceLoader(resourceName, self);
	
	if(!$loader._modules.hasOwnProperty(resourceName)) {
		$loader._modules[resourceName] = self;
	}
	
	self.loader.grab = function() {
		var moduleLoaded = function(err) {
			if(err) {
				self.loader.emit('error', self);
			} else {				
				if(!self.loader.loaded) {
					self.loader.emit('load');
					self.loader.loaded = true;
				}
			}
		}
		
		if($loader.grab._activeScripts[self.loader.name]) {
			moduleLoaded();
		} else {
			$loader.grab.loadAndEmbedScript(self.loader.name, moduleLoaded);
			$loader.grab._activeScripts[self.loader.name] = true;
		}
	}
}

$loader.Template = function(resourceName) {
	var self = this;
	self.loader = new $loader.ResourceLoader(resourceName, self);
	
	self.loader.renderer = null;
	self.loader.text = null;
	self.loader.extRegex = /[.][^\/\\]*$/;
	
	self.getName = function() {
		return self.loader.name;
	}
	
	self.isLoaded = function() {
		return self.loader.loaded;
	}
	
	self.loader.grab = function(fresh) {
		$loader.grab._loadDeepResourceToCache(self.loader.name, fresh, function(err, result) {
			if(err) {
				self.loader.emit('error', self);
			} else {
				$loader.grab._resourcesGrabbed.push(self.loader.name);
				self.loader.loaded = true;
				self.loader.text = result.data;
				self.loader.renderer = Handlebars.compile(self.loader.text);
				
				self.loader.emit('load', self);
				
				if(!$loader.grab.isGrabbing()) {
					$loader.grab._triggerReady();
				}
			}
		});
	}
	
	self.make = function(content) {
		self.loader.text = content;
		self.loader.renderer = Handlebars.compile(self.loader.text);
		self.loader.loaded = true;
	}
	
	self.clone = function() {
		var templ = new $loader.Template(self.loader.name);
		templ.make(self.loader.text);
		return templ;
	}
	
	self.render = function(data) {
		if(!self.loader.loaded) {
			throw 'The template has not been loaded';
		}
		return self.loader.renderer(data);
	}
	
	self.toString = function() {
		if(!self.loader.loaded) {
			throw 'The template has not been loaded';
		}
		return self.loader.text;
	}
	
	self.getRenderer = function() {
		return self.loader.renderer;
	}
}
