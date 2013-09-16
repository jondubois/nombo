# requireify

Browserify v2 transform to allow access to all modules from browser console

## Usage

Install requireify locally to your project:

    npm install requireify --save-dev


Then use it as Browserify transform module with `-t`:

    browserify --insert-globals --require --transform requireify main.js > bundle.js

Now, inside your browser console, you can look up every module on the global require

    >> require['foo/dep.js']
  

