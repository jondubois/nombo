var fs = require('fs');
var path = require('path');
var pathManager = require('nombo/pathmanager');
var EventEmitter = require('events').EventEmitter;
var watchr = require('watchr');

module.exports = function (options) {
	var self = new EventEmitter();
	
	var specialCharsRegex = /[\r\n\t]/g;
	var singleQuoteRegex = /'/g;
	var files = options.files;
	var watch = options.watch;
	var watchDirs = options.watchDirs;
	
	var updateDelay;
	if (options.updateDelay == null) {
		updateDelay = 1000;
	} else {
		updateDelay = options.updateDelay;
	}
	
	if (watch) {
		var emitBundle = function () {
			self.emit('update');
		}
		
		watchr.watch({
			paths: watchDirs,
			listener: emitBundle,
			catchupDelay: updateDelay
		});
	}
	
	self._stringifyHTML = function (content) {
		return content.replace(specialCharsRegex, '').replace(singleQuoteRegex, "\\'");
	}
	
	self._genTemplateCode = function (filePath) {
		var url = pathManager.pathToURL(filePath);
		if (!fs.existsSync(filePath)) {
			return null;
		}
		
		var content = fs.readFileSync(filePath, 'utf8');
		var code = "$loader.grab._loadableResourceMap['" + url + "'] = new $loader.Template('" + url + "');\n";
		code += "$loader.grab._loadableResourceMap['" + url + "'].make('" + self._stringifyHTML(content) + "');\n";
		
		return code;
	}
	
	self.bundle = function () {
		if (!(files instanceof Array)) {
			files = [files];
		}
		var content = [];
		
		var i, file, code;
		for (i in files) {
			file = files[i];
			code = self._genTemplateCode(file);
			if (code) {
				content.push(code);
			}
		}
		
		return content.join('\n');
	}
	
	return self;
}