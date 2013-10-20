var engine = require('engine.io');
var Server = engine.Server;
var ClusterSocket = require('./clustersocket');
var transports = engine.transports;
var EventEmitter = require('events').EventEmitter;
var base64id = require('base64id');

var ClusterServer = function (options) {
	var self = this;
	var opts = {};
	var i;
	for (i in options) {
		opts[i] = options[i];
	}
	
	var pollingEnabled = false;
	for (i in opts.transports) {
		if (opts.transports[i] == 'polling') {
			pollingEnabled = true;
			break;
		}
	}
	if (!pollingEnabled) {
		opts.transports.unshift('polling');
	}

	opts.pingTimeout = opts.pingTimeout * 1000;
	opts.pingInterval = opts.pingInterval * 1000;
	opts.upgradeTimeout = opts.upgradeTimeout * 1000;
	
	opts.cookie = 'n/' + opts.appName + '/io';
	
	Server.call(this, opts);
	
	this.sourcePort = opts.sourcePort;
	this.hostAddress = opts.hostAddress;
	this.secure = opts.secure ? 1 : 0;
	this.logLevel = opts.logLevel;
	
	this._ioClusterClient = opts.ioClusterClient;
	this._sessionIdRegex = new RegExp('(n/' + opts.appName + '/ssid=)([^;]*)');
	this._hostRegex = /^[^:]*/;
	
	this._handleSocketError = function (error) {
		self.emit('error', error);
	};
};

ClusterServer.prototype = Object.create(Server.prototype);

ClusterServer.prototype._parseSessionId = function (cookieString) {
	if(typeof cookieString == 'string') {
		var result = cookieString.match(this._sessionIdRegex);
		if(result) {
			return result[2];
		}
	}
	return null;
};

ClusterServer.prototype.generateId = function (req) {
	var host;
	if (this.hostAddress) {
		host = this.hostAddress;
	} else {
		host = req.headers.host.match(this._hostRegex);
		if (host) {
			host = host[0];
		} else {
			host = '';
		}
	}
	var port = req.connection.address().port;
	return host + '_' + port + '_' + this.sourcePort + '_' + this.secure + '_' + base64id.generateId();
};

ClusterServer.prototype.on = function (event, listener) {
	if (event == 'ready') {
		this._ioClusterClient.on(event, listener);
	} else {
		Server.prototype.on.apply(this, arguments);
	}
};

ClusterServer.prototype.removeListener = function (event, listener) {
	if (event == 'ready') {
		this._ioClusterClient.removeListener(event, listener);
	} else {
		Server.prototype.removeListener.apply(this, arguments);
	}
};

ClusterServer.prototype.sendErrorMessage = function (res, code) {
	res.writeHead(400, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({
		code: code,
		message: Server.errorMessages[code]
	}));
};

ClusterServer.prototype.handshake = function (transport, req) {
	var self = this;
	
	var id = this.generateId(req);
	try {
		var transport = new transports[transport](req);
	} catch (e) {
		this.sendErrorMessage(req.res, Server.errors.BAD_REQUEST);
		return;
	}
	
	var socket = new ClusterSocket(id, this, transport);

	if (false !== this.cookie) {
		transport.on('headers', function (headers) {
			headers['Set-Cookie'] = self.cookie + '=' + id;
		});
	}

	transport.onRequest(req);

	this.clients[id] = socket;
	this.clientsCount++;
	
	var headers = req.headers || {};
	
	if (req.connection) {
		socket.address = headers['x-forwarded-for'] || req.connection.remoteAddress;
	}
	var ssid = this._parseSessionId(headers.cookie);
	socket.ssid = ssid || socket.id;
	
	this._ioClusterClient.bind(socket, function (err, notice) {
		socket.on('error', function (err) {
			socket.close();
			self._handleSocketError(err);
		});
		if (err) {
			var errorMessage = 'Failed to bind socket to io cluster - ' + err;
			socket.emit('fail', errorMessage);
			socket.close();
			if (notice) {
				self.emit('notice', errorMessage);
			} else {
				self.emit('error', new Error(errorMessage));
			}
		} else {
			socket.session = self._ioClusterClient.session(socket.ssid, socket.id);
			socket.global = self._ioClusterClient.global(socket.id);
			self.emit('connection', socket);
			socket.emit('connect', socket.id);
		}
	});
	
	socket.once('close', function () {
		self._ioClusterClient.unbind(socket, function (err) {
			if (err) {
				self.emit('error', new Error('Failed to unbind socket from io cluster - ' + err));
			} else {
				delete self.clients[id];
				self.clientsCount--;
				self.emit('close', 'Socket was disconnected');
			}
		});
	});
};

module.exports = ClusterServer;