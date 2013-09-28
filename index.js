'use strict';

var through = require('through');
var innersource = require('innersource');
var detective = require('detective');
var prepend = innersource(addRequire).replace('\n', ';');
var postpend = innersource(addModule).replace('\n', ';');

module.exports = function() {
  var buffer = '';

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var nodeModuleRequires = getNodeModuleRequires(buffer);
    this.queue(prepend + nodeModuleRequires+buffer +';' + postpend);
    this.queue(null);
  });

};

function addModule(){
  var global = (function(){ return this; }).call(null);
  if(typeof __filename !== 'undefined'){
    global.require[__filename.substring(0, __filename.length - 3)] = module.exports;
  }
}

function addRequire(){
  var global = (function(){ return this; }).call(null);
  if(!global.require){
    global.require = global.require || function require(key){return global.require[key];};

    (function(){
    var require = global.require;
    var ret = global.require;
        
    Object.defineProperty(global, 'require', {
        get: function(){
          return ret;
        },
        set: function(newRequire){
            ret = function(key){
                if(require[key]){
                  return require[key];
                }else{
                  var temp = ret;
                  ret = newRequire;
                  try {
                    var module = newRequire(key);
                  }
                  catch(e){
                    ret = temp;
                    throw e;
                  }
                  ret = temp;
                  return module;
                }
            };
            for(var key in require){
              ret[key] = require[key];
            }
        }
    });

    })();
  }

}

function getNodeModuleRequires(source){
  var requires = detective(source);
  requires = requires.filter(function(require){
    return require[0] !== '.';
  });
  return requires.map(function(require){
    return ";var global = (function(){ return this; }).call(null);global.require['"+require+"'] = require('"+require+"');";
  }).join('');
}

