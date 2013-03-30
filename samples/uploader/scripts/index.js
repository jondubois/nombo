/*
	We do not have to use $n.ready() because we are not loading any assets dynamically.
	We have already pre-bundled them in app/server.node.js.
*/

$(document.body).html('<div style="padding:20px;">Upload your files!<br /><br /><div class="file-uploader"></div></div>');

var uploader = new qq.FileUploader({
	element: $('.file-uploader')[0],
	action: '/~upload'
});