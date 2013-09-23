'use strict';
var foo = require('./foo/dep');
var dep2 = require('./foo/dep2');
var innersource = require('innersource');

exports = module.exports = {
  hello: foo.hello
};
