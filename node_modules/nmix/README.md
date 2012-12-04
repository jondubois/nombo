nmix
====

A simple mixin module which facilitates multiple inheritance in JavaScript.

## Installation

```bash
npm install nmix
```

## Example Usage

```js
var nmix = require('nmix');

var Apple = function(adjective) {
	this.info = function() {
		return 'a ' + adjective + ' apple';
	}
	this.crunch = function() {
		return 'CRUNCH CRUNCH CRUNCH!';
	}
}

var Banana = function() {
	this.info = function(size) {
		return 'a ' + size + ' banana';
	}
	this.splat = function() {
		return 'SPLAT!';
	}
}

var FruitSalad = nmix(function(appleColor) {
	this.initMixin(Apple, appleColor);
	this.initMixin(Banana);
	
	this.info = function() {
		var appleInfo = this.callMixinMethod(Apple, 'info');
		var bananaInfo = this.callMixinMethod(Banana, 'info', 'big');
		var str = 'A fruit salad containing ' + appleInfo + ' and ' + bananaInfo;
		return str;
	}
});

var ImprovedFruitSalad = nmix(function() {
	this.initMixin(FruitSalad, 'red');
	
	this.info = function() {
		var str = this.callMixinMethod(FruitSalad, 'info') + ' - An improved version';
		return str;
	}
});

var fruitSalad = new FruitSalad('green');
console.log(fruitSalad.splat()); // outputs 'SPLAT!'
console.log(fruitSalad.crunch()); // 'CRUNCH CRUNCH CRUNCH!'
console.log(fruitSalad.info()); // 'A fruit salad containing a green apple and a big banana'

console.log();

var improvedFruitSalad = new ImprovedFruitSalad();
console.log(improvedFruitSalad.info()); // 'A fruit salad containing a red apple and a big banana - An improved version'
```