'use strict';
var regex = /function[^)]*\([^)]*\)\s{0,}\{([\s\S]*)\}/,
	toString = Function.prototype.toString;

module.exports = function innersource(func){
  return toString.call(func).match(regex)[1];
};
