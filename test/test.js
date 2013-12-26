'use strict';

var fs = require('fs');
var vm = require('vm');
var assert = require('assert');
var util = require('util');

var browserify = require('browserify');
var coffeeify = require('coffeeify');
var requireify = require('../index');
var innersource = require('innersource');
var convert = require('convert-source-map');

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
   assert.equal(context.window.test4, 'works');
 });

// test for sourcemaps
b.add(modulePath)
 .bundle({ debug: true }, function(err, src){

   var sourceMapComment = src.split('\n').slice(-2)[0];
   var json = convert.fromComment(sourceMapComment);

   //expected was found by first checking by hand and then saving those mappings
   //fs.writeFileSync('./expected-sourcemap', JSON.stringify(json));
   var expected = JSON.parse(require('./expected-sourcemap')).mappings;

  assert.equal(json.sourcemap.mappings, expected);
 });
 
var b = browserify();


// test for coffescript with sourcemaps
b.transform(coffeeify).transform(requireify)
 .add(__dirname+'/coffee/foo.coffee')
 .bundle({ debug: true }, function(err, src){
   fs.writeFileSync(__dirname+'/compiled-for-coffee-source-maps.js', src);

   var sourceMapComment = src.split('\n').slice(-2)[0];
   var json = convert.fromComment(sourceMapComment);
   //fs.writeFileSync('./expected-coffeescript-sourcemap', JSON.stringify(json));


   //expected was found by first checking by hand and then saving those mappings
   var expected = JSON.parse(require('./expected-coffescript-sourcemap')).mappings;

   assert.equal(json.sourcemap.mappings, expected);
 });

var b = browserify();

// test for last curly brace error in issue #4
b.transform(requireify)
 .add(__dirname+'/regressions/last-char-curly-brace.js')
 .bundle({ debug: true }, function(err, src){
    if(err){
      throw err;
    }
   var script = vm.createScript(src);
   var context = getContext();
   script.runInNewContext(context);
 });


function getContext(){
  return {console:{log: function(){
     console.log.apply(console, arguments);
   }},window:{}};

}

function tests(){
  var innersource = require('innersource');
  window.test = require("x");
  try{
    var dne = require('does_not_exist');
  }
  catch(e){
    dne = undefined;
  }
  window.test2 = require("/foo/dep").hello;
  window.test3 = innersource(function(){tests();});
  window.test4 = require('/withIndex');
}
