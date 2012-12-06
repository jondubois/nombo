/*
	A function to facilitate multiple inheritance in JavaScript.
	Author: JF Gros-Dubois
*/

var nmix = function(MainClass) {
	var proto = MainClass.prototype;
	proto.__internalMixinMethods = {};
	
	proto.initMixin = function(MixinClass) {
		var args = Array.prototype.slice.call(arguments, 1);
		
		if(args) {
			MixinClass.apply(this, args);
		} else {
			MixinClass.apply(this);
		}
		
		var mixinInstance = {};
		proto.__internalMixinMethods[MixinClass] = mixinInstance;
		
		var i, value;
		for(i in this) {
			value = this[i];
			if(value instanceof Function) {
				mixinInstance[i] = value;
			}
		}
	}
	
	proto.callMixinMethod = function(MixinClass, method) {
		var args = Array.prototype.slice.call(arguments, 2);
		if(args) {
			return proto.__internalMixinMethods[MixinClass][method].apply(this, args);
		} else {
			return proto.__internalMixinMethods[MixinClass][method].apply(this);
		}
	}
	
	proto.applyMixinMethod = function(MixinClass, method, args) {
		if(args && !(args instanceof Array)) {
			throw 'Exception: The args parameter of the applyMixinMethod function must be an Array';
		}
		return proto.__internalMixinMethods[MixinClass][method].apply(this, args);
	}
	
	proto.instanceOf = function(classReference) {
		return this instanceof classReference || proto.__internalMixinMethods.hasOwnProperty(classReference);
	}
	
	return MainClass;
}

if(typeof module != 'undefined') {
	module.exports = nmix;
}