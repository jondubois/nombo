var net = require('net');
var formatter = require('./formatter');

var ComSocket = function(netSocket) {
	var self = this;
	var dataBuffer = '';
	var endSymbol = '~λιφρ~';
	var socket = null;
	
	if(netSocket) {
		socket = netSocket;
	} else {
		socket = new net.Socket();
	}
	
	self.connect = function() {
		socket.connect.apply(socket, arguments);
	}
	
	self.on = function(event, callback) {
		if(event == 'message') {
			socket.on('data', function(data) {
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
			socket.on(event, callback);
		}
	}
	
	self.removeListener = function() {
		socket.removeListener.apply(socket, arguments);
	}
	
	self.removeAllListeners = function() {
		socket.removeAllListeners.apply(socket, arguments);
	}
	
	self.write = function(data) {
		socket.write(formatter.stringify(data) + endSymbol);
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