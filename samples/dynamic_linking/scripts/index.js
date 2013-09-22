/*
	Scripts can be grabbed from anywhere (including inside functions) but the start of the file is a good place to load core dependencies.
	You can grab multiple scripts one after another; They will be downloaded in parallel but executed in sequence.
	You can also grab styles (CSS), libs (JS) and templates (HTML).
*/
var a = $n.grab.app.script('a');

/*
	This code gets executed immediately after the request for script a has been made - Since this is asynchronous, the following code 
	will be executed while script a and all its dependencies are loading.
*/
console.log('Loading scripts...');

/*
	The ready callback is executed when all dependencies required before it (including all subdependencies for scripts) have been loaded and executed.
	Use $n.ready when you want to run code that makes use of dependencies. For simplicity, it is advisable to
	have at least one main ready block for each script file which has dependencies.
	
	$n.ready also accounts for all images referenced within CSS files as well as additional CSS loaded using @import - Nombo will wait for all style data to be loaded before
	the ready callback is executed.
*/
$n.ready(function() {
	console.log('All scripts have been loaded.');
	a.foo(function(result) {
		$(document.body).html('<div style="padding:20px;">' + result + '</div>');
	});
});