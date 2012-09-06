# socket.io-clusterhub [![Build Status](https://secure.travis-ci.org/fent/socket.io-clusterhub.png)](http://travis-ci.org/fent/socket.io-clusterhub)

A [socket.io](http://socket.io/) storage made with [clusterhub](https://github.com/fent/clusterhub). Syncs data between multi-process socket.io applications.

# Usage
```js
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

// store must be initialized for master/worker processes
var store = new (require('socket.io-clusterhub'));

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

} else {
  var io = require('socket.io').listen(3000)
  console.log('Listening on port 3000');

  // set the store to the socket.io-clusterhub instance
  io.configure(function() {
    io.set('store', store);
  });

  io.sockets.on('connection', function(socket) {
    // use socket.io as normal
  });
}
```

# Install

    npm install socket.io-clusterhub


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# License
MIT
