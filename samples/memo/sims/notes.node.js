var json = require('json');

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
	
	/*
	// This is has the same effect as the code above except it does it in a single call to nData.
	var query = req.session.query("function(DataMap){ DataMap.add('notes', {{note}}); return DataMap.get('notes'); }", {note: note});
	req.session.run(query, function(err, notes) {
		req.session.emit('addednote', {notes: notes});
		res.end();
	});
	*/
}
