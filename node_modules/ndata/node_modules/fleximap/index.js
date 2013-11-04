var FlexiMap = function (object) {
	var self = this;
	self.length = 0;
	var _data = [];

	FlexiMap.isEmpty = function (object) {
		var i;
		var empty = true;
		for (i in object) {
			empty = false;
			break;
		}
		return empty;
	}

	FlexiMap.isIterable = function (object) {
		return object && (object.constructor.name == 'Object' || object instanceof Array);
	}

	self.getLength = function (keyChain) {
		if (keyChain) {
			return self.count(keyChain);
		} else {
			return _data.length;
		}
	}

	if (object) {
		var i;
		if (FlexiMap.isIterable(object)) {
			for (i in object) {
				if (FlexiMap.isIterable(object[i])) {
					_data[i] = new FlexiMap(object[i]);
				} else {
					_data[i] = object[i];
				}
			}
		} else {
			_data.push(object);
		}
	}

	self._isInt = function (input) {
		return /^[0-9]+$/.test(input);
	}

	self._getValue = function (key) {
		return _data[key];
	}

	self._setValue = function (key, value) {
		_data[key] = value;
	}

	self._deleteValue = function (key) {
		delete _data[key];
		if (self._isInt(key)) {
			_data.splice(key, 1);
		}
	}

	self.getRaw = function (keyChain) {
		if (!(keyChain instanceof Array)) {
			keyChain = [keyChain];
		}
		var key = keyChain[0];
		var data = self._getValue(key);
		if (keyChain.length < 2) {
			return data;
		} else {
			if (data instanceof FlexiMap) {
				return data.getRaw(keyChain.slice(1));
			} else {
				return undefined;
			}
		}
	}

	self.get = function (keyChain) {
		var result = self.getRaw(keyChain);
		if (result instanceof FlexiMap) {
			result = result.getAll();
		}
		return result;
	}

	self.getRange = function (keyChain, fromIndex, toIndex) {
		var value = self.get(keyChain);
		var range;
		var i;

		if (value instanceof Array) {
			range = [];
			if (toIndex == null || toIndex > value.length) {
				toIndex = value.length;
			}
			for (i = fromIndex; i < toIndex; i++) {
				range.push(value[i]);
			}
		} else {
			range = {};
			var recording = false;
			for (i in value) {
				if (i == fromIndex) {
					recording = true;
				}
				if (recording && i == toIndex) {
					break;
				}
				if (recording) {
					range[i] = value[i];
				}
			}
		}

		return range;
	}

	self.count = function (keyChain) {
		var elements = self.get(keyChain);

		if (elements) {
			if (FlexiMap.isIterable(elements)) {
				var result = 0;
				var i;
				for (i in elements) {
					result++;
				}
				return result;
			}
			return 1;
		}
		return 0;
	}

	self.hasImmediateKey = function (key) {
		return _data[key] !== undefined;
	}

	self.hasKey = function (keyChain) {
		return (self.get(keyChain) === undefined) ? false : true;
	}

	self.hasType = function (keyChain, type) {
		var objects = self.get(keyChain);
		var i;
		for (i in objects) {
			if (objects[i] instanceof type) {
				return true;
			}
		}
		return false;
	}

	self.hasValue = function (keyChain, value) {
		var values = self.get(keyChain);
		var i;
		for (i in values) {
			if (values[i] == value) {
				return true;
			}
		}
		return false;
	}

	self.hasObject = function (keyChain, object) {
		var objects = self.get(keyChain);
		var i;
		for (i in objects) {
			if (objects[i] === object) {
				return true;
			}
		}
		return false;
	}

	self.set = function (keyChain, value) {
		if (!(keyChain instanceof Array)) {
			keyChain = [keyChain];
		}
		var key = keyChain[0];
		if (keyChain.length < 2) {
			if (!(value instanceof FlexiMap) && FlexiMap.isIterable(value)) {
				value = new FlexiMap(value);
			}
			self._setValue(key, value);
		} else {
			if (!self.hasImmediateKey(key) || !(self._getValue(key) instanceof FlexiMap)) {
				self._setValue(key, new FlexiMap());
			}
			self._getValue(key).set(keyChain.slice(1), value);
		}
		return value;
	}

	self.add = function (keyChain, value) {
		if (!(keyChain instanceof Array)) {
			keyChain = [keyChain];
		}
		var target = self.getRaw(keyChain);
		if (target == null) {
			target = new FlexiMap([value]);
			self.set(keyChain, target);
		} else if (!(target instanceof FlexiMap)) {
			target = new FlexiMap([target, value]);
			self.set(keyChain, target);
		} else {
			self.set(keyChain.concat(target.getLength()), value);
		}
		return value;
	}

	self.concat = function (keyChain, value) {
		if (!(keyChain instanceof Array)) {
			keyChain = [keyChain];
		}
		
		var target = self.getRaw(keyChain);

		if (!FlexiMap.isIterable(value)) {
			value = [value];
		}

		if (!target) {
			target = new FlexiMap(value);
			self.set(keyChain, target);
		} else if (!(target instanceof FlexiMap)) {
			target = new FlexiMap([target].concat(value));
			self.set(keyChain, target);
		} else {
			var i;
			var keyChainLastIndex = keyChain.length;
			if (value instanceof Array) {
				var len = target.getLength();
				keyChain = keyChain.concat(len);
				for (i in value) {
					self.set(keyChain, value[i]);
					keyChain[keyChainLastIndex] += 1;
				}
			} else {
				for (i in value) {
					keyChain[keyChainLastIndex] = i;
					self.set(keyChain, value[i]);
				}
			}
		}
		return value;
	}

	self._remove = function (key) {
		if (self.hasImmediateKey(key)) {
			var data = self._getValue(key);
			self._deleteValue(key);

			if (data instanceof FlexiMap) {
				return data.getAll();
			} else {
				return data;
			}
		} else {
			return undefined;
		}
	}

	self.remove = function (keyChain) {
		if (!(keyChain instanceof Array)) {
			keyChain = [keyChain];
		}
		if (keyChain.length < 2) {
			return self._remove(keyChain[0]);
		}
		var parentMap = self.getRaw(keyChain.slice(0, -1));
		if (parentMap instanceof FlexiMap) {
			return parentMap._remove(keyChain[keyChain.length - 1]);
		} else {
			return undefined;
		}
	}

	self.removeRange = function (keyChain, fromIndex, toIndex) {
		var value = self.get(keyChain);
		var range;
		var i;

		if (value instanceof Array) {
			if (toIndex == null || toIndex > value.length) {
				toIndex = value.length;
			}
			range = value.splice(fromIndex, toIndex - fromIndex);
			self.set(keyChain, value);
		} else {
			range = {};
			var deleting = false;
			for (i in value) {
				if (i == fromIndex) {
					deleting = true;
				}
				if (deleting && i == toIndex) {
					break;
				}
				if (deleting) {
					range[i] = value[i];
					delete value[i];
				}
			}
			self.set(keyChain, value);
		}

		return range;
	}

	self.pop = function (keyChain) {
		if (!(keyChain instanceof Array)) {
			keyChain = [keyChain];
		}
		
		var target = self.get(keyChain);
		if (!target) {
			return target;
		}
		if (!(target instanceof FlexiMap) || target.getLength() < 1) {
			return self.remove(keyChain);
		}

		var lastElementChain = keyChain.concat([target.getLength() - 1]);

		return self.remove(lastElementChain);
	}

	self.removeAll = function () {
		_data = [];
	}

	self._arrayToObject = function (array) {
		var i;
		var obj = {};
		for (i in array) {
			obj[i] = array[i];
		}
		return obj;
	}

	self.getAll = function () {
		var isArray = (_data.length > 0) ? true : false;
		var i;

		var data = [];

		for (i in _data) {
			if (_data[i] instanceof FlexiMap) {
				data[i] = _data[i].getAll();
			} else {
				data[i] = _data[i];
			}
		}

		if (isArray) {
			var len = data.length;

			for (i = 0; i < len; i++) {
				if (data[i] === undefined) {
					isArray = false;
					break;
				}
			}
		}

		if (isArray) {
			for (i in data) {
				if (!self._isInt(i)) {
					isArray = false;
					break;
				}
			}
		}

		if (isArray) {
			return data;
		}

		return self._arrayToObject(data);
	}
}

module.exports.FlexiMap = FlexiMap;