var EventEmitter = require('events').EventEmitter;

var Cache = function (options) {
	var self = this;
	self.ENCODING_PLAIN = 'plain';
	self.ENCODING_SEPARATOR = '::';
	
	self.reset = function () {
		self._cache = {};
		self._encodings = {};
		self._totalSize = 0;
		
		self._head = {
			prev: null
		};
		self._tail = {
			next: null
		};
		self._head.next = self._tail;
		self._tail.prev = self._head;
	};
	
	self.reset();
	
	self._cacheFilter = options.cacheFilter;
	self._maxSize = options.maxSize || 1000000000;
	self._maxEntrySize = options.maxEntrySize || 10000000;
	
	self._getFullKey = function (encoding, key) {
		return encoding + self.ENCODING_SEPARATOR + key;
	};
	
	self._floatCacheEntry = function (entry) {
		if (entry.next) {
			entry.next.prev = entry.prev;
			entry.prev.next = entry.next;
		}
		entry.next = self._head.next;
		entry.prev = self._head;
		self._head.next.prev = entry;
		self._head.next = entry;
	};
	
	self._removeCacheEntry = function (entry) {
		entry.prev.next = entry.next;
		entry.next.prev = entry.prev;
	};
	
	self._addKeyEncoding = function (key, encoding) {
		if (self._encodings[key] == null) {
			self._encodings[key] = {};
		}
		self._encodings[key][encoding] = 1;
	};
	
	self._removeKeyEncoding = function (key, encoding) {
		if (self._encodings[key] != null) {
			delete self._encodings[key][encoding];
		}
		var empty = true;
		for (var i in self._encodings[key]) {
			empty = false;
			break;
		}
		if (empty) {
			delete self._encodings[key];
		}
	};
	
	self.set = function (encoding, key, data, permanent) {
		if (!(data instanceof Buffer)) {
			if (typeof data != 'string') {
				data = data.toString();
			}
			data = new Buffer(data);
		}
		
		var size = data.length;
		if ((size > self._maxEntrySize || (self._cacheFilter && !self._cacheFilter(key))) && !permanent) {
			return false;
		}
		
		var fullKey = self._getFullKey(encoding, key);
		if (self._cache.hasOwnProperty(fullKey)) {
			var now = Date.now();
			self._cache[fullKey].data = data;
			self._cache[fullKey].time = now;
		} else {
			if (permanent) {
				self._cache[fullKey] = {data: data, headers: {}, time: Date.now(), permanent: true};
			} else {
				var entry = {
					key: fullKey,
					size: size
				};
				self._floatCacheEntry(entry);
				self._cache[fullKey] = {data: data, headers: {}, time: Date.now(), entry: entry};
			}
		}
		
		self._addKeyEncoding(key, encoding);
		self.emit('set', key, encoding, permanent);
		
		self._totalSize += size;
		
		var curEntry = self._tail.prev;
		var keyParts;
		while (self._totalSize > self._maxSize && curEntry && curEntry.key) {
			self._totalSize -= curEntry.size;
			delete self._cache[curEntry.key];
			self._removeCacheEntry(curEntry);
			keyParts = curEntry.key.split(self.ENCODING_SEPARATOR);
			curEntry = self._tail.prev;
			
			self._removeKeyEncoding(keyParts[1], keyParts[0]);
			self.emit('clear', keyParts[1], keyParts[0]);
		}
		
		return true;
	};
	
	self.get = function (encoding, key) {
		var fullKey = self._getFullKey(encoding, key);
		if (self._cache.hasOwnProperty(fullKey)) {
			var entry = self._cache[fullKey].entry;
			if (entry) {
				self._floatCacheEntry(entry);
			}
			return self._cache[fullKey].data;
		}
		return null;
	};
	
	self.getModifiedTime = function (encoding, key) {
		var fullKey = self._getFullKey(encoding, key);
		if (self._cache.hasOwnProperty(fullKey)) {
			var entry = self._cache[fullKey].entry;
			if (entry) {
				self._floatCacheEntry(entry);
			}
			var time = self._cache[fullKey].time;
			if (time == null) {
				return -1;
			}
			return time;
		} else {
			return -1;
		}
	};
	
	self.has = function (encoding, key) {
		var fullKey = self._getFullKey(encoding, key);
		return self._cache.hasOwnProperty(fullKey) && self._cache[fullKey].hasOwnProperty('data');
	};
	
	self.clear = function (encoding, key) {
		if (encoding) {
			var fullKey = self._getFullKey(encoding, key);
			if (self._cache[fullKey] != null) {
				delete self._cache[fullKey];
				
				self._removeKeyEncoding(key, encoding);
				self.emit('clear', key, encoding);
			}
		} else {
			// Clear URL entry for every encoding used with the key
			var encodings = [];
			for (var i in self._encodings[key]) {
				encodings.push(i);
			}
			for (var j in encodings) {
				self.clear(encodings[j], key);
			}
		}
	};
	
	self.setHeader = function (encoding, objectKey, headerKey, headerValue) {
		var fullObjectKey = self._getFullKey(encoding, objectKey);
		
		if (!self._cache.hasOwnProperty(fullObjectKey)) {
			self._cache[fullObjectKey] = {headers: {}};
		}
		
		self._cache[fullObjectKey].headers[headerKey] = headerValue;
	};
	
	self.getHeader = function (encoding, objectKey, headerKey) {
		var fullObjectKey = self._getFullKey(encoding, objectKey);
		
		if (self._cache.hasOwnProperty(fullObjectKey)) {
			if (self._cache[fullObjectKey].headers.hasOwnProperty(headerKey)) {
				return self._cache[fullObjectKey].headers[headerKey];
			} else {
				return null;
			}
		}
		
		fullObjectKey = self._getFullKey(self.ENCODING_PLAIN, objectKey);
		
		if (self._cache.hasOwnProperty(fullObjectKey)) {
			if (self._cache[fullObjectKey].headers.hasOwnProperty(headerKey)) {
				return self._cache[fullObjectKey].headers[headerKey];
			}
		}
		
		return null;
	};
	
	self.setHeaders = function (encoding, objectKey, headerMap) {
		var i;
		for (i in headerMap) {
			self.setHeader(encoding, objectKey, i, headerMap[i]);
		}
	};
	
	self.getHeaders = function (encoding, objectKey) {
		var fullObjectKey = self._getFullKey(encoding, objectKey);
		if (self._cache.hasOwnProperty(fullObjectKey) && self._cache[fullObjectKey].headers) {
			return self._cache[fullObjectKey].headers;
		}
		return {};
	};
	
	self.clearHeader = function (encoding, objectKey, headerKey) {
		var fullObjectKey = self._getFullKey(encoding, objectKey);
		
		if (self._cache.hasOwnProperty(fullObjectKey) && self._cache[fullObjectKey].headers) {
			if (self._cache[fullObjectKey].headers.hasOwnProperty(headerKey)) {
				delete self._cache[fullObjectKey].headers[headerKey];
			}
		}
	};
	
	self.clearHeaders = function (encoding, objectKey) {
		var fullObjectKey = self._getFullKey(encoding, objectKey);
		
		if (self._cache.hasOwnProperty(fullObjectKey) && self._cache[fullObjectKey].headers) {
			self._cache[fullObjectKey].headers = {};
		}
	};
	
	self.clearMatches = function (regex) {
		var i, keyParts;
		for (i in self._cache) {
			if (regex.test(i)) {
				keyParts = i.split(self.ENCODING_SEPARATOR);
				delete self._cache[i];
				self._removeKeyEncoding(keyParts[1], keyParts[0]);
				self.emit('clear', keyParts[1], keyParts[0]);
			}
		}
	};
};

Cache.prototype = Object.create(EventEmitter.prototype);

module.exports.Cache = Cache