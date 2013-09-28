'use strict';

var fs = require('fs');
var vm = require('vm');
var assert = require('assert');

var browserify = require('browserify');
var requireify = require('../index');
var innersource = require('innersource');

var modulePath = __dirname + '/module.js';
var exported = __dirname + '/compiled.js';

var b = browserify();

b.transform(requireify);

b.require(__dirname + '/foo/dep2.js', {expose: 'x'});

b.add(modulePath)
 .bundle(function(err, src){
   var completeScript = src+innersource(tests);
   var script = vm.createScript(completeScript);
   fs.writeFileSync(__dirname+'/compiled.js', completeScript);

   var context = getContext();
   context.self = context.window;

   script.runInNewContext(context);

   assert.equal(context.window.test, 'world');
   assert.equal(context.window.test2, 'world');
   assert.equal(context.window.test3, 'tests();');
 });

function getContext(){
  return {console:{log: function(){
     console.log.apply(console, arguments);
   }},window:{}};

}

function tests(){
  var innersource = require('innersource');
  window.test = require("/foo/dep").hello;
  window.test2 = require("x");
  window.test3 = innersource(function(){tests();});
}
