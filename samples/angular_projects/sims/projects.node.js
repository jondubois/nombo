var crypto = require('crypto');

/*
	Generate a key which will either point to a single project record or all 
	records depending on the request object.
*/
function projectKey(req) {
	if(req && req.data && req.data._id) {
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

/*
	Dispatch a 'projectchanged' event which all clients of the current session will receive.
	This is useful in case multiple open tabs share the same session.
*/
function dispatchProjectsChanged(req, projects) {
	/*
		emitOut emits an event to all clients which are bound to the current session except the current one.
		This is for efficiency purposes.
	*/
	req.session.emitOut('projectschanged', req.session.extractValues(projects));
}

/*
	Save one or more project records.
*/
module.exports.save = function(req, res) {
	var save = function() {
		req.session.set(projectKey(req), req.data, function(err) {
			res.end(req.data);
			
			req.session.get(projectKey(), function(err, data) {
				dispatchProjectsChanged(req, data);
			});
		});
	}

	if(req.data && req.data._id) {
		save();
	} else {
		genId(function(id) {
			if(req.data) {
				req.data._id = id;
				save();
			}
		});
	}
}

/*
	Get one or more project records.
*/
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

/*
	Remove one or more project records.
*/
module.exports.remove = function(req, res) {
	req.session.remove(projectKey(req), function(err) {
		res.end(req.data);
		
		req.session.get(projectKey(), function(err, data) {
			dispatchProjectsChanged(req, data);
		});
	});
}