/*
	Import stylesheet from appname/styles/ directory
	Note that all Nombo framework files are stored under framework/ - App-specific files are stored under the appname/ directory
*/
$n.grab.app.style('styles.css');

/*
	Here it is grabbing the template 'chatbox' (app/templates/chatbox.handlebars), 
	You can then get the string representation of this template by calling its render()
	method (with an optional data argument).
*/
var chatView = $n.grab.app.template("chatbox");
var chatListView = $n.grab.app.template("chatlist");

var prevList = "";

var chatHandler = function (messages) {
	var msgStr = '';
	var i;
	for (i in messages) {
		msgStr += '<li>' + messages[i].user + ': ' + messages[i].message + '</li>';
	}
	
	$('.messageContainer').html(msgStr);
}

/*
	This is a presenter (look up Model View Presenter pattern), it handles data from the chat serverinterface
	It updates the view whenever the message log changes on the server.
	The callback to the $n.local.exec function is in the form: callback(err, data) where err is an error string (or null if no error) and data is the
	data received from the server.
*/
var showChat = function (err, data) {
	if (err) {
		chatHandler([{user:"System", message: "Couldn't load chat: " + err}]);
	} else {
		chatHandler(data);
	}
}

// Sends message to the chat server interface's addMessage method
function sendMessage(e) {
	var sendBox = $("#sendBox");
	var nameBox = $("#nameBox");
	
	/*
		Calls the chat server interface's addMessage method (see app/sims/chat.node.js)
		Feel free to add new server interfaces to the app/sims/ directory and call their methods from the client-side using $n.local.exec
		Make sure that your server interface files have a .node.js extension - The .node.js extension keeps your code private
	*/
	$n.local.exec('chat', 'addMessage', {user: nameBox.val(), message: sendBox.val()}, function(err) {
		if (err) {
			throw new Error("Error - Couldn't post your message - " + (err.message || err));
			sendBox.val("");
		} else {
			sendBox.val("");
		}
	});
}

/*
	Functions passed to $n.ready will only be run when all scripts grabbed before the current $n.ready call have finished loading
	Note that once inside $n.ready, you may choose to load other external scripts which can have their own $n.ready handlers
*/
$n.ready(function () {
	var chatString = chatView.render({"chatArea": chatListView.render()});
	
	$(document.body).html(chatString);
	// Call the chat server interfaces' getChatLog method - The chatHandler object will handle the result (through its success property)
	$n.local.exec('chat', 'getChatLog', showChat);
	
	// Here we are simply watching for an event called 'updatemessages' which happens when a different client makes an update to the message log
	$n.local.watch('updatemessages', chatHandler);
	
	$("#nameBox").val("Guest");
	$("#sendButton").click(sendMessage);
	$("#sendBox").keypress(function (e) {
		if (e.keyCode == 13) {
			sendMessage(e);
		}
	});
});