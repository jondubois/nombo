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

b.require(__dirname + '/foo/dep2.js', {expose: 'x'});

b.add(modulePath)
 .bundle(function(err, src){
   var completeScript = src+';window.test = require("/foo/dep").hello;window.test2 = require("x");'
   var script = vm.createScript(completeScript);
   fs.writeFileSync(__dirname+'/compiled.js', completeScript);

   var context = getContext();
   context.self = context.window;

   script.runInNewContext(context);

   assert.equal(context.window.test, 'world');
   assert.equal(context.window.test2, 'world');
 });

function getContext(){
  return {console:{log: function(){
     console.log.apply(console, arguments);
   }},window:{}};

}
