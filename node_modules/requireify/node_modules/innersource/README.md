# innersource

Returns inner source (the body) of a function as a string.

## Install

```shell
$ npm install innersource
```

## Usage

```javascript
var innersource = require('innersource');

function test1() {
  console.log('hello');
}

console.log(innersource(test1)); //  console.log('hello');
```

## Test

```shell
$ npm test
```
