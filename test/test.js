/*jshint node: true*/

var fs = require('fs');
var vm = require('vm');
var assert = require('assert');

var browserify = require('browserify');
var requireify = require('../index');

var modulePath = __dirname + '/module.js';
var exported = __dirname + '/compiled.js';

var b = browserify();

b.transform(requireify);

b.add(modulePath)
 .bundle({insertGlobals: true}, function(err, src){
   fs.writeFileSync(__dirname+'/compiled.js', src);
   var script = vm.createScript(src+';window.test = window.require["/foo/dep.js"].hello');

   var context = {console: {log: function(){}}, window:{require: function(){}}};
   context.self = context.window;

   script.runInNewContext(context);
   assert.equal(context.window.test, 'world');
 });


