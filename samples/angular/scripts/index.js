// These have already been bundled into the app, grabbing them will not reload them
var mainTemplate = $n.grab.app.template('main');

var stage = $(document.body);

// Once all our scripts and styles are loaded
$n.ready(function() {
	stage.html(mainTemplate.toString());
});