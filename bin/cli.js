#!/usr/bin/env node

process.stdin.resume();
process.stdin.setEncoding('utf8');
  
var wrench = require('wrench');
var fs = require('fs');
var path = require('path');
var json = require('json');

var argv = require('optimist').argv;

var command = argv._[0];
var arg1 = argv._[1];
var force = argv.force ? true : false;
var sampleDirName = 'ncombo-samples';

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
	console.log('Usage: ncombo [options] [command]\n');
	console.log('Options:');
	console.log("  -v                Get the version number of the current nCombo installation");
	console.log('  --help            Get info on how to use this command');
	console.log('  --force           Force all necessary directory modifications without prompts');
	console.log();
	console.log('Commands:');
	console.log('  create <appname>  Create a new app <appname> within the working directory');
	console.log('  samples           Create an ncombo-samples directory');
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
	var nComboSrcDir = __dirname + '/..';
	var progressMessage = 'Installing nCombo modules... This may take a while.';
	var finishedMessage = 'Done';
	var success = true;
	var nodeModulesDir = destDir + '/node_modules';
	
	var moveModules = function() {
		var nodeModules = fs.readdirSync(nodeModulesDir);
		var curFile, moduleDest;
		var modulesDirs = [];
		var i;
		for(i in nodeModules) {
			curFile = nodeModulesDir + '/' + nodeModules[i];
			if(fs.statSync(curFile).isDirectory() && nodeModules[i] != 'ncombo') {
				moduleDest = nodeModulesDir + '/../../' + nodeModules[i];
				if(fs.existsSync(moduleDest)) {
					wrench.rmdirSyncRecursive(moduleDest);
				}
				copyDirRecursive(curFile, moduleDest);
				wrench.rmdirSyncRecursive(curFile);
			}
		}
	}
	
	var proceed = function(confirm) {
		if(confirm) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(nComboSrcDir, destDir);
			moveModules();
			console.log(finishedMessage);
		}
		callback(success);
	}
	
	if(fs.existsSync(destDir)) {
		var srcPkg = parsePackageFile(nComboSrcDir);
		var destPkg = parsePackageFile(destDir);
		
		if(srcPkg.version == destPkg.version) {
			moveModules();
			callback(success);
		} else if(force) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(nComboSrcDir, destDir);
			moveModules();
			console.log(finishedMessage);
			callback(success);
		} else {
			prompConfirm('A different version of the nCombo framework directory already exists at ' + nComboDestDir + '. Overwrite it (y/n)?', proceed);
		}
	} else {
		console.log(progressMessage);
		success = copyDirRecursive(nComboSrcDir, destDir);
		moveModules();
		console.log(finishedMessage);
		callback(success);
	}
}

var createSamplesDir = function(destDir, callback) {
	var samplesSrcPath = __dirname + '/../samples';
	var progressMessage = 'Setting up sample apps...';
	var finishedMessage = 'Done';
	var success = true;
	var proceed = function(confirm) {
		if(confirm) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(samplesSrcPath, destDir);
			console.log(finishedMessage);
			callback(success);
		} else {
			errorMessage('Skipped samples setup process');
			callback(false);
		}
	}
	
	if(fs.existsSync(destDir)) {
		if(force) {
			console.log(progressMessage);
			success = rmdirRecursive(destDir) && copyDirRecursive(samplesSrcPath, destDir);
			console.log(finishedMessage);
			callback(success);
		} else {
			prompConfirm('A directory already exists at ' + destDir + '. Overwrite it (y/n)?', proceed);
		}
	} else {
		console.log(progressMessage);
		success = copyDirRecursive(samplesSrcPath, destDir);
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

if(argv.v) {
	var nComboDir = __dirname + '/../../ncombo';
	var nComboPkg = parsePackageFile(nComboDir);
	console.log('v' + nComboPkg.version);
	process.exit();
}

var wd = process.cwd();

var nodeModulesDir = wd + '/node_modules';
var nComboDestDir = nodeModulesDir + '/ncombo';

if(!fs.existsSync(nodeModulesDir)) {
	fs.mkdirSync(nodeModulesDir);
}

if(command == 'create' || command == 'samples') {
	createFrameworkDir(nComboDestDir, function(frameworkSuccess) {
		if(frameworkSuccess) {
			if(command == 'samples') {
				var samplesDestDir = path.normalize(wd + '/' + sampleDirName);
				createSamplesDir(samplesDestDir, function(samplesSuccess) {
					if(samplesSuccess) {
						successMessage("Install process is complete. Run 'node " + sampleDirName + "/sampleappname/server' to launch. Access at http://localhost:8000/");
					}
					process.exit();
				});
			} else if(command == 'create') {
				if(arg1) {
					var appDestDir = path.normalize(wd + '/' + arg1);
					createAppDir(appDestDir, function(appSuccess) {
						if(appSuccess) {
							successMessage("Install process is complete. Run 'node " + arg1 + "/server' to launch. Access at http://localhost:8000/");
						}
						process.exit();
					});
				} else {
					successMessage('nCombo framework core has been installed. nCombo apps which are placed within the ' + wd + ' directory (including subdirectories) will use this framework core.');
					process.exit();
				}
			}
		} else {
			process.exit();
		}
	});
} else {
	errorMessage("'" + command + "' is not a valid nCombo command");
	showCorrectUsage();
	process.exit();
}