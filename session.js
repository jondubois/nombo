var IE = false;
var IE_VERSION = 0;

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	IE = true;
	IE_VERSION = new Number(RegExp.$1)
}

var NOMBO_PORT = {{port}};
var NOMBO_TIMEOUT = {{timeout}};
var NOMBO_FRAMEWORK_URL = '{{frameworkURL}}';
var NOMBO_FRAMEWORK_CLIENT_URL = '{{frameworkClientURL}}';
var NOMBO_SOCKET_ENGINE = socketCluster;
var NOMBO_SOCKET = null;
var NOMBO_SESSION_MANAGER = null;
var NOMBO_IE = IE;
var NOMBO_IE_VERSION = IE_VERSION;
var NOMBO_APP_DEF = {{{appDef}}};
var NOMBO_RESOURCES = {{{resources}}};
var NOMBO_DEBUG = {{debug}};
var NOMBO_ERROR = 'Unkown Error';
var NOMBO_SPINNER = {{spinner}};
var NOMBO_SPINNER_OPTIONS = {{{spinnerOptions}}};

(function () {	
	var freshnessURL = NOMBO_APP_DEF.freshnessURL;

	var head = document.getElementsByTagName('head');
	if (head) {
		head = head[0];
	}

	if (NOMBO_SPINNER) {
		var spinnerOpts = {
			lines: 10,
			length: 7,
			width: 4,
			radius: 15,
			corners: 2,
			rotate: 0,
			color: '#666',
			speed: 1,
			trail: 60,
			shadow: false,
			hwaccel: true,
			zIndex: 10000,
			top: 'auto',
			left: 'auto'
		};
		
		for (var i in NOMBO_SPINNER_OPTIONS) {
			spinnerOpts[i] = NOMBO_SPINNER_OPTIONS[i];
		};
		
		spinnerOpts.className = 'ncspinner';

		var spinnerDiv = document.createElement('div');

		spinnerDiv.id = spinnerOpts.className;
		spinnerDiv.style.width = spinnerOpts.radius * 2 + 'px';
		spinnerDiv.style.height = spinnerOpts.radius * 2 + 'px';
		spinnerDiv.style.position = 'absolute';
		spinnerDiv.style.left = '50%';
		spinnerDiv.style.top = '50%';

		var spinner = new Spinner(spinnerOpts).spin(spinnerDiv);
	}
	
	var beginLoading = function () {
		if (NOMBO_SPINNER) {
			spinner.stop();
			document.body.removeChild(spinnerDiv);
		}
		$loader.init(NOMBO_APP_DEF, NOMBO_RESOURCES);
	}
	
	function setCookie(name, value, expirySeconds) {
		var exdate = null;
		if (expirySeconds) {
			exdate = new Date();
			exdate.setTime(exdate.getTime() + Math.round(expirySeconds * 1000));
		}
		var value = escape(value) + '; path=/;' + ((exdate == null) ? '' : ' expires=' + exdate.toUTCString() + ';');
		document.cookie = name + '=' + value;
	}

	function getCookie(name) {
	    var i, x, y, ARRcookies = document.cookie.split(';');
	    for (i = 0; i < ARRcookies.length; i++) {
			x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
			x = x.replace(/^\s+|\s+$/g, '');
			if (x == name) {
				return unescape(y);
			}
	    }
	}
	
	var cookiesEnabledResult = false;
	
	function areCookiesEnabled() {
		if (cookiesEnabledResult) {
			return true;
		}
		var cookieName = 'n/cookiecheck';
		setCookie(cookieName, '1');
		if (getCookie(cookieName) != null) {
			cookiesEnabledResult = true;
			setCookie(cookieName, '', -100);
		}
		return cookiesEnabledResult;
	}
	
	var appendSpinner = function () {
		document.body.appendChild(spinnerDiv);
	};

	var readyInterval = setInterval(function () {
		if (document.body) {
			if (areCookiesEnabled()) {
				clearInterval(readyInterval);
				if (NOMBO_SPINNER) {
					appendSpinner();
				}
			} else {
				if (document.head) {
					clearInterval(readyInterval);
					var cookiesDisabledScript = document.createElement('script');
					cookiesDisabledScript.type = 'text/javascript';
					
					url = NOMBO_APP_DEF.cookiesDisabledURL;
					
					if (!NOMBO_DEBUG) {
						url = NOMBO_CACHE_MANAGER.setURLCacheVersion(url);
					}
					
					cookiesDisabledScript.src = url;
					document.head.appendChild(cookiesDisabledScript);
				}
			}
		}
	}, 20);

	var _getHTTPReqObject = function () {
		var xmlhttp = null;
		if (NOMBO_IE) {
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
			throw new Error("Could not instantiate XMLHttpRequest");
		}
		return xmlhttp;
	}
	
	NOMBO_SESSION_MANAGER = new (function () {
		var self = this;
		var timeout = NOMBO_TIMEOUT;
		var sessionID = null;
		var sessionCookieName = NOMBO_APP_DEF.sessionCookieName;
		var cacheCookieName = NOMBO_APP_DEF.cacheCookieName;
		
		var sessionDestRegex = /^([^_]*)_([^_]*)_([^_]*)_([^_]*)_/;
		
		self.getTimeout = function () {
			return timeout;
		};
		
		self.markAsCached = function () {
			if (NOMBO_IS_FRESH) {
				setCookie(cacheCookieName, 1);
				var xmlhttp = _getHTTPReqObject();

				xmlhttp.open('GET', freshnessURL, true);
				xmlhttp.send(null);
				setCookie(cacheCookieName, '', -100);
			}
		};
		
		self.startSession = function (callback) {
			var timeoutCallback = null;
			
			if (NOMBO_SOCKET && (NOMBO_SOCKET.readyState == 'open' || NOMBO_SOCKET.readyState == 'opening')) {
				NOMBO_SOCKET.removeAllListeners();
				NOMBO_SOCKET.close();
			}
			
			var options = {
				protocol: location.protocol.replace(/:$/, ''),
				hostname: location.hostname,
				port: NOMBO_PORT,
				autoReconnect: NOMBO_APP_DEF.autoReconnect,
				autoReconnectOptions: NOMBO_APP_DEF.autoReconnectOptions
			};
			
			NOMBO_SOCKET = NOMBO_SOCKET_ENGINE.connect(options);
		    
			if (callback) {
				var errorCallback = function (err) {
					if (err != 'client not handshaken') {
						clearTimeout(timeoutCallback);
						NOMBO_SOCKET.removeListener('connect', connectCallback);
						NOMBO_SOCKET.removeListener('fail', errorCallback);
						callback(err);
					}
				}
				
				var connectCallback = function () {
					clearTimeout(timeoutCallback);
					NOMBO_SOCKET.removeListener('connect', connectCallback);
					NOMBO_SOCKET.removeListener('fail', errorCallback);
					callback(null, NOMBO_SOCKET.ssid);
				}
				
				if (timeout > 0) {
					timeoutCallback = setTimeout(function () {
						NOMBO_SOCKET.removeListener('connect', connectCallback);
						NOMBO_SOCKET.removeListener('fail', errorCallback);
						callback('Session initiation attempt timed out')
					}, timeout);
				}
				
				NOMBO_SOCKET.on('fail', errorCallback);
				//NOMBO_SOCKET.on('connect', connectCallback);
			}
		};
		
		self.endSession = function (callback) {
			var timeoutCallback = null;
			if (callback) {
				var disconnectCallback = function () {
					clearTimeout(timeoutCallback);
					callback(null);
				}
			
				if (timeout > 0) {
					timeoutCallback = setTimeout(function () {
						NOMBO_SOCKET.removeListener('close', disconnectCallback);
						callback('Disconnection attempt timed out')
					}, timeout);
				}
				
				NOMBO_SOCKET.on('close', disconnectCallback);
			}
			NOMBO_SOCKET.close();
		};
	})();
	
	var ncBegin = function () {
		if (areCookiesEnabled()) {
			var startLoader = function () {
				if (NOMBO_SPINNER) {
					if (document.getElementById(spinnerOpts.className)) {
						beginLoading();
					} else {
						setTimeout(startLoader, 20);
					}
				} else {
					beginLoading();
				}
			}
			startLoader();
		}
	};
	
	var handler = function (err, ssid) {
		if (err) {
			var head = document.getElementsByTagName('head');
			if (head) {
				head = head[0];
			}
			
			NOMBO_ERROR = err;
			
			var limitScript = document.createElement('script');
			limitScript.type = 'text/javascript';
			limitScript.src = NOMBO_CACHE_MANAGER.setURLCacheVersion(NOMBO_APP_DEF.failedConnectionURL);
			head.appendChild(limitScript);
		} else {
			ncBegin();
		}
	};
	
	NOMBO_SESSION_MANAGER.startSession(handler);
})();