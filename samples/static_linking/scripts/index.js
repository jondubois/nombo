/*
	To load scripts statically (at launch), you need to call require().
	Embedding dependencies in this way allows you to treat client-side scripts as though they were Node.js modules.
	Effectively, all the linking and bundling happens at launch so that when a script executes, all its dependencies have already been loaded.
	This avoids the need for waiting for scripts to load asyncronously.
	This is the simplest and recommended way to link script dependencies.
*/
var a = require('./a');

$(document.body).html('<div style="padding:20px;">' + a.foo() + '</div>');