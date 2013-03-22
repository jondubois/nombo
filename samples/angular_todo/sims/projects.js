var crypto = require('crypto');

function projectKey(req) {
	if(req.data && req.data._id) {
		return 'projects.' + req.session.input(req.data._id);
	} else {
		return 'projects';
	}
}

var pid = 1;
function genId(callback) {
	crypto.randomBytes(12, function(err, buff) {
		callback(buff.toString('hex') + '-' + pid++);
	});
}

module.exports.save = function(req, res) {
	var save = function() {
		req.session.set(projectKey(req), req.data, function(err) {
			res.end(req.data);
		});
	}

	if(req.data && req.data._id) {
		save();
	} else {
		genId(function(id) {
			req.data._id = id;
			save();
		});
	}
	
}

module.exports.get = function(req, res) {
	var hasId = false;
	if(req.data && req.data._id) {
		hasId = true;
	}
	req.session.get(projectKey(req), function(err, data) {
		if(hasId) {
			res.end(data);
		} else {
			res.end(req.session.extractValues(data));
		}
		
	});
}

module.exports.remove = function(req, res) {
	req.session.remove(projectKey(req), function(err) {
		res.end(req.data);
	});
}