/* 
	Get a list of current notes bound to this session. These will be cleared when session is destroyed.
	To persist data beyond a session, you can use a database engine of your choice or you can use the req.global object.
*/
module.exports.getNotes = function(req, res) {	
	req.session.get('notes', function(err, notes) {
		if(!notes) {
			notes = [];
		}
		res.end({notes: notes});
	});
}

/* 
	Save a new note to the current session object.
*/
module.exports.createNote = function(req, res) {
	var note = req.data;
	req.session.add('notes', note, function(err) {
		req.session.get('notes', function(err, notes) {
			req.session.emit('addednote', {notes: notes});
			res.end();
		});
	});
}
