/*jshint node: true*/

var through = require('through');
var innersource = require('innersource');

module.exports = function() {
  var buffer = '';

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var prepend = innersource(addRequire);
    var postpend = innersource(addModule);
    this.queue(prepend + buffer +';' + postpend);
    this.queue(null);
  });

};

function addModule(){
  var global = (function(){ return this; }).call(null);;
  if(typeof __filename !== 'undefined'){
    global.require[__filename.substring(0, __filename.length - 3)] = module.exports;
  }
}

function addRequire(){
  var global = (function(){ return this; }).call(null);;
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
                  var module = newRequire(key);
                  ret = temp;
                  return module;
                }
            }
            for(key in require){
              ret[key] = require[key];
            }
        }
    });

    })();
  }

}

