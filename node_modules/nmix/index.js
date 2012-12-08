/*
	A function to facilitate multiple inheritance in JavaScript.
	Author: JF Gros-Dubois
*/

var nmix = function(MainClass) {
	var proto = MainClass.prototype;
	proto.__internalMixinMethods = {};
	
	proto.initMixin = function(MixinClass) {
		var args = Array.prototype.slice.call(arguments, 1);
		var i, value;
		
		var protoClone = {};
		for(i in proto) {
			protoClone[i] = proto[i];
		}
		
		for(i in MixinClass.prototype) {
			this[i] = MixinClass.prototype[i];
		}
		
		// Using different calls for browser compatibility reasons
		if(args) {
			MixinClass.apply(this, args);
		} else {
			MixinClass.apply(this);
		}
		
		var mixinMethods = {};
		
		for(i in this) {
			value = this[i];
			if(value instanceof Function) {
				mixinMethods[i] = value;
			}
		}
		
		for(i in protoClone) {
			value = protoClone[i];
			if(i != '__internalMixinMethods') {
				this[i] = value;
			}
		}
		
		this.__internalMixinMethods[MixinClass] = mixinMethods;
	}
	
	proto.callMixinMethod = function(MixinClass, method) {
		var args = Array.prototype.slice.call(arguments, 2);
		if(args) {
			return this.__internalMixinMethods[MixinClass][method].apply(this, args);
		} else {
			return this.__internalMixinMethods[MixinClass][method].apply(this);
		}
	}
	
	proto.applyMixinMethod = function(MixinClass, method, args) {
		if(args && !(args instanceof Array)) {
			throw 'Exception: The args parameter of the applyMixinMethod function must be an Array';
		}
		return this.__internalMixinMethods[MixinClass][method].apply(this, args);
	}
	
	proto.instanceOf = function(classReference) {
		return this instanceof classReference || this.__internalMixinMethods.hasOwnProperty(classReference);
	}
	
	return MainClass;
}

if(typeof module != 'undefined') {
	module.exports = nmix;
}
