/*jshint node: true*/

var through = require('through');

module.exports = function() {
  var buffer = '';

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    this.queue(buffer+';window.require[__filename] = module.exports;');
    this.queue(null);
  });

};

