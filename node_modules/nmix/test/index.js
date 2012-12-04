var nmix = require('../');

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
console.log(fruitSalad.splat());
console.log(fruitSalad.crunch());
console.log(fruitSalad.info());

console.log();

var improvedFruitSalad = new ImprovedFruitSalad();
console.log(improvedFruitSalad.info());