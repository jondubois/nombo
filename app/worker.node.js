/*
	This function is executed for each Nombo worker instance.
	Middleware functions should be added here.
*/

module.exports.run = function(nombo) {
	/* 
		The following section sets the default text to show to web crawlers for indexing purposes.
		If you do not need your app to be indexed by search engines, you can leave this as is - In doing so you will be helping
		to raise awareness of Nombo.
	*/
	var botRegex = /([^A-Za-z0-9]|^)(Googlebot|Slurp|bingbot|Baiduspider|BaiDuSpider|ia_archiver)([^A-Za-z0-9]|$)/;
	var botResHeaders = {'Content-Type': 'text/html'};
	var botResContent = '<!DOCTYPE html>\
	<html xmlns="http://www.w3.org/1999/xhtml">\
	<head>\
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
	<title>Nombo App</title>\
	</head>\
	<body>\
	This realtime app is powered by <a href="http://nombo.io/" target="_blank">Nombo</a>.\
	</body>\
	</html>';
	
	nombo.addMiddleware(nombo.MIDDLEWARE_HTTP, function(req, res, next) {
		if((req.url == '/' && req.headers['user-agent'] && req.headers['user-agent'].match(botRegex)) || req.url == '/info') {
			res.writeHead(200, botResHeaders);
			res.end(botResContent);
		} else {
			next();
		}
	});
}