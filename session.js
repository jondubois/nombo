var IE = false;
var IE_VERSION = 0;

if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	IE = true;
	IE_VERSION = new Number(RegExp.$1)
}

var NCOMBO_PORT = {{port}};
var NCOMBO_TIMEOUT = {{timeout}};
var NCOMBO_FRAMEWORK_URL = '{{frameworkURL}}';
var NCOMBO_FRAMEWORK_CLIENT_URL = '{{frameworkClientURL}}';
var NCOMBO_IS_FRESH = null;
var NCOMBO_SOCKET_ENGINE = socketCluster;
var NCOMBO_SOCKET = null;
var NCOMBO_SESSION_MANAGER = null;
var NCOMBO_IE = IE;
var NCOMBO_IE_VERSION = IE_VERSION;
var NCOMBO_APP_DEF = {{{appDef}}};
var NCOMBO_RESOURCES = {{{resources}}};
var NCOMBO_DEBUG = {{debug}};
var NCOMBO_ERROR = 'Unkown Error';

(function() {
	var beginLoading = function() {
		$loader.init(NCOMBO_APP_DEF, NCOMBO_RESOURCES, NCOMBO_DEBUG);
	}

	var head = document.getElementsByTagName('head');
	if(head) {
		head = head[0];
	}

	var ncOnScriptLoad = function(scriptTag, callback) {
		if(!NCOMBO_IE || NCOMBO_IE_VERSION > 8) {
			scriptTag.onload = function() {
				callback();
			}
		} else {
			scriptTag.onreadystatechange = function() {
				if(this.readyState == 'complete' || this.readyState == 'loaded') {
					callback();
				}
			}
		}
	}

	var ncScriptLoaded = false;

	var loadScript = document.createElement('script');
	loadScript.type = 'text/javascript';
	
	url = NCOMBO_FRAMEWORK_URL + 'loader.js';
	
	if(!NCOMBO_DEBUG) {
		url = smartCacheManager.setURLCacheVersion(url);
	}
	
	loadScript.src = url;
	
	ncOnScriptLoad(loadScript, function() {
		ncScriptLoaded = true;
	});
	
	head.appendChild(loadScript);

	var spinnerOpts = {
	  lines: 8,
	  length: 5,
	  width: 4,
	  radius: 7,
	  corners: 2,
	  rotate: 0,
	  color: '#666',
	  speed: 1,
	  trail: 60,
	  shadow: false,
	  hwaccel: false,
	  className: 'ncspinner',
	  zIndex: 2e9,
	  top: 'auto',
	  left: 'auto'
	};

	var spinnerDiv = document.createElement('div');

	spinnerDiv.id = 'ncspinner';
	spinnerDiv.style.width = spinnerOpts.radius * 2 + 'px';
	spinnerDiv.style.height = spinnerOpts.radius * 2 + 'px';
	spinnerDiv.style.position = 'absolute';
	spinnerDiv.style.left = '50%';
	spinnerDiv.style.top = '50%';

	var spinner = new Spinner(spinnerOpts).spin(spinnerDiv);
	
	function setCookie(name, value, expirySeconds) {
		var exdate = null;
		if(expirySeconds) {
			exdate = new Date();
			exdate.setTime(exdate.getTime() + Math.round(expirySeconds * 1000));
		}
		var value = escape(value) + '; path=/;' + ((exdate == null) ? '' : ' expires=' + exdate.toUTCString() + ';');
		document.cookie = name + '=' + value;
	}

	function getCookie(name) {
	    var i, x, y, ARRcookies = document.cookie.split(';');
	    for(i = 0; i < ARRcookies.length; i++) {
			x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
			x = x.replace(/^\s+|\s+$/g, '');
			if(x == name) {
				return unescape(y);
			}
	    }
	}
	
	var cookiesEnabledResult = false;
	
	function areCookiesEnabled() {
		if(cookiesEnabledResult) {
			return true;
		}
		var cookieName = '__nccookiecheck';
		setCookie(cookieName, '1');
		if(getCookie(cookieName) != null) {
			cookiesEnabledResult = true;
			setCookie(cookieName, '', -100);
		}
		return cookiesEnabledResult;
	}
	
	var appendSpinner = function() {
		document.body.appendChild(spinnerDiv);
	}

	var readyInterval = setInterval(function() {
		if(document.body) {
			if(areCookiesEnabled()) {
				clearInterval(readyInterval);
				appendSpinner();
			} else {
				if(document.head) {
					clearInterval(readyInterval);
					var cookiesDisabledScript = document.createElement('script');
					cookiesDisabledScript.type = 'text/javascript';
					
					url = NCOMBO_FRAMEWORK_CLIENT_URL + 'scripts/cookiesdisabled.js';
					
					if(!NCOMBO_DEBUG) {
						url = smartCacheManager.setURLCacheVersion(url);
					}
					
					cookiesDisabledScript.src = url;
					document.head.appendChild(cookiesDisabledScript);
				}
			}
		}
	}, 20);

	var _getHTTPReqObject = function() {
		var xmlhttp = null;
		if(NCOMBO_IE) {
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
	}
	
	var cacheVersion = smartCacheManager.getCacheVersion();
	var ncCacheCookieName = '__' + NCOMBO_APP_DEF.appURL + 'nccached';
	var ncCacheCookie = getCookie(ncCacheCookieName);
	
	NCOMBO_IS_FRESH = (ncCacheCookie && ncCacheCookie == cacheVersion) ? false : true;
	
	NCOMBO_SESSION_MANAGER = new (function() {
		var self = this;
		var timeout = NCOMBO_TIMEOUT;
		var sessionID = null;
		var sessionCookieName = '__' + NCOMBO_APP_DEF.appURL + 'ssid';
		var sessionDestRegex = /^([^_]*)_([^_]*)_([^_]*)_([^_]*)_/;
	
		self._setIDCookies = function(soid) {
			var ssid = getCookie(sessionCookieName);
			var ssidDest = null;
			if (ssid) {
				ssidDest = ssid.match(sessionDestRegex);
				ssidDest = ssidDest ? ssidDest[0] : null;
			}
			var soidDest = soid.match(sessionDestRegex);
			soidDest = soidDest ? soidDest[0]: null;
			if(!ssid || soidDest != ssidDest) {
				ssid = soid;
				setCookie(sessionCookieName, ssid);
			}
			return ssid;
		}
		
		self.getTimeout = function() {
			return timeout;
		}
		
		self.markAsCached = function() {
			setCookie(ncCacheCookieName, cacheVersion, 31536000);
		}
		
		self.markAsUncached = function() {
			setCookie(ncCacheCookieName, cacheVersion, -100);
		}
		
		self.startSession = function(callback) {
			var timeoutCallback = null;
			
			if(NCOMBO_SOCKET && (NCOMBO_SOCKET.readyState == 'open' || NCOMBO_SOCKET.readyState == 'opening')) {
				NCOMBO_SOCKET.removeAllListeners();
				NCOMBO_SOCKET.close();
			}
			
			var matches = location.href.match(/^([^\/]*):\/\/([^\/:]+)/);
			
			var options = {
				protocol: matches[1],
				hostname: matches[2],
				port: NCOMBO_PORT
			};
			
			NCOMBO_SOCKET = NCOMBO_SOCKET_ENGINE.connect(options);
		    
			if(callback) {
				var errorCallback = function(err) {
					if(err != 'client not handshaken') {
						clearTimeout(timeoutCallback);
						NCOMBO_SOCKET.removeListener('connect', connectCallback);
						NCOMBO_SOCKET.removeListener('fail', errorCallback);
						callback(err);
					}
				}
				
				var connectCallback = function() {
					clearTimeout(timeoutCallback);
					NCOMBO_SOCKET.removeListener('connect', connectCallback);
					NCOMBO_SOCKET.removeListener('fail', errorCallback);
					sessionID = self._setIDCookies(NCOMBO_SOCKET.id);
					callback(null, sessionID);
				}
				
				if(timeout > 0) {
					timeoutCallback = setTimeout(function() {
						NCOMBO_SOCKET.removeListener('connect', connectCallback);
						NCOMBO_SOCKET.removeListener('fail', errorCallback);
						callback('Session initiation attempt timed out')
					}, timeout);
				}
				
				NCOMBO_SOCKET.on('fail', errorCallback);
				NCOMBO_SOCKET.on('connect', connectCallback);
			}
		}
		
		self.endSession = function(callback) {
			var timeoutCallback = null;
			if(callback) {
				var disconnectCallback = function() {
					clearTimeout(timeoutCallback);
					callback(null);
				}
			
				if(timeout > 0) {
					timeoutCallback = setTimeout(function() {
						NCOMBO_SOCKET.removeListener('close', disconnectCallback);
						callback('Disconnection attempt timed out')
					}, timeout);
				}
				
				NCOMBO_SOCKET.on('close', disconnectCallback);
			}
			NCOMBO_SOCKET.close();
		}
	})();
	
	var ncBegin = function() {
		if(areCookiesEnabled()) {
			var startLoader = function() {
				if(document.getElementById('ncspinner')) {
					document.body.removeChild(spinnerDiv);
					beginLoading();
				} else {
					setTimeout(startLoader, 20);
				}
			}

			if(ncScriptLoaded) {
				startLoader();
			} else {
				ncOnScriptLoad(loadScript, function() {
					startLoader();
				});
			}
		}
	}
	
	var handler = function(err, ssid) {
		if(err) {
			var head = document.getElementsByTagName('head');
			if(head) {
				head = head[0];
			}
			
			NCOMBO_ERROR = err;
			
			var limitScript = document.createElement('script');
			limitScript.type = 'text/javascript';
			limitScript.src = smartCacheManager.setURLCacheVersion(NCOMBO_FRAMEWORK_CLIENT_URL + 'scripts/failedconnection.js');
			head.appendChild(limitScript);
		} else {
			ncBegin();
		}
	}
	
	NCOMBO_SESSION_MANAGER.startSession(handler);
})();