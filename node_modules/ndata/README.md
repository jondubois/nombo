nData
======

nData is a lightweight key-value store server and client pair.
It is written entirely in node.js for maximum portability.

## Installation

```bash
npm install ndata
```

## Overview

To use it call:
var ndata = require('ndata');

Firstly, launch a new nData server. If you're using the node cluster module, you might want to launch the nData server once 
from the master process and then interact with it using nData clients.

To launch the server, use:
var dataServer = ndata.createServer(port, secretKey)

The secretKey argument is optional; you should use it if you want to restrict access to the server.
If you're running a node cluster, you may want to use a random key and distribute it to all the workers so that only
your application can interact with the nData server.

Once the server is setup, you should create clients to interact with it. **Make sure that the server is running before creating clients; listen for the 'ready' event on the server.**
To create a client use:
var dataClient = ndata.createClient(port, secretKey);

The port and secret key must match those supplied to the createServer function.

The client exposes the following methods:
(Please see the section on keys (below) to see how you can use keys in nData.
Also, note that the callback argument in all of the following cases is optional.)

- run(code, callback) - Run a JavaScript function declaration as a query on the nData server - This function declaration accepts the DataMap as a parameter. The callback is in form: callback(err, data) Example:

```js
client.run('function(DataMap) { DataMap.set("main.message", "This is an important message"); return DataMap.get("main"); }', function(err, data) {
	console.log(data); // outputs {message: "This is an important message"}
});
```

- set(key, value, callback) - Set a key-value pair, when the operation has been completed, callback will be executed.
The callback is in form: callback(err)

- add(key, value, callback) - Append a value to the given key; the object at key will be treated as an array. If a value already exists at that key and is not an array,
this existing value will be placed inside an empty array and the specified value argument will be appended to that array.
The callback is in form: callback(err)

- remove(key, callback) - Removes the value at key. If value is an array, it will remove the entire array.
The callback is in form: callback(err, value)

- removeAll(callback) - Clears nData completely.
The callback is in form: callback(err)

- pop(key, callback) - Removes the last numerically-indexed entry at key; callback is in the form: callback(err, value)

- get(key, callback) - Gets the value at key; callback is in form: callback(err, value)

- getAll(callback) - Gets all the values in nData; callback is in form: callback(err, value)

- watch(event, handler, ackCallback) - Watches for an event on nData, handler is a callback in the form handler(value) where value is a value sent with the event.
Note that you can watch the same event multiple times (even using the same handler).

- watchOnce(event, handler, ackCallback) - As above except that it will only trigger a single handler (from the last call to watchOnce).

- unwatch(event, handler, ackCallback) - Unwatch the specified event. If handler is not specified, it will remove handlers associated with the specified event.
If event is not specified, it will remove all nData events.

- broadcast(event, value, callback) - Broadcast an event with the specified associated value.

## Keys

nData is very flexible with how you can use keys. It lets you set key chains of any dimension without having to manually create each link in the chain.
For example, when you start, nData will be empty, but this code is perfectly valid:
dataClient.set('this.is.a.deep.key', 'Hello world');

In this case, nData will create the necessary key chain and set the bottom-level 'key' to 'Hello World'.
If you were to call:
dataClient.get('this.is.a', function(value) {
	console.log(value);
});

The above would output: {deep:{key:'Hello world'}}

nCombo generally doesn't restrict you from doing anything you want. It is perfectly OK to call this:

dataClient.add('this.is.a', 'foo');

In this case, the key chain 'this.is.a' would evaluate to:
{0:'foo',deep:{key:'Hello world'}}

In this case, nData will add the value at the next numeric index in the specified key path (which in this case is 0).
You can access numerically-indexed values like this:
dataClient.get('this.is.a.0', function(value) {
	console.log(value);
});

The output here will be 'foo'.
You can also add entire JSON-compatible objects as value. Objects with circular references are also valid.


## Special Macros

Special macros serve to extend the capabilities of nData - They can be applied within both the key and the value arguments supplied to any nData method (basically any string supplied to nData).

In nData, the dot (.) character is special - By default it serves to delimit different depths in the key chain.
There may be cases where you want a dot character to be interpreted literally - In this case, you should use the #() macro.
For example, if you have:

```js
dataClient.set('#(this.is.a.shallow.key)', 'Hello world');
```

If you tried running this:

```js
dataClient.get('this.is.a', function(value) {
	console.log(value);
});
```

Value would be undefined.
To actually retrieve the value, you would need to do it like this:

```js
dataClient.get('#(this.is.a.shallow.key)', function(value) {
	console.log(value);
});
```

You need to be consistent in how you escape the chain.

To evaluate expressions, you may use the %() macro.

Example:

```js
dataClient.set('value', 'Number: %(8 + 2)'); // This would store the string 'Number: 10'
```

Sometimes you may want to substitute the value of an object that is already stored within nData, in this case, use the $() macro.

Example (also using evaluation macro):

```js
dataClient.set('valueA', 1, function(err) {
	dataClient.set('valueB', '%($(valueA) + 1)'); // This would set valueB to the number 2
});
```