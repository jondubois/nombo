#!/usr/bin/env node

process.stdin.resume();
process.stdin.setEncoding('utf8');
  
var wrench = require('wrench');
var fs = require('fs');
var path = require('path');
var json = require('json');

var argv = require('optimist').argv;

var appName = argv._[0];
var force = argv.force ? true : false;

var parsePackageFile = function(moduleDir) {
	var packageFile = moduleDir + '/package.json';
	try {
		if(fs.existsSync(packageFile)) {
			return json.parse(fs.readFileSync(packageFile, 'utf8'));
		}
	} catch(e) {}
	
	return {};
}

var errorMessage = function(message) {
	console.log('\033[0;31m[Error]\033[0m ' + message);
}

var successMessage = function(message) {
	console.log('\033[0;32m[Success]\033[0m ' + message);
}

var warningMessage = function(message) {
	console.log('\033[0;33m[Warning]\033[0m ' + message);
}

var showCorrectUsage = function() {
	console.log('Usage: ncombo [PROJECT_NAME] [OPTIONS]');
	console.log('Create a new nCombo project\n');
	console.log('Usage: ncombo [OPTIONS]');
	console.log('Install nCombo in current directory\n');
	console.log('Available options:');
	console.log('--help               Get info on how to use this command');
	console.log('--force              Force all necessary directory modifications without prompts');
}

var failedToRemoveDirMessage = function(dirPath) {
	errorMessage('Failed to remove existing directory at ' + dirPath + '. This directory may be used by another program or you may not have the permission to remove it.');
}

var failedToCreateMessage = function() {
	errorMessage('Failed to create necessary files. Please check your permissions and try again.');
}

var prompt = function(message, callback) {
	process.stdout.write(message + ' ');
	process.stdin.on('data', function inputHandler(text) {
		process.stdin.removeListener('data', inputHandler);
		callback(text)
	});
}

var prompConfirm = function(message, callback) {
	prompt(message, function(data) {
		data = data.toLowerCase().replace(/[\r\n]/g, '');
		callback(data == 'y' || data == 'yes');
	});
}

var copyDirRecursive = function(src, dest) {
	try {
		wrench.copyDirSyncRecursive(src, dest);
		return true;
	} catch(e) {
		failedToCreateMessage();
	}
	return false;
}

var rmdirRecursive = function(dirname) {
	try {
		wrench.rmdirSyncRecursive(dirname);
		return true;
	} catch(e) {
		failedToRemoveDirMessage(dirname);
	}
	return false;
}

var createFrameworkDir = function(destDir, callback) {
	var nComboSrcDir = __dirname + '/../../ncombo';
	var progressMessage = 'Installing nCombo module... This may take a few minutes.';
	var finishedMessage = 'Done';
	var success = true;
	var proceed = function(confirm) {
		if(confirm) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(nComboSrcDir, destDir);
			console.log(finishedMessage);
		}
		callback(success);
	}
	
	if(fs.existsSync(destDir)) {
		var srcPkg = parsePackageFile(nComboSrcDir);
		var destPkg = parsePackageFile(destDir);
		
		if(srcPkg.version == destPkg.version) {
			callback(success);
		} else if(force) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(nComboSrcDir, destDir);
			console.log(finishedMessage);
			callback(success);
		} else {
			prompConfirm('A different version of the nCombo framework directory already exists at ' + nComboDestDir + '. Overwrite it (y/n)?', proceed);
		}
	} else {
		console.log(progressMessage);
		success = copyDirRecursive(nComboSrcDir, destDir);
		console.log(finishedMessage);
		callback(success);
	}
}

var createAppDir = function(destDir, callback) {
	var appSrcPath = __dirname + '/../app';
	var progressMessage = 'Setting up app structure...';
	var finishedMessage = 'Done';
	var success = true;
	var proceed = function(confirm) {
		if(confirm) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(appSrcPath, destDir);
			console.log(finishedMessage);
			callback(success);
		} else {
			errorMessage('Skipped app structure setup process');
			callback(false);
		}
	}
	
	if(fs.existsSync(destDir)) {
		if(force) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(appSrcPath, destDir);
			console.log(finishedMessage);
			callback(success);
		} else {
			prompConfirm('A directory already exists at ' + destDir + '. Overwrite it (y/n)?', proceed);
		}
	} else {
		console.log(progressMessage);
		success = copyDirRecursive(appSrcPath, destDir);
		console.log(finishedMessage);
		callback(success);
	}
}

if(argv.help) {
	showCorrectUsage();
	process.exit();
}

var wd = process.cwd();

var nodeModulesDir = wd + '/node_modules';
var nComboDestDir = nodeModulesDir + '/ncombo';

if(!fs.existsSync(nodeModulesDir)) {
	fs.mkdirSync(nodeModulesDir);
}

createFrameworkDir(nComboDestDir, function(frameworkSuccess) {
	if(frameworkSuccess) {
		if(appName) {
			var appDestDir = path.normalize(wd + '/' + appName);
			createAppDir(appDestDir, function(appSuccess) {
				if(appSuccess) {
					successMessage("Install process is complete. Run 'node " + appName + "/server' to launch. Access at http://localhost:8000/");
				}
				process.exit();
			});
		} else {
			successMessage('nCombo framework core has been installed. nCombo apps which are placed within the ' + wd + ' directory (including subdirectories) will use this framework core.');
			process.exit();
		}
	}
});