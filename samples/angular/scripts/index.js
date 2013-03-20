// These have already been bundled into the app, grabbing them will not reload them
//var mainTemplate = $n.grab.app.template('index.html');

var stage = $(document.body);

window.TodoCtrl = require('./todo-ctrl').TodoCtrl;

$n.ready(function() {
	//$n.mvp.setMainView(mainTemplate.toString());
	//stage.html(mainTemplate.toString());
});