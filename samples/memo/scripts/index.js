/*
	This is a very basic note-taking app. It stores notes for the duration of a session.
	For simplicity, we are using plain jQuery. 
	In a practical setting, you may want to split your code into several files and include them into one another using 
	$n.grab.app.script().
*/

// These have already been bundled into the app, grabbing them will not reload them
var loginTemplate = $n.grab.app.template('login');
var mainTemplate = $n.grab.app.template('main');
var notesTableTemplate = $n.grab.app.template('notes_table');
var addNoteDialogTemplate = $n.grab.app.template('add_note_dialog');

var stage = $(document.body);
var screens = {};

// Once all our scripts and styles are loaded
$n.ready(function() {
	$n.local.exec('auth', 'isLoggedIn', function(err, isLoggedIn) {
		if(isLoggedIn) {
			main();
		} else {
			stage.html(loginTemplate.render());
			var lis = screens.loginScreen = stage.find('.login-screen');
			
			lis.find('.username').val('bob');
			lis.find('.password').val('hello');
			lis.find('.login-btn').click(function() {
				var user = lis.find('.username').val();
				var pass = lis.find('.password').val();
				
				var authData = {username: user, password: pass};
				$n.local.exec('auth', 'login', authData, function(err, success) {
					if(success) {
						main();
					} else {
						screens.loginScreen.find('.error-box').html('Failed. Wrong username or password.');
					}
				});
			});
		}
	});
});

function main() {
	console.log('User is logged in');
	screens.loginScreen && screens.loginScreen.remove();
	
	// Render all templates to the stage and get references to all major view components
	stage.html(mainTemplate.render());
	var mainView = stage.find('.main');
	var notesView = stage.find('.notes-view');
	notesView.html(notesTableTemplate.render({notes:[]}));
	var notesTable = stage.find('.notes-table');
	stage.append(addNoteDialogTemplate.render());
	
	var addNoteDialog = stage.find('.add-note-dialog');
	var addNoteDialogAddButton = addNoteDialog.find('.add-btn');
	
	addNoteDialogAddButton.click(function() {
		var titleBox = addNoteDialog.find('.title');
		var messageBox = addNoteDialog.find('.message');
		var title = titleBox.val();
		var message = messageBox.val();
		// Execute the notes sim's createNote method - This will add a new note to this session
		$n.local.exec('notes', 'createNote', {title: title, message: message}, function (err) {
			err && alert(err);
		});
		titleBox.val('');
		messageBox.val('');
		addNoteDialog.dialog('close');
	});
	
	var addNoteButton = mainView.find('.add-note-btn');
	var shareButtons = mainView.find('.share');
	
	/*
	This is a handle to the chat app running at samples.nombo.io port 8000.
	Chat app is configured to accept all remote communications by default (there is no middleware which stops this from happening), 
	so we can call all its SIM methods directly.
	In practice, all private SIM methods should be protected using middleware which should authenticate calls to it.
	*/
	var chatApp = $n.remote('samples.nombo.io', 8000);
	//var chatApp = $n.remote('localhost', 8000);
	
	mainView.delegate('.share', 'click', function(e) {
		var parent = $(e.target).parent().parent();
		var message = parent.find('.message').html();
		
		// We are using the chat app's chat sim and calling its addMessage method with the specified 'data' parameter
		chatApp.exec('chat', 'addMessage', {user: 'Memo', message: message}, function (err) {
			err && alert(err);
		});
	});
	
	addNoteButton.click(function() {
		addNoteDialog.dialog({title: 'Add New Note'});
	});
	
	var renderNotes = function(notes) {
		// Render the entire table from scratch for simplicity's sake; this leverages handlebars template capabilities
		notesView.html(notesTableTemplate.render(notes));
	}
	
	// Execute the notes sim's getNotes method
	$n.local.exec('notes', 'getNotes', function(err, notes) {
		if (err) {
			alert(err);
		} else {
			renderNotes(notes);
		}
	});
	
	// Watch for the addednote server event which will be triggered whenever a new note is added
	$n.local.watch('addednote', renderNotes);
}