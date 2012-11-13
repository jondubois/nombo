var PORT = process.argv[2];
var SECRET_KEY = process.argv[3] || null;
var HOST = '127.0.0.1';

var initialized = {};

var com = require('./com');

var escapeStr = '\\u001b';
var escapeArr = escapeStr.split('');
var escapeRegex = new RegExp('\\+' + escapeStr, 'g');

var unsimplifyFilter = function(str) {
	return str.replace(/\\+u001a/g, '.');
}

var unescapeFilter = function(str) {
	return str.replace(escapeRegex, '');
}

var unescape = function(value) {
	if(typeof value == 'string') {
		value = value.replace(escapeRegex, '');
	} else {
		if(value instanceof FlexiMap) {
			value = value.getData();
		}
	}
	return value;
}

var filters = [unsimplifyFilter, unescapeFilter];

var send = function(socket, object) {
	if(object.key) {
		object.key = unescape(object.key);
	}
	if(object.value) {
		object.value = unescape(object.value);
	}
	socket.write(object, filters);
}

var isEmpty = function(object) {
	var i;
	var empty = true;
	for(i in object) {
		empty = false;
		break;
	}
	return empty;
}

var FlexiMap = function(object) {
	var self = this;
	self.length = 0;
	self._data = [];
	
	self.isEmpty = function(object) {
		var i;
		var empty = true;
		for(i in object) {
			empty = false;
			break;
		}
		return empty;
	}
	
	self.isIterable = function(object) {
		return object && (object.constructor.name == 'Object' || object instanceof Array);
	}
	
	self._getAllPaths = function(curPath, object) {
		var paths = {};
		var i, j, pth, nextPaths;
		if (self.isIterable(object)) {
			for (i in object) {
				pth = curPath + '.' + i;
				if (!paths[pth]) {
					if (self.isIterable(object[i])) {
						nextPaths = self._getAllPaths(pth, object[i]);
						for(j in nextPaths) {
							paths[j] = 1;
						}
					} else {
						paths[pth] = 1;
					}
				}
			}
		}
		paths[curPath] = 1;
		return paths;
	}
	
	self.getAllPaths = function(curPath, object) {
		var paths = self._getAllPaths(curPath, object);
		var arr = [];
		var i;
		for(i in paths) {
			arr.push(i);
		}
		return arr;
	}
	
	self.getLength = function() {
		return self._data.length;
	}
	
	if(object) {
		var i;
		if(self.isIterable(object)) {
			for(i in object) {
				if(self.isIterable(object[i])) {
					self._data[i] = new FlexiMap(object[i]);
				} else {
					self._data[i] = object[i];
				}
			}
		} else {
			self._data.push(object);
		}
	}
	
	self._isInt = function(input) {
		return /^[0-9]+$/.test(input);
	}
	
	self._getValue = function(key) {
		return self._data[key];
	}
	
	self._setValue = function(key, value) {
		self._data[key] = value;
	}
	
	self._deleteValue = function(key) {
		delete self._data[key];
		if(self._isInt(key)) {
			self._data.splice(key, 1);
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
				return null;
			}
		}
	}
	
	self.get = function(keyPath) {
		var keyChain = keyPath.split('.');
		var result = self._get(keyChain);
		if(result instanceof FlexiMap) {
			result = result.getData();
		}
		return result;
	}
	
	self.hasImmediateKey = function(key) {
		return self._data[key] !== undefined;
	}
	
	self.hasKey = function(keyPath) {
		return (self.get(keyPath) === undefined) ? false : true;
	}
	
	self._set = function(keyChain, value) {
		var key = keyChain[0];
		if(keyChain.length < 2) {
			if(!(value instanceof FlexiMap) && self.isIterable(value)) {
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
		var target = self.get(keyPath);
		
		if(!target) {
			target = new FlexiMap([value]);
			self.set(keyPath, target);
		} else if(!(target instanceof FlexiMap)) {
			target = new FlexiMap([target, value]);
			self.set(keyPath, target);
		} else {
			self.set(keyPath + '.' + target.getLength(), value);
		}
		return value;
	}
	
	self.escapeBackslashes = function(str) {
		return str.replace(/([^\\])\\([^\\])/g, '$1\\\\$2');
	}
	
	self.run = function(code) {
		return Function('var DataMap = arguments[0]; return ' + self.escapeBackslashes(code) + ' || "";')(self);
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
			return null;
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
			return null;
		}
	}
	
	self.pop = function(keyPath) {
		var target = self.get(keyPath);
		if(!target) {
			return null;
		}
		if(!(target instanceof FlexiMap) || target.getLength() < 1) {
			return self.remove(keyPath);
		}
		
		return self.remove(keyPath + '.' + (target.getLength() - 1));
	}
	
	self.removeAll = function() {
		self._data = [];
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
		var isArray = (self._data.length > 0) ? true : false;
		var i;
		
		var data = [];
		
		for(i in self._data) {
			if(self._data[i] instanceof FlexiMap) {
				data[i] = self._data[i].getData();
			} else {
				data[i] = self._data[i];
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

var DataMap = new FlexiMap();
var EventMap = new FlexiMap();

var addEvent = function(socket, event) {
	EventMap.set('event.' + event + '.' + socket.id, socket);
	EventMap.set('socket.' + socket.id + '.' + event, true);
}

var removeEvent = function(socket, event) {
	var removedEvents = EventMap.remove('socket.' + socket.id + '.' + event);
	var removePaths = EventMap.getAllPaths(event, removedEvents);
	
	var i, par;
	for(i in removePaths) {
		EventMap.remove('event.' + removePaths[i] + '.' + socket.id);
		par = EventMap.get('event.' + removePaths[i]);
		if(par !== undefined && EventMap.isEmpty(par)) {
			EventMap.remove('event.' + removePaths[i]);
		}
		
		EventMap.remove('socket.' + socket.id + '.' + removePaths[i]);
	}
	par = EventMap.get('socket.' + socket.id);
	if(par !== undefined && EventMap.isEmpty(par)) {
		EventMap.remove('socket.' + socket.id);
	}
}

var getEvents = function(socket) {
	return EventMap.get('socket.' + socket.id);
}

var removeAllEvents = function(socket) {
	var events = getEvents(socket.id);
	if(events) {
		var i;
		for(i in events) {
			removeEvent(socket.id, i);
		}
	}
}

var countTreeLeaves = function(tree) {
	var i;
	var num = 0;
	for(i in tree) {
		if(EventMap.isIterable(tree[i])) {
			num += countTreeLeaves(tree[i]);
		} else {
			num++;
		}
	}
	return num;
}

var forEachSocket = function(socketMap, callback) {
	var i;
	for(i in socketMap) {
		if(socketMap[i] instanceof com.ComSocket) {
			callback(socketMap[i]);
		} else if(EventMap.isIterable(socketMap[i])) {
			forEachSocket(socketMap[i], callback);
		}
	}
}

var actions = {
	init: function(command, socket) {	
		var result = {id: command.id, type: 'response', action: 'init'};
		
		if(command.secretKey == SECRET_KEY) {
			initialized[socket.id] = true;
		} else if(SECRET_KEY) {
			result.error = 'nData Error - Invalid password was supplied to nData';
		}
		
		send(socket, result);
	},

	set: function(command, socket) {
		var result = DataMap.set(command.key, command.value);
		send(socket, {id: command.id, type: 'response', action: 'set', value: result});
	},
	
	add: function(command, socket) {
		var result = DataMap.add(command.key, command.value);
		send(socket, {id: command.id, type: 'response', action: 'add', value: result});
	},
	
	run: function(command, socket) {
		var result = DataMap.run(command.value);
		send(socket, {id: command.id, type: 'response', action: 'run', value: result});
	},
	
	remove: function(command, socket) {
		var result = DataMap.remove(command.key);
		send(socket, {id: command.id, type: 'response', action: 'remove', value: result});
	},
	
	removeAll: function(command, socket) {
		DataMap.removeAll();
		send(socket, {id: command.id, type: 'response', action: 'removeAll'});
	},
	
	pop: function(command, socket) {
		var result = DataMap.pop(command.key);
		send(socket, {id: command.id, type: 'response', action: 'pop', value: result});
	},
	
	hasKey: function(command, socket) {
		send(socket, {id: command.id, type: 'response', action: 'hasKey', value: DataMap.hasKey(command.key)});
	},
	
	get: function(command, socket) {
		var result = DataMap.get(command.key);
		send(socket, {id: command.id, type: 'response', action: 'get', value: result});
	},
	
	getAll: function(command, socket) {
		send(socket, {id: command.id, type: 'response', action: 'getAll', value: DataMap.getData()});
	},
	
	watch: function(command, socket) {
		addEvent(socket, command.event);
		send(socket, {id: command.id, type: 'response', action: 'watch', event: command.event});
	},
	
	unwatch: function(command, socket) {
		if(command.event) {
			removeEvent(socket, command.event);
		} else {
			removeAllEvents(socket);
		}
		send(socket, {id: command.id, type: 'response', action: 'unwatch', event: command.event});
	},
	
	isWatching: function(command, socket) {
		var result = EventMap.hasKey('event.' + command.event + '.' + socket.id);
		send(socket, {id: command.id, type: 'response', action: 'isWatching', event: command.event});
	},
	
	broadcast: function(command, socket) {
		var sockets = EventMap.get('event.' + command.event);
		
		if(sockets) {
			var sock;
			var i;
			for(i in sockets) {
				sock = sockets[i];
				if(sock instanceof com.ComSocket) {
					send(sock, {type: 'event', event: command.event, value: command.value});
				}
			}
		}
		send(socket, {id: command.id, type: 'response', action: 'broadcast', value: command.value, event: command.event});
	}
}

var MAX_ID = Math.pow(2, 53) - 2;
var curID = 1;

var genID = function() {
	curID++;
	curID = curID % MAX_ID;
	return curID;
}

var server = com.createServer();

server.listen(PORT, HOST);

var evaluate = function(str) {
	return Function('return ' + DataMap.escapeBackslashes(str) + ' || null;')();
}

var substitute = function(str) {
	return DataMap.get(str);
}

var escape = function(str) {
	return '"' + str.replace(/([()'".])/g, '\\u001b$1') + '"';
}

var simplify = function(str) {
	return str.replace(/[.]/g, '\\u001a');
}

var convertToString = function(object) {
	var str;
	if(typeof object == 'string') {
		str = object;
	} else if(typeof object == 'number') {
		str = object;
	} else if(object == null) {
		str = null;
	} else if(object == undefined) {
		str = object;
	} else {
		str = object.toString();
	}
	return str;
}

var arrayToString = function(array) {
	if(array.length == 1) {
		return convertToString(array[0]);
	}
	var i;
	var str = '';
	for(i in array) {
		str += convertToString(array[i]);
	}
	return str;
}

var matchesPrev = function(charArray, beforeIndex, matchCharArray) {
	var i, j;
	for(i=beforeIndex-matchCharArray.length, j=0; i<beforeIndex; i++, j++) {
		if(!charArray[i] || charArray[i] != matchCharArray[j]) {
			return false;
		}
	}
	return true;
}

var compile = function(str, macroMap, macroName) {
	var buffer = [];
	var chars;
	if(typeof str == 'string') {
		chars = str.split('');
	} else {
		chars = str;
	}
	var len = chars.length;
	
	var i, j, curMacroChar, segment, numOpen, notEscaped, comp;
	for(i=0; i<len; i++) {
		if(macroMap.hasOwnProperty(chars[i]) && chars[i + 1] == '(') {
			curMacroChar = chars[i];
			i += 2;
			segment = [];
			numOpen = 1;
			for(j=i; j<len; j++) {
				notEscaped = !matchesPrev(chars, j, escapeArr);
				if(chars[j] == '(' && notEscaped) {
					numOpen++;
				} else if(chars[j] == ')' && notEscaped) {
					numOpen--;
				}
				
				if(numOpen > 0) {
					segment.push(chars[j]);
				} else {
					break;
				}
			}
			i = j;
			if(curMacroChar == '#') {
				comp = arrayToString(segment);
			} else {
				comp = compile(segment, macroMap, curMacroChar);
			}
			buffer.push(comp);
		} else {
			buffer.push(chars[i]);
		}
	}
	if(macroName) {
		return macroMap[macroName](arrayToString(buffer));
	} else {
		return arrayToString(buffer);
	}
}

var macros = {
	'%': evaluate,
	'$': substitute,
	'#': escape,
	'~': simplify
};

server.on('connection', function(sock) {
	sock.id = genID();
	
	sock.on('message', function(command) {		
		if(!SECRET_KEY || initialized.hasOwnProperty(sock.id) || command.action == 'init') {
			try {
				if(!command.key || typeof command.key == 'string') {
					if(command.key) {
						command.key = compile(command.key, macros);
					}
					if(command.value && typeof command.value == 'string') {
						command.value = compile(command.value, macros);
					}
					
					if(actions.hasOwnProperty(command.action)) {
						actions[command.action](command, sock);
					}
					
				} else {
					send(sock, {id: command.id, type: 'response', action: command.action, error: 'nData Error - The specified key was not a string'});
				}
			
			} catch(e) {
				if(e.stack) {
					console.log(e.stack);
				} else {
					console.log(e);
				}
				if(e instanceof Error) {
					e = e.toString();
				}
				
				send(sock, {id: command.id, type: 'response', action:  command.action, error: 'nData Error - Failed to process command due to the following error: ' + e});
			}
			
		} else {
			var e = 'nData Error - Cannot process command before init handshake';
			console.log(e);
			send(sock, {id: command.id, type: 'response', action: command.action, error: e});
		}
	});
	
	sock.on('end', function() {
		if(initialized.hasOwnProperty(sock.id)) {
			delete initialized[sock.id];
		}
		removeAllEvents(sock);
	});
});

server.on('listening', function() {
	process.send({event: 'listening'});
});