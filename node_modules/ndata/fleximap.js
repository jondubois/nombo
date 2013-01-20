var FlexiMap = function(object) {
	var self = this;
	self.length = 0;
	var _data = [];
	
	FlexiMap.isEmpty = function(object) {
		var i;
		var empty = true;
		for(i in object) {
			empty = false;
			break;
		}
		return empty;
	}
	
	FlexiMap.isIterable = function(object) {
		return object && (object.constructor.name == 'Object' || object instanceof Array);
	}
	
	FlexiMap._getChainLeaves = function(curChain, object) {
		var paths = {};
		var i, j, pth, nextPaths;
		if(FlexiMap.isIterable(object)) {
			for(i in object) {
				if(curChain) {
					pth = curChain + '.' + i;
				} else {
					pth = i;
				}
				if(!paths[pth]) {
					if(FlexiMap.isIterable(object[i])) {
						nextPaths = FlexiMap._getChainLeaves(pth, object[i]);
						for(j in nextPaths) {
							paths[j] = 1;
						}
					} else {
						paths[pth] = 1;
					}
				}
			}
		}
		paths[curChain] = 1;
		return paths;
	}
	
	FlexiMap.getChainLeaves = function(object) {
		var paths = FlexiMap._getChainLeaves(null, object);
		var arr = [];
		var i;
		for(i in paths) {
			arr.push(i);
		}
		return arr;
	}
	
	FlexiMap.getSubChains = function(keyPath) {
		var chain = keyPath.split('.');
		var paths = [];
		var i;
		while(chain.length > 0) {
			paths.push(chain.join('.'));
			chain.pop();
		}
		return paths;
	}
	
	self.getLength = function(keyPath) {
		if(keyPath) {
			return self.count(keyPath);
		} else {
			return _data.length;
		}
	}
	
	if(object) {
		var i;
		if(FlexiMap.isIterable(object)) {
			for(i in object) {
				if(FlexiMap.isIterable(object[i])) {
					_data[i] = new FlexiMap(object[i]);
				} else {
					_data[i] = object[i];
				}
			}
		} else {
			_data.push(object);
		}
	}
	
	self._isInt = function(input) {
		return /^[0-9]+$/.test(input);
	}
	
	self._getValue = function(key) {
		return _data[key];
	}
	
	self._setValue = function(key, value) {
		_data[key] = value;
	}
	
	self._deleteValue = function(key) {
		delete _data[key];
		if(self._isInt(key)) {
			_data.splice(key, 1);
		}
	}
	
	self._get = function(keyChain) {
		var key = keyChain[0];
		var data = self._getValue(key);
		if(keyChain.length < 2) {
			return data;
		} else {
			if(data instanceof FlexiMap) {
				return data._get(keyChain.slice(1));
			} else {
				return undefined;
			}
		}
	}
	
	self.getRaw = function(keyPath) {
		var keyChain = keyPath.split('.');
		return self._get(keyChain);
	}
	
	self.get = function(keyPath) {
		var keyChain = keyPath.split('.');
		var result = self._get(keyChain);
		if(result instanceof FlexiMap) {
			result = result.getData();
		}
		return result;
	}
	
	self.getRange = function(keyPath, fromIndex, toIndex) {
		var value = self.get(keyPath);
		var range;
		var i;
		
		if(value instanceof Array) {
			range = [];
			if(toIndex == null || toIndex > value.length) {
				toIndex = value.length;
			}			
			for(i=fromIndex; i<toIndex; i++) {
				range.push(value[i]);
			}
		} else {
			range = {};
			var recording = false;
			for(i in value) {
				if(i == fromIndex) {
					recording = true;
				}
				if(recording && i == toIndex) {
					break;
				}
				if(recording) {
					range[i] = value[i];
				}
			}
		}
		
		return range;
	}
	
	self.count = function(keyPath) {
		var elements = self.get(keyPath);
		
		if(elements) {
			if(FlexiMap.isIterable(elements)) {
				var result = 0;
				var i;
				for(i in elements) {
					result++;
				}
				return result;
			}
			return 1;
		}
		return 0;		
	}
	
	self.hasImmediateKey = function(key) {
		return _data[key] !== undefined;
	}
	
	self.hasKey = function(keyPath) {
		return (self.get(keyPath) === undefined) ? false : true;
	}
	
	self.hasType = function(keyPath, type) {
		var objects = self.get(keyPath);
		var i;
		for(i in objects) {
			if(objects[i] instanceof type) {
				return true;
			}
		}
		return false;
	}
	
	self.hasValue = function(keyPath, value) {
		var values = self.get(keyPath);
		var i;
		for(i in values) {
			if(values[i] == value) {
				return true;
			}
		}
		return false;
	}
	
	self.hasObject = function(keyPath, object) {
		var objects = self.get(keyPath);
		var i;
		for(i in objects) {
			if(objects[i] === object) {
				return true;
			}
		}
		return false;
	}
	
	self._set = function(keyChain, value) {
		var key = keyChain[0];
		if(keyChain.length < 2) {
			if(!(value instanceof FlexiMap) && FlexiMap.isIterable(value)) {
				value = new FlexiMap(value);
			}
			self._setValue(key, value);
		} else {
			if(!self.hasImmediateKey(key) || !(self._getValue(key) instanceof FlexiMap)) {
				self._setValue(key, new FlexiMap());
			}
			self._getValue(key)._set(keyChain.slice(1), value);
		}
	}
	
	self.set = function(keyPath, value) {
		var keyChain = keyPath.split('.');
		self._set(keyChain, value);
		return value;
	}
	
	self.add = function(keyPath, value) {
		var keyChain = keyPath.split('.');
		var target = self._get(keyChain);
		
		if(!target) {
			target = new FlexiMap([value]);
			self._set(keyChain, target);
		} else if(!(target instanceof FlexiMap)) {
			target = new FlexiMap([target, value]);
			self._set(keyChain, target);
		} else {
			keyChain.push(target.getLength());
			self._set(keyChain, value);
		}
		return value;
	}
	
	self.concat = function(keyPath, value) {
		var keyChain = keyPath.split('.');
		var target = self._get(keyChain);
		
		if(!FlexiMap.isIterable(value)) {
			value = [value];
		}
		
		if(!target) {
			target = new FlexiMap(value);
			self._set(keyChain, target);
		} else if(!(target instanceof FlexiMap)) {
			target = new FlexiMap([target].concat(value));
			self._set(keyChain, target);
		} else {
			var i;
			var keyChainLastIndex = keyChain.length;
			if(value instanceof Array) {
				var len = target.getLength();
				keyChain.push(len);
				for(i in value) {
					self._set(keyChain, value[i]);
					keyChain[keyChainLastIndex] += 1;
				}
			} else {
				for(i in value) {
					keyChain[keyChainLastIndex] = i;
					self._set(keyChain, value[i]);
				}
			}
		}
		return value;
	}
	
	self._remove = function(key) {
		if(self.hasImmediateKey(key)) {
			var data = self._getValue(key);
			self._deleteValue(key);
			
			if(data instanceof FlexiMap) {
				return data.getData();
			} else {
				return data;
			}
		} else {
			return undefined;
		}
	}
	
	self.remove = function(keyPath) {
		var keyChain = keyPath.split('.');
		if(keyChain.length < 2) {
			return self._remove(keyChain[0]);
		}
		var parentMap = self._get(keyChain.slice(0, -1));
		if(parentMap instanceof FlexiMap) {
			return parentMap._remove(keyChain[keyChain.length - 1]);
		} else {
			return undefined;
		}
	}
	
	self.removeRange = function(keyPath, fromIndex, toIndex) {
		var value = self.get(keyPath);
		var range;
		var i;
		
		if(value instanceof Array) {
			if(toIndex == null || toIndex > value.length) {
				toIndex = value.length;
			}
			range = value.splice(fromIndex, toIndex - fromIndex);
			self.set(keyPath, value);
		} else {
			range = {};
			var deleting = false;
			for(i in value) {
				if(i == fromIndex) {
					deleting = true;
				}
				if(deleting && i == toIndex) {
					break;
				}
				if(deleting) {
					range[i] = value[i];
					delete value[i];
				}
			}
			self.set(keyPath, value);
		}
		
		return range;
	}
	
	self.pop = function(keyPath) {
		var target = self.get(keyPath);
		if(!target) {
			return target;
		}
		if(!(target instanceof FlexiMap) || target.getLength() < 1) {
			return self.remove(keyPath);
		}
		
		return self.remove(keyPath + '.' + (target.getLength() - 1));
	}
	
	self.removeAll = function() {
		_data = [];
	}
	
	self._arrayToObject = function(array) {
		var i;
		var obj = {};
		for(i in array) {
			obj[i] = array[i];
		}
		return obj;
	}
	
	self.getData = function() {
		var isArray = (_data.length > 0) ? true : false;
		var i;
		
		var data = [];
		
		for(i in _data) {
			if(_data[i] instanceof FlexiMap) {
				data[i] = _data[i].getData();
			} else {
				data[i] = _data[i];
			}
		}
		
		if(isArray) {
			var len = data.length;
			
			for(i=0; i<len; i++) {
				if(data[i] === undefined) {
					isArray = false;
					break;
				}
			}
		}
		
		if(isArray) {
			for(i in data) {
				if(!self._isInt(i)) {
					isArray = false;
					break;
				}
			}
		}
		
		if(isArray) {
			return data;
		}
		
		return self._arrayToObject(data);
	}
}

module.exports.FlexiMap = FlexiMap;