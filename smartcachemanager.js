var SmartCacheManager = function(cacheVersion) {
	var self = this;
	self._versioning = true;
	self._ckid = 1;
	
	self.versionURLs = function(enable) {
		self._versioning = enable;
	}
	
	self.setParam = function(url, paramName, paramValue) {
		var match = url.match(/(^[^?]*)(([?])(.*))?/);
		
		if(match) {
			var mainPart = match[1];
			if(match[4]) {
				var fieldStrings = match[4].split('&');
				var temp;
				var fields = {};
				var i;
				
				for(i in fieldStrings) {
					temp = fieldStrings[i].split('=');
					fields[temp[0]] = temp[1] || true;
				}
				
				fields[paramName] = paramValue;
				fieldStrings = [];
				
				for(i in fields) {
					fieldStrings.push(i + '=' + fields[i]);
				}
				
				return mainPart + '?' + fieldStrings.join('&');
			} else {
				return mainPart + '?' + paramName + '=' + paramValue;
			}
		}
	
		throw new Error('Invalid url specified');
	}
	
	self._curTime = function() {
		return (new Date()).getTime();
	}
	
	self.setURLCacheVersion = function(url) {
		if(self._versioning) {
			return self.setParam(url, 'cv', cacheVersion);
		}
		return url;
	}
	
	self.setCacheKiller = function(url, value) {
		if(!value) {
			value = self._ckid++;
		}
		return self.setParam(url, 'ck', self._curTime() + '-' + value);
	}
	
	self.setCacheKillerParam = function(url, param) {
		var parts = param.split('=');
		return self.setParam(url, parts[0], parts[1]);
	}
	
	self.getCacheKillerParam = function() {
		return 'ck=' + self._curTime() + '-' + self._ckid++;
	}
	
	self.getURLCacheVersionParam = function() {
		return 'cv=' + cacheVersion;
	}
	
	self.getCacheVersion = function() {
		return cacheVersion;
	}
}

if(typeof window === 'undefined') {
	module.exports.SmartCacheManager = SmartCacheManager;
} else {
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
	
	function setCookie(name, value, expirySeconds) {
		var exdate = null;
		if(expirySeconds) {
			exdate = new Date();
			exdate.setTime(exdate.getTime() + Math.round(expirySeconds * 1000));
		}
		var value = escape(value) + '; path=/;' + ((exdate == null) ? '' : ' expires=' + exdate.toUTCString() + ';');
		document.cookie = name + '=' + value;
	}
	var cookieName = '__nccacheversion';
	var NCOMBO_CACHE_VERSION = getCookie(cookieName);
	setCookie(cookieName, '', -100);
	
	var smartCacheManager = new SmartCacheManager(NCOMBO_CACHE_VERSION);
}
