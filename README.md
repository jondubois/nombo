# requireify

Browserify v2 transform to allow access to all modules from browser console

## Usage

Install requireify locally to your project:

    npm install requireify --save-dev


Then use it as Browserify transform module with `-t`:

    browserify --transform requireify main.js > bundle.js



```javascript
// /index.js
exports = module.exports = {
  hello: 'world'
};
  
// /foo/dep.js

var dep = require('./foo/dep');
console.log(dep.hello); // world
```

Now, inside your browser console, you can look up every module on the global require

    >> var hello = require('/foo/dep').hello;
    >> console.log(hello); // world
