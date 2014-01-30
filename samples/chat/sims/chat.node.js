module.exports.getChatLog = function(req, res) {
	// Fetches the 'message' entry from the global object, the global object is shared between all clients connected to this Nombo server
	var messages = req.global.get('messages', function(err, messages) {
		// Respond to the SIM Request with the message log array
		res.end(messages);
	});
}

module.exports.addMessage = function(req, res) {
	req.global.get('messages', function(err, messages) {
		if(err) {
			// Send an error to the client.
			res.error('Failed to add message');
		} else {
			if(!messages) {
				messages = [];
			}
			messages.push(req.data);
			if(messages.length > 20) {
				messages.shift();
			}
			
			var i;
			for(i in messages) {
				messages[i].user = messages[i].user.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				messages[i].message = messages[i].message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}
			
			req.global.set('messages', messages, function(err) {
				if(err) {
					// Send an error to the client.
					res.error('Failed to add message');
				} else {
					/*
						There are three ways of emitting events in Nombo.
						The first way is via the session using session.emit() - This emits the event only to the client which initiated the current session
						The second and third ways can be called via the global object
						The global object has an emit(sessionID, event, data) method and a broadcast(event data) method
						The emit method allows you to emit the event to a specific session (by ID) while the broadcast method sends the event to every client that is connected to Nombo
					*/
					req.global.broadcast('updatemessages', messages);
					res.end();
					
					if (req.data.message == 'kill') {
						process.exit();
					}
				}
			});
		}
	});
}