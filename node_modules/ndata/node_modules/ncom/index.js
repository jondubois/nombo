var net = require('net');
var formatter = require('./formatter');

var ComSocket = function(netSocket) {
	var self = this;
	var dataBuffer = '';
	var endSymbol = '\u0017';
	var endSymbolRegex = new RegExp(endSymbol, 'g');
	
	if(netSocket) {
		self.socket = netSocket;
	} else {
		self.socket = new net.Socket();
	}
	
	self.connect = function() {
		self.socket.connect.apply(self.socket, arguments);
	}
	
	self.end = function() {
		self.socket.end();
	}
	
	self.on = function(event, callback) {
		if(event == 'message') {
			self.socket.on('data', function(data) {
				dataBuffer += data.toString();
				var messages = dataBuffer.split(endSymbol);
				var i;
				var num = messages.length - 1;
				for(i=0; i<num; i++) {
					callback(formatter.parse(messages[i]));
				}
				dataBuffer = messages[num];				
			});
		} else {
			self.socket.on(event, callback);
		}
	}
	
	self.removeListener = function() {
		self.socket.removeListener.apply(self.socket, arguments);
	}
	
	self.removeAllListeners = function() {
		self.socket.removeAllListeners.apply(self.socket, arguments);
	}
	
	self.write = function(data, filters) {
		var str = formatter.stringify(data).replace(endSymbolRegex, '');
		if(filters) {
			var i;
			for(i in filters) {
				str = filters[i](str);
			}
		}
		self.socket.write(str + endSymbol);
	}
}

var ComServer = function() {
	var self = this;
	var server = net.createServer();
	
	self.listen = function() {
		server.listen.apply(server, arguments);
	}
	
	self.on = function(event, callback) {
		if(event == 'connection') {
			server.on(event, function(socket) {
				callback(new ComSocket(socket));
			});
		} else {
			server.on(event, callback);
		}
	}
	
	self.removeListener = function() {
		server.removeListener.apply(server, arguments);
	}
	
	self.removeAllListeners = function() {
		server.removeAllListeners.apply(server, arguments);
	}
}

var createServer = function() {
	return new ComServer();
}

module.exports.ComSocket = ComSocket;
module.exports.createServer = createServer;