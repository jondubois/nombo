$n.grab.frameworkCSS('bootstrap');
$n.grab.script('showtable');

var template = $n.grab.template('mytemplate');

$n.ready(function() {
	var dataRows = [
			{month: 'January', amount: '$100'},
			{month: 'February', amount: '$200'},
			{month: 'March', amount: '$300'} ];
	
	$(document.body).append(template.render({rows: dataRows}));
	
	/*
	$n.acall('test', 'fun', 'Hi', function(data) {
		$(document.body).append(data + "<br />");
	});
	*/
	
	$n.acall('indirect', 'stream', 'Test ', function(data) {
		$(document.body).append(data + "<br />");
	});
	
	$n.acall('indirect', 'second');
});