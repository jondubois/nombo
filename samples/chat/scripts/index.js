/*
	Import stylesheet from framework/styles/ directory
	You can also import a .less stylesheet which will be pre-compiled on the serverside; In this case, make sure that your files have a .less extension
	Note that all nCombo framework files are stored under framework/ - App-specific files are stored under the app/ directory
*/
$n.grab.framework.style('jqueryui/ui-lightness/style.css');

// Import library script, library scripts are core framework scripts and are located in the framework/libs/ directory
$n.grab.framework.lib('jquery/ui.js');

// Set the document to display a loading message while files are being loaded
$(document.body).html('Loading Dynamic Libraries...');

/*
	This uses the $j.mvp plugin which lets you work with views - You don't have to use the MVP plugin if you don't want to
	In most cases, you can simply manipulate the DOM using jQuery.
	Here it is grabbing a view based on the template 'chatbox' (app/templates/chatbox.handlebars), 
	If you want to grab the template directly, you should use the $n.grab.template("chatbox") method directly - You can then get the string representation of
	this template by calling its render() method (with an optional data argument).
*/
var chatView = $n.grab.app.template("chatbox");
var chatListView = $n.grab.app.template("chatlist");

var prevList = "";

var chatHandler = function(messages) {
	var msgStr = '';
	
	var i;
	for(i in messages) {
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
var showChat = function(err, data) {
	if(err) {
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
		Calls the chat server interface's addMessage method (see app/serverinterfaces/chat.node.js)
		Feel free to add new server interfaces to the app/serverinterfaces/ directory and call their methods from the client-side using $n.local.exec
		Make sure that your server interface file have a .node.js extension - The .node.js extension keeps your code private
	*/
	$n.local.exec('chat', 'addMessage', {user: nameBox.val(), message: sendBox.val()}, function(err) {
		if(err) {
			throw new Error("Error - Couldn't post your message");
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
$n.ready(function() {
	/* 
		This is a method of the $n.mvp.View class, it fills the {{chatArea}} handlebars segment with the given $n.mvp.View object (also accepts HTML strings)
		See http://handlebarsjs.com/ for more info on handlebars templates
	*/
	var chatString = chatView.render({"chatArea": chatListView.render()});
	
	/*
		Sets the root view of your application - You only need this if you're using the full MVP approach, otherwise you can just use $(document.body).html()
		Just make sure to choose one way, not both - Here we chose to go with the MVP component-based approach, but there is no right way to do this provided that you can
		keep your code under control
	*/
	$(document.body).html(chatString);
	
	// Call the chat server interfaces' getChatLog method - The chatHandler object will handle the result (through its success property)
	$n.local.exec('chat', 'getChatLog', showChat);
	
	// Here we are simply watching for an event called 'updatemessages' which happens when a different client makes an update to the message log
	$n.local.watch('updatemessages', chatHandler);
	
	$(".button").button();
	
	$("#nameBox").val("Guest");
	$("#sendButton").click(sendMessage);
	$("#sendBox").keypress(function(e) {
		if(e.keyCode == 13){
			sendMessage(e);
		}
	});
});