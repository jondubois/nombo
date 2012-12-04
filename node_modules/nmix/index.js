var nmix = function(mainClass) {
	var mixinHolder = function() {
		this.__internalMixinMethods = {};
		
		this.initMixin = function(MixinClass) {
			var args = Array.prototype.slice.call(arguments, 1);
			
			if(args) {
				MixinClass.apply(this, args);
			} else {
				MixinClass.apply(this);
			}
			
			var mixedInInstance = {};
			this.__internalMixinMethods[MixinClass] = mixedInInstance;
			
			var value, index;
			for(index in this) {
				value = this[index];
				if(value instanceof Function) {
					mixedInInstance[index] = value;
				}
			}
		}
		
		this.callMixinMethod = function(MixinClass, method) {
			var args = Array.prototype.slice.call(arguments, 2);
			if(args) {
				return this.__internalMixinMethods[MixinClass][method].apply(this, args);
			} else {
				return this.__internalMixinMethods[MixinClass][method].apply(this);
			}
		}
		
		this.applyMixinMethod = function(MixinClass, method, args) {
			if(args && !(args instanceof Array)) {
				throw 'Exception: The args parameter of the applyMixinMethod function must be an Array';
			}
			return this.__internalMixinMethods[MixinClass][method].apply(this, args);
		}
		
		this.instanceOf = function(classReference) {
			return this instanceof classReference || this.__internalMixinMethods.hasOwnProperty(classReference);
		}
	}
	mixinHolder.apply(mainClass.prototype);
	
	return mainClass;
}

if(typeof module != 'undefined') {
	module.exports = nmix;
}