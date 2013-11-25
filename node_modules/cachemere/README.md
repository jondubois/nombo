Cachemere
======

A nice, smooth, cushiony layer of cache.

Cachemere is a static file fetching/caching engine which greatly reduces the number of disk I/O operations and eases the CPU load on your server.
Cachemere caches preprocessed and/or compressed file contents and updates them when the related files change on the file system.
By default, Cachemere also generates necessary ETag headers for client-side caching - Default headers can be modified as required before being sent.

To install, run:

```bash
npm install cachemere
```

==================

#### Basic example (fetches a file from disk or cache):

```js
var cachemere = require('cachemere');
var http = require('http');

var server = http.createServer(function (req, res) {
    cachemere.fetch(req, function (err, resource) {
		/*
		Note that you can manipulate the Resource object's 
		properties before outputting it to the response.
		*/
        resource.output(res);
    });
});
```

==================

## API

#### Top-level

These are exposed by `require('cachemere')`:

##### Events

- `ready`
	- Emitted when all pending resources have been cached.
- `hit`
	- Emitted when a resource is fetched from cache
	- **Arguments**
		- `url`: A resource URL
- `miss`
	- Emitted when a resource misses the cache and is fetched from disk
	- **Arguments**
		- `url`: A resource URL
- `notice`
	- Emitted when Cachemere encounters a notice error - These errors are very low importance - For example, fetching a file which does not exist will cause a notice to be emitted.
	- **Arguments**
		- `err`: An instance of Error with an additional property 'type' which can be 'read' (cachemere.ERROR_TYPE_READ), 'compress' (cachemere.ERROR_TYPE_COMPRESS) or 'prep' (cachemere.ERROR_TYPE_PREP).
- `error`
	- Emitted when Cachemere encounters an error - These errors don't need to be handled explicitly since Cachemere handles them internally - This event is mostly for logging purposes.
	- **Arguments**
		- `err`: An instance of Error with an additional property 'type' which can be 'read' (cachemere.ERROR_TYPE_READ), 'compress' (cachemere.ERROR_TYPE_COMPRESS) or 'prep' (cachemere.ERROR_TYPE_PREP).

##### Methods

- `init`
	- Resets and initializes Cachemere with an options object.
	- **Parameters**
		- `Object`: (Optional) An options object which Cachemere will use to configure itself.
		The options object can have the following properties:
			- `compress`: (Optional) A boolean which indicates whether or not to use GZIP compression. Defaults to true.
			- `useETags`: (Optional) A boolean which indicates whether or not to use ETags. ETag values are based on file content hash. Defaults to true.
			- `ignoreQueryString`: (Optional) A boolean which indicates whether or not to remove query strings from URLs before doing any processing. Defaults to true.
			- `mapper`: (Optional) A function which maps any given URL to a path on the file system. The default mapper interprets URLs as paths relative to the application's main file.
			- `cacheFilter`: (Optional) A function which decides whether a resource is cachable. Accepts a URL as argument. Return true to allow the URL to be cached and false to not cache it.
			- `maxSize`: (Optional) An integer which indicates the total maximum size of the server cache in bytes. Cachemere will automatically clear least-accessed resources from cache in order to meet the maxSize requirement. Defaults to 1000000000 (1GB).
			- `maxEntrySize`: (Optional) An integer which indicates the maximum size of a single cache entry in bytes. If a file exceeds this size, it will not be cached. Defaults to 10000000 (10MB).
			
- `fetch`
	- Fetches a file from cache or from the file system if not already cached. The act of fetching the file for the first time will cause Cachemere to cache it and watch that file for any changes.
	- **Parameters**
		- `http.IncomingMessage`: An HTTP request object (like the 'req' object passed to a HTTP request handler).
		- `Function`: A callback in the form function(err, resource) - The second argument is a cachemere.Resource object. The resource object can be manipulated and it can be output to a HTTP response. See the documentation about the Resource class below.
		If an err is present, it will be of type Error but with an added 'type' property which gives you details about the stage of caching in which the error occurred (read, preprocess or compress).

- `set`
	- Associates a URL with some content (string or Buffer) - When fetch is called on that URL, the content specified here will be served - Cachemere will not touch the file system.
	- **Parameters**
		- `url`: The URL on which to serve the specified content
		- `content`: A string or Buffer
		- `mime`: The mime type of the content
		
- `setPrepProvider`
	- Allows you to specify an optional preprocessor provider. If no prep provider is set, then Cachemere will not preprocess any of your files' contents before caching them.
	- **Parameters**
		- `Function`: A function which takes a URL as argument and returns a preprocessor function which will be used by Cachemere to preprocess that file's content. To skip preprocessing for a particular URL, this function should return a boolean true or false.
		Returning false signifies that the file should be streamed directly from disk. Returning true will cause Cachemere to buffer the file's contents before sending it out).
		A preprocessor function is in the form function(resourceData) - Where resourceData is an object with a url, path and content property. The content represent's the files content as a Buffer. The preprocessor function can return either a string or a Buffer.
		The returned value will be cached as the file's preprocessed content.

	**Example:**

	```js
	var textFileRegex = /\.txt$/;

	var textPrep = function (resource) {
		// Note that resource.content is a Buffer not a string
		var data = resource.content.toString().replace(/[.]/g, '!');
		return data;
	};

	cachemere.setPrepProvider(function (url) {
		// Only preprocess files with .txt extension, the others will be streamed from Disk (unless they are already cached).
		if (textFileRegex.test(url)) {
			return textPrep;
		}
		return false;
	});
	```

- `getPrepProvider`
	- Returns the preprocessor provider which is currently active.

	
#### Resource

A resource object is a representation of a resource on disk or in cache.
This resource can be output directly to an HTTP response object.
Note that you can manipulate any of the properties of a Resource before outputting it to a response in order to customize the behaviour.

##### Properties

- `status` _(Number)_: The status of the HTTP response associated with this resource.
- `headers` _(Object)_: An object representing headers which will be sent along with this resource's content. Feel free to add additional headers as required.
- `content` _(ReadableStream|Buffer)_: The resource's content as a readable stream or Buffer (depending on whether it should be streamed directly from the file system *miss* or served from cache *hit*).

##### Methods

- `output`
	- Automatically writes the resource's content and any associated headers to the HTTP response object.
	- **Parameters**
		- `http.ServerResponse`: A response object to output the resource's data to (status, headers and content will be sent).