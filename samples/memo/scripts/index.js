/*
	This is a very basic note-taking app. It stores notes for the duration of a session.
	For simplicity, we are not using any special MVP views (from nCombo's MVP plugin) - Just plain jQuery. 
	In a practical setting, you may want to split your code into several files and include them into one another using 
	$n.grab.app.script().
*/
/*
$n.grab.framework.style('bootstrap');

$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.core.css');
$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.dialog.css');
$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.resizable.css');
$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.selectable.css');
$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.theme.css');
$n.grab.framework.lib('jquery/ui');

$n.grab.app.style('main');
*/
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
	console.log(arguments);
	console.log('user is logged in');
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
		var title = addNoteDialog.find('.title').val();
		var message = addNoteDialog.find('.message').val();
		// Execute the notes sim's createNote method - This will add a new note to this session
		$n.local.exec('notes', 'createNote', {title: title, message: message});
	});
	
	var addNoteButton = mainView.find('.add-note-btn');
	
	addNoteButton.click(function() {
		addNoteDialog.dialog({title: 'Add New Note'});
	});
	
	var renderNotes = function(notes) {
		// Render the entire table from scratch for simplicity's sake; this leverages handlebars template capabilities
		notesView.html(notesTableTemplate.render(notes));
	}
	
	// Execute the notes sim's getNotes method
	$n.local.exec('notes', 'getNotes', function(err, notes) {
		renderNotes(notes);
	});
	
	// Watch for the addednote server event which will be triggered whenever a new note is added
	$n.local.watch('addednote', renderNotes);
}
