var ExpiryManager = module.exports.ExpiryManager = function () {
	this._keys = {};
    this._expiries = {};
};

ExpiryManager.prototype._isEmpty = function (obj) {
	var i;
	for (i in obj) {
		return false;
	}
	return true;
};

ExpiryManager.prototype.now = function () {
	return (new Date()).getTime() / 1000;
};

ExpiryManager.prototype.expire = function (keys, seconds) {
	if (!(keys instanceof Array)) {
		keys = [keys];
	}
	this.unexpire(keys);
	var expiry = this.now() + seconds;
	for (var i in keys) {
		this._keys[keys[i]] = expiry;
		if (this._expiries[expiry] == null) {
			this._expiries[expiry] = {};
		}
		this._expiries[expiry][keys[i]] = 1;
	}
};

ExpiryManager.prototype.unexpire = function (keys) {
	if (!(keys instanceof Array)) {
		keys = [keys];
	}
	var expiry;
	for (var i in keys) {
		expiry = this._keys[keys[i]];
		delete this._keys[keys[i]];
		if (expiry && this._expiries[expiry] != null) {
			delete this._expiries[expiry][keys[i]];
			if (this._isEmpty(this._expiries[expiry])) {
				delete this._expiries[expiry];
			}
		}
	}
};

ExpiryManager.prototype.getExpiry = function (key) {
	return this._keys[key];
};

ExpiryManager.prototype.getKeysByExpiry = function (expiry) {
	var keys = [];
	var keyMap = this._expiries[expiry];
	for (var i in keyMap) {
		keys.push(i);
	}
	return keys;
};

ExpiryManager.prototype.getExpiredKeys = function (time) {
	var expiredKeys = [];
	var now = time || this.now();
	var i, j;
	for (i in this._expiries) {
		if (i <= now) {
			for (j in this._expiries[i]) {
				expiredKeys.push(j);
			}
		} else {
			break;
		}
	}
	return expiredKeys;
};

ExpiryManager.prototype.extractExpiredKeys = function (time) {
	var expiredKeys = this.getExpiredKeys(time);
	for (var i in expiredKeys) {
		this.unexpire(expiredKeys[i]);
	}
	return expiredKeys;
};

ExpiryManager.prototype.clear = function () {
	this._keys = {};
	this._expiries = {};
};