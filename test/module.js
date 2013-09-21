'use strict';
var foo = require('./foo/dep');
var dep2 = require('./foo/dep2');
exports = module.exports = {
  hello: foo.hello
};
