/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
// lib/handlebars/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1] 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]) 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]) 
break;
case 4: this.$ = new yy.ProgramNode([]) 
break;
case 5: this.$ = [$$[$0]] 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 9: this.$ = $$[$0] 
break;
case 10: this.$ = $$[$0] 
break;
case 11: this.$ = new yy.ContentNode($$[$0]) 
break;
case 12: this.$ = new yy.CommentNode($$[$0]) 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 15: this.$ = $$[$0-1] 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true) 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]) 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]) 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]] 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null] 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]] 
break;
case 24: this.$ = [[$$[$0]], null] 
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 26: this.$ = [$$[$0]] 
break;
case 27: this.$ = $$[$0] 
break;
case 28: this.$ = new yy.StringNode($$[$0]) 
break;
case 29: this.$ = new yy.IntegerNode($$[$0]) 
break;
case 30: this.$ = new yy.BooleanNode($$[$0]) 
break;
case 31: this.$ = new yy.HashNode($$[$0]) 
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 33: this.$ = [$$[$0]] 
break;
case 34: this.$ = [$$[$0-2], $$[$0]] 
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])] 
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])] 
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])] 
break;
case 38: this.$ = new yy.IdNode($$[$0]) 
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 40: this.$ = [$$[$0]] 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: this.begin("mu"); if (yy_.yytext) return 14; 
break;
case 1: return 14; 
break;
case 2: return 24; 
break;
case 3: return 16; 
break;
case 4: return 20; 
break;
case 5: return 19; 
break;
case 6: return 19; 
break;
case 7: return 23; 
break;
case 8: return 23; 
break;
case 9: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.begin("INITIAL"); return 15; 
break;
case 10: return 22; 
break;
case 11: return 34; 
break;
case 12: return 33; 
break;
case 13: return 33; 
break;
case 14: return 36; 
break;
case 15: /*ignore whitespace*/ 
break;
case 16: this.begin("INITIAL"); return 18; 
break;
case 17: this.begin("INITIAL"); return 18; 
break;
case 18: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28; 
break;
case 19: return 30; 
break;
case 20: return 30; 
break;
case 21: return 29; 
break;
case 22: return 33; 
break;
case 23: return 'INVALID'; 
break;
case 24: return 5; 
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s/.])/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"inclusive":false},"INITIAL":{"rules":[0,1,24],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();

// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.2";

Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, fn, inverse) {
  inverse = inverse || function() {};

  var ret = "";
  var type = Object.prototype.toString.call(context);

  if(type === "[object Function]") {
    context = context();
  }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
}, function(context, fn) {
  return fn(context);
});

Handlebars.registerHelper('each', function(context, fn, inverse) {
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, fn, inverse) {
  if(!context || context == []) {
    return inverse(this);
  } else {
    return fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, fn, inverse) {
  return Handlebars.helpers['if'].call(this, context, inverse, fn);
});

Handlebars.registerHelper('with', function(context, fn) {
  return fn(context);
});

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { continue; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(boolean) {
    this.type = "BOOLEAN";
    this.boolean = boolean;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/visitor.js

Handlebars.Visitor = function() {};

Handlebars.Visitor.prototype = {
  accept: function(object) {
    return this[object.type](object);
  }
};;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  this.message = message;
};

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;"
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    invokeInverse: 14,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 1,
    lookup: 1,
    invokeMustache: 2,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 2,
    invokePartial: 1,
    push: 1,
    invokeInverse: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options || {};
      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      this.ID(block.mustache.id);
      var programGuid = this.compileProgram(block.program);

      this.opcode('invokeInverse', programGuid);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'context');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original);

      if(mustache.escaped) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('push', integer.integer);
    },

    BOOLEAN: function(boolean) {
      this.opcode('push', boolean.boolean);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('push', '{}');
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if(JavaScriptCompiler.RESERVED_WORDS[name] || name.indexOf('-') !== -1 || !isNaN(name)) {
        return parent + "['" + name + "']";
      } else if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else {
        return parent + "." + name;
      }
    },

    appendToBuffer: function(string) {
      return "buffer = buffer + " + string + ";";
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },
    // END PUBLIC API

    compile: function(environment, options) {
      this.environment = environment;
      this.options = options || {};

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = {list: []};

      this.compileChildren(environment, options);

      Handlebars.log(Handlebars.logger.DEBUG, environment.disassemble() + "\n\n");

      var opcodes = environment.opcodes, opcode, name, declareName, declareVal;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunction();
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];
      out.push("var buffer = " + this.initializeBuffer() + ", currentContext = context");

      var copies = "helpers = helpers || Handlebars.helpers;";
      if(this.environment.usePartial) { copies = copies + " partials = partials || Handlebars.partials;"; }
      out.push(copies);

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunction: function() {
      var container = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(i, helpers, partials, data) {
          var programWrapper = this.programs[i];
          if(data) {
            return Handlebars.VM.program(this.children[i], helpers, partials, data);
          } else if(programWrapper) {
            return programWrapper;
          } else {
            programWrapper = this.programs[i] = Handlebars.VM.program(this.children[i], helpers, partials);
            return programWrapper;
          }
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[0] = this.source[0] + ", " + locals.join(", ");
      }

      this.source[0] = this.source[0] + ";";

      this.source.push("return buffer;");

      var params = ["Handlebars", "context", "helpers", "partials"];

      if(this.options.data) { params.push("data"); }

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if(params.length === 4 && !this.environment.usePartial) { params.pop(); }

      params.push(this.source.join("\n"));

      var fn = Function.apply(this, params);
      fn.displayName = "Handlebars.js";

      Handlebars.log(Handlebars.logger.DEBUG, fn.toString() + "\n\n");

      container.render = fn;

      container.children = this.environment.children;

      return function(context, options, $depth) {
        try {
          options = options || {};
          var args = [Handlebars, context, options.helpers, options.partials, options.data];
          var depth = Array.prototype.slice.call(arguments, 2);
          args = args.concat(depth);
          return container.render.apply(container, args);
        } catch(e) {
          throw e;
        }
      };
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("this.escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;

        if(depth === 0) {
          this.source.push("currentContext = context;");
        } else {
          this.source.push("currentContext = depth" + depth + ";");
        }
      }
    },

    lookupWithHelpers: function(name) {
      if(name) {
        var topStack = this.nextStack();

        var toPush =  "if('" + name + "' in helpers) { " + topStack +
                      " = " + this.nameLookup('helpers', name, 'helper') +
                      "; } else { " + topStack + " = " +
                      this.nameLookup('currentContext', name, 'context') +
                      "; }";

        this.source.push(toPush);
      } else {
        this.pushStack("currentContext");
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = " + this.nameLookup(topStack, name, 'context') + ";");
    },

    pushStringParam: function(string) {
      this.pushStack("currentContext");
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, function(nextStack, helperMissingString, id) {
        this.source.push("else if(" + id + "=== undefined) { " + nextStack + " = helpers.helperMissing.call(" + helperMissingString + "); }");
        this.source.push("else { " + nextStack + " = " + id + "; }");
      });
    },

    invokeProgram: function(guid, paramSize) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, function(nextStack, helperMissingString, id) {
        this.source.push("else { " + nextStack + " = helpers.blockHelperMissing.call(" + helperMissingString + "); }");
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, fn) {
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam;

      var hash = this.popStack();

      this.register('tmp1', program);
      this.source.push('tmp1.hash = ' + hash + ';');

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push('tmp1');

      // TODO: This is legacy behavior. Deprecate and remove.
      if(inverse) {
        params.push(inverse);
      }

      this.populateCall(params, id, helperId || id, fn);
    },

    populateCall: function(params, id, helperId, fn) {
      var paramString = ["context"].concat(params).join(", ");
      var helperMissingString = ["context"].concat(helperId).concat(params).join(", ");

      nextStack = this.nextStack();

      this.source.push("if(typeof " + id + " === 'function') { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      fn.call(this, nextStack, helperMissingString, id);
    },

    invokeInverse: function(guid) {
      var program = this.programExpression(guid);

      var blockMissingParams = ["context", this.topStack(), "this.noop", program];
      this.pushStack("helpers.blockHelperMissing.call(" + blockMissingParams.join(", ") + ")");
    },

    invokePartial: function(context) {
      this.pushStack("this.invokePartial(" + this.nameLookup('partials', context, 'partial') + ", '" + context + "', " + this.popStack() + ", helpers, partials);");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;
      var compiled = [];

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        compiled[i] = compiler.compile(child, options);
      }

      environment.rawChildren = children;
      environment.children = compiled;
    },

    programExpression: function(guid) {
      if(guid == null) { return "this.noop"; }

      var programParams = [guid, "helpers", "partials"];

      var depths = this.environment.rawChildren[guid].depths.list;

      if(this.options.data) { programParams.push("data"); }

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("context"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(!this.environment.usePartial) {
        if(programParams[3]) {
          programParams[2] = "null";
        } else {
          programParams.pop();
        }
      }

      if(depths.length === 0) {
        return "this.program(" + programParams.join(", ") + ")";
      } else {
        programParams[0] = "this.children[" + guid + "]";
        return "this.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = ("break case catch continue default delete do else finally " +
                       "for function if in instanceof new return switch this throw " + 
                       "try typeof var void while with null true false").split(" ");

  compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.VM = {
  programWithDepth: function(fn, helpers, partials, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 4);

    return function(context, options) {
      options = options || {};

      options = {
        helpers: options.helpers || helpers,
        partials: options.partials || partials,
        data: options.data || data
      };

      return fn.apply(this, [context, options].concat(args));
    };
  },
  program: function(fn, helpers, partials, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, {
        helpers: options.helpers || helpers,
        partials: options.partials || partials,
        data: options.data || data
      });
    };
  },
  noop: function() { return ""; },
  compile: function(string, options) {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    return new Handlebars.JavaScriptCompiler().compile(environment, options);
  },
  invokePartial: function(partial, name, context, helpers, partials) {
    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, {helpers: helpers, partials: partials});
    } else {
      partials[name] = Handlebars.VM.compile(partial);
      return partials[name](context, {helpers: helpers, partials: partials});
    }
  }
};

Handlebars.compile = Handlebars.VM.compile;

try {
	module.exports = Handlebars;
} catch(e) {}

var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());
try {
	module.exports = JSON;
} catch(e) {}

/**
	This script provides the core client-side functionality of nCombo.
*/
var $n = {
	MAX_ID: Math.pow(2, 53) - 2,
	socketIO: null,
	_wsEndpoint: null,
	_timeout: 10000,
	_appURL: null,
	_curID: 1,
	_callTracker: {},
	_frameworkURL: null,
	_jsLibsURL: null,
	_frameworkStylesURL: null,
	_scriptsRouterURL: null,
	_appScriptsURL: null,
	_appStylesURL: null,
	_appAssetsURL: null,
	_appFilesURL: null,
	_cacheSeverCalls: false,
	_cacheVersion: null,
	_callbacks: {},
	_releaseMode: false,
	
	initIO: function() {
		$n.socketIO = NCOMBO_SOCKET;
		if($n.socketIO) {
			$n.socketIO.on('return', $n._callReturn);
			$n.socketIO.on('event', $n._eventReceived);
		}
	},
    
	init: function(appDefinition) {
		$n._frameworkURL = appDefinition.frameworkURL;
		$n._appURL = appDefinition.appURL;
		$n._jsLibsURL = appDefinition.jsLibsURL;
		$n._frameworkStylesURL = appDefinition.frameworkStylesURL;
		$n._scriptsRouterURL = location.href.replace(/\?.*/, '');
		$n._appScriptsURL = appDefinition.appScriptsURL;
		$n._appStylesURL = appDefinition.appStylesURL;
		$n._appAssetsURL = appDefinition.appAssetsURL;
		$n._appFilesURL = appDefinition.appFilesURL;
		$n._wsEndpoint = appDefinition.wsEndpoint;
		$n._releaseMode = appDefinition.releaseMode;
		$n._timeout = appDefinition.timeout;
		
		// global variables from session.js
		$n._autoSession = NCOMBO_AUTO_SESSION;
		$n._cacheVersion = NCOMBO_CACHE_VERSION;
		
		$n.initIO();
		
		$n.local.init();
	},
	
	session: {
		start: function() {
			var data = null;
			var callback = null;
			if(arguments[0] instanceof Function) {
				callback = arguments[0];
			} else {
				data = arguments[0];
				callback = arguments[1];
			}
			NCOMBO_SESSION_MANAGER.startSession(data, function(err, ssid) {
				$n.initIO();
				if(callback) {
					callback(err, ssid);
				}
			});
		},
		
		end: function(callback) {
			NCOMBO_SESSION_MANAGER.endSession(callback);
		}
	},
	
	_genID: function() {
		$n._curID++;
		$n._curID = $n._curID % $n.MAX_ID;
		return 'l' + $n._curID;
	},
	
	_globalEval: $loader.grab._globalEval,
	
	/**
		Convert a class (function) into a mixin-extendable class. This will give the class internal access to an
		initMixin(MixinClass, args) method and a callMixinMethod(MixinClass, method, arg1, ...argn) which will allow the current
		class to manipulate base mixins.
	*/
	mixin: $loader.mixin,
	
	EventEmitter: $loader.EventEmitter,
	
	getBasicType: function(variable) {
		var classType = {}.toString
		var typeRegex = /[^0-9A-Za-z]*([A-Z][a-zA-Z0-9]*)/;
		var typeString = classType.call(variable);
		return typeString.match(typeRegex)[1];
	},
	
	/**
		Bind a callback function to nCombo's ready event. The specified function will be called when nCombo is ready to begin processing.
	*/
	ready: $loader.grab.ready,
	
	/**
		Bind a callback function to nCombo's fail event. The specified function will be called when nCombo fails to load a resource.
		The callback can accept a parameter which indicates the URL of the resource which failed to load.
	*/
	fail:  $loader.grab.fail,
	
	/**
		This object holds error functions to handle various client-side error types that can occur within the system.
		Each function handles a specific type of error and can accept any suitable number of parameters
		in order to generate the appropriate error message.
	*/
	errors: {
		serverInterfaceError: function(message) {
			return "ServerInterfaceError: " + message;
		},
		
		loadError: function(resourceURL) {
			return "LoadError: Failed to load resource: " + resourceURL;
		}
	},
	
	/**
		Get the URL of nCombo's root directory.
	*/
	getRootURL: function() {
		return $n._frameworkURL;
	},
	
	/**
		Navigate to another script.
	*/
	navigateToScript: function(scriptName) {
		location.href = $n._scriptsRouterURL + (scriptName ? "?" + scriptName : "");
	},
	
	caching: {
		/**
			Enable/disable default caching for server interface AJAX calls performed by nCombo.
			Server call caching is disabled by default.
		*/
		cacheServerCalls: function(bool) {
			$n._cacheSeverCalls = bool;
		}
	},
	
	/**
		Grab allows you to include external scripts, CSS stylesheets and templates into your JavaScript.
		Some grab methods allow you to load resources either synchronously or asynchronously.
	*/
	grab: $loader.grab,
	
	serverInterfaceDescription: {},
	
	_callReturn: function(data) {
		var id = data.id;
		if($n._callTracker[id]) {
			if($n._callTracker[id].timeout) {
				clearTimeout($n._callTracker[id].timeout);
			}
			if(!data.noValue && $n._callTracker[id].callback) {
				var finish = data.close ? true : false;
				$n._callTracker[id].callback(data.error, data.value, finish);
			}
			if(data.close) {
				delete $n._callTracker[id];
			}
		}
	},
	
	trackRequest: function(id, callback) {
		$n._callTracker[id] = {callback: callback};
	},
	
	_eventReceived: function(event) {
		if(event.remote) {
			$n.remote(event.host, event.port, event.secure, event.wsEndpoint).ns(event.ns)._triggerWatchers(event.event, event.data);
		} else {
			$n.local.ns(event.ns)._triggerWatchers(event.event, event.data);
		}
	},
	
	_asRemoteClientURL: function(host, port, secure, wsEndpoint) {
		return (secure ? 'https://' : 'http://') + host + ":" + port + wsEndpoint;
	},
	
	_remoteClientMap: {}
};

$n.NS = function(namespace, wsSocket) {
	var self = this;
	self._namespace = namespace;
	self.socketIO = wsSocket;
	self._serverWatchMap = {};
	
	self.watch = function(event, handler, ackCallback) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to watch local event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
		
		var id = $n._genID();
		if(!self._serverWatchMap.hasOwnProperty(event)) {
			self._serverWatchMap[event] = [];
		}
		self._serverWatchMap[event].push(handler);
		
		var ackHandler = function(err) {
			if(err) {
				delete self._serverWatchMap[event];
			}
			cb(err);
		}
		
		var request = {
			id: id,
			ns: self._namespace,
			event: event
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(id, ackHandler);
			$n.socketIO.emit('watchLocal', request);
		} else {
			cb();
		}
	}
	
	self.unwatch = function(event, handler, ackCallback) {
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to unwatch local event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
		
		var i;
		var id = $n._genID();
		var unwatchRequest = {id: id, requests: []};
		
		if(!event) {
			for(i in self._serverWatchMap) {
				unwatchRequest.requests.push({ns: self._namespace, event: i});
			}
			self._serverWatchMap = {};
			if(unwatchRequest.requests.length > 0) {
				$n.trackRequest(id, cb);
				self.socketIO.emit('unwatchLocal', unwatchRequest);
			} else {
				cb();
			}
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				unwatchRequest.requests.push({ns: self._namespace, event: event});
				delete self._serverWatchMap[event];
				if(unwatchRequest.requests.length > 0) {
					$n.trackRequest(id, cb);
					self.socketIO.emit('unwatchLocal', unwatchRequest);
				} else {
					cb();
				}
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					if(element == handler) {
						unwatchRequest.requests.push({ns: self._namespace, event: event});
						return false;
					}
					return true;
				});
				if(unwatchRequest.requests.length > 0 && self._serverWatchMap[event].length < 1) {
					$n.trackRequest(id, cb);
					self.socketIO.emit('unwatchLocal', unwatchRequest);
				} else {
					cb();
				}
			}
		}
	}
	
	self._getWatcher = function(event, handler) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		if(self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				if(watchers[i] == handler) {
					return watchers[i];
				}
			}
		}
		return null;
	}
	
	self.isWatching = function(event, handler) {
		return self._getWatcher(event, handler) ? true : false;
	}
	
	self._triggerWatchers = function(event, data) {
		if(self._serverWatchMap && self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				watchers[i].call(null, data);
			}
		}
	}
}

$n.RemoteNS = function(host, port, secure, wsEndpoint, namespace, wsSocket) {
	var self = this;
	self._namespace = namespace;
	self.socketIO = wsSocket;
	self._serverWatchMap = {};
	
	self.watch = function(event, handler, ackCallback) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to watch remote event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
		
		var id = $n._genID();
		
		if(!self._serverWatchMap.hasOwnProperty(event)) {
			self._serverWatchMap[event] = [];
		}
		
		self._serverWatchMap[event].push(handler);
		
		var ackHandler = function(err) {
			if(err) {
				delete self._serverWatchMap[event];
			}
			cb(err);
		}
		
		var request = {
			id: id,
			remote: true,
			host: host,
			port: port,
			secure: secure,
			wsEndpoint: wsEndpoint,
			ns: self._namespace,
			event: event
		};
		
		if(self._serverWatchMap[event].length < 2) {
			$n.trackRequest(id, ackHandler);
			self.socketIO.emit('watchRemote', request);
		} else {
			cb();
		}
	}
	
	self.unwatch = function(event, handler, ackCallback) {
		var ackCalled = false;
		var timeout = setTimeout(function() {
			if(!ackCalled && ackCallback) {
				ackCallback('Failed to watch remote event');
				ackCalled = true;
			}
		}, $n._timeout);
		
		var cb = function(err) {
			clearTimeout(timeout);
			if(!ackCalled && ackCallback) {
				ackCallback(err);
				ackCalled = true;
			}
		}
	
		var i;
		var id = $n._genID();
		var unwatchRequest = {id: id, requests: []};
		
		if(!event) {
			for(i in self._serverWatchMap) {
				unwatchRequest.requests.push({
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					ns: self._namespace,
					event: i
				});
			}
			self._serverWatchMap = {};
			if(unwatchRequest.requests.length > 0) {
				$n.trackRequest(id, cb);
				self.socketIO.emit('unwatchRemote', unwatchRequest);
			} else {
				cb()
			}
		} else if(!handler) {
			if(self._serverWatchMap[event]) {
				unwatchRequest.requests.push({
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					ns: self._namespace,
					event: event
				});
				delete self._serverWatchMap[event];
				if(unwatchRequest.requests.length > 0) {
					$n.trackRequest(id, cb);
					self.socketIO.emit('unwatchRemote', unwatchRequest);
				} else {
					cb();
				}
			}
		} else {
			if(self._serverWatchMap[event]) {
				self._serverWatchMap[event] = $.grep(self._serverWatchMap[event], function(element, index) {
					if(element == handler) {
						unwatchRequest.requests.push({
							remote: true,
							host: host,
							port: port,
							secure: secure,
							wsEndpoint: wsEndpoint,
							ns: self._namespace,
							event: event
						});
						
						return false;
					}
					return true;
				});
				if(unwatchRequest.requests.length > 0 && self._serverWatchMap[event].length < 1) {
					$n.trackRequest(id, cb);
					self.socketIO.emit('unwatchRemote', unwatchRequest);
				} else {
					cb();
				}
			}
		}
	}
	
	self._getWatcher = function(event, handler) {
		if(!event || !handler) {
			throw "Exception: One or more required parameters were undefined";
		}
		
		if(self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				if(watchers[i] == handler) {
					return watchers[i];
				}
			}
		}
		return null;
	}
	
	self.isWatching = function(event, handler) {
		return self._getWatcher(event, handler) ? true : false;
	}
	
	self._triggerWatchers = function(event, data) {
		if(self._serverWatchMap && self._serverWatchMap[event]) {
			var watchers = self._serverWatchMap[event];
			var len = watchers.length;
			var i;
			for(i=0; i<len; i++) {
				watchers[i].call(null, data);
			}
		}
	}
}

$n.remote = function(host, port, secure, wsEndpoint) {
	if(!wsEndpoint) {
		wsEndpoint = $n._wsEndpoint;
	}
	
	secure = secure || false;
	
	var url = $n._asRemoteClientURL(host, port, secure, wsEndpoint);
	
	if(!$n._remoteClientMap.hasOwnProperty(url)) {
		$n._remoteClientMap[url] = new (function(host, port, secure, wsEndpoint) {
			var self = this;
			self._namespaces = {};
			
			self.ns = function(namespace) {
				if(!self._namespaces[namespace]) {
					self._namespaces[namespace] = new $n.RemoteNS(host, port, secure, wsEndpoint, namespace, $n.socketIO);
				}
				return self._namespaces[namespace];
			}
			
			self._mainNamespace = self.ns('__main');
			
			self.exec = function() {
				var serverInterface = arguments[0];
				var method = arguments[1];
				var id = $n._genID();
				var callback = null;
				var timeout = null;
				
				var request = {
					id: id,
					remote: true,
					host: host,
					port: port,
					secure: secure,
					wsEndpoint: wsEndpoint,
					sim: serverInterface,
					method: method
				};
				
				if(arguments[3]) {
					request.data = arguments[2];
					callback = arguments[3];
				} else if(arguments[2] !== undefined) {
					if(arguments[2] instanceof Function) {
						callback = arguments[2];
					} else {
						request.data = arguments[2];
					}
				}
				if(callback) {
					timeout = setTimeout(function() {
						if($n._callTracker[id]) {
							delete $n._callTracker[id];
						}
						if(callback) {
							callback('Remote exec call timed out', null, true);
						}
					}, $n._timeout);
				}
				
				$n._callTracker[id] = {callback: callback, timeout: timeout};
				
				$n.socketIO.emit('remoteCall', request);
			}
			
			self.watch = function() {
				self._mainNamespace.watch.apply(null, arguments);
			}
			
			self.unwatch = function() {
				self._mainNamespace.unwatch.apply(null, arguments);
			}
		})(host, port, secure, wsEndpoint);
	}
	
	return $n._remoteClientMap[url];
}
	
$n.local = new (function($n) {
	var self = this;
	self._namespaces = {};
	self._mainNamespace = null;
	
	self.ns = function(namespace) {
		if(!self._namespaces[namespace]) {
			self._namespaces[namespace] = new $n.NS(namespace, $n.socketIO);
		}
		return self._namespaces[namespace];
	}
	
	self.init = function() {
		self._mainNamespace = self.ns('__main');
	}
	
	self.exec = function() {
		var serverInterface = arguments[0];
		var method = arguments[1];
		var id = $n._genID();
		var callback = null;
		var timeout = null;
		
		var request = {
			id: id,
			sim: serverInterface,
			method: method
		};
		
		if(arguments[3]) {
			request.data = arguments[2];
			callback = arguments[3];
		} else if(arguments[2] !== undefined) {
			if(arguments[2] instanceof Function) {
				callback = arguments[2];
			} else {
				request.data = arguments[2];
			}
		}
		if(callback) {
			timeout = setTimeout(function() {
				if($n._callTracker[id]) {
					delete $n._callTracker[id];
				}
				if(callback) {
					callback('Local exec call timed out', null, true);
				}
			}, $n._timeout);
		}
		
		$n._callTracker[id] = {callback: callback, timeout: timeout};
		
		$n.socketIO.emit('localCall', request);
	}
	
	self.watch = function() {
		self._mainNamespace.watch.apply(null, arguments);
	}
	
	self.unwatch = function() {
		self._mainNamespace.unwatch.apply(null, arguments);
	}
	
	self.isWatching = function() {
		return self._mainNamespace.isWatching.apply(null, arguments);
	}
})($n);

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item, start) {
		if(!start) {
			start = 0;
		}
		var len = this.length;
		var i;
		for(i=start; i<len; i++) {
			if(this[i] === item) {
				return i;
			}
		}
		return -1;
	}
}
$n.init($loader.getAppDefinition());
/*global setTimeout: false, console: false */(function(){var a={},b=this,c=b.async;typeof module!="undefined"&&module.exports?module.exports=a:b.async=a,a.noConflict=function(){return b.async=c,a};var d=function(a,b){if(a.forEach)return a.forEach(b);for(var c=0;c<a.length;c+=1)b(a[c],c,a)},e=function(a,b){if(a.map)return a.map(b);var c=[];return d(a,function(a,d,e){c.push(b(a,d,e))}),c},f=function(a,b,c){return a.reduce?a.reduce(b,c):(d(a,function(a,d,e){c=b(c,a,d,e)}),c)},g=function(a){if(Object.keys)return Object.keys(a);var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b};typeof process=="undefined"||!process.nextTick?a.nextTick=function(a){setTimeout(a,0)}:a.nextTick=process.nextTick,a.forEach=function(a,b,c){c=c||function(){};if(!a.length)return c();var e=0;d(a,function(d){b(d,function(b){b?(c(b),c=function(){}):(e+=1,e===a.length&&c(null))})})},a.forEachSeries=function(a,b,c){c=c||function(){};if(!a.length)return c();var d=0,e=function(){b(a[d],function(b){b?(c(b),c=function(){}):(d+=1,d===a.length?c(null):e())})};e()},a.forEachLimit=function(a,b,c,d){d=d||function(){};if(!a.length||b<=0)return d();var e=0,f=0,g=0;(function h(){if(e===a.length)return d();while(g<b&&f<a.length)f+=1,g+=1,c(a[f-1],function(b){b?(d(b),d=function(){}):(e+=1,g-=1,e===a.length?d():h())})})()};var h=function(b){return function(){var c=Array.prototype.slice.call(arguments);return b.apply(null,[a.forEach].concat(c))}},i=function(b){return function(){var c=Array.prototype.slice.call(arguments);return b.apply(null,[a.forEachSeries].concat(c))}},j=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c,d){f[a.index]=d,b(c)})},function(a){d(a,f)})};a.map=h(j),a.mapSeries=i(j),a.reduce=function(b,c,d,e){a.forEachSeries(b,function(a,b){d(c,a,function(a,d){c=d,b(a)})},function(a){e(a,c)})},a.inject=a.reduce,a.foldl=a.reduce,a.reduceRight=function(b,c,d,f){var g=e(b,function(a){return a}).reverse();a.reduce(g,c,d,f)},a.foldr=a.reduceRight;var k=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c){c&&f.push(a),b()})},function(a){d(e(f.sort(function(a,b){return a.index-b.index}),function(a){return a.value}))})};a.filter=h(k),a.filterSeries=i(k),a.select=a.filter,a.selectSeries=a.filterSeries;var l=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c){c||f.push(a),b()})},function(a){d(e(f.sort(function(a,b){return a.index-b.index}),function(a){return a.value}))})};a.reject=h(l),a.rejectSeries=i(l);var m=function(a,b,c,d){a(b,function(a,b){c(a,function(c){c?(d(a),d=function(){}):b()})},function(a){d()})};a.detect=h(m),a.detectSeries=i(m),a.some=function(b,c,d){a.forEach(b,function(a,b){c(a,function(a){a&&(d(!0),d=function(){}),b()})},function(a){d(!1)})},a.any=a.some,a.every=function(b,c,d){a.forEach(b,function(a,b){c(a,function(a){a||(d(!1),d=function(){}),b()})},function(a){d(!0)})},a.all=a.every,a.sortBy=function(b,c,d){a.map(b,function(a,b){c(a,function(c,d){c?b(c):b(null,{value:a,criteria:d})})},function(a,b){if(a)return d(a);var c=function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0};d(null,e(b.sort(c),function(a){return a.value}))})},a.auto=function(a,b){b=b||function(){};var c=g(a);if(!c.length)return b(null);var e={},h=[],i=function(a){h.unshift(a)},j=function(a){for(var b=0;b<h.length;b+=1)if(h[b]===a){h.splice(b,1);return}},k=function(){d(h.slice(0),function(a){a()})};i(function(){g(e).length===c.length&&(b(null,e),b=function(){})}),d(c,function(c){var d=a[c]instanceof Function?[a[c]]:a[c],g=function(a){if(a)b(a),b=function(){};else{var d=Array.prototype.slice.call(arguments,1);d.length<=1&&(d=d[0]),e[c]=d,k()}},h=d.slice(0,Math.abs(d.length-1))||[],l=function(){return f(h,function(a,b){return a&&e.hasOwnProperty(b)},!0)&&!e.hasOwnProperty(c)};if(l())d[d.length-1](g,e);else{var m=function(){l()&&(j(m),d[d.length-1](g,e))};i(m)}})},a.waterfall=function(b,c){c=c||function(){};if(!b.length)return c();var d=function(b){return function(e){if(e)c(e),c=function(){};else{var f=Array.prototype.slice.call(arguments,1),g=b.next();g?f.push(d(g)):f.push(c),a.nextTick(function(){b.apply(null,f)})}}};d(a.iterator(b))()},a.parallel=function(b,c){c=c||function(){};if(b.constructor===Array)a.map(b,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},c);else{var d={};a.forEach(g(b),function(a,c){b[a](function(b){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),d[a]=e,c(b)})},function(a){c(a,d)})}},a.series=function(b,c){c=c||function(){};if(b.constructor===Array)a.mapSeries(b,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},c);else{var d={};a.forEachSeries(g(b),function(a,c){b[a](function(b){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),d[a]=e,c(b)})},function(a){c(a,d)})}},a.iterator=function(a){var b=function(c){var d=function(){return a.length&&a[c].apply(null,arguments),d.next()};return d.next=function(){return c<a.length-1?b(c+1):null},d};return b(0)},a.apply=function(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b.concat(Array.prototype.slice.call(arguments)))}};var n=function(a,b,c,d){var e=[];a(b,function(a,b){c(a,function(a,c){e=e.concat(c||[]),b(a)})},function(a){d(a,e)})};a.concat=h(n),a.concatSeries=i(n),a.whilst=function(b,c,d){b()?c(function(e){if(e)return d(e);a.whilst(b,c,d)}):d()},a.until=function(b,c,d){b()?d():c(function(e){if(e)return d(e);a.until(b,c,d)})},a.queue=function(b,c){var e=0,f={tasks:[],concurrency:c,saturated:null,empty:null,drain:null,push:function(b,e){b.constructor!==Array&&(b=[b]),d(b,function(b){f.tasks.push({data:b,callback:typeof e=="function"?e:null}),f.saturated&&f.tasks.length==c&&f.saturated(),a.nextTick(f.process)})},process:function(){if(e<f.concurrency&&f.tasks.length){var a=f.tasks.shift();f.empty&&f.tasks.length==0&&f.empty(),e+=1,b(a.data,function(){e-=1,a.callback&&a.callback.apply(a,arguments),f.drain&&f.tasks.length+e==0&&f.drain(),f.process()})}},length:function(){return f.tasks.length},running:function(){return e}};return f};var o=function(a){return function(b){var c=Array.prototype.slice.call(arguments,1);b.apply(null,c.concat([function(b){var c=Array.prototype.slice.call(arguments,1);typeof console!="undefined"&&(b?console.error&&console.error(b):console[a]&&d(c,function(b){console[a](b)}))}]))}};a.log=o("log"),a.dir=o("dir"),a.memoize=function(a,b){var c={},d={};b=b||function(a){return a};var e=function(){var e=Array.prototype.slice.call(arguments),f=e.pop(),g=b.apply(null,e);g in c?f.apply(null,c[g]):g in d?d[g].push(f):(d[g]=[f],a.apply(null,e.concat([function(){c[g]=arguments;var a=d[g];delete d[g];for(var b=0,e=a.length;b<e;b++)a[b].apply(null,arguments)}])))};return e.unmemoized=a,e},a.unmemoize=function(a){return function(){return(a.unmemoized||a).apply(null,arguments)}}})();
$n.mvp = {
	_idCount: 0,
	_rootView: null,
	
	errors: {
		domNotReadyException: function() {
			return 'DOMNotReadyException: The DOM is not ready - Main view cannot be set';
		},
	
		methodNotImplemented: function(object, methodName) {
			return 'MethodNotImplementedException: The ' + methodName + ' method needs to be implemented by the following object: ' + object;
		},
		
		notAddedToDOM: function(componentName, actionName) {
			return 'NotAddedToDOMException: The ' + actionName + ' action cannot be executed because the ' + componentName + ' component has not been added to the DOM';
		},
		
		noParamsSpecified: function() {
			return 'No parameters were specified';
		}
	},
	
	init: function() {
		$n.mvp._rootView = new $n.mvp.View('{{mainView}}');
	},
	
	setMainView: function(view) {
		if(!$n.mvp._rootView) {
			throw $n.mvp.errors.domNotReadyException();
		}
		
		$(document.body).html($n.mvp._rootView.toString());
		$n.mvp._rootView.setContent('mainView', view);
	},
	
	getMainView: function() {
		return $n.mvp._rootView.getContent('mainView');
	},
	
	generateID: function() {
		return $n.mvp._idCount++;
	},
	
	Area: function(parentView, areaName) {
		var self = this;
		self._parentView = parentView;
		self._areaName = areaName;
		
		self.setContent = function(view) {
			self._parentView.setContent(self._areaName, view);
		}
		
		self.getContent = function() {
			return self._parentView.getContent(self._areaName);
		}
		
		self.getParentView = function() {
			return self._parentView;
		}
		
		self.getAreaName = function() {
			return self._areaName;
		}
	},
	
	View: function(template) {
		var self = this;
		self._parent = null;
		self._callbacks = {};
		self._unbindSelectorMap = {};
		self._rebindEvents = [];
		self._callbacks['render'] = [];
		self._callbacks['unrender'] = [];
		self._callbacks['load'] = [];
		self._callbacks['error'] = [];
		self._children = {};
		self._classes = '';
		self._loaded = false;
		self._defaultTemplate = template;
		self._templateString = null;
		self._mainTemplate = null;
		self._template = null;
		
		self.errors = {
			areaDoesNotExistError: function(areaName) {
				return 'Exception: View does not have an area with the areaName "' + areaName + '"';
			},
			templateNotSpecified: function() {
				return 'Exception: No template was specified for this view';
			}
		};
		
		if(!template) {
			throw self.errors.templateNotSpecified();
		}
		
		self._id = 'jComboView' + $n.mvp.generateID();
		
		self.on = function() {
			var args = arguments;
			var selfSelector = '.' + self._id;
			var jObject = $(selfSelector);
			if(args.length < 1) {
				throw $n.mvp.errors.noParamsSpecified();
			}
			
			if(args[0] == 'render' || args[0] == 'unrender' || args[0] == 'load' ||  args[0] == 'error') {
				var lastArg = args[args.length-1];
				
				if(args.length < 2 || !lastArg instanceof Function) {
					throw 'Exception: Handler not specified for the ' + args[0] + ' event';
				}
				
				if((args[0] == 'load' || args[0] == 'error') && self._loaded) {
					lastArg(self);
				} else {
					self._callbacks[args[0]].push(lastArg);
				}
			} else {
				self._rebindEvents.push(args);
				jObject.on.apply(jObject, args);
			}
		}
		
		self.off = function() {
			var args = arguments;
			if(args.length > 0 && (args[0] == 'render' || args[0] == 'unrender' || args[0] == 'load' ||  args[0] == 'error')) {
				var firstArg = args[0];
				var lastArg = args[args.length-1];
				
				if(args.length > 1) {
					self._callbacks[firstArg] = $.grep(self._callbacks[firstArg], function(value) {
						return value != lastArg;
					});
				} else {
					self._callbacks[firstArg] = [];
				}
			} else {
				var selfSelector = '.' + self._id;
				var jObject = $(selfSelector);
				
				jObject.off.apply(jObject, args);
				
				if(self._rebindEvents.length > 0) {
					self._rebindEvents = $.grep(self._rebindEvents, function(value) {
						return !self._handlerTriggeredBy(value, args);
					});
				}
			}
		}
		
		self.load = function(listener) {
			self.on('load', listener);
		}
		
		self.error = function(listener)	{
			self.on('error', listener);
		}
		
		self._triggerLoad = function() {
			var templateName = self._defaultTemplate.getName();
			$.each(self._callbacks['load'], function(index, value) {
				value(self);
			});
		}
		
		self._triggerError = function() {
			$.each(self._callbacks['error'], function(index, value) {
				value(self);
			});
		}
		
		if(typeof self._defaultTemplate == 'string') {
			self._loaded = true;
			self._templateString = self._defaultTemplate;
			self._mainTemplate = Handlebars.compile(self._defaultTemplate);
			self._template = self._mainTemplate;
		} else {
			self.load(function() {
				self._loaded = true;
				self._templateString = self._defaultTemplate.getText();
				self._mainTemplate = self._defaultTemplate.getRenderer();
				self._template = self._mainTemplate;
			});
			
			self.error(function() {
				if(self._callbacks['error'].length < 1) {
					throw 'Failed to load template';
				}
			});
			
			self._defaultTemplate.loader.load(function() {
				self._triggerLoad();
			});
			
			self._defaultTemplate.loader.error(function() {
				self._triggerError();
			});
		}
		
		self.isLoaded = function() {
			return self._loaded;
		}
		
		self._data = {};
		
		self.cover = function(view) {
			self._template = view.getTemplate();
			if(self.isInDOM()) {
				self.update();
			}
		}
		
		self.uncover = function() {
			self._template = self._mainTemplate;
			if(self.isInDOM()) {
				self.update();
			}
		}
		
		self.getTemplate = function() {
			return self._template;
		}
		
		self.getID = function() {
			return self._id;
		}
		
		self.clone = function() {
			self._validateLoaded();
			return new $n.mvp.View(template);
		}
		
		self.setParent = function(parent) {
			self._parent = parent;
		}
		
		self.getParent = function() {
			return self._parent;
		}
		
		self.addViewableChild = function(child) {
			self._children[child.getID()] = child;
		}
		
		self.removeViewableChild = function(child) {
			delete self._children[child.getID()];
		}
		
		self._adoptDescendantViewables = function(iterable) {
			var basicType;
			$.each(iterable, function(index, value) {
				if(value) {
					basicType = $n.getBasicType(value);
					
					if(value.setParent && value.getID) {
						value.setParent(self);
						self._children[value.getID()] = value;
					} else if(basicType == 'Array' || basicType == 'Object') {
						self._adoptDescendantViewables(value);
					}
				}
			});
		}
		
		self.setData = function(data) {
			if(self.isInDOM()) {
				self.triggerUnrender();
			}
			$.each(self._children, function(index, value) {
				if(value.setParent && value.getID) {
					value.setParent(null);
					delete self._children[value.getID()];
				}
			});
			
			$.each(data, function(index, value) {
				self._data[index] = value;
			});
			
			self._adoptDescendantViewables(self._data);
			
			if(self.isInDOM()) {
				self.update();
			}
		}
		
		self.clearData = function() {
			var newData = {};
			$.each(self._data, function(index) {
				newData[index] = '';
			});
			self.setData(newData);
		}
		
		self.getData = function() {
			return self._data;
		}
		
		self.getArea = function(areaName) {
			if(!self.hasArea(areaName)) {
				throw self.errors.areaDoesNotExistError(areaName);
			}
			return new $n.mvp.Area(self, areaName);
		}
		
		self.setContent = function(areaName, view) {
			if(!self.hasArea(areaName)) {
				throw self.errors.areaDoesNotExistError(areaName);
			}
			
			var data = {};
			data[areaName] = view;
			self.setData(data);
		}
		
		self.hasArea = function(areaName) {
			var areaRegex = new RegExp('[{][ ]*[{]([ ]*#[^ ]* +)?' + areaName + '[ ]*[}][ ]*[}]');
			return areaRegex.test(self._templateString);
		}
		
		self.getContent = function(areaName) {
			if(!self.hasArea(areaName)) {
				throw self.errors.areaDoesNotExistError(areaName);
			}
			
			return self._data[areaName];
		}
		
		self.select = function(selector) {
			if(!self.isInDOM()) {
				throw $n.mvp.errors.notAddedToDOM('View', 'select()');
			}
			
			if(!selector) {
				return $('.' + self._id);
			}
			var elSelector = '.' + self._id + ' ' + selector;
			self._unbindSelectorMap[elSelector] = true;
			return $(elSelector);
		}
		
		self.addClass = function(cssClass) {
			self._classes += ' ' + cssClass;
			if(self.isInDOM()) {
				var element = self.select();
				element.addClass(cssClass);
			}
		}
		
		self.removeClass = function(cssClass) {
			self._classes = self._classes.replace(new RegExp('( *' + cssClass + '| +$)', 'g'), '');
			
			if(self.isInDOM()) {
				var element = self.select();
				element.removeClass(cssClass);
			}
		}
		
		self._handlerTriggeredBy = function(handlerData, triggeredByData) {
			var triggers = true;
			$.each(triggeredByData, function(index, value) {
				if(!handlerData[index] || handlerData[index] != value) {
					triggers = false;
					return false;
				}
			});
			
			return triggers;
		}
		
		self.render = function(handler) {
			self.on('render', handler);
		}
		
		self.unrender = function(handler) {
			self.on('unrender', handler);
		}
		
		self.triggerUnrender = function() {
			var selector = '.' + self._id;
			$.each(self._callbacks['unrender'], function(index, value) {
				value();
			});
			
			$.each(self._unbindSelectorMap, function(index) {
				$(index).unbind();
				$(index).off();
			});
			
			if(self._rebindEvents.length > 0) {
				$(selector).off();
			};
			
			$.each(self._children, function(index, value) {
				if(value.triggerUnrender) {
					value.triggerUnrender();
				}
			});
			
			self._unbindSelectorMap = {};
		}
		
		self.triggerRender = function() {
			var selector = '.' + self._id;
			var jObject = $(selector);
			
			$.each(self._rebindEvents, function(index, value) {
				jObject.on.apply(jObject, value);
			});
			
			$.each(self._callbacks['render'], function(index, value) {
				value();
			});
			
			$.each(self._children, function(index, value) {
				if(value.triggerRender) {
					value.triggerRender();
				}
			});
		}
		
		self.isInDOM = function() {			
			return $('.' + self._id).length > 0;
		}
		
		self.toHandlebarsString = function() {
			return new Handlebars.SafeString(self.toString());			
		}
		
		self.toString = function() {
			return self._wrapID(self._getContent());
		}
		
		self._safeFormat = function(iterable) {
			var iter;
			if(iterable instanceof Array) {
				iter = [];
			} else {
				iter = {};
			}
			
			$.each(iterable, function(index, value) {
				if(value && (value instanceof $n.mvp.View || value.jComboMVPComponent)) {
					iter[index] = value.toHandlebarsString();
				} else if(typeof value == 'string') {
					iter[index] = new Handlebars.SafeString(value);
				} else if(value instanceof Object) {
					iter[index] = self._safeFormat(value);
				} else {
					iter[index] = value;
				}
			});
			
			return iter;
		}
		
		self._getContent = function() {
			self._validateLoaded();
			var compiledData = self._safeFormat(self._data);
			return self._template(compiledData);
		}
		
		self._validateLoaded = function() {
			if(!self._loaded) {
				throw 'Exception: Method cannot be called before the view has been fully loaded';
			}
		}
		
		self._wrapID = function(html) {
			return '<div class="jComboWrapper ' + self._id + self._classes + '">' + html + '</div>'
		}
		
		self.update = function() {
			var selfDiv = self.select();
			selfDiv.html(self._getContent());
			selfDiv.addClass(self._classes);
			self.triggerRender();
		}
	}, 
	
	/**
		Mixin class to be mixed into all component classes which must implement the getComponentName() methods.
		See $n.mixin() function.
	*/
	Component: $n.mixin(function(template) {
		var self = this;
		self.initMixin($n.mvp.View, template);
		self.jComboMVPComponent = true;
	
		self.getComponentName = function() {
			throw $n.mvp.errors.methodNotImplemented(self.constructor.toString(), 'getComponentName()');
		}
	})
};

$n.mvp.init();

$n.grab.app.view = function(templateName, fresh) {
	return new $n.mvp.View($n.grab.app.template(templateName, fresh));
};
/*
 * jQuery UI 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(a,d){a.ui=a.ui||{};if(a.ui.version){return}a.extend(a.ui,{version:"1.8.16",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(e,f){return typeof e==="number"?this.each(function(){var g=this;setTimeout(function(){a(g).focus();if(f){f.call(g)}},e)}):this._focus.apply(this,arguments)},scrollParent:function(){var e;if((a.browser.msie&&(/(static|relative)/).test(this.css("position")))||(/absolute/).test(this.css("position"))){e=this.parents().filter(function(){return(/(relative|absolute|fixed)/).test(a.curCSS(this,"position",1))&&(/(auto|scroll)/).test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0)}else{e=this.parents().filter(function(){return(/(auto|scroll)/).test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0)}return(/fixed/).test(this.css("position"))||!e.length?a(document):e},zIndex:function(h){if(h!==d){return this.css("zIndex",h)}if(this.length){var f=a(this[0]),e,g;while(f.length&&f[0]!==document){e=f.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){g=parseInt(f.css("zIndex"),10);if(!isNaN(g)&&g!==0){return g}}f=f.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});a.each(["Width","Height"],function(g,e){var f=e==="Width"?["Left","Right"]:["Top","Bottom"],h=e.toLowerCase(),k={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};function j(m,l,i,n){a.each(f,function(){l-=parseFloat(a.curCSS(m,"padding"+this,true))||0;if(i){l-=parseFloat(a.curCSS(m,"border"+this+"Width",true))||0}if(n){l-=parseFloat(a.curCSS(m,"margin"+this,true))||0}});return l}a.fn["inner"+e]=function(i){if(i===d){return k["inner"+e].call(this)}return this.each(function(){a(this).css(h,j(this,i)+"px")})};a.fn["outer"+e]=function(i,l){if(typeof i!=="number"){return k["outer"+e].call(this,i)}return this.each(function(){a(this).css(h,j(this,i,true,l)+"px")})}});function c(g,e){var j=g.nodeName.toLowerCase();if("area"===j){var i=g.parentNode,h=i.name,f;if(!g.href||!h||i.nodeName.toLowerCase()!=="map"){return false}f=a("img[usemap=#"+h+"]")[0];return !!f&&b(f)}return(/input|select|textarea|button|object/.test(j)?!g.disabled:"a"==j?g.href||e:e)&&b(g)}function b(e){return !a(e).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}a.extend(a.expr[":"],{data:function(g,f,e){return !!a.data(g,e[3])},focusable:function(e){return c(e,!isNaN(a.attr(e,"tabindex")))},tabbable:function(g){var e=a.attr(g,"tabindex"),f=isNaN(e);return(f||e>=0)&&c(g,!f)}});a(function(){var e=document.body,f=e.appendChild(f=document.createElement("div"));a.extend(f.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});a.support.minHeight=f.offsetHeight===100;a.support.selectstart="onselectstart" in f;e.removeChild(f).style.display="none"});a.extend(a.ui,{plugin:{add:function(f,g,j){var h=a.ui[f].prototype;for(var e in j){h.plugins[e]=h.plugins[e]||[];h.plugins[e].push([g,j[e]])}},call:function(e,g,f){var j=e.plugins[g];if(!j||!e.element[0].parentNode){return}for(var h=0;h<j.length;h++){if(e.options[j[h][0]]){j[h][1].apply(e.element,f)}}}},contains:function(f,e){return document.compareDocumentPosition?f.compareDocumentPosition(e)&16:f!==e&&f.contains(e)},hasScroll:function(h,f){if(a(h).css("overflow")==="hidden"){return false}var e=(f&&f==="left")?"scrollLeft":"scrollTop",g=false;if(h[e]>0){return true}h[e]=1;g=(h[e]>0);h[e]=0;return g},isOverAxis:function(f,e,g){return(f>e)&&(f<(e+g))},isOver:function(j,f,i,h,e,g){return a.ui.isOverAxis(j,i,e)&&a.ui.isOverAxis(f,h,g)}})})(jQuery);
/*
 * jQuery UI Widget 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,d){if(b.cleanData){var c=b.cleanData;b.cleanData=function(f){for(var g=0,h;(h=f[g])!=null;g++){try{b(h).triggerHandler("remove")}catch(j){}}c(f)}}else{var a=b.fn.remove;b.fn.remove=function(e,f){return this.each(function(){if(!f){if(!e||b.filter(e,[this]).length){b("*",this).add([this]).each(function(){try{b(this).triggerHandler("remove")}catch(g){}})}}return a.call(b(this),e,f)})}}b.widget=function(f,h,e){var g=f.split(".")[0],j;f=f.split(".")[1];j=g+"-"+f;if(!e){e=h;h=b.Widget}b.expr[":"][j]=function(k){return !!b.data(k,f)};b[g]=b[g]||{};b[g][f]=function(k,l){if(arguments.length){this._createWidget(k,l)}};var i=new h();i.options=b.extend(true,{},i.options);b[g][f].prototype=b.extend(true,i,{namespace:g,widgetName:f,widgetEventPrefix:b[g][f].prototype.widgetEventPrefix||f,widgetBaseClass:j},e);b.widget.bridge(f,b[g][f])};b.widget.bridge=function(f,e){b.fn[f]=function(i){var g=typeof i==="string",h=Array.prototype.slice.call(arguments,1),j=this;i=!g&&h.length?b.extend.apply(null,[true,i].concat(h)):i;if(g&&i.charAt(0)==="_"){return j}if(g){this.each(function(){var k=b.data(this,f),l=k&&b.isFunction(k[i])?k[i].apply(k,h):k;if(l!==k&&l!==d){j=l;return false}})}else{this.each(function(){var k=b.data(this,f);if(k){k.option(i||{})._init()}else{b.data(this,f,new e(i,this))}})}return j}};b.Widget=function(e,f){if(arguments.length){this._createWidget(e,f)}};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(f,g){b.data(g,this.widgetName,this);this.element=b(g);this.options=b.extend(true,{},this.options,this._getCreateOptions(),f);var e=this;this.element.bind("remove."+this.widgetName,function(){e.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(f,g){var e=f;if(arguments.length===0){return b.extend({},this.options)}if(typeof f==="string"){if(g===d){return this.options[f]}e={};e[f]=g}this._setOptions(e);return this},_setOptions:function(f){var e=this;b.each(f,function(g,h){e._setOption(g,h)});return this},_setOption:function(e,f){this.options[e]=f;if(e==="disabled"){this.widget()[f?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",f)}return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(f,g,h){var k=this.options[f];g=b.Event(g);g.type=(f===this.widgetEventPrefix?f:this.widgetEventPrefix+f).toLowerCase();h=h||{};if(g.originalEvent){for(var e=b.event.props.length,j;e;){j=b.event.props[--e];g[j]=g.originalEvent[j]}}this.element.trigger(g,h);return !(b.isFunction(k)&&k.call(this.element[0],g,h)===false||g.isDefaultPrevented())}}})(jQuery);
/*
 * jQuery UI Mouse 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b,c){var a=false;b(document).mouseup(function(d){a=false});b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var d=this;this.element.bind("mousedown."+this.widgetName,function(e){return d._mouseDown(e)}).bind("click."+this.widgetName,function(e){if(true===b.data(e.target,d.widgetName+".preventClickEvent")){b.removeData(e.target,d.widgetName+".preventClickEvent");e.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(f){if(a){return}(this._mouseStarted&&this._mouseUp(f));this._mouseDownEvent=f;var e=this,g=(f.which==1),d=(typeof this.options.cancel=="string"&&f.target.nodeName?b(f.target).closest(this.options.cancel).length:false);if(!g||d||!this._mouseCapture(f)){return true}this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){e.mouseDelayMet=true},this.options.delay)}if(this._mouseDistanceMet(f)&&this._mouseDelayMet(f)){this._mouseStarted=(this._mouseStart(f)!==false);if(!this._mouseStarted){f.preventDefault();return true}}if(true===b.data(f.target,this.widgetName+".preventClickEvent")){b.removeData(f.target,this.widgetName+".preventClickEvent")}this._mouseMoveDelegate=function(h){return e._mouseMove(h)};this._mouseUpDelegate=function(h){return e._mouseUp(h)};b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);f.preventDefault();a=true;return true},_mouseMove:function(d){if(b.browser.msie&&!(document.documentMode>=9)&&!d.button){return this._mouseUp(d)}if(this._mouseStarted){this._mouseDrag(d);return d.preventDefault()}if(this._mouseDistanceMet(d)&&this._mouseDelayMet(d)){this._mouseStarted=(this._mouseStart(this._mouseDownEvent,d)!==false);(this._mouseStarted?this._mouseDrag(d):this._mouseUp(d))}return !this._mouseStarted},_mouseUp:function(d){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;if(d.target==this._mouseDownEvent.target){b.data(d.target,this.widgetName+".preventClickEvent",true)}this._mouseStop(d)}return false},_mouseDistanceMet:function(d){return(Math.max(Math.abs(this._mouseDownEvent.pageX-d.pageX),Math.abs(this._mouseDownEvent.pageY-d.pageY))>=this.options.distance)},_mouseDelayMet:function(d){return this.mouseDelayMet},_mouseStart:function(d){},_mouseDrag:function(d){},_mouseStop:function(d){},_mouseCapture:function(d){return true}})})(jQuery);(function(f,g){f.ui=f.ui||{};var d=/left|center|right/,e=/top|center|bottom/,a="center",b=f.fn.position,c=f.fn.offset;f.fn.position=function(i){if(!i||!i.of){return b.apply(this,arguments)}i=f.extend({},i);var m=f(i.of),l=m[0],o=(i.collision||"flip").split(" "),n=i.offset?i.offset.split(" "):[0,0],k,h,j;if(l.nodeType===9){k=m.width();h=m.height();j={top:0,left:0}}else{if(l.setTimeout){k=m.width();h=m.height();j={top:m.scrollTop(),left:m.scrollLeft()}}else{if(l.preventDefault){i.at="left top";k=h=0;j={top:i.of.pageY,left:i.of.pageX}}else{k=m.outerWidth();h=m.outerHeight();j=m.offset()}}}f.each(["my","at"],function(){var p=(i[this]||"").split(" ");if(p.length===1){p=d.test(p[0])?p.concat([a]):e.test(p[0])?[a].concat(p):[a,a]}p[0]=d.test(p[0])?p[0]:a;p[1]=e.test(p[1])?p[1]:a;i[this]=p});if(o.length===1){o[1]=o[0]}n[0]=parseInt(n[0],10)||0;if(n.length===1){n[1]=n[0]}n[1]=parseInt(n[1],10)||0;if(i.at[0]==="right"){j.left+=k}else{if(i.at[0]===a){j.left+=k/2}}if(i.at[1]==="bottom"){j.top+=h}else{if(i.at[1]===a){j.top+=h/2}}j.left+=n[0];j.top+=n[1];return this.each(function(){var s=f(this),v=s.outerWidth(),r=s.outerHeight(),u=parseInt(f.curCSS(this,"marginLeft",true))||0,q=parseInt(f.curCSS(this,"marginTop",true))||0,x=v+u+(parseInt(f.curCSS(this,"marginRight",true))||0),y=r+q+(parseInt(f.curCSS(this,"marginBottom",true))||0),w=f.extend({},j),p;if(i.my[0]==="right"){w.left-=v}else{if(i.my[0]===a){w.left-=v/2}}if(i.my[1]==="bottom"){w.top-=r}else{if(i.my[1]===a){w.top-=r/2}}w.left=Math.round(w.left);w.top=Math.round(w.top);p={left:w.left-u,top:w.top-q};f.each(["left","top"],function(A,z){if(f.ui.position[o[A]]){f.ui.position[o[A]][z](w,{targetWidth:k,targetHeight:h,elemWidth:v,elemHeight:r,collisionPosition:p,collisionWidth:x,collisionHeight:y,offset:n,my:i.my,at:i.at})}});if(f.fn.bgiframe){s.bgiframe()}s.offset(f.extend(w,{using:i.using}))})};f.ui.position={fit:{left:function(h,i){var k=f(window),j=i.collisionPosition.left+i.collisionWidth-k.width()-k.scrollLeft();h.left=j>0?h.left-j:Math.max(h.left-i.collisionPosition.left,h.left)},top:function(h,i){var k=f(window),j=i.collisionPosition.top+i.collisionHeight-k.height()-k.scrollTop();h.top=j>0?h.top-j:Math.max(h.top-i.collisionPosition.top,h.top)}},flip:{left:function(i,k){if(k.at[0]===a){return}var m=f(window),l=k.collisionPosition.left+k.collisionWidth-m.width()-m.scrollLeft(),h=k.my[0]==="left"?-k.elemWidth:k.my[0]==="right"?k.elemWidth:0,j=k.at[0]==="left"?k.targetWidth:-k.targetWidth,n=-2*k.offset[0];i.left+=k.collisionPosition.left<0?h+j+n:l>0?h+j+n:0},top:function(i,k){if(k.at[1]===a){return}var m=f(window),l=k.collisionPosition.top+k.collisionHeight-m.height()-m.scrollTop(),h=k.my[1]==="top"?-k.elemHeight:k.my[1]==="bottom"?k.elemHeight:0,j=k.at[1]==="top"?k.targetHeight:-k.targetHeight,n=-2*k.offset[1];i.top+=k.collisionPosition.top<0?h+j+n:l>0?h+j+n:0}}};if(!f.offset.setOffset){f.offset.setOffset=function(l,i){if(/static/.test(f.curCSS(l,"position"))){l.style.position="relative"}var k=f(l),n=k.offset(),h=parseInt(f.curCSS(l,"top",true),10)||0,m=parseInt(f.curCSS(l,"left",true),10)||0,j={top:(i.top-n.top)+h,left:(i.left-n.left)+m};if("using" in i){i.using.call(l,j)}else{k.css(j)}};f.fn.offset=function(h){var i=this[0];if(!i||!i.ownerDocument){return null}if(h){return this.each(function(){f.offset.setOffset(this,h)})}return c.call(this)}}}(jQuery));(function(a,b){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper=="original"&&!(/^(?:r|a|f)/).test(this.element.css("position"))){this.element[0].style.position="relative"}(this.options.addClasses&&this.element.addClass("ui-draggable"));(this.options.disabled&&this.element.addClass("ui-draggable-disabled"));this._mouseInit()},destroy:function(){if(!this.element.data("draggable")){return}this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this},_mouseCapture:function(c){var d=this.options;if(this.helper||d.disabled||a(c.target).is(".ui-resizable-handle")){return false}this.handle=this._getHandle(c);if(!this.handle){return false}if(d.iframeFix){a(d.iframeFix===true?"iframe":d.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(a(this).offset()).appendTo("body")})}return true},_mouseStart:function(c){var d=this.options;this.helper=this._createHelper(c);this._cacheHelperProportions();if(a.ui.ddmanager){a.ui.ddmanager.current=this}this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};a.extend(this.offset,{click:{left:c.pageX-this.offset.left,top:c.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(c);this.originalPageX=c.pageX;this.originalPageY=c.pageY;(d.cursorAt&&this._adjustOffsetFromHelper(d.cursorAt));if(d.containment){this._setContainment()}if(this._trigger("start",c)===false){this._clear();return false}this._cacheHelperProportions();if(a.ui.ddmanager&&!d.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,c)}this.helper.addClass("ui-draggable-dragging");this._mouseDrag(c,true);if(a.ui.ddmanager){a.ui.ddmanager.dragStart(this,c)}return true},_mouseDrag:function(c,e){this.position=this._generatePosition(c);this.positionAbs=this._convertPositionTo("absolute");if(!e){var d=this._uiHash();if(this._trigger("drag",c,d)===false){this._mouseUp({});return false}this.position=d.position}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}if(a.ui.ddmanager){a.ui.ddmanager.drag(this,c)}return false},_mouseStop:function(d){var e=false;if(a.ui.ddmanager&&!this.options.dropBehaviour){e=a.ui.ddmanager.drop(this,d)}if(this.dropped){e=this.dropped;this.dropped=false}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original"){return false}if((this.options.revert=="invalid"&&!e)||(this.options.revert=="valid"&&e)||this.options.revert===true||(a.isFunction(this.options.revert)&&this.options.revert.call(this.element,e))){var c=this;a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){if(c._trigger("stop",d)!==false){c._clear()}})}else{if(this._trigger("stop",d)!==false){this._clear()}}return false},_mouseUp:function(c){if(this.options.iframeFix===true){a("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}if(a.ui.ddmanager){a.ui.ddmanager.dragStop(this,c)}return a.ui.mouse.prototype._mouseUp.call(this,c)},cancel:function(){if(this.helper.is(".ui-draggable-dragging")){this._mouseUp({})}else{this._clear()}return this},_getHandle:function(c){var d=!this.options.handle||!a(this.options.handle,this.element).length?true:false;a(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==c.target){d=true}});return d},_createHelper:function(d){var e=this.options;var c=a.isFunction(e.helper)?a(e.helper.apply(this.element[0],[d])):(e.helper=="clone"?this.element.clone().removeAttr("id"):this.element);if(!c.parents("body").length){c.appendTo((e.appendTo=="parent"?this.element[0].parentNode:e.appendTo))}if(c[0]!=this.element[0]&&!(/(fixed|absolute)/).test(c.css("position"))){c.css("position","absolute")}return c},_adjustOffsetFromHelper:function(c){if(typeof c=="string"){c=c.split(" ")}if(a.isArray(c)){c={left:+c[0],top:+c[1]||0}}if("left" in c){this.offset.click.left=c.left+this.margins.left}if("right" in c){this.offset.click.left=this.helperProportions.width-c.right+this.margins.left}if("top" in c){this.offset.click.top=c.top+this.margins.top}if("bottom" in c){this.offset.click.top=this.helperProportions.height-c.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var c=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])){c.left+=this.scrollParent.scrollLeft();c.top+=this.scrollParent.scrollTop()}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)){c={top:0,left:0}}return{top:c.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:c.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var c=this.element.position();return{top:c.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:c.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:(parseInt(this.element.css("marginLeft"),10)||0),top:(parseInt(this.element.css("marginTop"),10)||0),right:(parseInt(this.element.css("marginRight"),10)||0),bottom:(parseInt(this.element.css("marginBottom"),10)||0)}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var g=this.options;if(g.containment=="parent"){g.containment=this.helper[0].parentNode}if(g.containment=="document"||g.containment=="window"){this.containment=[g.containment=="document"?0:a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,g.containment=="document"?0:a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(g.containment=="document"?0:a(window).scrollLeft())+a(g.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(g.containment=="document"?0:a(window).scrollTop())+(a(g.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!(/^(document|window|parent)$/).test(g.containment)&&g.containment.constructor!=Array){var h=a(g.containment);var e=h[0];if(!e){return}var f=h.offset();var d=(a(e).css("overflow")!="hidden");this.containment=[(parseInt(a(e).css("borderLeftWidth"),10)||0)+(parseInt(a(e).css("paddingLeft"),10)||0),(parseInt(a(e).css("borderTopWidth"),10)||0)+(parseInt(a(e).css("paddingTop"),10)||0),(d?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(a(e).css("borderLeftWidth"),10)||0)-(parseInt(a(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(d?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(a(e).css("borderTopWidth"),10)||0)-(parseInt(a(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];this.relative_container=h}else{if(g.containment.constructor==Array){this.containment=g.containment}}},_convertPositionTo:function(g,i){if(!i){i=this.position}var e=g=="absolute"?1:-1;var f=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,h=(/(html|body)/i).test(c[0].tagName);return{top:(i.top+this.offset.relative.top*e+this.offset.parent.top*e-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(h?0:c.scrollTop()))*e)),left:(i.left+this.offset.relative.left*e+this.offset.parent.left*e-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():h?0:c.scrollLeft())*e))}},_generatePosition:function(d){var e=this.options,l=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,i=(/(html|body)/i).test(l[0].tagName);var h=d.pageX;var g=d.pageY;if(this.originalPosition){var c;if(this.containment){if(this.relative_container){var k=this.relative_container.offset();c=[this.containment[0]+k.left,this.containment[1]+k.top,this.containment[2]+k.left,this.containment[3]+k.top]}else{c=this.containment}if(d.pageX-this.offset.click.left<c[0]){h=c[0]+this.offset.click.left}if(d.pageY-this.offset.click.top<c[1]){g=c[1]+this.offset.click.top}if(d.pageX-this.offset.click.left>c[2]){h=c[2]+this.offset.click.left}if(d.pageY-this.offset.click.top>c[3]){g=c[3]+this.offset.click.top}}if(e.grid){var j=e.grid[1]?this.originalPageY+Math.round((g-this.originalPageY)/e.grid[1])*e.grid[1]:this.originalPageY;g=c?(!(j-this.offset.click.top<c[1]||j-this.offset.click.top>c[3])?j:(!(j-this.offset.click.top<c[1])?j-e.grid[1]:j+e.grid[1])):j;var f=e.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/e.grid[0])*e.grid[0]:this.originalPageX;h=c?(!(f-this.offset.click.left<c[0]||f-this.offset.click.left>c[2])?f:(!(f-this.offset.click.left<c[0])?f-e.grid[0]:f+e.grid[0])):f}}return{top:(g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(i?0:l.scrollTop())))),left:(h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():i?0:l.scrollLeft())))}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");if(this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval){this.helper.remove()}this.helper=null;this.cancelHelperRemoval=false},_trigger:function(c,d,e){e=e||this._uiHash();a.ui.plugin.call(this,c,[d,e]);if(c=="drag"){this.positionAbs=this._convertPositionTo("absolute")}return a.Widget.prototype._trigger.call(this,c,d,e)},plugins:{},_uiHash:function(c){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});a.extend(a.ui.draggable,{version:"1.8.16"});a.ui.plugin.add("draggable","connectToSortable",{start:function(d,f){var e=a(this).data("draggable"),g=e.options,c=a.extend({},f,{item:e.element});e.sortables=[];a(g.connectToSortable).each(function(){var h=a.data(this,"sortable");if(h&&!h.options.disabled){e.sortables.push({instance:h,shouldRevert:h.options.revert});h.refreshPositions();h._trigger("activate",d,c)}})},stop:function(d,f){var e=a(this).data("draggable"),c=a.extend({},f,{item:e.element});a.each(e.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;e.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert){this.instance.options.revert=true}this.instance._mouseStop(d);this.instance.options.helper=this.instance.options._helper;if(e.options.helper=="original"){this.instance.currentItem.css({top:"auto",left:"auto"})}}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",d,c)}})},drag:function(d,g){var f=a(this).data("draggable"),c=this;var e=function(j){var p=this.offset.click.top,n=this.offset.click.left;var h=this.positionAbs.top,l=this.positionAbs.left;var k=j.height,m=j.width;var q=j.top,i=j.left;return a.ui.isOver(h+p,l+n,q,i,k,m)};a.each(f.sortables,function(h){this.instance.positionAbs=f.positionAbs;this.instance.helperProportions=f.helperProportions;this.instance.offset.click=f.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=a(c).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return g.helper[0]};d.target=this.instance.currentItem[0];this.instance._mouseCapture(d,true);this.instance._mouseStart(d,true,true);this.instance.offset.click.top=f.offset.click.top;this.instance.offset.click.left=f.offset.click.left;this.instance.offset.parent.left-=f.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=f.offset.parent.top-this.instance.offset.parent.top;f._trigger("toSortable",d);f.dropped=this.instance.element;f.currentItem=f.element;this.instance.fromOutside=f}if(this.instance.currentItem){this.instance._mouseDrag(d)}}else{if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",d,this.instance._uiHash(this.instance));this.instance._mouseStop(d,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();if(this.instance.placeholder){this.instance.placeholder.remove()}f._trigger("fromSortable",d);f.dropped=false}}})}});a.ui.plugin.add("draggable","cursor",{start:function(d,e){var c=a("body"),f=a(this).data("draggable").options;if(c.css("cursor")){f._cursor=c.css("cursor")}c.css("cursor",f.cursor)},stop:function(c,d){var e=a(this).data("draggable").options;if(e._cursor){a("body").css("cursor",e._cursor)}}});a.ui.plugin.add("draggable","opacity",{start:function(d,e){var c=a(e.helper),f=a(this).data("draggable").options;if(c.css("opacity")){f._opacity=c.css("opacity")}c.css("opacity",f.opacity)},stop:function(c,d){var e=a(this).data("draggable").options;if(e._opacity){a(d.helper).css("opacity",e._opacity)}}});a.ui.plugin.add("draggable","scroll",{start:function(d,e){var c=a(this).data("draggable");if(c.scrollParent[0]!=document&&c.scrollParent[0].tagName!="HTML"){c.overflowOffset=c.scrollParent.offset()}},drag:function(e,f){var d=a(this).data("draggable"),g=d.options,c=false;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!g.axis||g.axis!="x"){if((d.overflowOffset.top+d.scrollParent[0].offsetHeight)-e.pageY<g.scrollSensitivity){d.scrollParent[0].scrollTop=c=d.scrollParent[0].scrollTop+g.scrollSpeed}else{if(e.pageY-d.overflowOffset.top<g.scrollSensitivity){d.scrollParent[0].scrollTop=c=d.scrollParent[0].scrollTop-g.scrollSpeed}}}if(!g.axis||g.axis!="y"){if((d.overflowOffset.left+d.scrollParent[0].offsetWidth)-e.pageX<g.scrollSensitivity){d.scrollParent[0].scrollLeft=c=d.scrollParent[0].scrollLeft+g.scrollSpeed}else{if(e.pageX-d.overflowOffset.left<g.scrollSensitivity){d.scrollParent[0].scrollLeft=c=d.scrollParent[0].scrollLeft-g.scrollSpeed}}}}else{if(!g.axis||g.axis!="x"){if(e.pageY-a(document).scrollTop()<g.scrollSensitivity){c=a(document).scrollTop(a(document).scrollTop()-g.scrollSpeed)}else{if(a(window).height()-(e.pageY-a(document).scrollTop())<g.scrollSensitivity){c=a(document).scrollTop(a(document).scrollTop()+g.scrollSpeed)}}}if(!g.axis||g.axis!="y"){if(e.pageX-a(document).scrollLeft()<g.scrollSensitivity){c=a(document).scrollLeft(a(document).scrollLeft()-g.scrollSpeed)}else{if(a(window).width()-(e.pageX-a(document).scrollLeft())<g.scrollSensitivity){c=a(document).scrollLeft(a(document).scrollLeft()+g.scrollSpeed)}}}}if(c!==false&&a.ui.ddmanager&&!g.dropBehaviour){a.ui.ddmanager.prepareOffsets(d,e)}}});a.ui.plugin.add("draggable","snap",{start:function(d,e){var c=a(this).data("draggable"),f=c.options;c.snapElements=[];a(f.snap.constructor!=String?(f.snap.items||":data(draggable)"):f.snap).each(function(){var h=a(this);var g=h.offset();if(this!=c.element[0]){c.snapElements.push({item:this,width:h.outerWidth(),height:h.outerHeight(),top:g.top,left:g.left})}})},drag:function(u,p){var g=a(this).data("draggable"),q=g.options;var y=q.snapTolerance;var x=p.offset.left,w=x+g.helperProportions.width,f=p.offset.top,e=f+g.helperProportions.height;for(var v=g.snapElements.length-1;v>=0;v--){var s=g.snapElements[v].left,n=s+g.snapElements[v].width,m=g.snapElements[v].top,A=m+g.snapElements[v].height;if(!((s-y<x&&x<n+y&&m-y<f&&f<A+y)||(s-y<x&&x<n+y&&m-y<e&&e<A+y)||(s-y<w&&w<n+y&&m-y<f&&f<A+y)||(s-y<w&&w<n+y&&m-y<e&&e<A+y))){if(g.snapElements[v].snapping){(g.options.snap.release&&g.options.snap.release.call(g.element,u,a.extend(g._uiHash(),{snapItem:g.snapElements[v].item})))}g.snapElements[v].snapping=false;continue}if(q.snapMode!="inner"){var c=Math.abs(m-e)<=y;var z=Math.abs(A-f)<=y;var j=Math.abs(s-w)<=y;var k=Math.abs(n-x)<=y;if(c){p.position.top=g._convertPositionTo("relative",{top:m-g.helperProportions.height,left:0}).top-g.margins.top}if(z){p.position.top=g._convertPositionTo("relative",{top:A,left:0}).top-g.margins.top}if(j){p.position.left=g._convertPositionTo("relative",{top:0,left:s-g.helperProportions.width}).left-g.margins.left}if(k){p.position.left=g._convertPositionTo("relative",{top:0,left:n}).left-g.margins.left}}var h=(c||z||j||k);if(q.snapMode!="outer"){var c=Math.abs(m-f)<=y;var z=Math.abs(A-e)<=y;var j=Math.abs(s-x)<=y;var k=Math.abs(n-w)<=y;if(c){p.position.top=g._convertPositionTo("relative",{top:m,left:0}).top-g.margins.top}if(z){p.position.top=g._convertPositionTo("relative",{top:A-g.helperProportions.height,left:0}).top-g.margins.top}if(j){p.position.left=g._convertPositionTo("relative",{top:0,left:s}).left-g.margins.left}if(k){p.position.left=g._convertPositionTo("relative",{top:0,left:n-g.helperProportions.width}).left-g.margins.left}}if(!g.snapElements[v].snapping&&(c||z||j||k||h)){(g.options.snap.snap&&g.options.snap.snap.call(g.element,u,a.extend(g._uiHash(),{snapItem:g.snapElements[v].item})))}g.snapElements[v].snapping=(c||z||j||k||h)}}});a.ui.plugin.add("draggable","stack",{start:function(d,e){var g=a(this).data("draggable").options;var f=a.makeArray(a(g.stack)).sort(function(i,h){return(parseInt(a(i).css("zIndex"),10)||0)-(parseInt(a(h).css("zIndex"),10)||0)});if(!f.length){return}var c=parseInt(f[0].style.zIndex)||0;a(f).each(function(h){this.style.zIndex=c+h});this[0].style.zIndex=c+f.length}});a.ui.plugin.add("draggable","zIndex",{start:function(d,e){var c=a(e.helper),f=a(this).data("draggable").options;if(c.css("zIndex")){f._zIndex=c.css("zIndex")}c.css("zIndex",f.zIndex)},stop:function(c,d){var e=a(this).data("draggable").options;if(e._zIndex){a(d.helper).css("zIndex",e._zIndex)}}})})(jQuery);(function(a,b){a.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var d=this.options,c=d.accept;this.isover=0;this.isout=1;this.accept=a.isFunction(c)?c:function(e){return e.is(c)};this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};a.ui.ddmanager.droppables[d.scope]=a.ui.ddmanager.droppables[d.scope]||[];a.ui.ddmanager.droppables[d.scope].push(this);(d.addClasses&&this.element.addClass("ui-droppable"))},destroy:function(){var c=a.ui.ddmanager.droppables[this.options.scope];for(var d=0;d<c.length;d++){if(c[d]==this){c.splice(d,1)}}this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");return this},_setOption:function(c,d){if(c=="accept"){this.accept=a.isFunction(d)?d:function(e){return e.is(d)}}a.Widget.prototype._setOption.apply(this,arguments)},_activate:function(d){var c=a.ui.ddmanager.current;if(this.options.activeClass){this.element.addClass(this.options.activeClass)}(c&&this._trigger("activate",d,this.ui(c)))},_deactivate:function(d){var c=a.ui.ddmanager.current;if(this.options.activeClass){this.element.removeClass(this.options.activeClass)}(c&&this._trigger("deactivate",d,this.ui(c)))},_over:function(d){var c=a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0]){return}if(this.accept.call(this.element[0],(c.currentItem||c.element))){if(this.options.hoverClass){this.element.addClass(this.options.hoverClass)}this._trigger("over",d,this.ui(c))}},_out:function(d){var c=a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0]){return}if(this.accept.call(this.element[0],(c.currentItem||c.element))){if(this.options.hoverClass){this.element.removeClass(this.options.hoverClass)}this._trigger("out",d,this.ui(c))}},_drop:function(d,e){var c=e||a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0]){return false}var f=false;this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var g=a.data(this,"droppable");if(g.options.greedy&&!g.options.disabled&&g.options.scope==c.options.scope&&g.accept.call(g.element[0],(c.currentItem||c.element))&&a.ui.intersect(c,a.extend(g,{offset:g.element.offset()}),g.options.tolerance)){f=true;return false}});if(f){return false}if(this.accept.call(this.element[0],(c.currentItem||c.element))){if(this.options.activeClass){this.element.removeClass(this.options.activeClass)}if(this.options.hoverClass){this.element.removeClass(this.options.hoverClass)}this._trigger("drop",d,this.ui(c));return this.element}return false},ui:function(d){return{draggable:(d.currentItem||d.element),helper:d.helper,position:d.position,offset:d.positionAbs}}});a.extend(a.ui.droppable,{version:"1.8.16"});a.ui.intersect=function(q,j,o){if(!j.offset){return false}var e=(q.positionAbs||q.position.absolute).left,d=e+q.helperProportions.width,n=(q.positionAbs||q.position.absolute).top,m=n+q.helperProportions.height;var g=j.offset.left,c=g+j.proportions.width,p=j.offset.top,k=p+j.proportions.height;switch(o){case"fit":return(g<=e&&d<=c&&p<=n&&m<=k);break;case"intersect":return(g<e+(q.helperProportions.width/2)&&d-(q.helperProportions.width/2)<c&&p<n+(q.helperProportions.height/2)&&m-(q.helperProportions.height/2)<k);break;case"pointer":var h=((q.positionAbs||q.position.absolute).left+(q.clickOffset||q.offset.click).left),i=((q.positionAbs||q.position.absolute).top+(q.clickOffset||q.offset.click).top),f=a.ui.isOver(i,h,p,g,j.proportions.height,j.proportions.width);return f;break;case"touch":return((n>=p&&n<=k)||(m>=p&&m<=k)||(n<p&&m>k))&&((e>=g&&e<=c)||(d>=g&&d<=c)||(e<g&&d>c));break;default:return false;break}};a.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(f,h){var c=a.ui.ddmanager.droppables[f.options.scope]||[];var g=h?h.type:null;var k=(f.currentItem||f.element).find(":data(droppable)").andSelf();droppablesLoop:for(var e=0;e<c.length;e++){if(c[e].options.disabled||(f&&!c[e].accept.call(c[e].element[0],(f.currentItem||f.element)))){continue}for(var d=0;d<k.length;d++){if(k[d]==c[e].element[0]){c[e].proportions.height=0;continue droppablesLoop}}c[e].visible=c[e].element.css("display")!="none";if(!c[e].visible){continue}if(g=="mousedown"){c[e]._activate.call(c[e],h)}c[e].offset=c[e].element.offset();c[e].proportions={width:c[e].element[0].offsetWidth,height:c[e].element[0].offsetHeight}}},drop:function(c,d){var e=false;a.each(a.ui.ddmanager.droppables[c.options.scope]||[],function(){if(!this.options){return}if(!this.options.disabled&&this.visible&&a.ui.intersect(c,this,this.options.tolerance)){e=e||this._drop.call(this,d)}if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],(c.currentItem||c.element))){this.isout=1;this.isover=0;this._deactivate.call(this,d)}});return e},dragStart:function(c,d){c.element.parents(":not(body,html)").bind("scroll.droppable",function(){if(!c.options.refreshPositions){a.ui.ddmanager.prepareOffsets(c,d)}})},drag:function(c,d){if(c.options.refreshPositions){a.ui.ddmanager.prepareOffsets(c,d)}a.each(a.ui.ddmanager.droppables[c.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible){return}var f=a.ui.intersect(c,this,this.options.tolerance);var h=!f&&this.isover==1?"isout":(f&&this.isover==0?"isover":null);if(!h){return}var g;if(this.options.greedy){var e=this.element.parents(":data(droppable):eq(0)");if(e.length){g=a.data(e[0],"droppable");g.greedyChild=(h=="isover"?1:0)}}if(g&&h=="isover"){g.isover=0;g.isout=1;g._out.call(g,d)}this[h]=1;this[h=="isout"?"isover":"isout"]=0;this[h=="isover"?"_over":"_out"].call(this,d);if(g&&h=="isout"){g.isout=0;g.isover=1;g._over.call(g,d)}})},dragStop:function(c,d){c.element.parents(":not(body,html)").unbind("scroll.droppable");if(!c.options.refreshPositions){a.ui.ddmanager.prepareOffsets(c,d)}}}})(jQuery);(function(c,d){c.widget("ui.resizable",c.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1000},_create:function(){var f=this,k=this.options;this.element.addClass("ui-resizable");c.extend(this,{_aspectRatio:!!(k.aspectRatio),aspectRatio:k.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:k.helper||k.ghost||k.animate?k.helper||"ui-resizable-helper":null});if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){if(/relative/.test(this.element.css("position"))&&c.browser.opera){this.element.css({position:"relative",top:"auto",left:"auto"})}this.element.wrap(c('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")}));this.element=this.element.parent().data("resizable",this.element.data("resizable"));this.elementIsWrapper=true;this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});this.originalResizeStyle=this.originalElement.css("resize");this.originalElement.css("resize","none");this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));this.originalElement.css({margin:this.originalElement.css("margin")});this._proportionallyResize()}this.handles=k.handles||(!c(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"});if(this.handles.constructor==String){if(this.handles=="all"){this.handles="n,e,s,w,se,sw,ne,nw"}var l=this.handles.split(",");this.handles={};for(var g=0;g<l.length;g++){var j=c.trim(l[g]),e="ui-resizable-"+j;var h=c('<div class="ui-resizable-handle '+e+'"></div>');if(/sw|se|ne|nw/.test(j)){h.css({zIndex:++k.zIndex})}if("se"==j){h.addClass("ui-icon ui-icon-gripsmall-diagonal-se")}this.handles[j]=".ui-resizable-"+j;this.element.append(h)}}this._renderAxis=function(q){q=q||this.element;for(var n in this.handles){if(this.handles[n].constructor==String){this.handles[n]=c(this.handles[n],this.element).show()}if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var o=c(this.handles[n],this.element),p=0;p=/sw|ne|nw|se|n|s/.test(n)?o.outerHeight():o.outerWidth();var m=["padding",/ne|nw|n/.test(n)?"Top":/se|sw|s/.test(n)?"Bottom":/^e$/.test(n)?"Right":"Left"].join("");q.css(m,p);this._proportionallyResize()}if(!c(this.handles[n]).length){continue}}};this._renderAxis(this.element);this._handles=c(".ui-resizable-handle",this.element).disableSelection();this._handles.mouseover(function(){if(!f.resizing){if(this.className){var i=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)}f.axis=i&&i[1]?i[1]:"se"}});if(k.autoHide){this._handles.hide();c(this.element).addClass("ui-resizable-autohide").hover(function(){if(k.disabled){return}c(this).removeClass("ui-resizable-autohide");f._handles.show()},function(){if(k.disabled){return}if(!f.resizing){c(this).addClass("ui-resizable-autohide");f._handles.hide()}})}this._mouseInit()},destroy:function(){this._mouseDestroy();var e=function(g){c(g).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){e(this.element);var f=this.element;f.after(this.originalElement.css({position:f.css("position"),width:f.outerWidth(),height:f.outerHeight(),top:f.css("top"),left:f.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);e(this.originalElement);return this},_mouseCapture:function(f){var g=false;for(var e in this.handles){if(c(this.handles[e])[0]==f.target){g=true}}return !this.options.disabled&&g},_mouseStart:function(g){var j=this.options,f=this.element.position(),e=this.element;this.resizing=true;this.documentScroll={top:c(document).scrollTop(),left:c(document).scrollLeft()};if(e.is(".ui-draggable")||(/absolute/).test(e.css("position"))){e.css({position:"absolute",top:f.top,left:f.left})}if(c.browser.opera&&(/relative/).test(e.css("position"))){e.css({position:"relative",top:"auto",left:"auto"})}this._renderProxy();var k=b(this.helper.css("left")),h=b(this.helper.css("top"));if(j.containment){k+=c(j.containment).scrollLeft()||0;h+=c(j.containment).scrollTop()||0}this.offset=this.helper.offset();this.position={left:k,top:h};this.size=this._helper?{width:e.outerWidth(),height:e.outerHeight()}:{width:e.width(),height:e.height()};this.originalSize=this._helper?{width:e.outerWidth(),height:e.outerHeight()}:{width:e.width(),height:e.height()};this.originalPosition={left:k,top:h};this.sizeDiff={width:e.outerWidth()-e.width(),height:e.outerHeight()-e.height()};this.originalMousePosition={left:g.pageX,top:g.pageY};this.aspectRatio=(typeof j.aspectRatio=="number")?j.aspectRatio:((this.originalSize.width/this.originalSize.height)||1);var i=c(".ui-resizable-"+this.axis).css("cursor");c("body").css("cursor",i=="auto"?this.axis+"-resize":i);e.addClass("ui-resizable-resizing");this._propagate("start",g);return true},_mouseDrag:function(e){var h=this.helper,g=this.options,m={},q=this,j=this.originalMousePosition,n=this.axis;var r=(e.pageX-j.left)||0,p=(e.pageY-j.top)||0;var i=this._change[n];if(!i){return false}var l=i.apply(this,[e,r,p]),k=c.browser.msie&&c.browser.version<7,f=this.sizeDiff;this._updateVirtualBoundaries(e.shiftKey);if(this._aspectRatio||e.shiftKey){l=this._updateRatio(l,e)}l=this._respectSize(l,e);this._propagate("resize",e);h.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});if(!this._helper&&this._proportionallyResizeElements.length){this._proportionallyResize()}this._updateCache(l);this._trigger("resize",e,this.ui());return false},_mouseStop:function(h){this.resizing=false;var i=this.options,m=this;if(this._helper){var g=this._proportionallyResizeElements,e=g.length&&(/textarea/i).test(g[0].nodeName),f=e&&c.ui.hasScroll(g[0],"left")?0:m.sizeDiff.height,k=e?0:m.sizeDiff.width;var n={width:(m.helper.width()-k),height:(m.helper.height()-f)},j=(parseInt(m.element.css("left"),10)+(m.position.left-m.originalPosition.left))||null,l=(parseInt(m.element.css("top"),10)+(m.position.top-m.originalPosition.top))||null;if(!i.animate){this.element.css(c.extend(n,{top:l,left:j}))}m.helper.height(m.size.height);m.helper.width(m.size.width);if(this._helper&&!i.animate){this._proportionallyResize()}}c("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");this._propagate("stop",h);if(this._helper){this.helper.remove()}return false},_updateVirtualBoundaries:function(g){var j=this.options,i,h,f,k,e;e={minWidth:a(j.minWidth)?j.minWidth:0,maxWidth:a(j.maxWidth)?j.maxWidth:Infinity,minHeight:a(j.minHeight)?j.minHeight:0,maxHeight:a(j.maxHeight)?j.maxHeight:Infinity};if(this._aspectRatio||g){i=e.minHeight*this.aspectRatio;f=e.minWidth/this.aspectRatio;h=e.maxHeight*this.aspectRatio;k=e.maxWidth/this.aspectRatio;if(i>e.minWidth){e.minWidth=i}if(f>e.minHeight){e.minHeight=f}if(h<e.maxWidth){e.maxWidth=h}if(k<e.maxHeight){e.maxHeight=k}}this._vBoundaries=e},_updateCache:function(e){var f=this.options;this.offset=this.helper.offset();if(a(e.left)){this.position.left=e.left}if(a(e.top)){this.position.top=e.top}if(a(e.height)){this.size.height=e.height}if(a(e.width)){this.size.width=e.width}},_updateRatio:function(h,g){var i=this.options,j=this.position,f=this.size,e=this.axis;if(a(h.height)){h.width=(h.height*this.aspectRatio)}else{if(a(h.width)){h.height=(h.width/this.aspectRatio)}}if(e=="sw"){h.left=j.left+(f.width-h.width);h.top=null}if(e=="nw"){h.top=j.top+(f.height-h.height);h.left=j.left+(f.width-h.width)}return h},_respectSize:function(l,g){var j=this.helper,i=this._vBoundaries,r=this._aspectRatio||g.shiftKey,q=this.axis,u=a(l.width)&&i.maxWidth&&(i.maxWidth<l.width),m=a(l.height)&&i.maxHeight&&(i.maxHeight<l.height),h=a(l.width)&&i.minWidth&&(i.minWidth>l.width),s=a(l.height)&&i.minHeight&&(i.minHeight>l.height);if(h){l.width=i.minWidth}if(s){l.height=i.minHeight}if(u){l.width=i.maxWidth}if(m){l.height=i.maxHeight}var f=this.originalPosition.left+this.originalSize.width,p=this.position.top+this.size.height;var k=/sw|nw|w/.test(q),e=/nw|ne|n/.test(q);if(h&&k){l.left=f-i.minWidth}if(u&&k){l.left=f-i.maxWidth}if(s&&e){l.top=p-i.minHeight}if(m&&e){l.top=p-i.maxHeight}var n=!l.width&&!l.height;if(n&&!l.left&&l.top){l.top=null}else{if(n&&!l.top&&l.left){l.left=null}}return l},_proportionallyResize:function(){var k=this.options;if(!this._proportionallyResizeElements.length){return}var g=this.helper||this.element;for(var f=0;f<this._proportionallyResizeElements.length;f++){var h=this._proportionallyResizeElements[f];if(!this.borderDif){var e=[h.css("borderTopWidth"),h.css("borderRightWidth"),h.css("borderBottomWidth"),h.css("borderLeftWidth")],j=[h.css("paddingTop"),h.css("paddingRight"),h.css("paddingBottom"),h.css("paddingLeft")];this.borderDif=c.map(e,function(l,n){var m=parseInt(l,10)||0,o=parseInt(j[n],10)||0;return m+o})}if(c.browser.msie&&!(!(c(g).is(":hidden")||c(g).parents(":hidden").length))){continue}h.css({height:(g.height()-this.borderDif[0]-this.borderDif[2])||0,width:(g.width()-this.borderDif[1]-this.borderDif[3])||0})}},_renderProxy:function(){var f=this.element,i=this.options;this.elementOffset=f.offset();if(this._helper){this.helper=this.helper||c('<div style="overflow:hidden;"></div>');var e=c.browser.msie&&c.browser.version<7,g=(e?1:0),h=(e?2:-1);this.helper.addClass(this._helper).css({width:this.element.outerWidth()+h,height:this.element.outerHeight()+h,position:"absolute",left:this.elementOffset.left-g+"px",top:this.elementOffset.top-g+"px",zIndex:++i.zIndex});this.helper.appendTo("body").disableSelection()}else{this.helper=this.element}},_change:{e:function(g,f,e){return{width:this.originalSize.width+f}},w:function(h,f,e){var j=this.options,g=this.originalSize,i=this.originalPosition;return{left:i.left+f,width:g.width-f}},n:function(h,f,e){var j=this.options,g=this.originalSize,i=this.originalPosition;return{top:i.top+e,height:g.height-e}},s:function(g,f,e){return{height:this.originalSize.height+e}},se:function(g,f,e){return c.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[g,f,e]))},sw:function(g,f,e){return c.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[g,f,e]))},ne:function(g,f,e){return c.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[g,f,e]))},nw:function(g,f,e){return c.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[g,f,e]))}},_propagate:function(f,e){c.ui.plugin.call(this,f,[e,this.ui()]);(f!="resize"&&this._trigger(f,e,this.ui()))},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});c.extend(c.ui.resizable,{version:"1.8.16"});c.ui.plugin.add("resizable","alsoResize",{start:function(f,g){var e=c(this).data("resizable"),i=e.options;var h=function(j){c(j).each(function(){var k=c(this);k.data("resizable-alsoresize",{width:parseInt(k.width(),10),height:parseInt(k.height(),10),left:parseInt(k.css("left"),10),top:parseInt(k.css("top"),10),position:k.css("position")})})};if(typeof(i.alsoResize)=="object"&&!i.alsoResize.parentNode){if(i.alsoResize.length){i.alsoResize=i.alsoResize[0];h(i.alsoResize)}else{c.each(i.alsoResize,function(j){h(j)})}}else{h(i.alsoResize)}},resize:function(g,i){var f=c(this).data("resizable"),j=f.options,h=f.originalSize,l=f.originalPosition;var k={height:(f.size.height-h.height)||0,width:(f.size.width-h.width)||0,top:(f.position.top-l.top)||0,left:(f.position.left-l.left)||0},e=function(m,n){c(m).each(function(){var q=c(this),r=c(this).data("resizable-alsoresize"),p={},o=n&&n.length?n:q.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];c.each(o,function(s,v){var u=(r[v]||0)+(k[v]||0);if(u&&u>=0){p[v]=u||null}});if(c.browser.opera&&/relative/.test(q.css("position"))){f._revertToRelativePosition=true;q.css({position:"absolute",top:"auto",left:"auto"})}q.css(p)})};if(typeof(j.alsoResize)=="object"&&!j.alsoResize.nodeType){c.each(j.alsoResize,function(m,n){e(m,n)})}else{e(j.alsoResize)}},stop:function(g,h){var f=c(this).data("resizable"),i=f.options;var e=function(j){c(j).each(function(){var k=c(this);k.css({position:k.data("resizable-alsoresize").position})})};if(f._revertToRelativePosition){f._revertToRelativePosition=false;if(typeof(i.alsoResize)=="object"&&!i.alsoResize.nodeType){c.each(i.alsoResize,function(j){e(j)})}else{e(i.alsoResize)}}c(this).removeData("resizable-alsoresize")}});c.ui.plugin.add("resizable","animate",{stop:function(i,n){var p=c(this).data("resizable"),j=p.options;var h=p._proportionallyResizeElements,e=h.length&&(/textarea/i).test(h[0].nodeName),f=e&&c.ui.hasScroll(h[0],"left")?0:p.sizeDiff.height,l=e?0:p.sizeDiff.width;var g={width:(p.size.width-l),height:(p.size.height-f)},k=(parseInt(p.element.css("left"),10)+(p.position.left-p.originalPosition.left))||null,m=(parseInt(p.element.css("top"),10)+(p.position.top-p.originalPosition.top))||null;p.element.animate(c.extend(g,m&&k?{top:m,left:k}:{}),{duration:j.animateDuration,easing:j.animateEasing,step:function(){var o={width:parseInt(p.element.css("width"),10),height:parseInt(p.element.css("height"),10),top:parseInt(p.element.css("top"),10),left:parseInt(p.element.css("left"),10)};if(h&&h.length){c(h[0]).css({width:o.width,height:o.height})}p._updateCache(o);p._propagate("resize",i)}})}});c.ui.plugin.add("resizable","containment",{start:function(f,r){var u=c(this).data("resizable"),j=u.options,l=u.element;var g=j.containment,k=(g instanceof c)?g.get(0):(/parent/.test(g))?l.parent().get(0):g;if(!k){return}u.containerElement=c(k);if(/document/.test(g)||g==document){u.containerOffset={left:0,top:0};u.containerPosition={left:0,top:0};u.parentData={element:c(document),left:0,top:0,width:c(document).width(),height:c(document).height()||document.body.parentNode.scrollHeight}}else{var n=c(k),i=[];c(["Top","Right","Left","Bottom"]).each(function(p,o){i[p]=b(n.css("padding"+o))});u.containerOffset=n.offset();u.containerPosition=n.position();u.containerSize={height:(n.innerHeight()-i[3]),width:(n.innerWidth()-i[1])};var q=u.containerOffset,e=u.containerSize.height,m=u.containerSize.width,h=(c.ui.hasScroll(k,"left")?k.scrollWidth:m),s=(c.ui.hasScroll(k)?k.scrollHeight:e);u.parentData={element:k,left:q.left,top:q.top,width:h,height:s}}},resize:function(g,q){var u=c(this).data("resizable"),i=u.options,f=u.containerSize,p=u.containerOffset,m=u.size,n=u.position,r=u._aspectRatio||g.shiftKey,e={top:0,left:0},h=u.containerElement;if(h[0]!=document&&(/static/).test(h.css("position"))){e=p}if(n.left<(u._helper?p.left:0)){u.size.width=u.size.width+(u._helper?(u.position.left-p.left):(u.position.left-e.left));if(r){u.size.height=u.size.width/i.aspectRatio}u.position.left=i.helper?p.left:0}if(n.top<(u._helper?p.top:0)){u.size.height=u.size.height+(u._helper?(u.position.top-p.top):u.position.top);if(r){u.size.width=u.size.height*i.aspectRatio}u.position.top=u._helper?p.top:0}u.offset.left=u.parentData.left+u.position.left;u.offset.top=u.parentData.top+u.position.top;var l=Math.abs((u._helper?u.offset.left-e.left:(u.offset.left-e.left))+u.sizeDiff.width),s=Math.abs((u._helper?u.offset.top-e.top:(u.offset.top-p.top))+u.sizeDiff.height);var k=u.containerElement.get(0)==u.element.parent().get(0),j=/relative|absolute/.test(u.containerElement.css("position"));if(k&&j){l-=u.parentData.left}if(l+u.size.width>=u.parentData.width){u.size.width=u.parentData.width-l;if(r){u.size.height=u.size.width/u.aspectRatio}}if(s+u.size.height>=u.parentData.height){u.size.height=u.parentData.height-s;if(r){u.size.width=u.size.height*u.aspectRatio}}},stop:function(f,n){var q=c(this).data("resizable"),g=q.options,l=q.position,m=q.containerOffset,e=q.containerPosition,i=q.containerElement;var j=c(q.helper),r=j.offset(),p=j.outerWidth()-q.sizeDiff.width,k=j.outerHeight()-q.sizeDiff.height;if(q._helper&&!g.animate&&(/relative/).test(i.css("position"))){c(this).css({left:r.left-e.left-m.left,width:p,height:k})}if(q._helper&&!g.animate&&(/static/).test(i.css("position"))){c(this).css({left:r.left-e.left-m.left,width:p,height:k})}}});c.ui.plugin.add("resizable","ghost",{start:function(g,h){var e=c(this).data("resizable"),i=e.options,f=e.size;e.ghost=e.originalElement.clone();e.ghost.css({opacity:0.25,display:"block",position:"relative",height:f.height,width:f.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof i.ghost=="string"?i.ghost:"");e.ghost.appendTo(e.helper)},resize:function(f,g){var e=c(this).data("resizable"),h=e.options;if(e.ghost){e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})}},stop:function(f,g){var e=c(this).data("resizable"),h=e.options;if(e.ghost&&e.helper){e.helper.get(0).removeChild(e.ghost.get(0))}}});c.ui.plugin.add("resizable","grid",{resize:function(e,m){var p=c(this).data("resizable"),h=p.options,k=p.size,i=p.originalSize,j=p.originalPosition,n=p.axis,l=h._aspectRatio||e.shiftKey;h.grid=typeof h.grid=="number"?[h.grid,h.grid]:h.grid;var g=Math.round((k.width-i.width)/(h.grid[0]||1))*(h.grid[0]||1),f=Math.round((k.height-i.height)/(h.grid[1]||1))*(h.grid[1]||1);if(/^(se|s|e)$/.test(n)){p.size.width=i.width+g;p.size.height=i.height+f}else{if(/^(ne)$/.test(n)){p.size.width=i.width+g;p.size.height=i.height+f;p.position.top=j.top-f}else{if(/^(sw)$/.test(n)){p.size.width=i.width+g;p.size.height=i.height+f;p.position.left=j.left-g}else{p.size.width=i.width+g;p.size.height=i.height+f;p.position.top=j.top-f;p.position.left=j.left-g}}}}});var b=function(e){return parseInt(e,10)||0};var a=function(e){return !isNaN(parseInt(e,10))}})(jQuery);(function(a,b){a.widget("ui.selectable",a.ui.mouse,{options:{appendTo:"body",autoRefresh:true,distance:0,filter:"*",tolerance:"touch"},_create:function(){var c=this;this.element.addClass("ui-selectable");this.dragged=false;var d;this.refresh=function(){d=a(c.options.filter,c.element[0]);d.each(function(){var e=a(this);var f=e.offset();a.data(this,"selectable-item",{element:this,$element:e,left:f.left,top:f.top,right:f.left+e.outerWidth(),bottom:f.top+e.outerHeight(),startselected:false,selected:e.hasClass("ui-selected"),selecting:e.hasClass("ui-selecting"),unselecting:e.hasClass("ui-unselecting")})})};this.refresh();this.selectees=d.addClass("ui-selectee");this._mouseInit();this.helper=a("<div class='ui-selectable-helper'></div>")},destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item");this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");this._mouseDestroy();return this},_mouseStart:function(e){var c=this;this.opos=[e.pageX,e.pageY];if(this.options.disabled){return}var d=this.options;this.selectees=a(d.filter,this.element[0]);this._trigger("start",e);a(d.appendTo).append(this.helper);this.helper.css({left:e.clientX,top:e.clientY,width:0,height:0});if(d.autoRefresh){this.refresh()}this.selectees.filter(".ui-selected").each(function(){var f=a.data(this,"selectable-item");f.startselected=true;if(!e.metaKey){f.$element.removeClass("ui-selected");f.selected=false;f.$element.addClass("ui-unselecting");f.unselecting=true;c._trigger("unselecting",e,{unselecting:f.element})}});a(e.target).parents().andSelf().each(function(){var g=a.data(this,"selectable-item");if(g){var f=!e.metaKey||!g.$element.hasClass("ui-selected");g.$element.removeClass(f?"ui-unselecting":"ui-selected").addClass(f?"ui-selecting":"ui-unselecting");g.unselecting=!f;g.selecting=f;g.selected=f;if(f){c._trigger("selecting",e,{selecting:g.element})}else{c._trigger("unselecting",e,{unselecting:g.element})}return false}})},_mouseDrag:function(j){var d=this;this.dragged=true;if(this.options.disabled){return}var f=this.options;var e=this.opos[0],i=this.opos[1],c=j.pageX,h=j.pageY;if(e>c){var g=c;c=e;e=g}if(i>h){var g=h;h=i;i=g}this.helper.css({left:e,top:i,width:c-e,height:h-i});this.selectees.each(function(){var k=a.data(this,"selectable-item");if(!k||k.element==d.element[0]){return}var l=false;if(f.tolerance=="touch"){l=(!(k.left>c||k.right<e||k.top>h||k.bottom<i))}else{if(f.tolerance=="fit"){l=(k.left>e&&k.right<c&&k.top>i&&k.bottom<h)}}if(l){if(k.selected){k.$element.removeClass("ui-selected");k.selected=false}if(k.unselecting){k.$element.removeClass("ui-unselecting");k.unselecting=false}if(!k.selecting){k.$element.addClass("ui-selecting");k.selecting=true;d._trigger("selecting",j,{selecting:k.element})}}else{if(k.selecting){if(j.metaKey&&k.startselected){k.$element.removeClass("ui-selecting");k.selecting=false;k.$element.addClass("ui-selected");k.selected=true}else{k.$element.removeClass("ui-selecting");k.selecting=false;if(k.startselected){k.$element.addClass("ui-unselecting");k.unselecting=true}d._trigger("unselecting",j,{unselecting:k.element})}}if(k.selected){if(!j.metaKey&&!k.startselected){k.$element.removeClass("ui-selected");k.selected=false;k.$element.addClass("ui-unselecting");k.unselecting=true;d._trigger("unselecting",j,{unselecting:k.element})}}}});return false},_mouseStop:function(e){var c=this;this.dragged=false;var d=this.options;a(".ui-unselecting",this.element[0]).each(function(){var f=a.data(this,"selectable-item");f.$element.removeClass("ui-unselecting");f.unselecting=false;f.startselected=false;c._trigger("unselected",e,{unselected:f.element})});a(".ui-selecting",this.element[0]).each(function(){var f=a.data(this,"selectable-item");f.$element.removeClass("ui-selecting").addClass("ui-selected");f.selecting=false;f.selected=true;f.startselected=true;c._trigger("selected",e,{selected:f.element})});this._trigger("stop",e);this.helper.remove();return false}});a.extend(a.ui.selectable,{version:"1.8.16"})})(jQuery);(function(a,b){a.widget("ui.sortable",a.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var c=this.options;this.containerCache={};this.element.addClass("ui-sortable");this.refresh();this.floating=this.items.length?c.axis==="x"||(/left|right/).test(this.items[0].item.css("float"))||(/inline|table-cell/).test(this.items[0].item.css("display")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var c=this.items.length-1;c>=0;c--){this.items[c].item.removeData("sortable-item")}return this},_setOption:function(c,d){if(c==="disabled"){this.options[c]=d;this.widget()[d?"addClass":"removeClass"]("ui-sortable-disabled")}else{a.Widget.prototype._setOption.apply(this,arguments)}},_mouseCapture:function(f,g){if(this.reverting){return false}if(this.options.disabled||this.options.type=="static"){return false}this._refreshItems(f);var e=null,d=this,c=a(f.target).parents().each(function(){if(a.data(this,"sortable-item")==d){e=a(this);return false}});if(a.data(f.target,"sortable-item")==d){e=a(f.target)}if(!e){return false}if(this.options.handle&&!g){var h=false;a(this.options.handle,e).find("*").andSelf().each(function(){if(this==f.target){h=true}});if(!h){return false}}this.currentItem=e;this._removeCurrentsFromItems();return true},_mouseStart:function(f,g,c){var h=this.options,d=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(f);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");a.extend(this.offset,{click:{left:f.pageX-this.offset.left,top:f.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(f);this.originalPageX=f.pageX;this.originalPageY=f.pageY;(h.cursorAt&&this._adjustOffsetFromHelper(h.cursorAt));this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};if(this.helper[0]!=this.currentItem[0]){this.currentItem.hide()}this._createPlaceholder();if(h.containment){this._setContainment()}if(h.cursor){if(a("body").css("cursor")){this._storedCursor=a("body").css("cursor")}a("body").css("cursor",h.cursor)}if(h.opacity){if(this.helper.css("opacity")){this._storedOpacity=this.helper.css("opacity")}this.helper.css("opacity",h.opacity)}if(h.zIndex){if(this.helper.css("zIndex")){this._storedZIndex=this.helper.css("zIndex")}this.helper.css("zIndex",h.zIndex)}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){this.overflowOffset=this.scrollParent.offset()}this._trigger("start",f,this._uiHash());if(!this._preserveHelperProportions){this._cacheHelperProportions()}if(!c){for(var e=this.containers.length-1;e>=0;e--){this.containers[e]._trigger("activate",f,d._uiHash(this))}}if(a.ui.ddmanager){a.ui.ddmanager.current=this}if(a.ui.ddmanager&&!h.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,f)}this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(f);return true},_mouseDrag:function(g){this.position=this._generatePosition(g);this.positionAbs=this._convertPositionTo("absolute");if(!this.lastPositionAbs){this.lastPositionAbs=this.positionAbs}if(this.options.scroll){var h=this.options,c=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if((this.overflowOffset.top+this.scrollParent[0].offsetHeight)-g.pageY<h.scrollSensitivity){this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop+h.scrollSpeed}else{if(g.pageY-this.overflowOffset.top<h.scrollSensitivity){this.scrollParent[0].scrollTop=c=this.scrollParent[0].scrollTop-h.scrollSpeed}}if((this.overflowOffset.left+this.scrollParent[0].offsetWidth)-g.pageX<h.scrollSensitivity){this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft+h.scrollSpeed}else{if(g.pageX-this.overflowOffset.left<h.scrollSensitivity){this.scrollParent[0].scrollLeft=c=this.scrollParent[0].scrollLeft-h.scrollSpeed}}}else{if(g.pageY-a(document).scrollTop()<h.scrollSensitivity){c=a(document).scrollTop(a(document).scrollTop()-h.scrollSpeed)}else{if(a(window).height()-(g.pageY-a(document).scrollTop())<h.scrollSensitivity){c=a(document).scrollTop(a(document).scrollTop()+h.scrollSpeed)}}if(g.pageX-a(document).scrollLeft()<h.scrollSensitivity){c=a(document).scrollLeft(a(document).scrollLeft()-h.scrollSpeed)}else{if(a(window).width()-(g.pageX-a(document).scrollLeft())<h.scrollSensitivity){c=a(document).scrollLeft(a(document).scrollLeft()+h.scrollSpeed)}}}if(c!==false&&a.ui.ddmanager&&!h.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,g)}}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}for(var e=this.items.length-1;e>=0;e--){var f=this.items[e],d=f.item[0],j=this._intersectsWithPointer(f);if(!j){continue}if(d!=this.currentItem[0]&&this.placeholder[j==1?"next":"prev"]()[0]!=d&&!a.ui.contains(this.placeholder[0],d)&&(this.options.type=="semi-dynamic"?!a.ui.contains(this.element[0],d):true)){this.direction=j==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(f)){this._rearrange(g,f)}else{break}this._trigger("change",g,this._uiHash());break}}this._contactContainers(g);if(a.ui.ddmanager){a.ui.ddmanager.drag(this,g)}this._trigger("sort",g,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(d,e){if(!d){return}if(a.ui.ddmanager&&!this.options.dropBehaviour){a.ui.ddmanager.drop(this,d)}if(this.options.revert){var c=this;var f=c.placeholder.offset();c.reverting=true;a(this.helper).animate({left:f.left-this.offset.parent.left-c.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:f.top-this.offset.parent.top-c.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){c._clear(d)})}else{this._clear(d,e)}return false},cancel:function(){var c=this;if(this.dragging){this._mouseUp({target:null});if(this.options.helper=="original"){this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else{this.currentItem.show()}for(var d=this.containers.length-1;d>=0;d--){this.containers[d]._trigger("deactivate",null,c._uiHash(this));if(this.containers[d].containerCache.over){this.containers[d]._trigger("out",null,c._uiHash(this));this.containers[d].containerCache.over=0}}}if(this.placeholder){if(this.placeholder[0].parentNode){this.placeholder[0].parentNode.removeChild(this.placeholder[0])}if(this.options.helper!="original"&&this.helper&&this.helper[0].parentNode){this.helper.remove()}a.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});if(this.domPosition.prev){a(this.domPosition.prev).after(this.currentItem)}else{a(this.domPosition.parent).prepend(this.currentItem)}}return this},serialize:function(e){var c=this._getItemsAsjQuery(e&&e.connected);var d=[];e=e||{};a(c).each(function(){var f=(a(e.item||this).attr(e.attribute||"id")||"").match(e.expression||(/(.+)[-=_](.+)/));if(f){d.push((e.key||f[1]+"[]")+"="+(e.key&&e.expression?f[1]:f[2]))}});if(!d.length&&e.key){d.push(e.key+"=")}return d.join("&")},toArray:function(e){var c=this._getItemsAsjQuery(e&&e.connected);var d=[];e=e||{};c.each(function(){d.push(a(e.item||this).attr(e.attribute||"id")||"")});return d},_intersectsWith:function(m){var e=this.positionAbs.left,d=e+this.helperProportions.width,k=this.positionAbs.top,j=k+this.helperProportions.height;var f=m.left,c=f+m.width,n=m.top,i=n+m.height;var o=this.offset.click.top,h=this.offset.click.left;var g=(k+o)>n&&(k+o)<i&&(e+h)>f&&(e+h)<c;if(this.options.tolerance=="pointer"||this.options.forcePointerForContainers||(this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>m[this.floating?"width":"height"])){return g}else{return(f<e+(this.helperProportions.width/2)&&d-(this.helperProportions.width/2)<c&&n<k+(this.helperProportions.height/2)&&j-(this.helperProportions.height/2)<i)}},_intersectsWithPointer:function(e){var f=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,e.top,e.height),d=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,e.left,e.width),h=f&&d,c=this._getDragVerticalDirection(),g=this._getDragHorizontalDirection();if(!h){return false}return this.floating?(((g&&g=="right")||c=="down")?2:1):(c&&(c=="down"?2:1))},_intersectsWithSides:function(f){var d=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,f.top+(f.height/2),f.height),e=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,f.left+(f.width/2),f.width),c=this._getDragVerticalDirection(),g=this._getDragHorizontalDirection();if(this.floating&&g){return((g=="right"&&e)||(g=="left"&&!e))}else{return c&&((c=="down"&&d)||(c=="up"&&!d))}},_getDragVerticalDirection:function(){var c=this.positionAbs.top-this.lastPositionAbs.top;return c!=0&&(c>0?"down":"up")},_getDragHorizontalDirection:function(){var c=this.positionAbs.left-this.lastPositionAbs.left;return c!=0&&(c>0?"right":"left")},refresh:function(c){this._refreshItems(c);this.refreshPositions();return this},_connectWith:function(){var c=this.options;return c.connectWith.constructor==String?[c.connectWith]:c.connectWith},_getItemsAsjQuery:function(c){var m=this;var h=[];var f=[];var k=this._connectWith();if(k&&c){for(var e=k.length-1;e>=0;e--){var l=a(k[e]);for(var d=l.length-1;d>=0;d--){var g=a.data(l[d],"sortable");if(g&&g!=this&&!g.options.disabled){f.push([a.isFunction(g.options.items)?g.options.items.call(g.element):a(g.options.items,g.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),g])}}}}f.push([a.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):a(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var e=f.length-1;e>=0;e--){f[e][0].each(function(){h.push(this)})}return a(h)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data(sortable-item)");for(var d=0;d<this.items.length;d++){for(var c=0;c<e.length;c++){if(e[c]==this.items[d].item[0]){this.items.splice(d,1)}}}},_refreshItems:function(c){this.items=[];this.containers=[this];var k=this.items;var q=this;var g=[[a.isFunction(this.options.items)?this.options.items.call(this.element[0],c,{item:this.currentItem}):a(this.options.items,this.element),this]];var m=this._connectWith();if(m){for(var f=m.length-1;f>=0;f--){var n=a(m[f]);for(var e=n.length-1;e>=0;e--){var h=a.data(n[e],"sortable");if(h&&h!=this&&!h.options.disabled){g.push([a.isFunction(h.options.items)?h.options.items.call(h.element[0],c,{item:this.currentItem}):a(h.options.items,h.element),h]);this.containers.push(h)}}}}for(var f=g.length-1;f>=0;f--){var l=g[f][1];var d=g[f][0];for(var e=0,o=d.length;e<o;e++){var p=a(d[e]);p.data("sortable-item",l);k.push({item:p,instance:l,width:0,height:0,left:0,top:0})}}},refreshPositions:function(c){if(this.offsetParent&&this.helper){this.offset.parent=this._getParentOffset()}for(var e=this.items.length-1;e>=0;e--){var f=this.items[e];if(f.instance!=this.currentContainer&&this.currentContainer&&f.item[0]!=this.currentItem[0]){continue}var d=this.options.toleranceElement?a(this.options.toleranceElement,f.item):f.item;if(!c){f.width=d.outerWidth();f.height=d.outerHeight()}var g=d.offset();f.left=g.left;f.top=g.top}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this)}else{for(var e=this.containers.length-1;e>=0;e--){var g=this.containers[e].element.offset();this.containers[e].containerCache.left=g.left;this.containers[e].containerCache.top=g.top;this.containers[e].containerCache.width=this.containers[e].element.outerWidth();this.containers[e].containerCache.height=this.containers[e].element.outerHeight()}}return this},_createPlaceholder:function(e){var c=e||this,f=c.options;if(!f.placeholder||f.placeholder.constructor==String){var d=f.placeholder;f.placeholder={element:function(){var g=a(document.createElement(c.currentItem[0].nodeName)).addClass(d||c.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];if(!d){g.style.visibility="hidden"}return g},update:function(g,h){if(d&&!f.forcePlaceholderSize){return}if(!h.height()){h.height(c.currentItem.innerHeight()-parseInt(c.currentItem.css("paddingTop")||0,10)-parseInt(c.currentItem.css("paddingBottom")||0,10))}if(!h.width()){h.width(c.currentItem.innerWidth()-parseInt(c.currentItem.css("paddingLeft")||0,10)-parseInt(c.currentItem.css("paddingRight")||0,10))}}}}c.placeholder=a(f.placeholder.element.call(c.element,c.currentItem));c.currentItem.after(c.placeholder);f.placeholder.update(c,c.placeholder)},_contactContainers:function(c){var e=null,l=null;for(var g=this.containers.length-1;g>=0;g--){if(a.ui.contains(this.currentItem[0],this.containers[g].element[0])){continue}if(this._intersectsWith(this.containers[g].containerCache)){if(e&&a.ui.contains(this.containers[g].element[0],e.element[0])){continue}e=this.containers[g];l=g}else{if(this.containers[g].containerCache.over){this.containers[g]._trigger("out",c,this._uiHash(this));this.containers[g].containerCache.over=0}}}if(!e){return}if(this.containers.length===1){this.containers[l]._trigger("over",c,this._uiHash(this));this.containers[l].containerCache.over=1}else{if(this.currentContainer!=this.containers[l]){var k=10000;var h=null;var d=this.positionAbs[this.containers[l].floating?"left":"top"];for(var f=this.items.length-1;f>=0;f--){if(!a.ui.contains(this.containers[l].element[0],this.items[f].item[0])){continue}var m=this.items[f][this.containers[l].floating?"left":"top"];if(Math.abs(m-d)<k){k=Math.abs(m-d);h=this.items[f]}}if(!h&&!this.options.dropOnEmpty){return}this.currentContainer=this.containers[l];h?this._rearrange(c,h,null,true):this._rearrange(c,null,this.containers[l].element,true);this._trigger("change",c,this._uiHash());this.containers[l]._trigger("change",c,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[l]._trigger("over",c,this._uiHash(this));this.containers[l].containerCache.over=1}}},_createHelper:function(d){var e=this.options;var c=a.isFunction(e.helper)?a(e.helper.apply(this.element[0],[d,this.currentItem])):(e.helper=="clone"?this.currentItem.clone():this.currentItem);if(!c.parents("body").length){a(e.appendTo!="parent"?e.appendTo:this.currentItem[0].parentNode)[0].appendChild(c[0])}if(c[0]==this.currentItem[0]){this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}}if(c[0].style.width==""||e.forceHelperSize){c.width(this.currentItem.width())}if(c[0].style.height==""||e.forceHelperSize){c.height(this.currentItem.height())}return c},_adjustOffsetFromHelper:function(c){if(typeof c=="string"){c=c.split(" ")}if(a.isArray(c)){c={left:+c[0],top:+c[1]||0}}if("left" in c){this.offset.click.left=c.left+this.margins.left}if("right" in c){this.offset.click.left=this.helperProportions.width-c.right+this.margins.left}if("top" in c){this.offset.click.top=c.top+this.margins.top}if("bottom" in c){this.offset.click.top=this.helperProportions.height-c.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var c=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])){c.left+=this.scrollParent.scrollLeft();c.top+=this.scrollParent.scrollTop()}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)){c={top:0,left:0}}return{top:c.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:c.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var c=this.currentItem.position();return{top:c.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:c.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:(parseInt(this.currentItem.css("marginLeft"),10)||0),top:(parseInt(this.currentItem.css("marginTop"),10)||0)}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var f=this.options;if(f.containment=="parent"){f.containment=this.helper[0].parentNode}if(f.containment=="document"||f.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,a(f.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a(f.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!(/^(document|window|parent)$/).test(f.containment)){var d=a(f.containment)[0];var e=a(f.containment).offset();var c=(a(d).css("overflow")!="hidden");this.containment=[e.left+(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0)-this.margins.left,e.top+(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0)-this.margins.top,e.left+(c?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,e.top+(c?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(g,i){if(!i){i=this.position}var e=g=="absolute"?1:-1;var f=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,h=(/(html|body)/i).test(c[0].tagName);return{top:(i.top+this.offset.relative.top*e+this.offset.parent.top*e-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(h?0:c.scrollTop()))*e)),left:(i.left+this.offset.relative.left*e+this.offset.parent.left*e-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():h?0:c.scrollLeft())*e))}},_generatePosition:function(f){var i=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,j=(/(html|body)/i).test(c[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0])){this.offset.relative=this._getRelativeOffset()}var e=f.pageX;var d=f.pageY;if(this.originalPosition){if(this.containment){if(f.pageX-this.offset.click.left<this.containment[0]){e=this.containment[0]+this.offset.click.left}if(f.pageY-this.offset.click.top<this.containment[1]){d=this.containment[1]+this.offset.click.top}if(f.pageX-this.offset.click.left>this.containment[2]){e=this.containment[2]+this.offset.click.left}if(f.pageY-this.offset.click.top>this.containment[3]){d=this.containment[3]+this.offset.click.top}}if(i.grid){var h=this.originalPageY+Math.round((d-this.originalPageY)/i.grid[1])*i.grid[1];d=this.containment?(!(h-this.offset.click.top<this.containment[1]||h-this.offset.click.top>this.containment[3])?h:(!(h-this.offset.click.top<this.containment[1])?h-i.grid[1]:h+i.grid[1])):h;var g=this.originalPageX+Math.round((e-this.originalPageX)/i.grid[0])*i.grid[0];e=this.containment?(!(g-this.offset.click.left<this.containment[0]||g-this.offset.click.left>this.containment[2])?g:(!(g-this.offset.click.left<this.containment[0])?g-i.grid[0]:g+i.grid[0])):g}}return{top:(d-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(j?0:c.scrollTop())))),left:(e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():j?0:c.scrollLeft())))}},_rearrange:function(h,g,d,f){d?d[0].appendChild(this.placeholder[0]):g.item[0].parentNode.insertBefore(this.placeholder[0],(this.direction=="down"?g.item[0]:g.item[0].nextSibling));this.counter=this.counter?++this.counter:1;var e=this,c=this.counter;window.setTimeout(function(){if(c==e.counter){e.refreshPositions(!f)}},0)},_clear:function(e,f){this.reverting=false;var g=[],c=this;if(!this._noFinalSort&&this.currentItem.parent().length){this.placeholder.before(this.currentItem)}this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var d in this._storedCSS){if(this._storedCSS[d]=="auto"||this._storedCSS[d]=="static"){this._storedCSS[d]=""}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else{this.currentItem.show()}if(this.fromOutside&&!f){g.push(function(h){this._trigger("receive",h,this._uiHash(this.fromOutside))})}if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!f){g.push(function(h){this._trigger("update",h,this._uiHash())})}if(!a.ui.contains(this.element[0],this.currentItem[0])){if(!f){g.push(function(h){this._trigger("remove",h,this._uiHash())})}for(var d=this.containers.length-1;d>=0;d--){if(a.ui.contains(this.containers[d].element[0],this.currentItem[0])&&!f){g.push((function(h){return function(i){h._trigger("receive",i,this._uiHash(this))}}).call(this,this.containers[d]));g.push((function(h){return function(i){h._trigger("update",i,this._uiHash(this))}}).call(this,this.containers[d]))}}}for(var d=this.containers.length-1;d>=0;d--){if(!f){g.push((function(h){return function(i){h._trigger("deactivate",i,this._uiHash(this))}}).call(this,this.containers[d]))}if(this.containers[d].containerCache.over){g.push((function(h){return function(i){h._trigger("out",i,this._uiHash(this))}}).call(this,this.containers[d]));this.containers[d].containerCache.over=0}}if(this._storedCursor){a("body").css("cursor",this._storedCursor)}if(this._storedOpacity){this.helper.css("opacity",this._storedOpacity)}if(this._storedZIndex){this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex)}this.dragging=false;if(this.cancelHelperRemoval){if(!f){this._trigger("beforeStop",e,this._uiHash());for(var d=0;d<g.length;d++){g[d].call(this,e)}this._trigger("stop",e,this._uiHash())}return false}if(!f){this._trigger("beforeStop",e,this._uiHash())}this.placeholder[0].parentNode.removeChild(this.placeholder[0]);if(this.helper[0]!=this.currentItem[0]){this.helper.remove()}this.helper=null;if(!f){for(var d=0;d<g.length;d++){g[d].call(this,e)}this._trigger("stop",e,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){if(a.Widget.prototype._trigger.apply(this,arguments)===false){this.cancel()}},_uiHash:function(d){var c=d||this;return{helper:c.helper,placeholder:c.placeholder||a([]),position:c.position,originalPosition:c.originalPosition,offset:c.positionAbs,item:c.currentItem,sender:d?d.element:null}}});a.extend(a.ui.sortable,{version:"1.8.16"})})(jQuery);(function(a,b){a.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:true,clearStyle:false,collapsible:false,event:"click",fillSpace:false,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:false,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var c=this,d=c.options;c.running=0;c.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");c.headers=c.element.find(d.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){if(d.disabled){return}a(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){if(d.disabled){return}a(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){if(d.disabled){return}a(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){if(d.disabled){return}a(this).removeClass("ui-state-focus")});c.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");if(d.navigation){var e=c.element.find("a").filter(d.navigationFilter).eq(0);if(e.length){var f=e.closest(".ui-accordion-header");if(f.length){c.active=f}else{c.active=e.closest(".ui-accordion-content").prev()}}}c.active=c._findActive(c.active||d.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");c.active.next().addClass("ui-accordion-content-active");c._createIcons();c.resize();c.element.attr("role","tablist");c.headers.attr("role","tab").bind("keydown.accordion",function(g){return c._keydown(g)}).next().attr("role","tabpanel");c.headers.not(c.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide();if(!c.active.length){c.headers.eq(0).attr("tabIndex",0)}else{c.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0})}if(!a.browser.safari){c.headers.find("a").attr("tabIndex",-1)}if(d.event){c.headers.bind(d.event.split(" ").join(".accordion ")+".accordion",function(g){c._clickHandler.call(c,g,this);g.preventDefault()})}},_createIcons:function(){var c=this.options;if(c.icons){a("<span></span>").addClass("ui-icon "+c.icons.header).prependTo(this.headers);this.active.children(".ui-icon").toggleClass(c.icons.header).toggleClass(c.icons.headerSelected);this.element.addClass("ui-accordion-icons")}},_destroyIcons:function(){this.headers.children(".ui-icon").remove();this.element.removeClass("ui-accordion-icons")},destroy:function(){var c=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex");this.headers.find("a").removeAttr("tabIndex");this._destroyIcons();var d=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");if(c.autoHeight||c.fillHeight){d.css("height","")}return a.Widget.prototype.destroy.call(this)},_setOption:function(c,d){a.Widget.prototype._setOption.apply(this,arguments);if(c=="active"){this.activate(d)}if(c=="icons"){this._destroyIcons();if(d){this._createIcons()}}if(c=="disabled"){this.headers.add(this.headers.next())[d?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")}},_keydown:function(f){if(this.options.disabled||f.altKey||f.ctrlKey){return}var g=a.ui.keyCode,e=this.headers.length,c=this.headers.index(f.target),d=false;switch(f.keyCode){case g.RIGHT:case g.DOWN:d=this.headers[(c+1)%e];break;case g.LEFT:case g.UP:d=this.headers[(c-1+e)%e];break;case g.SPACE:case g.ENTER:this._clickHandler({target:f.target},f.target);f.preventDefault()}if(d){a(f.target).attr("tabIndex",-1);a(d).attr("tabIndex",0);d.focus();return false}return true},resize:function(){var c=this.options,e;if(c.fillSpace){if(a.browser.msie){var d=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}e=this.element.parent().height();if(a.browser.msie){this.element.parent().css("overflow",d)}this.headers.each(function(){e-=a(this).outerHeight(true)});this.headers.next().each(function(){a(this).height(Math.max(0,e-a(this).innerHeight()+a(this).height()))}).css("overflow","auto")}else{if(c.autoHeight){e=0;this.headers.next().each(function(){e=Math.max(e,a(this).height("").height())}).height(e)}}return this},activate:function(c){this.options.active=c;var d=this._findActive(c)[0];this._clickHandler({target:d},d);return this},_findActive:function(c){return c?typeof c==="number"?this.headers.filter(":eq("+c+")"):this.headers.not(this.headers.not(c)):c===false?a([]):this.headers.filter(":eq(0)")},_clickHandler:function(c,g){var l=this.options;if(l.disabled){return}if(!c.target){if(!l.collapsible){return}this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(l.icons.headerSelected).addClass(l.icons.header);this.active.next().addClass("ui-accordion-content-active");var i=this.active.next(),f={options:l,newHeader:a([]),oldHeader:l.active,newContent:a([]),oldContent:i},d=(this.active=a([]));this._toggle(d,i,f);return}var h=a(c.currentTarget||g),j=h[0]===this.active[0];l.active=l.collapsible&&j?false:this.headers.index(h);if(this.running||(!l.collapsible&&j)){return}var e=this.active,d=h.next(),i=this.active.next(),f={options:l,newHeader:j&&l.collapsible?a([]):h,oldHeader:this.active,newContent:j&&l.collapsible?a([]):d,oldContent:i},k=this.headers.index(this.active[0])>this.headers.index(h[0]);this.active=j?a([]):h;this._toggle(d,i,f,j,k);e.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(l.icons.headerSelected).addClass(l.icons.header);if(!j){h.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(l.icons.header).addClass(l.icons.headerSelected);h.next().addClass("ui-accordion-content-active")}return},_toggle:function(c,i,g,j,k){var m=this,n=m.options;m.toShow=c;m.toHide=i;m.data=g;var d=function(){if(!m){return}return m._completed.apply(m,arguments)};m._trigger("changestart",null,m.data);m.running=i.size()===0?c.size():i.size();if(n.animated){var f={};if(n.collapsible&&j){f={toShow:a([]),toHide:i,complete:d,down:k,autoHeight:n.autoHeight||n.fillSpace}}else{f={toShow:c,toHide:i,complete:d,down:k,autoHeight:n.autoHeight||n.fillSpace}}if(!n.proxied){n.proxied=n.animated}if(!n.proxiedDuration){n.proxiedDuration=n.duration}n.animated=a.isFunction(n.proxied)?n.proxied(f):n.proxied;n.duration=a.isFunction(n.proxiedDuration)?n.proxiedDuration(f):n.proxiedDuration;var l=a.ui.accordion.animations,e=n.duration,h=n.animated;if(h&&!l[h]&&!a.easing[h]){h="slide"}if(!l[h]){l[h]=function(o){this.slide(o,{easing:h,duration:e||700})}}l[h](f)}else{if(n.collapsible&&j){c.toggle()}else{i.hide();c.show()}d(true)}i.prev().attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).blur();c.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(c){this.running=c?0:--this.running;if(this.running){return}if(this.options.clearStyle){this.toShow.add(this.toHide).css({height:"",overflow:""})}this.toHide.removeClass("ui-accordion-content-active");if(this.toHide.length){this.toHide.parent()[0].className=this.toHide.parent()[0].className}this._trigger("change",null,this.data)}});a.extend(a.ui.accordion,{version:"1.8.16",animations:{slide:function(k,i){k=a.extend({easing:"swing",duration:300},k,i);if(!k.toHide.size()){k.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},k);return}if(!k.toShow.size()){k.toHide.animate({height:"hide",paddingTop:"hide",paddingBottom:"hide"},k);return}var d=k.toShow.css("overflow"),h=0,e={},g={},f=["height","paddingTop","paddingBottom"],c;var j=k.toShow;c=j[0].style.width;j.width(parseInt(j.parent().width(),10)-parseInt(j.css("paddingLeft"),10)-parseInt(j.css("paddingRight"),10)-(parseInt(j.css("borderLeftWidth"),10)||0)-(parseInt(j.css("borderRightWidth"),10)||0));a.each(f,function(l,n){g[n]="hide";var m=(""+a.css(k.toShow[0],n)).match(/^([\d+-.]+)(.*)$/);e[n]={value:m[1],unit:m[2]||"px"}});k.toShow.css({height:0,overflow:"hidden"}).show();k.toHide.filter(":hidden").each(k.complete).end().filter(":visible").animate(g,{step:function(l,m){if(m.prop=="height"){h=(m.end-m.start===0)?0:(m.now-m.start)/(m.end-m.start)}k.toShow[0].style[m.prop]=(h*e[m.prop].value)+e[m.prop].unit},duration:k.duration,easing:k.easing,complete:function(){if(!k.autoHeight){k.toShow.css("height","")}k.toShow.css({width:c,overflow:d});k.complete()}})},bounceslide:function(c){this.slide(c,{easing:c.down?"easeOutBounce":"swing",duration:c.down?1000:200})}}})})(jQuery);(function(a,b){var c=0;a.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var d=this,f=this.element[0].ownerDocument,e;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(g){if(d.options.disabled||d.element.propAttr("readOnly")){return}e=false;var h=a.ui.keyCode;switch(g.keyCode){case h.PAGE_UP:d._move("previousPage",g);break;case h.PAGE_DOWN:d._move("nextPage",g);break;case h.UP:d._move("previous",g);g.preventDefault();break;case h.DOWN:d._move("next",g);g.preventDefault();break;case h.ENTER:case h.NUMPAD_ENTER:if(d.menu.active){e=true;g.preventDefault()}case h.TAB:if(!d.menu.active){return}d.menu.select(g);break;case h.ESCAPE:d.element.val(d.term);d.close(g);break;default:clearTimeout(d.searching);d.searching=setTimeout(function(){if(d.term!=d.element.val()){d.selectedItem=null;d.search(null,g)}},d.options.delay);break}}).bind("keypress.autocomplete",function(g){if(e){e=false;g.preventDefault()}}).bind("focus.autocomplete",function(){if(d.options.disabled){return}d.selectedItem=null;d.previous=d.element.val()}).bind("blur.autocomplete",function(g){if(d.options.disabled){return}clearTimeout(d.searching);d.closing=setTimeout(function(){d.close(g);d._change(g)},150)});this._initSource();this.response=function(){return d._response.apply(d,arguments)};this.menu=a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo||"body",f)[0]).mousedown(function(g){var h=d.menu.element[0];if(!a(g.target).closest(".ui-menu-item").length){setTimeout(function(){a(document).one("mousedown",function(i){if(i.target!==d.element[0]&&i.target!==h&&!a.ui.contains(h,i.target)){d.close()}})},1)}setTimeout(function(){clearTimeout(d.closing)},13)}).menu({focus:function(h,i){var g=i.item.data("item.autocomplete");if(false!==d._trigger("focus",h,{item:g})){if(/^key/.test(h.originalEvent.type)){d.element.val(g.value)}}},selected:function(i,j){var h=j.item.data("item.autocomplete"),g=d.previous;if(d.element[0]!==f.activeElement){d.element.focus();d.previous=g;setTimeout(function(){d.previous=g;d.selectedItem=h},1)}if(false!==d._trigger("select",i,{item:h})){d.element.val(h.value)}d.term=d.element.val();d.close(i);d.selectedItem=h},blur:function(g,h){if(d.menu.element.is(":visible")&&(d.element.val()!==d.term)){d.element.val(d.term)}}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");if(a.fn.bgiframe){this.menu.element.bgiframe()}},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");this.menu.element.remove();a.Widget.prototype.destroy.call(this)},_setOption:function(d,e){a.Widget.prototype._setOption.apply(this,arguments);if(d==="source"){this._initSource()}if(d==="appendTo"){this.menu.element.appendTo(a(e||"body",this.element[0].ownerDocument)[0])}if(d==="disabled"&&e&&this.xhr){this.xhr.abort()}},_initSource:function(){var d=this,f,e;if(a.isArray(this.options.source)){f=this.options.source;this.source=function(h,g){g(a.ui.autocomplete.filter(f,h.term))}}else{if(typeof this.options.source==="string"){e=this.options.source;this.source=function(h,g){if(d.xhr){d.xhr.abort()}d.xhr=a.ajax({url:e,data:h,dataType:"json",autocompleteRequest:++c,success:function(j,i){if(this.autocompleteRequest===c){g(j)}},error:function(){if(this.autocompleteRequest===c){g([])}}})}}else{this.source=this.options.source}}},search:function(e,d){e=e!=null?e:this.element.val();this.term=this.element.val();if(e.length<this.options.minLength){return this.close(d)}clearTimeout(this.closing);if(this._trigger("search",d)===false){return}return this._search(e)},_search:function(d){this.pending++;this.element.addClass("ui-autocomplete-loading");this.source({term:d},this.response)},_response:function(d){if(!this.options.disabled&&d&&d.length){d=this._normalize(d);this._suggest(d);this._trigger("open")}else{this.close()}this.pending--;if(!this.pending){this.element.removeClass("ui-autocomplete-loading")}},close:function(d){clearTimeout(this.closing);if(this.menu.element.is(":visible")){this.menu.element.hide();this.menu.deactivate();this._trigger("close",d)}},_change:function(d){if(this.previous!==this.element.val()){this._trigger("change",d,{item:this.selectedItem})}},_normalize:function(d){if(d.length&&d[0].label&&d[0].value){return d}return a.map(d,function(e){if(typeof e==="string"){return{label:e,value:e}}return a.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(d){var e=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(e,d);this.menu.deactivate();this.menu.refresh();e.show();this._resizeMenu();e.position(a.extend({of:this.element},this.options.position));if(this.options.autoFocus){this.menu.next(new a.Event("mouseover"))}},_resizeMenu:function(){var d=this.menu.element;d.outerWidth(Math.max(d.width("").outerWidth(),this.element.outerWidth()))},_renderMenu:function(f,e){var d=this;a.each(e,function(g,h){d._renderItem(f,h)})},_renderItem:function(d,e){return a("<li></li>").data("item.autocomplete",e).append(a("<a></a>").text(e.label)).appendTo(d)},_move:function(e,d){if(!this.menu.element.is(":visible")){this.search(null,d);return}if(this.menu.first()&&/^previous/.test(e)||this.menu.last()&&/^next/.test(e)){this.element.val(this.term);this.menu.deactivate();return}this.menu[e](d)},widget:function(){return this.menu.element}});a.extend(a.ui.autocomplete,{escapeRegex:function(d){return d.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},filter:function(f,d){var e=new RegExp(a.ui.autocomplete.escapeRegex(d),"i");return a.grep(f,function(g){return e.test(g.label||g.value||g)})}})}(jQuery));(function(a){a.widget("ui.menu",{_create:function(){var b=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(c){if(!a(c.target).closest(".ui-menu-item a").length){return}c.preventDefault();b.select(c)});this.refresh()},refresh:function(){var c=this;var b=this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem");b.children("a").addClass("ui-corner-all").attr("tabindex",-1).mouseenter(function(d){c.activate(d,a(this).parent())}).mouseleave(function(){c.deactivate()})},activate:function(e,d){this.deactivate();if(this.hasScroll()){var f=d.offset().top-this.element.offset().top,b=this.element.scrollTop(),c=this.element.height();if(f<0){this.element.scrollTop(b+f)}else{if(f>=c){this.element.scrollTop(b+f-c+d.height())}}}this.active=d.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();this._trigger("focus",e,{item:d})},deactivate:function(){if(!this.active){return}this.active.children("a").removeClass("ui-state-hover").removeAttr("id");this._trigger("blur");this.active=null},next:function(b){this.move("next",".ui-menu-item:first",b)},previous:function(b){this.move("prev",".ui-menu-item:last",b)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(e,d,c){if(!this.active){this.activate(c,this.element.children(d));return}var b=this.active[e+"All"](".ui-menu-item").eq(0);if(b.length){this.activate(c,b)}else{this.activate(c,this.element.children(d))}},nextPage:function(d){if(this.hasScroll()){if(!this.active||this.last()){this.activate(d,this.element.children(".ui-menu-item:first"));return}var e=this.active.offset().top,c=this.element.height(),b=this.element.children(".ui-menu-item").filter(function(){var f=a(this).offset().top-e-c+a(this).height();return f<10&&f>-10});if(!b.length){b=this.element.children(".ui-menu-item:last")}this.activate(d,b)}else{this.activate(d,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))}},previousPage:function(c){if(this.hasScroll()){if(!this.active||this.first()){this.activate(c,this.element.children(".ui-menu-item:last"));return}var d=this.active.offset().top,b=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var e=a(this).offset().top-d+b-a(this).height();return e<10&&e>-10});if(!result.length){result=this.element.children(".ui-menu-item:first")}this.activate(c,result)}else{this.activate(c,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))}},hasScroll:function(){return this.element.height()<this.element[a.fn.prop?"prop":"attr"]("scrollHeight")},select:function(b){this._trigger("selected",b,{item:this.active})}})}(jQuery));(function(f,b){var k,e,a,h,i="ui-button ui-widget ui-state-default ui-corner-all",c="ui-state-hover ui-state-active ",g="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",j=function(){var l=f(this).find(":ui-button");setTimeout(function(){l.button("refresh")},1)},d=function(m){var l=m.name,n=m.form,o=f([]);if(l){if(n){o=f(n).find("[name='"+l+"']")}else{o=f("[name='"+l+"']",m.ownerDocument).filter(function(){return !this.form})}}return o};f.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",j);if(typeof this.options.disabled!=="boolean"){this.options.disabled=this.element.propAttr("disabled")}this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var l=this,n=this.options,o=this.type==="checkbox"||this.type==="radio",p="ui-state-hover"+(!o?" ui-state-active":""),m="ui-state-focus";if(n.label===null){n.label=this.buttonElement.html()}if(this.element.is(":disabled")){n.disabled=true}this.buttonElement.addClass(i).attr("role","button").bind("mouseenter.button",function(){if(n.disabled){return}f(this).addClass("ui-state-hover");if(this===k){f(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){if(n.disabled){return}f(this).removeClass(p)}).bind("click.button",function(q){if(n.disabled){q.preventDefault();q.stopImmediatePropagation()}});this.element.bind("focus.button",function(){l.buttonElement.addClass(m)}).bind("blur.button",function(){l.buttonElement.removeClass(m)});if(o){this.element.bind("change.button",function(){if(h){return}l.refresh()});this.buttonElement.bind("mousedown.button",function(q){if(n.disabled){return}h=false;e=q.pageX;a=q.pageY}).bind("mouseup.button",function(q){if(n.disabled){return}if(e!==q.pageX||a!==q.pageY){h=true}})}if(this.type==="checkbox"){this.buttonElement.bind("click.button",function(){if(n.disabled||h){return false}f(this).toggleClass("ui-state-active");l.buttonElement.attr("aria-pressed",l.element[0].checked)})}else{if(this.type==="radio"){this.buttonElement.bind("click.button",function(){if(n.disabled||h){return false}f(this).addClass("ui-state-active");l.buttonElement.attr("aria-pressed","true");var q=l.element[0];d(q).not(q).map(function(){return f(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")})}else{this.buttonElement.bind("mousedown.button",function(){if(n.disabled){return false}f(this).addClass("ui-state-active");k=this;f(document).one("mouseup",function(){k=null})}).bind("mouseup.button",function(){if(n.disabled){return false}f(this).removeClass("ui-state-active")}).bind("keydown.button",function(q){if(n.disabled){return false}if(q.keyCode==f.ui.keyCode.SPACE||q.keyCode==f.ui.keyCode.ENTER){f(this).addClass("ui-state-active")}}).bind("keyup.button",function(){f(this).removeClass("ui-state-active")});if(this.buttonElement.is("a")){this.buttonElement.keyup(function(q){if(q.keyCode===f.ui.keyCode.SPACE){f(this).click()}})}}}this._setOption("disabled",n.disabled);this._resetButton()},_determineButtonType:function(){if(this.element.is(":checkbox")){this.type="checkbox"}else{if(this.element.is(":radio")){this.type="radio"}else{if(this.element.is("input")){this.type="input"}else{this.type="button"}}}if(this.type==="checkbox"||this.type==="radio"){var l=this.element.parents().filter(":last"),n="label[for='"+this.element.attr("id")+"']";this.buttonElement=l.find(n);if(!this.buttonElement.length){l=l.length?l.siblings():this.element.siblings();this.buttonElement=l.filter(n);if(!this.buttonElement.length){this.buttonElement=l.find(n)}}this.element.addClass("ui-helper-hidden-accessible");var m=this.element.is(":checked");if(m){this.buttonElement.addClass("ui-state-active")}this.buttonElement.attr("aria-pressed",m)}else{this.buttonElement=this.element}},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass(i+" "+c+" "+g).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());if(!this.hasTitle){this.buttonElement.removeAttr("title")}f.Widget.prototype.destroy.call(this)},_setOption:function(l,m){f.Widget.prototype._setOption.apply(this,arguments);if(l==="disabled"){if(m){this.element.propAttr("disabled",true)}else{this.element.propAttr("disabled",false)}return}this._resetButton()},refresh:function(){var l=this.element.is(":disabled");if(l!==this.options.disabled){this._setOption("disabled",l)}if(this.type==="radio"){d(this.element[0]).each(function(){if(f(this).is(":checked")){f(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true")}else{f(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}})}else{if(this.type==="checkbox"){if(this.element.is(":checked")){this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true")}else{this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false")}}}},_resetButton:function(){if(this.type==="input"){if(this.options.label){this.element.val(this.options.label)}return}var p=this.buttonElement.removeClass(g),n=f("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(p.empty()).text(),m=this.options.icons,l=m.primary&&m.secondary,o=[];if(m.primary||m.secondary){if(this.options.text){o.push("ui-button-text-icon"+(l?"s":(m.primary?"-primary":"-secondary")))}if(m.primary){p.prepend("<span class='ui-button-icon-primary ui-icon "+m.primary+"'></span>")}if(m.secondary){p.append("<span class='ui-button-icon-secondary ui-icon "+m.secondary+"'></span>")}if(!this.options.text){o.push(l?"ui-button-icons-only":"ui-button-icon-only");if(!this.hasTitle){p.attr("title",n)}}}else{o.push("ui-button-text-only")}p.addClass(o.join(" "))}});f.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(l,m){if(l==="disabled"){this.buttons.button("option",l,m)}f.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){var l=this.element.css("direction")==="ltr";this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return f(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(l?"ui-corner-left":"ui-corner-right").end().filter(":last").addClass(l?"ui-corner-right":"ui-corner-left").end().end()},destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return f(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");f.Widget.prototype.destroy.call(this)}})}(jQuery));(function(e,f){var c="ui-dialog ui-widget ui-widget-content ui-corner-all ",b={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},d={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true},a=e.attrFn||{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true,click:true};e.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,position:{my:"center",at:"center",collision:"fit",using:function(h){var g=e(this).css(h).offset().top;if(g<0){e(this).css("top",h.top-g)}}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1000},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string"){this.originalTitle=""}this.options.title=this.options.title||this.originalTitle;var o=this,p=o.options,m=p.title||"&#160;",h=e.ui.dialog.getTitleId(o.element),n=(o.uiDialog=e("<div></div>")).appendTo(document.body).hide().addClass(c+p.dialogClass).css({zIndex:p.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(q){if(p.closeOnEscape&&!q.isDefaultPrevented()&&q.keyCode&&q.keyCode===e.ui.keyCode.ESCAPE){o.close(q);q.preventDefault()}}).attr({role:"dialog","aria-labelledby":h}).mousedown(function(q){o.moveToTop(false,q)}),j=o.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(n),i=(o.uiDialogTitlebar=e("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(n),l=e('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){l.addClass("ui-state-hover")},function(){l.removeClass("ui-state-hover")}).focus(function(){l.addClass("ui-state-focus")}).blur(function(){l.removeClass("ui-state-focus")}).click(function(q){o.close(q);return false}).appendTo(i),k=(o.uiDialogTitlebarCloseText=e("<span></span>")).addClass("ui-icon ui-icon-closethick").text(p.closeText).appendTo(l),g=e("<span></span>").addClass("ui-dialog-title").attr("id",h).html(m).prependTo(i);if(e.isFunction(p.beforeclose)&&!e.isFunction(p.beforeClose)){p.beforeClose=p.beforeclose}i.find("*").add(i).disableSelection();if(p.draggable&&e.fn.draggable){o._makeDraggable()}if(p.resizable&&e.fn.resizable){o._makeResizable()}o._createButtons(p.buttons);o._isOpen=false;if(e.fn.bgiframe){n.bgiframe()}},_init:function(){if(this.options.autoOpen){this.open()}},destroy:function(){var g=this;if(g.overlay){g.overlay.destroy()}g.uiDialog.hide();g.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");g.uiDialog.remove();if(g.originalTitle){g.element.attr("title",g.originalTitle)}return g},widget:function(){return this.uiDialog},close:function(j){var g=this,i,h;if(false===g._trigger("beforeClose",j)){return}if(g.overlay){g.overlay.destroy()}g.uiDialog.unbind("keypress.ui-dialog");g._isOpen=false;if(g.options.hide){g.uiDialog.hide(g.options.hide,function(){g._trigger("close",j)})}else{g.uiDialog.hide();g._trigger("close",j)}e.ui.dialog.overlay.resize();if(g.options.modal){i=0;e(".ui-dialog").each(function(){if(this!==g.uiDialog[0]){h=e(this).css("z-index");if(!isNaN(h)){i=Math.max(i,h)}}});e.ui.dialog.maxZ=i}return g},isOpen:function(){return this._isOpen},moveToTop:function(k,j){var g=this,i=g.options,h;if((i.modal&&!k)||(!i.stack&&!i.modal)){return g._trigger("focus",j)}if(i.zIndex>e.ui.dialog.maxZ){e.ui.dialog.maxZ=i.zIndex}if(g.overlay){e.ui.dialog.maxZ+=1;g.overlay.$el.css("z-index",e.ui.dialog.overlay.maxZ=e.ui.dialog.maxZ)}h={scrollTop:g.element.scrollTop(),scrollLeft:g.element.scrollLeft()};e.ui.dialog.maxZ+=1;g.uiDialog.css("z-index",e.ui.dialog.maxZ);g.element.attr(h);g._trigger("focus",j);return g},open:function(){if(this._isOpen){return}var h=this,i=h.options,g=h.uiDialog;h.overlay=i.modal?new e.ui.dialog.overlay(h):null;h._size();h._position(i.position);g.show(i.show);h.moveToTop(true);if(i.modal){g.bind("keypress.ui-dialog",function(l){if(l.keyCode!==e.ui.keyCode.TAB){return}var k=e(":tabbable",this),m=k.filter(":first"),j=k.filter(":last");if(l.target===j[0]&&!l.shiftKey){m.focus(1);return false}else{if(l.target===m[0]&&l.shiftKey){j.focus(1);return false}}})}e(h.element.find(":tabbable").get().concat(g.find(".ui-dialog-buttonpane :tabbable").get().concat(g.get()))).eq(0).focus();h._isOpen=true;h._trigger("open");return h},_createButtons:function(j){var i=this,g=false,h=e("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),k=e("<div></div>").addClass("ui-dialog-buttonset").appendTo(h);i.uiDialog.find(".ui-dialog-buttonpane").remove();if(typeof j==="object"&&j!==null){e.each(j,function(){return !(g=true)})}if(g){e.each(j,function(l,n){n=e.isFunction(n)?{click:n,text:l}:n;var m=e('<button type="button"></button>').click(function(){n.click.apply(i.element[0],arguments)}).appendTo(k);e.each(n,function(o,p){if(o==="click"){return}if(o in a){m[o](p)}else{m.attr(o,p)}});if(e.fn.button){m.button()}});h.appendTo(i.uiDialog)}},_makeDraggable:function(){var g=this,j=g.options,k=e(document),i;function h(l){return{position:l.position,offset:l.offset}}g.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(l,m){i=j.height==="auto"?"auto":e(this).height();e(this).height(e(this).height()).addClass("ui-dialog-dragging");g._trigger("dragStart",l,h(m))},drag:function(l,m){g._trigger("drag",l,h(m))},stop:function(l,m){j.position=[m.position.left-k.scrollLeft(),m.position.top-k.scrollTop()];e(this).removeClass("ui-dialog-dragging").height(i);g._trigger("dragStop",l,h(m));e.ui.dialog.overlay.resize()}})},_makeResizable:function(l){l=(l===f?this.options.resizable:l);var h=this,k=h.options,g=h.uiDialog.css("position"),j=(typeof l==="string"?l:"n,e,s,w,se,sw,ne,nw");function i(m){return{originalPosition:m.originalPosition,originalSize:m.originalSize,position:m.position,size:m.size}}h.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:h.element,maxWidth:k.maxWidth,maxHeight:k.maxHeight,minWidth:k.minWidth,minHeight:h._minHeight(),handles:j,start:function(m,n){e(this).addClass("ui-dialog-resizing");h._trigger("resizeStart",m,i(n))},resize:function(m,n){h._trigger("resize",m,i(n))},stop:function(m,n){e(this).removeClass("ui-dialog-resizing");k.height=e(this).height();k.width=e(this).width();h._trigger("resizeStop",m,i(n));e.ui.dialog.overlay.resize()}}).css("position",g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var g=this.options;if(g.height==="auto"){return g.minHeight}else{return Math.min(g.minHeight,g.height)}},_position:function(h){var i=[],j=[0,0],g;if(h){if(typeof h==="string"||(typeof h==="object"&&"0" in h)){i=h.split?h.split(" "):[h[0],h[1]];if(i.length===1){i[1]=i[0]}e.each(["left","top"],function(l,k){if(+i[l]===i[l]){j[l]=i[l];i[l]=k}});h={my:i.join(" "),at:i.join(" "),offset:j.join(" ")}}h=e.extend({},e.ui.dialog.prototype.options.position,h)}else{h=e.ui.dialog.prototype.options.position}g=this.uiDialog.is(":visible");if(!g){this.uiDialog.show()}this.uiDialog.css({top:0,left:0}).position(e.extend({of:window},h));if(!g){this.uiDialog.hide()}},_setOptions:function(j){var h=this,g={},i=false;e.each(j,function(k,l){h._setOption(k,l);if(k in b){i=true}if(k in d){g[k]=l}});if(i){this._size()}if(this.uiDialog.is(":data(resizable)")){this.uiDialog.resizable("option",g)}},_setOption:function(j,k){var h=this,g=h.uiDialog;switch(j){case"beforeclose":j="beforeClose";break;case"buttons":h._createButtons(k);break;case"closeText":h.uiDialogTitlebarCloseText.text(""+k);break;case"dialogClass":g.removeClass(h.options.dialogClass).addClass(c+k);break;case"disabled":if(k){g.addClass("ui-dialog-disabled")}else{g.removeClass("ui-dialog-disabled")}break;case"draggable":var i=g.is(":data(draggable)");if(i&&!k){g.draggable("destroy")}if(!i&&k){h._makeDraggable()}break;case"position":h._position(k);break;case"resizable":var l=g.is(":data(resizable)");if(l&&!k){g.resizable("destroy")}if(l&&typeof k==="string"){g.resizable("option","handles",k)}if(!l&&k!==false){h._makeResizable(k)}break;case"title":e(".ui-dialog-title",h.uiDialogTitlebar).html(""+(k||"&#160;"));break}e.Widget.prototype._setOption.apply(h,arguments)},_size:function(){var k=this.options,h,j,g=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0});if(k.minWidth>k.width){k.width=k.minWidth}h=this.uiDialog.css({height:"auto",width:k.width}).height();j=Math.max(0,k.minHeight-h);if(k.height==="auto"){if(e.support.minHeight){this.element.css({minHeight:j,height:"auto"})}else{this.uiDialog.show();var i=this.element.css("height","auto").height();if(!g){this.uiDialog.hide()}this.element.height(Math.max(i,j))}}else{this.element.height(Math.max(k.height-h,0))}if(this.uiDialog.is(":data(resizable)")){this.uiDialog.resizable("option","minHeight",this._minHeight())}}});e.extend(e.ui.dialog,{version:"1.8.16",uuid:0,maxZ:0,getTitleId:function(g){var h=g.attr("id");if(!h){this.uuid+=1;h=this.uuid}return"ui-dialog-title-"+h},overlay:function(g){this.$el=e.ui.dialog.overlay.create(g)}});e.extend(e.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:e.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(g){return g+".dialog-overlay"}).join(" "),create:function(h){if(this.instances.length===0){setTimeout(function(){if(e.ui.dialog.overlay.instances.length){e(document).bind(e.ui.dialog.overlay.events,function(i){if(e(i.target).zIndex()<e.ui.dialog.overlay.maxZ){return false}})}},1);e(document).bind("keydown.dialog-overlay",function(i){if(h.options.closeOnEscape&&!i.isDefaultPrevented()&&i.keyCode&&i.keyCode===e.ui.keyCode.ESCAPE){h.close(i);i.preventDefault()}});e(window).bind("resize.dialog-overlay",e.ui.dialog.overlay.resize)}var g=(this.oldInstances.pop()||e("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});if(e.fn.bgiframe){g.bgiframe()}this.instances.push(g);return g},destroy:function(g){var h=e.inArray(g,this.instances);if(h!=-1){this.oldInstances.push(this.instances.splice(h,1)[0])}if(this.instances.length===0){e([document,window]).unbind(".dialog-overlay")}g.remove();var i=0;e.each(this.instances,function(){i=Math.max(i,this.css("z-index"))});this.maxZ=i},height:function(){var h,g;if(e.browser.msie&&e.browser.version<7){h=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);g=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);if(h<g){return e(window).height()+"px"}else{return h+"px"}}else{return e(document).height()+"px"}},width:function(){var g,h;if(e.browser.msie){g=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);h=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);if(g<h){return e(window).width()+"px"}else{return g+"px"}}else{return e(document).width()+"px"}},resize:function(){var g=e([]);e.each(e.ui.dialog.overlay.instances,function(){g=g.add(this)});g.css({width:0,height:0}).css({width:e.ui.dialog.overlay.width(),height:e.ui.dialog.overlay.height()})}});e.extend(e.ui.dialog.overlay.prototype,{destroy:function(){e.ui.dialog.overlay.destroy(this.$el)}})}(jQuery));(function(b,c){var a=5;b.widget("ui.slider",b.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var e=this,k=this.options,j=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),h="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",d=(k.values&&k.values.length)||1,g=[];this._keySliding=false;this._mouseSliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"+(k.disabled?" ui-slider-disabled ui-disabled":""));this.range=b([]);if(k.range){if(k.range===true){if(!k.values){k.values=[this._valueMin(),this._valueMin()]}if(k.values.length&&k.values.length!==2){k.values=[k.values[0],k.values[0]]}}this.range=b("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+((k.range==="min"||k.range==="max")?" ui-slider-range-"+k.range:""))}for(var f=j.length;f<d;f+=1){g.push(h)}this.handles=j.add(b(g.join("")).appendTo(e.element));this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(i){i.preventDefault()}).hover(function(){if(!k.disabled){b(this).addClass("ui-state-hover")}},function(){b(this).removeClass("ui-state-hover")}).focus(function(){if(!k.disabled){b(".ui-slider .ui-state-focus").removeClass("ui-state-focus");b(this).addClass("ui-state-focus")}else{b(this).blur()}}).blur(function(){b(this).removeClass("ui-state-focus")});this.handles.each(function(l){b(this).data("index.ui-slider-handle",l)});this.handles.keydown(function(p){var m=true,l=b(this).data("index.ui-slider-handle"),q,n,i,o;if(e.options.disabled){return}switch(p.keyCode){case b.ui.keyCode.HOME:case b.ui.keyCode.END:case b.ui.keyCode.PAGE_UP:case b.ui.keyCode.PAGE_DOWN:case b.ui.keyCode.UP:case b.ui.keyCode.RIGHT:case b.ui.keyCode.DOWN:case b.ui.keyCode.LEFT:m=false;if(!e._keySliding){e._keySliding=true;b(this).addClass("ui-state-active");q=e._start(p,l);if(q===false){return}}break}o=e.options.step;if(e.options.values&&e.options.values.length){n=i=e.values(l)}else{n=i=e.value()}switch(p.keyCode){case b.ui.keyCode.HOME:i=e._valueMin();break;case b.ui.keyCode.END:i=e._valueMax();break;case b.ui.keyCode.PAGE_UP:i=e._trimAlignValue(n+((e._valueMax()-e._valueMin())/a));break;case b.ui.keyCode.PAGE_DOWN:i=e._trimAlignValue(n-((e._valueMax()-e._valueMin())/a));break;case b.ui.keyCode.UP:case b.ui.keyCode.RIGHT:if(n===e._valueMax()){return}i=e._trimAlignValue(n+o);break;case b.ui.keyCode.DOWN:case b.ui.keyCode.LEFT:if(n===e._valueMin()){return}i=e._trimAlignValue(n-o);break}e._slide(p,l,i);return m}).keyup(function(l){var i=b(this).data("index.ui-slider-handle");if(e._keySliding){e._keySliding=false;e._stop(l,i);e._change(l,i);b(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");this._mouseDestroy();return this},_mouseCapture:function(f){var g=this.options,j,l,e,h,n,k,m,i,d;if(g.disabled){return false}this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();j={x:f.pageX,y:f.pageY};l=this._normValueFromMouse(j);e=this._valueMax()-this._valueMin()+1;n=this;this.handles.each(function(o){var p=Math.abs(l-n.values(o));if(e>p){e=p;h=b(this);k=o}});if(g.range===true&&this.values(1)===g.min){k+=1;h=b(this.handles[k])}m=this._start(f,k);if(m===false){return false}this._mouseSliding=true;n._handleIndex=k;h.addClass("ui-state-active").focus();i=h.offset();d=!b(f.target).parents().andSelf().is(".ui-slider-handle");this._clickOffset=d?{left:0,top:0}:{left:f.pageX-i.left-(h.width()/2),top:f.pageY-i.top-(h.height()/2)-(parseInt(h.css("borderTopWidth"),10)||0)-(parseInt(h.css("borderBottomWidth"),10)||0)+(parseInt(h.css("marginTop"),10)||0)};if(!this.handles.hasClass("ui-state-hover")){this._slide(f,k,l)}this._animateOff=true;return true},_mouseStart:function(d){return true},_mouseDrag:function(f){var d={x:f.pageX,y:f.pageY},e=this._normValueFromMouse(d);this._slide(f,this._handleIndex,e);return false},_mouseStop:function(d){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(d,this._handleIndex);this._change(d,this._handleIndex);this._handleIndex=null;this._clickOffset=null;this._animateOff=false;return false},_detectOrientation:function(){this.orientation=(this.options.orientation==="vertical")?"vertical":"horizontal"},_normValueFromMouse:function(e){var d,h,g,f,i;if(this.orientation==="horizontal"){d=this.elementSize.width;h=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{d=this.elementSize.height;h=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}g=(h/d);if(g>1){g=1}if(g<0){g=0}if(this.orientation==="vertical"){g=1-g}f=this._valueMax()-this._valueMin();i=this._valueMin()+g*f;return this._trimAlignValue(i)},_start:function(f,e){var d={handle:this.handles[e],value:this.value()};if(this.options.values&&this.options.values.length){d.value=this.values(e);d.values=this.values()}return this._trigger("start",f,d)},_slide:function(h,g,f){var d,e,i;if(this.options.values&&this.options.values.length){d=this.values(g?0:1);if((this.options.values.length===2&&this.options.range===true)&&((g===0&&f>d)||(g===1&&f<d))){f=d}if(f!==this.values(g)){e=this.values();e[g]=f;i=this._trigger("slide",h,{handle:this.handles[g],value:f,values:e});d=this.values(g?0:1);if(i!==false){this.values(g,f,true)}}}else{if(f!==this.value()){i=this._trigger("slide",h,{handle:this.handles[g],value:f});if(i!==false){this.value(f)}}}},_stop:function(f,e){var d={handle:this.handles[e],value:this.value()};if(this.options.values&&this.options.values.length){d.value=this.values(e);d.values=this.values()}this._trigger("stop",f,d)},_change:function(f,e){if(!this._keySliding&&!this._mouseSliding){var d={handle:this.handles[e],value:this.value()};if(this.options.values&&this.options.values.length){d.value=this.values(e);d.values=this.values()}this._trigger("change",f,d)}},value:function(d){if(arguments.length){this.options.value=this._trimAlignValue(d);this._refreshValue();this._change(null,0);return}return this._value()},values:function(e,h){var g,d,f;if(arguments.length>1){this.options.values[e]=this._trimAlignValue(h);this._refreshValue();this._change(null,e);return}if(arguments.length){if(b.isArray(arguments[0])){g=this.options.values;d=arguments[0];for(f=0;f<g.length;f+=1){g[f]=this._trimAlignValue(d[f]);this._change(null,f)}this._refreshValue()}else{if(this.options.values&&this.options.values.length){return this._values(e)}else{return this.value()}}}else{return this._values()}},_setOption:function(e,f){var d,g=0;if(b.isArray(this.options.values)){g=this.options.values.length}b.Widget.prototype._setOption.apply(this,arguments);switch(e){case"disabled":if(f){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.propAttr("disabled",true);this.element.addClass("ui-disabled")}else{this.handles.propAttr("disabled",false);this.element.removeClass("ui-disabled")}break;case"orientation":this._detectOrientation();this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case"value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case"values":this._animateOff=true;this._refreshValue();for(d=0;d<g;d+=1){this._change(null,d)}this._animateOff=false;break}},_value:function(){var d=this.options.value;d=this._trimAlignValue(d);return d},_values:function(d){var g,f,e;if(arguments.length){g=this.options.values[d];g=this._trimAlignValue(g);return g}else{f=this.options.values.slice();for(e=0;e<f.length;e+=1){f[e]=this._trimAlignValue(f[e])}return f}},_trimAlignValue:function(g){if(g<=this._valueMin()){return this._valueMin()}if(g>=this._valueMax()){return this._valueMax()}var d=(this.options.step>0)?this.options.step:1,f=(g-this._valueMin())%d,e=g-f;if(Math.abs(f)*2>=d){e+=(f>0)?d:(-d)}return parseFloat(e.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var g=this.options.range,f=this.options,m=this,e=(!this._animateOff)?f.animate:false,h,d={},i,k,j,l;if(this.options.values&&this.options.values.length){this.handles.each(function(o,n){h=(m.values(o)-m._valueMin())/(m._valueMax()-m._valueMin())*100;d[m.orientation==="horizontal"?"left":"bottom"]=h+"%";b(this).stop(1,1)[e?"animate":"css"](d,f.animate);if(m.options.range===true){if(m.orientation==="horizontal"){if(o===0){m.range.stop(1,1)[e?"animate":"css"]({left:h+"%"},f.animate)}if(o===1){m.range[e?"animate":"css"]({width:(h-i)+"%"},{queue:false,duration:f.animate})}}else{if(o===0){m.range.stop(1,1)[e?"animate":"css"]({bottom:(h)+"%"},f.animate)}if(o===1){m.range[e?"animate":"css"]({height:(h-i)+"%"},{queue:false,duration:f.animate})}}}i=h})}else{k=this.value();j=this._valueMin();l=this._valueMax();h=(l!==j)?(k-j)/(l-j)*100:0;d[m.orientation==="horizontal"?"left":"bottom"]=h+"%";this.handle.stop(1,1)[e?"animate":"css"](d,f.animate);if(g==="min"&&this.orientation==="horizontal"){this.range.stop(1,1)[e?"animate":"css"]({width:h+"%"},f.animate)}if(g==="max"&&this.orientation==="horizontal"){this.range[e?"animate":"css"]({width:(100-h)+"%"},{queue:false,duration:f.animate})}if(g==="min"&&this.orientation==="vertical"){this.range.stop(1,1)[e?"animate":"css"]({height:h+"%"},f.animate)}if(g==="max"&&this.orientation==="vertical"){this.range[e?"animate":"css"]({height:(100-h)+"%"},{queue:false,duration:f.animate})}}}});b.extend(b.ui.slider,{version:"1.8.16"})}(jQuery));(function(d,f){var c=0,b=0;function e(){return ++c}function a(){return ++b}d.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true)},_setOption:function(g,h){if(g=="selected"){if(this.options.collapsible&&h==this.options.selected){return}this.select(h)}else{this.options[g]=h;this._tabify()}},_tabId:function(g){return g.title&&g.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+e()},_sanitizeSelector:function(g){return g.replace(/:/g,"\\:")},_cookie:function(){var g=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+a());return d.cookie.apply(null,[g].concat(d.makeArray(arguments)))},_ui:function(h,g){return{tab:h,panel:g,index:this.anchors.index(h)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var g=d(this);g.html(g.data("label.tabs")).removeData("label.tabs")})},_tabify:function(u){var v=this,j=this.options,h=/^#.+/;this.list=this.element.find("ol,ul").eq(0);this.lis=d(" > li:has(a[href])",this.list);this.anchors=this.lis.map(function(){return d("a",this)[0]});this.panels=d([]);this.anchors.each(function(x,o){var w=d(o).attr("href");var y=w.split("#")[0],z;if(y&&(y===location.toString().split("#")[0]||(z=d("base")[0])&&y===z.href)){w=o.hash;o.href=w}if(h.test(w)){v.panels=v.panels.add(v.element.find(v._sanitizeSelector(w)))}else{if(w&&w!=="#"){d.data(o,"href.tabs",w);d.data(o,"load.tabs",w.replace(/#.*$/,""));var B=v._tabId(o);o.href="#"+B;var A=v.element.find("#"+B);if(!A.length){A=d(j.panelTemplate).attr("id",B).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(v.panels[x-1]||v.list);A.data("destroy.tabs",true)}v.panels=v.panels.add(A)}else{j.disabled.push(x)}}});if(u){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-top");this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");if(j.selected===f){if(location.hash){this.anchors.each(function(w,o){if(o.hash==location.hash){j.selected=w;return false}})}if(typeof j.selected!=="number"&&j.cookie){j.selected=parseInt(v._cookie(),10)}if(typeof j.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length){j.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"))}j.selected=j.selected||(this.lis.length?0:-1)}else{if(j.selected===null){j.selected=-1}}j.selected=((j.selected>=0&&this.anchors[j.selected])||j.selected<0)?j.selected:0;j.disabled=d.unique(j.disabled.concat(d.map(this.lis.filter(".ui-state-disabled"),function(w,o){return v.lis.index(w)}))).sort();if(d.inArray(j.selected,j.disabled)!=-1){j.disabled.splice(d.inArray(j.selected,j.disabled),1)}this.panels.addClass("ui-tabs-hide");this.lis.removeClass("ui-tabs-selected ui-state-active");if(j.selected>=0&&this.anchors.length){v.element.find(v._sanitizeSelector(v.anchors[j.selected].hash)).removeClass("ui-tabs-hide");this.lis.eq(j.selected).addClass("ui-tabs-selected ui-state-active");v.element.queue("tabs",function(){v._trigger("show",null,v._ui(v.anchors[j.selected],v.element.find(v._sanitizeSelector(v.anchors[j.selected].hash))[0]))});this.load(j.selected)}d(window).bind("unload",function(){v.lis.add(v.anchors).unbind(".tabs");v.lis=v.anchors=v.panels=null})}else{j.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"))}this.element[j.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");if(j.cookie){this._cookie(j.selected,j.cookie)}for(var m=0,s;(s=this.lis[m]);m++){d(s)[d.inArray(m,j.disabled)!=-1&&!d(s).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled")}if(j.cache===false){this.anchors.removeData("cache.tabs")}this.lis.add(this.anchors).unbind(".tabs");if(j.event!=="mouseover"){var l=function(o,i){if(i.is(":not(.ui-state-disabled)")){i.addClass("ui-state-"+o)}};var p=function(o,i){i.removeClass("ui-state-"+o)};this.lis.bind("mouseover.tabs",function(){l("hover",d(this))});this.lis.bind("mouseout.tabs",function(){p("hover",d(this))});this.anchors.bind("focus.tabs",function(){l("focus",d(this).closest("li"))});this.anchors.bind("blur.tabs",function(){p("focus",d(this).closest("li"))})}var g,n;if(j.fx){if(d.isArray(j.fx)){g=j.fx[0];n=j.fx[1]}else{g=n=j.fx}}function k(i,o){i.css("display","");if(!d.support.opacity&&o.opacity){i[0].style.removeAttribute("filter")}}var q=n?function(i,o){d(i).closest("li").addClass("ui-tabs-selected ui-state-active");o.hide().removeClass("ui-tabs-hide").animate(n,n.duration||"normal",function(){k(o,n);v._trigger("show",null,v._ui(i,o[0]))})}:function(i,o){d(i).closest("li").addClass("ui-tabs-selected ui-state-active");o.removeClass("ui-tabs-hide");v._trigger("show",null,v._ui(i,o[0]))};var r=g?function(o,i){i.animate(g,g.duration||"normal",function(){v.lis.removeClass("ui-tabs-selected ui-state-active");i.addClass("ui-tabs-hide");k(i,g);v.element.dequeue("tabs")})}:function(o,i,w){v.lis.removeClass("ui-tabs-selected ui-state-active");i.addClass("ui-tabs-hide");v.element.dequeue("tabs")};this.anchors.bind(j.event+".tabs",function(){var o=this,x=d(o).closest("li"),i=v.panels.filter(":not(.ui-tabs-hide)"),w=v.element.find(v._sanitizeSelector(o.hash));if((x.hasClass("ui-tabs-selected")&&!j.collapsible)||x.hasClass("ui-state-disabled")||x.hasClass("ui-state-processing")||v.panels.filter(":animated").length||v._trigger("select",null,v._ui(this,w[0]))===false){this.blur();return false}j.selected=v.anchors.index(this);v.abort();if(j.collapsible){if(x.hasClass("ui-tabs-selected")){j.selected=-1;if(j.cookie){v._cookie(j.selected,j.cookie)}v.element.queue("tabs",function(){r(o,i)}).dequeue("tabs");this.blur();return false}else{if(!i.length){if(j.cookie){v._cookie(j.selected,j.cookie)}v.element.queue("tabs",function(){q(o,w)});v.load(v.anchors.index(this));this.blur();return false}}}if(j.cookie){v._cookie(j.selected,j.cookie)}if(w.length){if(i.length){v.element.queue("tabs",function(){r(o,i)})}v.element.queue("tabs",function(){q(o,w)});v.load(v.anchors.index(this))}else{throw"jQuery UI Tabs: Mismatching fragment identifier."}if(d.browser.msie){this.blur()}});this.anchors.bind("click.tabs",function(){return false})},_getIndex:function(g){if(typeof g=="string"){g=this.anchors.index(this.anchors.filter("[href$="+g+"]"))}return g},destroy:function(){var g=this.options;this.abort();this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.anchors.each(function(){var h=d.data(this,"href.tabs");if(h){this.href=h}var i=d(this).unbind(".tabs");d.each(["href","load","cache"],function(j,k){i.removeData(k+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){if(d.data(this,"destroy.tabs")){d(this).remove()}else{d(this).removeClass(["ui-state-default","ui-corner-top","ui-tabs-selected","ui-state-active","ui-state-hover","ui-state-focus","ui-state-disabled","ui-tabs-panel","ui-widget-content","ui-corner-bottom","ui-tabs-hide"].join(" "))}});if(g.cookie){this._cookie(null,g.cookie)}return this},add:function(j,i,h){if(h===f){h=this.anchors.length}var g=this,l=this.options,n=d(l.tabTemplate.replace(/#\{href\}/g,j).replace(/#\{label\}/g,i)),m=!j.indexOf("#")?j.replace("#",""):this._tabId(d("a",n)[0]);n.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);var k=g.element.find("#"+m);if(!k.length){k=d(l.panelTemplate).attr("id",m).data("destroy.tabs",true)}k.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");if(h>=this.lis.length){n.appendTo(this.list);k.appendTo(this.list[0].parentNode)}else{n.insertBefore(this.lis[h]);k.insertBefore(this.panels[h])}l.disabled=d.map(l.disabled,function(p,o){return p>=h?++p:p});this._tabify();if(this.anchors.length==1){l.selected=0;n.addClass("ui-tabs-selected ui-state-active");k.removeClass("ui-tabs-hide");this.element.queue("tabs",function(){g._trigger("show",null,g._ui(g.anchors[0],g.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[h],this.panels[h]));return this},remove:function(g){g=this._getIndex(g);var i=this.options,j=this.lis.eq(g).remove(),h=this.panels.eq(g).remove();if(j.hasClass("ui-tabs-selected")&&this.anchors.length>1){this.select(g+(g+1<this.anchors.length?1:-1))}i.disabled=d.map(d.grep(i.disabled,function(l,k){return l!=g}),function(l,k){return l>=g?--l:l});this._tabify();this._trigger("remove",null,this._ui(j.find("a")[0],h[0]));return this},enable:function(g){g=this._getIndex(g);var h=this.options;if(d.inArray(g,h.disabled)==-1){return}this.lis.eq(g).removeClass("ui-state-disabled");h.disabled=d.grep(h.disabled,function(k,j){return k!=g});this._trigger("enable",null,this._ui(this.anchors[g],this.panels[g]));return this},disable:function(h){h=this._getIndex(h);var g=this,i=this.options;if(h!=i.selected){this.lis.eq(h).addClass("ui-state-disabled");i.disabled.push(h);i.disabled.sort();this._trigger("disable",null,this._ui(this.anchors[h],this.panels[h]))}return this},select:function(g){g=this._getIndex(g);if(g==-1){if(this.options.collapsible&&this.options.selected!=-1){g=this.options.selected}else{return this}}this.anchors.eq(g).trigger(this.options.event+".tabs");return this},load:function(j){j=this._getIndex(j);var h=this,l=this.options,g=this.anchors.eq(j)[0],i=d.data(g,"load.tabs");this.abort();if(!i||this.element.queue("tabs").length!==0&&d.data(g,"cache.tabs")){this.element.dequeue("tabs");return}this.lis.eq(j).addClass("ui-state-processing");if(l.spinner){var k=d("span",g);k.data("label.tabs",k.html()).html(l.spinner)}this.xhr=d.ajax(d.extend({},l.ajaxOptions,{url:i,success:function(n,m){h.element.find(h._sanitizeSelector(g.hash)).html(n);h._cleanup();if(l.cache){d.data(g,"cache.tabs",true)}h._trigger("load",null,h._ui(h.anchors[j],h.panels[j]));try{l.ajaxOptions.success(n,m)}catch(o){}},error:function(o,m,n){h._cleanup();h._trigger("load",null,h._ui(h.anchors[j],h.panels[j]));try{l.ajaxOptions.error(o,m,j,g)}catch(n){}}}));h.element.dequeue("tabs");return this},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},url:function(h,g){this.anchors.eq(h).removeData("cache.tabs").data("load.tabs",g);return this},length:function(){return this.anchors.length}});d.extend(d.ui.tabs,{version:"1.8.16"});d.extend(d.ui.tabs.prototype,{rotation:null,rotate:function(i,k){var g=this,l=this.options;var h=g._rotate||(g._rotate=function(m){clearTimeout(g.rotation);g.rotation=setTimeout(function(){var n=l.selected;g.select(++n<g.anchors.length?n:0)},i);if(m){m.stopPropagation()}});var j=g._unrotate||(g._unrotate=!k?function(m){if(m.clientX){g.rotate(null)}}:function(m){t=l.selected;h()});if(i){this.element.bind("tabsshow",h);this.anchors.bind(l.event+".tabs",j);h()}else{clearTimeout(g.rotation);this.element.unbind("tabsshow",h);this.anchors.unbind(l.event+".tabs",j);delete this._rotate;delete this._unrotate}return this}})})(jQuery);(function($,undefined){$.extend($.ui,{datepicker:{version:"1.8.16"}});var PROP_NAME="datepicker";var dpuuid=new Date().getTime();var instActive;function Datepicker(){this.debug=false;this._curInst=null;this._keyEvent=false;this._disabledInputs=[];this._datepickerShowing=false;this._inDialog=false;this._mainDivId="ui-datepicker-div";this._inlineClass="ui-datepicker-inline";this._appendClass="ui-datepicker-append";this._triggerClass="ui-datepicker-trigger";this._dialogClass="ui-datepicker-dialog";this._disableClass="ui-datepicker-disabled";this._unselectableClass="ui-datepicker-unselectable";this._currentClass="ui-datepicker-current-day";this._dayOverClass="ui-datepicker-days-cell-over";this.regional=[];this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false,disabled:false};$.extend(this._defaults,this.regional[""]);this.dpDiv=bindHover($('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){if(this.debug){console.log.apply("",arguments)}},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(settings){extendRemove(this._defaults,settings||{});return this},_attachDatepicker:function(target,settings){var inlineSettings=null;for(var attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);if(attrValue){inlineSettings=inlineSettings||{};try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}var nodeName=target.nodeName.toLowerCase();var inline=(nodeName=="div"||nodeName=="span");if(!target.id){this.uuid+=1;target.id="dp"+this.uuid}var inst=this._newInst($(target),inline);inst.settings=$.extend({},settings||{},inlineSettings||{});if(nodeName=="input"){this._connectDatepicker(target,inst)}else{if(inline){this._inlineDatepicker(target,inst)}}},_newInst:function(target,inline){var id=target[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");return{id:id,input:target,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:inline,dpDiv:(!inline?this.dpDiv:bindHover($('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))}},_connectDatepicker:function(target,inst){var input=$(target);inst.append=$([]);inst.trigger=$([]);if(input.hasClass(this.markerClassName)){return}this._attachments(input,inst);input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(event,key,value){inst.settings[key]=value}).bind("getData.datepicker",function(event,key){return this._get(inst,key)});this._autoSize(inst);$.data(target,PROP_NAME,inst);if(inst.settings.disabled){this._disableDatepicker(target)}},_attachments:function(input,inst){var appendText=this._get(inst,"appendText");var isRTL=this._get(inst,"isRTL");if(inst.append){inst.append.remove()}if(appendText){inst.append=$('<span class="'+this._appendClass+'">'+appendText+"</span>");input[isRTL?"before":"after"](inst.append)}input.unbind("focus",this._showDatepicker);if(inst.trigger){inst.trigger.remove()}var showOn=this._get(inst,"showOn");if(showOn=="focus"||showOn=="both"){input.focus(this._showDatepicker)}if(showOn=="button"||showOn=="both"){var buttonText=this._get(inst,"buttonText");var buttonImage=this._get(inst,"buttonImage");inst.trigger=$(this._get(inst,"buttonImageOnly")?$("<img/>").addClass(this._triggerClass).attr({src:buttonImage,alt:buttonText,title:buttonText}):$('<button type="button"></button>').addClass(this._triggerClass).html(buttonImage==""?buttonText:$("<img/>").attr({src:buttonImage,alt:buttonText,title:buttonText})));input[isRTL?"before":"after"](inst.trigger);inst.trigger.click(function(){if($.datepicker._datepickerShowing&&$.datepicker._lastInput==input[0]){$.datepicker._hideDatepicker()}else{$.datepicker._showDatepicker(input[0])}return false})}},_autoSize:function(inst){if(this._get(inst,"autoSize")&&!inst.inline){var date=new Date(2009,12-1,20);var dateFormat=this._get(inst,"dateFormat");if(dateFormat.match(/[DM]/)){var findMax=function(names){var max=0;var maxI=0;for(var i=0;i<names.length;i++){if(names[i].length>max){max=names[i].length;maxI=i}}return maxI};date.setMonth(findMax(this._get(inst,(dateFormat.match(/MM/)?"monthNames":"monthNamesShort"))));date.setDate(findMax(this._get(inst,(dateFormat.match(/DD/)?"dayNames":"dayNamesShort")))+20-date.getDay())}inst.input.attr("size",this._formatDate(inst,date).length)}},_inlineDatepicker:function(target,inst){var divSpan=$(target);if(divSpan.hasClass(this.markerClassName)){return}divSpan.addClass(this.markerClassName).append(inst.dpDiv).bind("setData.datepicker",function(event,key,value){inst.settings[key]=value}).bind("getData.datepicker",function(event,key){return this._get(inst,key)});$.data(target,PROP_NAME,inst);this._setDate(inst,this._getDefaultDate(inst),true);this._updateDatepicker(inst);this._updateAlternate(inst);if(inst.settings.disabled){this._disableDatepicker(target)}inst.dpDiv.css("display","block")},_dialogDatepicker:function(input,date,onSelect,settings,pos){var inst=this._dialogInst;if(!inst){this.uuid+=1;var id="dp"+this.uuid;this._dialogInput=$('<input type="text" id="'+id+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');this._dialogInput.keydown(this._doKeyDown);$("body").append(this._dialogInput);inst=this._dialogInst=this._newInst(this._dialogInput,false);inst.settings={};$.data(this._dialogInput[0],PROP_NAME,inst)}extendRemove(inst.settings,settings||{});date=(date&&date.constructor==Date?this._formatDate(inst,date):date);this._dialogInput.val(date);this._pos=(pos?(pos.length?pos:[pos.pageX,pos.pageY]):null);if(!this._pos){var browserWidth=document.documentElement.clientWidth;var browserHeight=document.documentElement.clientHeight;var scrollX=document.documentElement.scrollLeft||document.body.scrollLeft;var scrollY=document.documentElement.scrollTop||document.body.scrollTop;this._pos=[(browserWidth/2)-100+scrollX,(browserHeight/2)-150+scrollY]}this._dialogInput.css("left",(this._pos[0]+20)+"px").css("top",this._pos[1]+"px");inst.settings.onSelect=onSelect;this._inDialog=true;this.dpDiv.addClass(this._dialogClass);this._showDatepicker(this._dialogInput[0]);if($.blockUI){$.blockUI(this.dpDiv)}$.data(this._dialogInput[0],PROP_NAME,inst);return this},_destroyDatepicker:function(target){var $target=$(target);var inst=$.data(target,PROP_NAME);if(!$target.hasClass(this.markerClassName)){return}var nodeName=target.nodeName.toLowerCase();$.removeData(target,PROP_NAME);if(nodeName=="input"){inst.append.remove();inst.trigger.remove();$target.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)}else{if(nodeName=="div"||nodeName=="span"){$target.removeClass(this.markerClassName).empty()}}},_enableDatepicker:function(target){var $target=$(target);var inst=$.data(target,PROP_NAME);if(!$target.hasClass(this.markerClassName)){return}var nodeName=target.nodeName.toLowerCase();if(nodeName=="input"){target.disabled=false;inst.trigger.filter("button").each(function(){this.disabled=false}).end().filter("img").css({opacity:"1.0",cursor:""})}else{if(nodeName=="div"||nodeName=="span"){var inline=$target.children("."+this._inlineClass);inline.children().removeClass("ui-state-disabled");inline.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")}}this._disabledInputs=$.map(this._disabledInputs,function(value){return(value==target?null:value)})},_disableDatepicker:function(target){var $target=$(target);var inst=$.data(target,PROP_NAME);if(!$target.hasClass(this.markerClassName)){return}var nodeName=target.nodeName.toLowerCase();if(nodeName=="input"){target.disabled=true;inst.trigger.filter("button").each(function(){this.disabled=true}).end().filter("img").css({opacity:"0.5",cursor:"default"})}else{if(nodeName=="div"||nodeName=="span"){var inline=$target.children("."+this._inlineClass);inline.children().addClass("ui-state-disabled");inline.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled")}}this._disabledInputs=$.map(this._disabledInputs,function(value){return(value==target?null:value)});this._disabledInputs[this._disabledInputs.length]=target},_isDisabledDatepicker:function(target){if(!target){return false}for(var i=0;i<this._disabledInputs.length;i++){if(this._disabledInputs[i]==target){return true}}return false},_getInst:function(target){try{return $.data(target,PROP_NAME)}catch(err){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(target,name,value){var inst=this._getInst(target);if(arguments.length==2&&typeof name=="string"){return(name=="defaults"?$.extend({},$.datepicker._defaults):(inst?(name=="all"?$.extend({},inst.settings):this._get(inst,name)):null))}var settings=name||{};if(typeof name=="string"){settings={};settings[name]=value}if(inst){if(this._curInst==inst){this._hideDatepicker()}var date=this._getDateDatepicker(target,true);var minDate=this._getMinMaxDate(inst,"min");var maxDate=this._getMinMaxDate(inst,"max");extendRemove(inst.settings,settings);if(minDate!==null&&settings.dateFormat!==undefined&&settings.minDate===undefined){inst.settings.minDate=this._formatDate(inst,minDate)}if(maxDate!==null&&settings.dateFormat!==undefined&&settings.maxDate===undefined){inst.settings.maxDate=this._formatDate(inst,maxDate)}this._attachments($(target),inst);this._autoSize(inst);this._setDate(inst,date);this._updateAlternate(inst);this._updateDatepicker(inst)}},_changeDatepicker:function(target,name,value){this._optionDatepicker(target,name,value)},_refreshDatepicker:function(target){var inst=this._getInst(target);if(inst){this._updateDatepicker(inst)}},_setDateDatepicker:function(target,date){var inst=this._getInst(target);if(inst){this._setDate(inst,date);this._updateDatepicker(inst);this._updateAlternate(inst)}},_getDateDatepicker:function(target,noDefault){var inst=this._getInst(target);if(inst&&!inst.inline){this._setDateFromField(inst,noDefault)}return(inst?this._getDate(inst):null)},_doKeyDown:function(event){var inst=$.datepicker._getInst(event.target);var handled=true;var isRTL=inst.dpDiv.is(".ui-datepicker-rtl");inst._keyEvent=true;if($.datepicker._datepickerShowing){switch(event.keyCode){case 9:$.datepicker._hideDatepicker();handled=false;break;case 13:var sel=$("td."+$.datepicker._dayOverClass+":not(."+$.datepicker._currentClass+")",inst.dpDiv);if(sel[0]){$.datepicker._selectDay(event.target,inst.selectedMonth,inst.selectedYear,sel[0])}var onSelect=$.datepicker._get(inst,"onSelect");if(onSelect){var dateStr=$.datepicker._formatDate(inst);onSelect.apply((inst.input?inst.input[0]:null),[dateStr,inst])}else{$.datepicker._hideDatepicker()}return false;break;case 27:$.datepicker._hideDatepicker();break;case 33:$.datepicker._adjustDate(event.target,(event.ctrlKey?-$.datepicker._get(inst,"stepBigMonths"):-$.datepicker._get(inst,"stepMonths")),"M");break;case 34:$.datepicker._adjustDate(event.target,(event.ctrlKey?+$.datepicker._get(inst,"stepBigMonths"):+$.datepicker._get(inst,"stepMonths")),"M");break;case 35:if(event.ctrlKey||event.metaKey){$.datepicker._clearDate(event.target)}handled=event.ctrlKey||event.metaKey;break;case 36:if(event.ctrlKey||event.metaKey){$.datepicker._gotoToday(event.target)}handled=event.ctrlKey||event.metaKey;break;case 37:if(event.ctrlKey||event.metaKey){$.datepicker._adjustDate(event.target,(isRTL?+1:-1),"D")}handled=event.ctrlKey||event.metaKey;if(event.originalEvent.altKey){$.datepicker._adjustDate(event.target,(event.ctrlKey?-$.datepicker._get(inst,"stepBigMonths"):-$.datepicker._get(inst,"stepMonths")),"M")}break;case 38:if(event.ctrlKey||event.metaKey){$.datepicker._adjustDate(event.target,-7,"D")}handled=event.ctrlKey||event.metaKey;break;case 39:if(event.ctrlKey||event.metaKey){$.datepicker._adjustDate(event.target,(isRTL?-1:+1),"D")}handled=event.ctrlKey||event.metaKey;if(event.originalEvent.altKey){$.datepicker._adjustDate(event.target,(event.ctrlKey?+$.datepicker._get(inst,"stepBigMonths"):+$.datepicker._get(inst,"stepMonths")),"M")}break;case 40:if(event.ctrlKey||event.metaKey){$.datepicker._adjustDate(event.target,+7,"D")}handled=event.ctrlKey||event.metaKey;break;default:handled=false}}else{if(event.keyCode==36&&event.ctrlKey){$.datepicker._showDatepicker(this)}else{handled=false}}if(handled){event.preventDefault();event.stopPropagation()}},_doKeyPress:function(event){var inst=$.datepicker._getInst(event.target);if($.datepicker._get(inst,"constrainInput")){var chars=$.datepicker._possibleChars($.datepicker._get(inst,"dateFormat"));var chr=String.fromCharCode(event.charCode==undefined?event.keyCode:event.charCode);return event.ctrlKey||event.metaKey||(chr<" "||!chars||chars.indexOf(chr)>-1)}},_doKeyUp:function(event){var inst=$.datepicker._getInst(event.target);if(inst.input.val()!=inst.lastVal){try{var date=$.datepicker.parseDate($.datepicker._get(inst,"dateFormat"),(inst.input?inst.input.val():null),$.datepicker._getFormatConfig(inst));if(date){$.datepicker._setDateFromField(inst);$.datepicker._updateAlternate(inst);$.datepicker._updateDatepicker(inst)}}catch(event){$.datepicker.log(event)}}return true},_showDatepicker:function(input){input=input.target||input;if(input.nodeName.toLowerCase()!="input"){input=$("input",input.parentNode)[0]}if($.datepicker._isDisabledDatepicker(input)||$.datepicker._lastInput==input){return}var inst=$.datepicker._getInst(input);if($.datepicker._curInst&&$.datepicker._curInst!=inst){if($.datepicker._datepickerShowing){$.datepicker._triggerOnClose($.datepicker._curInst)}$.datepicker._curInst.dpDiv.stop(true,true)}var beforeShow=$.datepicker._get(inst,"beforeShow");var beforeShowSettings=beforeShow?beforeShow.apply(input,[input,inst]):{};if(beforeShowSettings===false){return}extendRemove(inst.settings,beforeShowSettings);inst.lastVal=null;$.datepicker._lastInput=input;$.datepicker._setDateFromField(inst);if($.datepicker._inDialog){input.value=""}if(!$.datepicker._pos){$.datepicker._pos=$.datepicker._findPos(input);$.datepicker._pos[1]+=input.offsetHeight}var isFixed=false;$(input).parents().each(function(){isFixed|=$(this).css("position")=="fixed";return !isFixed});if(isFixed&&$.browser.opera){$.datepicker._pos[0]-=document.documentElement.scrollLeft;$.datepicker._pos[1]-=document.documentElement.scrollTop}var offset={left:$.datepicker._pos[0],top:$.datepicker._pos[1]};$.datepicker._pos=null;inst.dpDiv.empty();inst.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});$.datepicker._updateDatepicker(inst);offset=$.datepicker._checkOffset(inst,offset,isFixed);inst.dpDiv.css({position:($.datepicker._inDialog&&$.blockUI?"static":(isFixed?"fixed":"absolute")),display:"none",left:offset.left+"px",top:offset.top+"px"});if(!inst.inline){var showAnim=$.datepicker._get(inst,"showAnim");var duration=$.datepicker._get(inst,"duration");var postProcess=function(){var cover=inst.dpDiv.find("iframe.ui-datepicker-cover");if(!!cover.length){var borders=$.datepicker._getBorders(inst.dpDiv);cover.css({left:-borders[0],top:-borders[1],width:inst.dpDiv.outerWidth(),height:inst.dpDiv.outerHeight()})}};inst.dpDiv.zIndex($(input).zIndex()+1);$.datepicker._datepickerShowing=true;if($.effects&&$.effects[showAnim]){inst.dpDiv.show(showAnim,$.datepicker._get(inst,"showOptions"),duration,postProcess)}else{inst.dpDiv[showAnim||"show"]((showAnim?duration:null),postProcess)}if(!showAnim||!duration){postProcess()}if(inst.input.is(":visible")&&!inst.input.is(":disabled")){inst.input.focus()}$.datepicker._curInst=inst}},_updateDatepicker:function(inst){var self=this;self.maxRows=4;var borders=$.datepicker._getBorders(inst.dpDiv);instActive=inst;inst.dpDiv.empty().append(this._generateHTML(inst));var cover=inst.dpDiv.find("iframe.ui-datepicker-cover");if(!!cover.length){cover.css({left:-borders[0],top:-borders[1],width:inst.dpDiv.outerWidth(),height:inst.dpDiv.outerHeight()})}inst.dpDiv.find("."+this._dayOverClass+" a").mouseover();var numMonths=this._getNumberOfMonths(inst);var cols=numMonths[1];var width=17;inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");if(cols>1){inst.dpDiv.addClass("ui-datepicker-multi-"+cols).css("width",(width*cols)+"em")}inst.dpDiv[(numMonths[0]!=1||numMonths[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi");inst.dpDiv[(this._get(inst,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");if(inst==$.datepicker._curInst&&$.datepicker._datepickerShowing&&inst.input&&inst.input.is(":visible")&&!inst.input.is(":disabled")&&inst.input[0]!=document.activeElement){inst.input.focus()}if(inst.yearshtml){var origyearshtml=inst.yearshtml;setTimeout(function(){if(origyearshtml===inst.yearshtml&&inst.yearshtml){inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml)}origyearshtml=inst.yearshtml=null},0)}},_getBorders:function(elem){var convert=function(value){return{thin:1,medium:2,thick:3}[value]||value};return[parseFloat(convert(elem.css("border-left-width"))),parseFloat(convert(elem.css("border-top-width")))]},_checkOffset:function(inst,offset,isFixed){var dpWidth=inst.dpDiv.outerWidth();var dpHeight=inst.dpDiv.outerHeight();var inputWidth=inst.input?inst.input.outerWidth():0;var inputHeight=inst.input?inst.input.outerHeight():0;var viewWidth=document.documentElement.clientWidth+$(document).scrollLeft();var viewHeight=document.documentElement.clientHeight+$(document).scrollTop();offset.left-=(this._get(inst,"isRTL")?(dpWidth-inputWidth):0);offset.left-=(isFixed&&offset.left==inst.input.offset().left)?$(document).scrollLeft():0;offset.top-=(isFixed&&offset.top==(inst.input.offset().top+inputHeight))?$(document).scrollTop():0;offset.left-=Math.min(offset.left,(offset.left+dpWidth>viewWidth&&viewWidth>dpWidth)?Math.abs(offset.left+dpWidth-viewWidth):0);offset.top-=Math.min(offset.top,(offset.top+dpHeight>viewHeight&&viewHeight>dpHeight)?Math.abs(dpHeight+inputHeight):0);return offset},_findPos:function(obj){var inst=this._getInst(obj);var isRTL=this._get(inst,"isRTL");while(obj&&(obj.type=="hidden"||obj.nodeType!=1||$.expr.filters.hidden(obj))){obj=obj[isRTL?"previousSibling":"nextSibling"]}var position=$(obj).offset();return[position.left,position.top]},_triggerOnClose:function(inst){var onClose=this._get(inst,"onClose");if(onClose){onClose.apply((inst.input?inst.input[0]:null),[(inst.input?inst.input.val():""),inst])}},_hideDatepicker:function(input){var inst=this._curInst;if(!inst||(input&&inst!=$.data(input,PROP_NAME))){return}if(this._datepickerShowing){var showAnim=this._get(inst,"showAnim");var duration=this._get(inst,"duration");var postProcess=function(){$.datepicker._tidyDialog(inst);this._curInst=null};if($.effects&&$.effects[showAnim]){inst.dpDiv.hide(showAnim,$.datepicker._get(inst,"showOptions"),duration,postProcess)}else{inst.dpDiv[(showAnim=="slideDown"?"slideUp":(showAnim=="fadeIn"?"fadeOut":"hide"))]((showAnim?duration:null),postProcess)}if(!showAnim){postProcess()}$.datepicker._triggerOnClose(inst);this._datepickerShowing=false;this._lastInput=null;if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});if($.blockUI){$.unblockUI();$("body").append(this.dpDiv)}}this._inDialog=false}},_tidyDialog:function(inst){inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(event){if(!$.datepicker._curInst){return}var $target=$(event.target);if($target[0].id!=$.datepicker._mainDivId&&$target.parents("#"+$.datepicker._mainDivId).length==0&&!$target.hasClass($.datepicker.markerClassName)&&!$target.hasClass($.datepicker._triggerClass)&&$.datepicker._datepickerShowing&&!($.datepicker._inDialog&&$.blockUI)){$.datepicker._hideDatepicker()}},_adjustDate:function(id,offset,period){var target=$(id);var inst=this._getInst(target[0]);if(this._isDisabledDatepicker(target[0])){return}this._adjustInstDate(inst,offset+(period=="M"?this._get(inst,"showCurrentAtPos"):0),period);this._updateDatepicker(inst)},_gotoToday:function(id){var target=$(id);var inst=this._getInst(target[0]);if(this._get(inst,"gotoCurrent")&&inst.currentDay){inst.selectedDay=inst.currentDay;inst.drawMonth=inst.selectedMonth=inst.currentMonth;inst.drawYear=inst.selectedYear=inst.currentYear}else{var date=new Date();inst.selectedDay=date.getDate();inst.drawMonth=inst.selectedMonth=date.getMonth();inst.drawYear=inst.selectedYear=date.getFullYear()}this._notifyChange(inst);this._adjustDate(target)},_selectMonthYear:function(id,select,period){var target=$(id);var inst=this._getInst(target[0]);inst["selected"+(period=="M"?"Month":"Year")]=inst["draw"+(period=="M"?"Month":"Year")]=parseInt(select.options[select.selectedIndex].value,10);this._notifyChange(inst);this._adjustDate(target)},_selectDay:function(id,month,year,td){var target=$(id);if($(td).hasClass(this._unselectableClass)||this._isDisabledDatepicker(target[0])){return}var inst=this._getInst(target[0]);inst.selectedDay=inst.currentDay=$("a",td).html();inst.selectedMonth=inst.currentMonth=month;inst.selectedYear=inst.currentYear=year;this._selectDate(id,this._formatDate(inst,inst.currentDay,inst.currentMonth,inst.currentYear))},_clearDate:function(id){var target=$(id);var inst=this._getInst(target[0]);this._selectDate(target,"")},_selectDate:function(id,dateStr){var target=$(id);var inst=this._getInst(target[0]);dateStr=(dateStr!=null?dateStr:this._formatDate(inst));if(inst.input){inst.input.val(dateStr)}this._updateAlternate(inst);var onSelect=this._get(inst,"onSelect");if(onSelect){onSelect.apply((inst.input?inst.input[0]:null),[dateStr,inst])}else{if(inst.input){inst.input.trigger("change")}}if(inst.inline){this._updateDatepicker(inst)}else{this._hideDatepicker();this._lastInput=inst.input[0];if(typeof(inst.input[0])!="object"){inst.input.focus()}this._lastInput=null}},_updateAlternate:function(inst){var altField=this._get(inst,"altField");if(altField){var altFormat=this._get(inst,"altFormat")||this._get(inst,"dateFormat");var date=this._getDate(inst);var dateStr=this.formatDate(altFormat,date,this._getFormatConfig(inst));$(altField).each(function(){$(this).val(dateStr)})}},noWeekends:function(date){var day=date.getDay();return[(day>0&&day<6),""]},iso8601Week:function(date){var checkDate=new Date(date.getTime());checkDate.setDate(checkDate.getDate()+4-(checkDate.getDay()||7));var time=checkDate.getTime();checkDate.setMonth(0);checkDate.setDate(1);return Math.floor(Math.round((time-checkDate)/86400000)/7)+1},parseDate:function(format,value,settings){if(format==null||value==null){throw"Invalid arguments"}value=(typeof value=="object"?value.toString():value+"");if(value==""){return null}var shortYearCutoff=(settings?settings.shortYearCutoff:null)||this._defaults.shortYearCutoff;shortYearCutoff=(typeof shortYearCutoff!="string"?shortYearCutoff:new Date().getFullYear()%100+parseInt(shortYearCutoff,10));var dayNamesShort=(settings?settings.dayNamesShort:null)||this._defaults.dayNamesShort;var dayNames=(settings?settings.dayNames:null)||this._defaults.dayNames;var monthNamesShort=(settings?settings.monthNamesShort:null)||this._defaults.monthNamesShort;var monthNames=(settings?settings.monthNames:null)||this._defaults.monthNames;var year=-1;var month=-1;var day=-1;var doy=-1;var literal=false;var lookAhead=function(match){var matches=(iFormat+1<format.length&&format.charAt(iFormat+1)==match);if(matches){iFormat++}return matches};var getNumber=function(match){var isDoubled=lookAhead(match);var size=(match=="@"?14:(match=="!"?20:(match=="y"&&isDoubled?4:(match=="o"?3:2))));var digits=new RegExp("^\\d{1,"+size+"}");var num=value.substring(iValue).match(digits);if(!num){throw"Missing number at position "+iValue}iValue+=num[0].length;return parseInt(num[0],10)};var getName=function(match,shortNames,longNames){var names=$.map(lookAhead(match)?longNames:shortNames,function(v,k){return[[k,v]]}).sort(function(a,b){return -(a[1].length-b[1].length)});var index=-1;$.each(names,function(i,pair){var name=pair[1];if(value.substr(iValue,name.length).toLowerCase()==name.toLowerCase()){index=pair[0];iValue+=name.length;return false}});if(index!=-1){return index+1}else{throw"Unknown name at position "+iValue}};var checkLiteral=function(){if(value.charAt(iValue)!=format.charAt(iFormat)){throw"Unexpected literal at position "+iValue}iValue++};var iValue=0;for(var iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{checkLiteral()}}else{switch(format.charAt(iFormat)){case"d":day=getNumber("d");break;case"D":getName("D",dayNamesShort,dayNames);break;case"o":doy=getNumber("o");break;case"m":month=getNumber("m");break;case"M":month=getName("M",monthNamesShort,monthNames);break;case"y":year=getNumber("y");break;case"@":var date=new Date(getNumber("@"));year=date.getFullYear();month=date.getMonth()+1;day=date.getDate();break;case"!":var date=new Date((getNumber("!")-this._ticksTo1970)/10000);year=date.getFullYear();month=date.getMonth()+1;day=date.getDate();break;case"'":if(lookAhead("'")){checkLiteral()}else{literal=true}break;default:checkLiteral()}}}if(iValue<value.length){throw"Extra/unparsed characters found in date: "+value.substring(iValue)}if(year==-1){year=new Date().getFullYear()}else{if(year<100){year+=new Date().getFullYear()-new Date().getFullYear()%100+(year<=shortYearCutoff?0:-100)}}if(doy>-1){month=1;day=doy;do{var dim=this._getDaysInMonth(year,month-1);if(day<=dim){break}month++;day-=dim}while(true)}var date=this._daylightSavingAdjust(new Date(year,month-1,day));if(date.getFullYear()!=year||date.getMonth()+1!=month||date.getDate()!=day){throw"Invalid date"}return date},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(((1970-1)*365+Math.floor(1970/4)-Math.floor(1970/100)+Math.floor(1970/400))*24*60*60*10000000),formatDate:function(format,date,settings){if(!date){return""}var dayNamesShort=(settings?settings.dayNamesShort:null)||this._defaults.dayNamesShort;var dayNames=(settings?settings.dayNames:null)||this._defaults.dayNames;var monthNamesShort=(settings?settings.monthNamesShort:null)||this._defaults.monthNamesShort;var monthNames=(settings?settings.monthNames:null)||this._defaults.monthNames;var lookAhead=function(match){var matches=(iFormat+1<format.length&&format.charAt(iFormat+1)==match);if(matches){iFormat++}return matches};var formatNumber=function(match,value,len){var num=""+value;if(lookAhead(match)){while(num.length<len){num="0"+num}}return num};var formatName=function(match,value,shortNames,longNames){return(lookAhead(match)?longNames[value]:shortNames[value])};var output="";var literal=false;if(date){for(var iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{output+=format.charAt(iFormat)}}else{switch(format.charAt(iFormat)){case"d":output+=formatNumber("d",date.getDate(),2);break;case"D":output+=formatName("D",date.getDay(),dayNamesShort,dayNames);break;case"o":output+=formatNumber("o",Math.round((new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime()-new Date(date.getFullYear(),0,0).getTime())/86400000),3);break;case"m":output+=formatNumber("m",date.getMonth()+1,2);break;case"M":output+=formatName("M",date.getMonth(),monthNamesShort,monthNames);break;case"y":output+=(lookAhead("y")?date.getFullYear():(date.getYear()%100<10?"0":"")+date.getYear()%100);break;case"@":output+=date.getTime();break;case"!":output+=date.getTime()*10000+this._ticksTo1970;break;case"'":if(lookAhead("'")){output+="'"}else{literal=true}break;default:output+=format.charAt(iFormat)}}}}return output},_possibleChars:function(format){var chars="";var literal=false;var lookAhead=function(match){var matches=(iFormat+1<format.length&&format.charAt(iFormat+1)==match);if(matches){iFormat++}return matches};for(var iFormat=0;iFormat<format.length;iFormat++){if(literal){if(format.charAt(iFormat)=="'"&&!lookAhead("'")){literal=false}else{chars+=format.charAt(iFormat)}}else{switch(format.charAt(iFormat)){case"d":case"m":case"y":case"@":chars+="0123456789";break;case"D":case"M":return null;case"'":if(lookAhead("'")){chars+="'"}else{literal=true}break;default:chars+=format.charAt(iFormat)}}}return chars},_get:function(inst,name){return inst.settings[name]!==undefined?inst.settings[name]:this._defaults[name]},_setDateFromField:function(inst,noDefault){if(inst.input.val()==inst.lastVal){return}var dateFormat=this._get(inst,"dateFormat");var dates=inst.lastVal=inst.input?inst.input.val():null;var date,defaultDate;date=defaultDate=this._getDefaultDate(inst);var settings=this._getFormatConfig(inst);try{date=this.parseDate(dateFormat,dates,settings)||defaultDate}catch(event){this.log(event);dates=(noDefault?"":dates)}inst.selectedDay=date.getDate();inst.drawMonth=inst.selectedMonth=date.getMonth();inst.drawYear=inst.selectedYear=date.getFullYear();inst.currentDay=(dates?date.getDate():0);inst.currentMonth=(dates?date.getMonth():0);inst.currentYear=(dates?date.getFullYear():0);this._adjustInstDate(inst)},_getDefaultDate:function(inst){return this._restrictMinMax(inst,this._determineDate(inst,this._get(inst,"defaultDate"),new Date()))},_determineDate:function(inst,date,defaultDate){var offsetNumeric=function(offset){var date=new Date();date.setDate(date.getDate()+offset);return date};var offsetString=function(offset){try{return $.datepicker.parseDate($.datepicker._get(inst,"dateFormat"),offset,$.datepicker._getFormatConfig(inst))}catch(e){}var date=(offset.toLowerCase().match(/^c/)?$.datepicker._getDate(inst):null)||new Date();var year=date.getFullYear();var month=date.getMonth();var day=date.getDate();var pattern=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;var matches=pattern.exec(offset);while(matches){switch(matches[2]||"d"){case"d":case"D":day+=parseInt(matches[1],10);break;case"w":case"W":day+=parseInt(matches[1],10)*7;break;case"m":case"M":month+=parseInt(matches[1],10);day=Math.min(day,$.datepicker._getDaysInMonth(year,month));break;case"y":case"Y":year+=parseInt(matches[1],10);day=Math.min(day,$.datepicker._getDaysInMonth(year,month));break}matches=pattern.exec(offset)}return new Date(year,month,day)};var newDate=(date==null||date===""?defaultDate:(typeof date=="string"?offsetString(date):(typeof date=="number"?(isNaN(date)?defaultDate:offsetNumeric(date)):new Date(date.getTime()))));newDate=(newDate&&newDate.toString()=="Invalid Date"?defaultDate:newDate);if(newDate){newDate.setHours(0);newDate.setMinutes(0);newDate.setSeconds(0);newDate.setMilliseconds(0)}return this._daylightSavingAdjust(newDate)},_daylightSavingAdjust:function(date){if(!date){return null}date.setHours(date.getHours()>12?date.getHours()+2:0);return date},_setDate:function(inst,date,noChange){var clear=!date;var origMonth=inst.selectedMonth;var origYear=inst.selectedYear;var newDate=this._restrictMinMax(inst,this._determineDate(inst,date,new Date()));inst.selectedDay=inst.currentDay=newDate.getDate();inst.drawMonth=inst.selectedMonth=inst.currentMonth=newDate.getMonth();inst.drawYear=inst.selectedYear=inst.currentYear=newDate.getFullYear();if((origMonth!=inst.selectedMonth||origYear!=inst.selectedYear)&&!noChange){this._notifyChange(inst)}this._adjustInstDate(inst);if(inst.input){inst.input.val(clear?"":this._formatDate(inst))}},_getDate:function(inst){var startDate=(!inst.currentYear||(inst.input&&inst.input.val()=="")?null:this._daylightSavingAdjust(new Date(inst.currentYear,inst.currentMonth,inst.currentDay)));return startDate},_generateHTML:function(inst){var today=new Date();today=this._daylightSavingAdjust(new Date(today.getFullYear(),today.getMonth(),today.getDate()));var isRTL=this._get(inst,"isRTL");var showButtonPanel=this._get(inst,"showButtonPanel");var hideIfNoPrevNext=this._get(inst,"hideIfNoPrevNext");var navigationAsDateFormat=this._get(inst,"navigationAsDateFormat");var numMonths=this._getNumberOfMonths(inst);var showCurrentAtPos=this._get(inst,"showCurrentAtPos");var stepMonths=this._get(inst,"stepMonths");var isMultiMonth=(numMonths[0]!=1||numMonths[1]!=1);var currentDate=this._daylightSavingAdjust((!inst.currentDay?new Date(9999,9,9):new Date(inst.currentYear,inst.currentMonth,inst.currentDay)));var minDate=this._getMinMaxDate(inst,"min");var maxDate=this._getMinMaxDate(inst,"max");var drawMonth=inst.drawMonth-showCurrentAtPos;var drawYear=inst.drawYear;if(drawMonth<0){drawMonth+=12;drawYear--}if(maxDate){var maxDraw=this._daylightSavingAdjust(new Date(maxDate.getFullYear(),maxDate.getMonth()-(numMonths[0]*numMonths[1])+1,maxDate.getDate()));maxDraw=(minDate&&maxDraw<minDate?minDate:maxDraw);while(this._daylightSavingAdjust(new Date(drawYear,drawMonth,1))>maxDraw){drawMonth--;if(drawMonth<0){drawMonth=11;drawYear--}}}inst.drawMonth=drawMonth;inst.drawYear=drawYear;var prevText=this._get(inst,"prevText");prevText=(!navigationAsDateFormat?prevText:this.formatDate(prevText,this._daylightSavingAdjust(new Date(drawYear,drawMonth-stepMonths,1)),this._getFormatConfig(inst)));var prev=(this._canAdjustMonth(inst,-1,drawYear,drawMonth)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._adjustDate('#"+inst.id+"', -"+stepMonths+", 'M');\" title=\""+prevText+'"><span class="ui-icon ui-icon-circle-triangle-'+(isRTL?"e":"w")+'">'+prevText+"</span></a>":(hideIfNoPrevNext?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+prevText+'"><span class="ui-icon ui-icon-circle-triangle-'+(isRTL?"e":"w")+'">'+prevText+"</span></a>"));var nextText=this._get(inst,"nextText");nextText=(!navigationAsDateFormat?nextText:this.formatDate(nextText,this._daylightSavingAdjust(new Date(drawYear,drawMonth+stepMonths,1)),this._getFormatConfig(inst)));var next=(this._canAdjustMonth(inst,+1,drawYear,drawMonth)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._adjustDate('#"+inst.id+"', +"+stepMonths+", 'M');\" title=\""+nextText+'"><span class="ui-icon ui-icon-circle-triangle-'+(isRTL?"w":"e")+'">'+nextText+"</span></a>":(hideIfNoPrevNext?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+nextText+'"><span class="ui-icon ui-icon-circle-triangle-'+(isRTL?"w":"e")+'">'+nextText+"</span></a>"));var currentText=this._get(inst,"currentText");var gotoDate=(this._get(inst,"gotoCurrent")&&inst.currentDay?currentDate:today);currentText=(!navigationAsDateFormat?currentText:this.formatDate(currentText,gotoDate,this._getFormatConfig(inst)));var controls=(!inst.inline?'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+dpuuid+'.datepicker._hideDatepicker();">'+this._get(inst,"closeText")+"</button>":"");var buttonPanel=(showButtonPanel)?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(isRTL?controls:"")+(this._isInRange(inst,gotoDate)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._gotoToday('#"+inst.id+"');\">"+currentText+"</button>":"")+(isRTL?"":controls)+"</div>":"";var firstDay=parseInt(this._get(inst,"firstDay"),10);firstDay=(isNaN(firstDay)?0:firstDay);var showWeek=this._get(inst,"showWeek");var dayNames=this._get(inst,"dayNames");var dayNamesShort=this._get(inst,"dayNamesShort");var dayNamesMin=this._get(inst,"dayNamesMin");var monthNames=this._get(inst,"monthNames");var monthNamesShort=this._get(inst,"monthNamesShort");var beforeShowDay=this._get(inst,"beforeShowDay");var showOtherMonths=this._get(inst,"showOtherMonths");var selectOtherMonths=this._get(inst,"selectOtherMonths");var calculateWeek=this._get(inst,"calculateWeek")||this.iso8601Week;var defaultDate=this._getDefaultDate(inst);var html="";for(var row=0;row<numMonths[0];row++){var group="";this.maxRows=4;for(var col=0;col<numMonths[1];col++){var selectedDate=this._daylightSavingAdjust(new Date(drawYear,drawMonth,inst.selectedDay));var cornerClass=" ui-corner-all";var calender="";if(isMultiMonth){calender+='<div class="ui-datepicker-group';if(numMonths[1]>1){switch(col){case 0:calender+=" ui-datepicker-group-first";cornerClass=" ui-corner-"+(isRTL?"right":"left");break;case numMonths[1]-1:calender+=" ui-datepicker-group-last";cornerClass=" ui-corner-"+(isRTL?"left":"right");break;default:calender+=" ui-datepicker-group-middle";cornerClass="";break}}calender+='">'}calender+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+cornerClass+'">'+(/all|left/.test(cornerClass)&&row==0?(isRTL?next:prev):"")+(/all|right/.test(cornerClass)&&row==0?(isRTL?prev:next):"")+this._generateMonthYearHeader(inst,drawMonth,drawYear,minDate,maxDate,row>0||col>0,monthNames,monthNamesShort)+'</div><table class="ui-datepicker-calendar"><thead><tr>';var thead=(showWeek?'<th class="ui-datepicker-week-col">'+this._get(inst,"weekHeader")+"</th>":"");for(var dow=0;dow<7;dow++){var day=(dow+firstDay)%7;thead+="<th"+((dow+firstDay+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+dayNames[day]+'">'+dayNamesMin[day]+"</span></th>"}calender+=thead+"</tr></thead><tbody>";var daysInMonth=this._getDaysInMonth(drawYear,drawMonth);if(drawYear==inst.selectedYear&&drawMonth==inst.selectedMonth){inst.selectedDay=Math.min(inst.selectedDay,daysInMonth)}var leadDays=(this._getFirstDayOfMonth(drawYear,drawMonth)-firstDay+7)%7;var curRows=Math.ceil((leadDays+daysInMonth)/7);var numRows=(isMultiMonth?this.maxRows>curRows?this.maxRows:curRows:curRows);this.maxRows=numRows;var printDate=this._daylightSavingAdjust(new Date(drawYear,drawMonth,1-leadDays));for(var dRow=0;dRow<numRows;dRow++){calender+="<tr>";var tbody=(!showWeek?"":'<td class="ui-datepicker-week-col">'+this._get(inst,"calculateWeek")(printDate)+"</td>");for(var dow=0;dow<7;dow++){var daySettings=(beforeShowDay?beforeShowDay.apply((inst.input?inst.input[0]:null),[printDate]):[true,""]);var otherMonth=(printDate.getMonth()!=drawMonth);var unselectable=(otherMonth&&!selectOtherMonths)||!daySettings[0]||(minDate&&printDate<minDate)||(maxDate&&printDate>maxDate);tbody+='<td class="'+((dow+firstDay+6)%7>=5?" ui-datepicker-week-end":"")+(otherMonth?" ui-datepicker-other-month":"")+((printDate.getTime()==selectedDate.getTime()&&drawMonth==inst.selectedMonth&&inst._keyEvent)||(defaultDate.getTime()==printDate.getTime()&&defaultDate.getTime()==selectedDate.getTime())?" "+this._dayOverClass:"")+(unselectable?" "+this._unselectableClass+" ui-state-disabled":"")+(otherMonth&&!showOtherMonths?"":" "+daySettings[1]+(printDate.getTime()==currentDate.getTime()?" "+this._currentClass:"")+(printDate.getTime()==today.getTime()?" ui-datepicker-today":""))+'"'+((!otherMonth||showOtherMonths)&&daySettings[2]?' title="'+daySettings[2]+'"':"")+(unselectable?"":' onclick="DP_jQuery_'+dpuuid+".datepicker._selectDay('#"+inst.id+"',"+printDate.getMonth()+","+printDate.getFullYear()+', this);return false;"')+">"+(otherMonth&&!showOtherMonths?"&#xa0;":(unselectable?'<span class="ui-state-default">'+printDate.getDate()+"</span>":'<a class="ui-state-default'+(printDate.getTime()==today.getTime()?" ui-state-highlight":"")+(printDate.getTime()==currentDate.getTime()?" ui-state-active":"")+(otherMonth?" ui-priority-secondary":"")+'" href="#">'+printDate.getDate()+"</a>"))+"</td>";printDate.setDate(printDate.getDate()+1);printDate=this._daylightSavingAdjust(printDate)}calender+=tbody+"</tr>"}drawMonth++;if(drawMonth>11){drawMonth=0;drawYear++}calender+="</tbody></table>"+(isMultiMonth?"</div>"+((numMonths[0]>0&&col==numMonths[1]-1)?'<div class="ui-datepicker-row-break"></div>':""):"");group+=calender}html+=group}html+=buttonPanel+($.browser.msie&&parseInt($.browser.version,10)<7&&!inst.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':"");inst._keyEvent=false;return html},_generateMonthYearHeader:function(inst,drawMonth,drawYear,minDate,maxDate,secondary,monthNames,monthNamesShort){var changeMonth=this._get(inst,"changeMonth");var changeYear=this._get(inst,"changeYear");var showMonthAfterYear=this._get(inst,"showMonthAfterYear");var html='<div class="ui-datepicker-title">';var monthHtml="";if(secondary||!changeMonth){monthHtml+='<span class="ui-datepicker-month">'+monthNames[drawMonth]+"</span>"}else{var inMinYear=(minDate&&minDate.getFullYear()==drawYear);var inMaxYear=(maxDate&&maxDate.getFullYear()==drawYear);monthHtml+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+dpuuid+".datepicker._selectMonthYear('#"+inst.id+"', this, 'M');\" >";for(var month=0;month<12;month++){if((!inMinYear||month>=minDate.getMonth())&&(!inMaxYear||month<=maxDate.getMonth())){monthHtml+='<option value="'+month+'"'+(month==drawMonth?' selected="selected"':"")+">"+monthNamesShort[month]+"</option>"}}monthHtml+="</select>"}if(!showMonthAfterYear){html+=monthHtml+(secondary||!(changeMonth&&changeYear)?"&#xa0;":"")}if(!inst.yearshtml){inst.yearshtml="";if(secondary||!changeYear){html+='<span class="ui-datepicker-year">'+drawYear+"</span>"}else{var years=this._get(inst,"yearRange").split(":");var thisYear=new Date().getFullYear();var determineYear=function(value){var year=(value.match(/c[+-].*/)?drawYear+parseInt(value.substring(1),10):(value.match(/[+-].*/)?thisYear+parseInt(value,10):parseInt(value,10)));return(isNaN(year)?thisYear:year)};var year=determineYear(years[0]);var endYear=Math.max(year,determineYear(years[1]||""));year=(minDate?Math.max(year,minDate.getFullYear()):year);endYear=(maxDate?Math.min(endYear,maxDate.getFullYear()):endYear);inst.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+dpuuid+".datepicker._selectMonthYear('#"+inst.id+"', this, 'Y');\" >";for(;year<=endYear;year++){inst.yearshtml+='<option value="'+year+'"'+(year==drawYear?' selected="selected"':"")+">"+year+"</option>"}inst.yearshtml+="</select>";html+=inst.yearshtml;inst.yearshtml=null}}html+=this._get(inst,"yearSuffix");if(showMonthAfterYear){html+=(secondary||!(changeMonth&&changeYear)?"&#xa0;":"")+monthHtml}html+="</div>";return html},_adjustInstDate:function(inst,offset,period){var year=inst.drawYear+(period=="Y"?offset:0);var month=inst.drawMonth+(period=="M"?offset:0);var day=Math.min(inst.selectedDay,this._getDaysInMonth(year,month))+(period=="D"?offset:0);var date=this._restrictMinMax(inst,this._daylightSavingAdjust(new Date(year,month,day)));inst.selectedDay=date.getDate();inst.drawMonth=inst.selectedMonth=date.getMonth();inst.drawYear=inst.selectedYear=date.getFullYear();if(period=="M"||period=="Y"){this._notifyChange(inst)}},_restrictMinMax:function(inst,date){var minDate=this._getMinMaxDate(inst,"min");var maxDate=this._getMinMaxDate(inst,"max");var newDate=(minDate&&date<minDate?minDate:date);newDate=(maxDate&&newDate>maxDate?maxDate:newDate);return newDate},_notifyChange:function(inst){var onChange=this._get(inst,"onChangeMonthYear");if(onChange){onChange.apply((inst.input?inst.input[0]:null),[inst.selectedYear,inst.selectedMonth+1,inst])}},_getNumberOfMonths:function(inst){var numMonths=this._get(inst,"numberOfMonths");return(numMonths==null?[1,1]:(typeof numMonths=="number"?[1,numMonths]:numMonths))},_getMinMaxDate:function(inst,minMax){return this._determineDate(inst,this._get(inst,minMax+"Date"),null)},_getDaysInMonth:function(year,month){return 32-this._daylightSavingAdjust(new Date(year,month,32)).getDate()},_getFirstDayOfMonth:function(year,month){return new Date(year,month,1).getDay()},_canAdjustMonth:function(inst,offset,curYear,curMonth){var numMonths=this._getNumberOfMonths(inst);var date=this._daylightSavingAdjust(new Date(curYear,curMonth+(offset<0?offset:numMonths[0]*numMonths[1]),1));if(offset<0){date.setDate(this._getDaysInMonth(date.getFullYear(),date.getMonth()))}return this._isInRange(inst,date)},_isInRange:function(inst,date){var minDate=this._getMinMaxDate(inst,"min");var maxDate=this._getMinMaxDate(inst,"max");return((!minDate||date.getTime()>=minDate.getTime())&&(!maxDate||date.getTime()<=maxDate.getTime()))},_getFormatConfig:function(inst){var shortYearCutoff=this._get(inst,"shortYearCutoff");shortYearCutoff=(typeof shortYearCutoff!="string"?shortYearCutoff:new Date().getFullYear()%100+parseInt(shortYearCutoff,10));return{shortYearCutoff:shortYearCutoff,dayNamesShort:this._get(inst,"dayNamesShort"),dayNames:this._get(inst,"dayNames"),monthNamesShort:this._get(inst,"monthNamesShort"),monthNames:this._get(inst,"monthNames")}},_formatDate:function(inst,day,month,year){if(!day){inst.currentDay=inst.selectedDay;inst.currentMonth=inst.selectedMonth;inst.currentYear=inst.selectedYear}var date=(day?(typeof day=="object"?day:this._daylightSavingAdjust(new Date(year,month,day))):this._daylightSavingAdjust(new Date(inst.currentYear,inst.currentMonth,inst.currentDay)));return this.formatDate(this._get(inst,"dateFormat"),date,this._getFormatConfig(inst))}});function bindHover(dpDiv){var selector="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return dpDiv.bind("mouseout",function(event){var elem=$(event.target).closest(selector);if(!elem.length){return}elem.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")}).bind("mouseover",function(event){var elem=$(event.target).closest(selector);if($.datepicker._isDisabledDatepicker(instActive.inline?dpDiv.parent()[0]:instActive.input[0])||!elem.length){return}elem.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");elem.addClass("ui-state-hover");if(elem.hasClass("ui-datepicker-prev")){elem.addClass("ui-datepicker-prev-hover")}if(elem.hasClass("ui-datepicker-next")){elem.addClass("ui-datepicker-next-hover")}})}function extendRemove(target,props){$.extend(target,props);for(var name in props){if(props[name]==null||props[name]==undefined){target[name]=props[name]}}return target}function isArray(a){return(a&&(($.browser.safari&&typeof a=="object"&&a.length)||(a.constructor&&a.constructor.toString().match(/\Array\(\)/))))}$.fn.datepicker=function(options){if(!this.length){return this}if(!$.datepicker.initialized){$(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv);$.datepicker.initialized=true}var otherArgs=Array.prototype.slice.call(arguments,1);if(typeof options=="string"&&(options=="isDisabled"||options=="getDate"||options=="widget")){return $.datepicker["_"+options+"Datepicker"].apply($.datepicker,[this[0]].concat(otherArgs))}if(options=="option"&&arguments.length==2&&typeof arguments[1]=="string"){return $.datepicker["_"+options+"Datepicker"].apply($.datepicker,[this[0]].concat(otherArgs))}return this.each(function(){typeof options=="string"?$.datepicker["_"+options+"Datepicker"].apply($.datepicker,[this].concat(otherArgs)):$.datepicker._attachDatepicker(this,options)})};$.datepicker=new Datepicker();$.datepicker.initialized=false;$.datepicker.uuid=new Date().getTime();$.datepicker.version="1.8.16";window["DP_jQuery_"+dpuuid]=$})(jQuery);(function(a,b){a.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()});this.valueDiv=a("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);this.oldValue=this._value();this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.valueDiv.remove();a.Widget.prototype.destroy.apply(this,arguments)},value:function(c){if(c===b){return this._value()}this._setOption("value",c);return this},_setOption:function(c,d){if(c==="value"){this.options.value=d;this._refreshValue();if(this._value()===this.options.max){this._trigger("complete")}}a.Widget.prototype._setOption.apply(this,arguments)},_value:function(){var c=this.options.value;if(typeof c!=="number"){c=0}return Math.min(this.options.max,Math.max(this.min,c))},_percentage:function(){return 100*this._value()/this.options.max},_refreshValue:function(){var d=this.value();var c=this._percentage();if(this.oldValue!==d){this.oldValue=d;this._trigger("change")}this.valueDiv.toggle(d>this.min).toggleClass("ui-corner-right",d===this.options.max).width(c.toFixed(0)+"%");this.element.attr("aria-valuenow",d)}});a.extend(a.ui.progressbar,{version:"1.8.16"})})(jQuery);jQuery.effects||(function(h,e){h.effects={};h.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","borderColor","color","outlineColor"],function(n,m){h.fx.step[m]=function(o){if(!o.colorInit){o.start=l(o.elem,m);o.end=j(o.end);o.colorInit=true}o.elem.style[m]="rgb("+Math.max(Math.min(parseInt((o.pos*(o.end[0]-o.start[0]))+o.start[0],10),255),0)+","+Math.max(Math.min(parseInt((o.pos*(o.end[1]-o.start[1]))+o.start[1],10),255),0)+","+Math.max(Math.min(parseInt((o.pos*(o.end[2]-o.start[2]))+o.start[2],10),255),0)+")"}});function j(n){var m;if(n&&n.constructor==Array&&n.length==3){return n}if(m=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(n)){return[parseInt(m[1],10),parseInt(m[2],10),parseInt(m[3],10)]}if(m=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(n)){return[parseFloat(m[1])*2.55,parseFloat(m[2])*2.55,parseFloat(m[3])*2.55]}if(m=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(n)){return[parseInt(m[1],16),parseInt(m[2],16),parseInt(m[3],16)]}if(m=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(n)){return[parseInt(m[1]+m[1],16),parseInt(m[2]+m[2],16),parseInt(m[3]+m[3],16)]}if(m=/rgba\(0, 0, 0, 0\)/.exec(n)){return a.transparent}return a[h.trim(n).toLowerCase()]}function l(o,m){var n;do{n=h.curCSS(o,m);if(n!=""&&n!="transparent"||h.nodeName(o,"body")){break}m="backgroundColor"}while(o=o.parentNode);return j(n)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]};var f=["add","remove","toggle"],c={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};function g(){var p=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,q={},n,o;if(p&&p.length&&p[0]&&p[p[0]]){var m=p.length;while(m--){n=p[m];if(typeof p[n]=="string"){o=n.replace(/\-(\w)/g,function(r,s){return s.toUpperCase()});q[o]=p[n]}}}else{for(n in p){if(typeof p[n]==="string"){q[n]=p[n]}}}return q}function b(n){var m,o;for(m in n){o=n[m];if(o==null||h.isFunction(o)||m in c||(/scrollbar/).test(m)||(!(/color/i).test(m)&&isNaN(parseFloat(o)))){delete n[m]}}return n}function i(m,o){var p={_:0},n;for(n in o){if(m[n]!=o[n]){p[n]=o[n]}}return p}h.effects.animateClass=function(m,n,p,o){if(h.isFunction(p)){o=p;p=null}return this.queue(function(){var u=h(this),q=u.attr("style")||" ",v=b(g.call(this)),s,r=u.attr("class");h.each(f,function(w,x){if(m[x]){u[x+"Class"](m[x])}});s=b(g.call(this));u.attr("class",r);u.animate(i(v,s),{queue:false,duration:n,easing:p,complete:function(){h.each(f,function(w,x){if(m[x]){u[x+"Class"](m[x])}});if(typeof u.attr("style")=="object"){u.attr("style").cssText="";u.attr("style").cssText=q}else{u.attr("style",q)}if(o){o.apply(this,arguments)}h.dequeue(this)}})})};h.fn.extend({_addClass:h.fn.addClass,addClass:function(n,m,p,o){return m?h.effects.animateClass.apply(this,[{add:n},m,p,o]):this._addClass(n)},_removeClass:h.fn.removeClass,removeClass:function(n,m,p,o){return m?h.effects.animateClass.apply(this,[{remove:n},m,p,o]):this._removeClass(n)},_toggleClass:h.fn.toggleClass,toggleClass:function(o,n,m,q,p){if(typeof n=="boolean"||n===e){if(!m){return this._toggleClass(o,n)}else{return h.effects.animateClass.apply(this,[(n?{add:o}:{remove:o}),m,q,p])}}else{return h.effects.animateClass.apply(this,[{toggle:o},n,m,q])}},switchClass:function(m,o,n,q,p){return h.effects.animateClass.apply(this,[{add:o,remove:m},n,q,p])}});h.extend(h.effects,{version:"1.8.16",save:function(n,o){for(var m=0;m<o.length;m++){if(o[m]!==null){n.data("ec.storage."+o[m],n[0].style[o[m]])}}},restore:function(n,o){for(var m=0;m<o.length;m++){if(o[m]!==null){n.css(o[m],n.data("ec.storage."+o[m]))}}},setMode:function(m,n){if(n=="toggle"){n=m.is(":hidden")?"show":"hide"}return n},getBaseline:function(n,o){var p,m;switch(n[0]){case"top":p=0;break;case"middle":p=0.5;break;case"bottom":p=1;break;default:p=n[0]/o.height}switch(n[1]){case"left":m=0;break;case"center":m=0.5;break;case"right":m=1;break;default:m=n[1]/o.width}return{x:m,y:p}},createWrapper:function(m){if(m.parent().is(".ui-effects-wrapper")){return m.parent()}var n={width:m.outerWidth(true),height:m.outerHeight(true),"float":m.css("float")},p=h("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),o=document.activeElement;m.wrap(p);if(m[0]===o||h.contains(m[0],o)){h(o).focus()}p=m.parent();if(m.css("position")=="static"){p.css({position:"relative"});m.css({position:"relative"})}else{h.extend(n,{position:m.css("position"),zIndex:m.css("z-index")});h.each(["top","left","bottom","right"],function(q,r){n[r]=m.css(r);if(isNaN(parseInt(n[r],10))){n[r]="auto"}});m.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})}return p.css(n).show()},removeWrapper:function(m){var n,o=document.activeElement;if(m.parent().is(".ui-effects-wrapper")){n=m.parent().replaceWith(m);if(m[0]===o||h.contains(m[0],o)){h(o).focus()}return n}return m},setTransition:function(n,p,m,o){o=o||{};h.each(p,function(r,q){unit=n.cssUnit(q);if(unit[0]>0){o[q]=unit[0]*m+unit[1]}});return o}});function d(n,m,o,p){if(typeof n=="object"){p=m;o=null;m=n;n=m.effect}if(h.isFunction(m)){p=m;o=null;m={}}if(typeof m=="number"||h.fx.speeds[m]){p=o;o=m;m={}}if(h.isFunction(o)){p=o;o=null}m=m||{};o=o||m.duration;o=h.fx.off?0:typeof o=="number"?o:o in h.fx.speeds?h.fx.speeds[o]:h.fx.speeds._default;p=p||m.complete;return[n,m,o,p]}function k(m){if(!m||typeof m==="number"||h.fx.speeds[m]){return true}if(typeof m==="string"&&!h.effects[m]){return true}return false}h.fn.extend({effect:function(p,o,r,u){var n=d.apply(this,arguments),q={options:n[1],duration:n[2],callback:n[3]},s=q.options.mode,m=h.effects[p];if(h.fx.off||!m){if(s){return this[s](q.duration,q.callback)}else{return this.each(function(){if(q.callback){q.callback.call(this)}})}}return m.call(this,q)},_show:h.fn.show,show:function(n){if(k(n)){return this._show.apply(this,arguments)}else{var m=d.apply(this,arguments);m[1].mode="show";return this.effect.apply(this,m)}},_hide:h.fn.hide,hide:function(n){if(k(n)){return this._hide.apply(this,arguments)}else{var m=d.apply(this,arguments);m[1].mode="hide";return this.effect.apply(this,m)}},__toggle:h.fn.toggle,toggle:function(n){if(k(n)||typeof n==="boolean"||h.isFunction(n)){return this.__toggle.apply(this,arguments)}else{var m=d.apply(this,arguments);m[1].mode="toggle";return this.effect.apply(this,m)}},cssUnit:function(m){var n=this.css(m),o=[];h.each(["em","px","%","pt"],function(p,q){if(n.indexOf(q)>0){o=[parseFloat(n),q]}});return o}});h.easing.jswing=h.easing.swing;h.extend(h.easing,{def:"easeOutQuad",swing:function(n,o,m,q,p){return h.easing[h.easing.def](n,o,m,q,p)},easeInQuad:function(n,o,m,q,p){return q*(o/=p)*o+m},easeOutQuad:function(n,o,m,q,p){return -q*(o/=p)*(o-2)+m},easeInOutQuad:function(n,o,m,q,p){if((o/=p/2)<1){return q/2*o*o+m}return -q/2*((--o)*(o-2)-1)+m},easeInCubic:function(n,o,m,q,p){return q*(o/=p)*o*o+m},easeOutCubic:function(n,o,m,q,p){return q*((o=o/p-1)*o*o+1)+m},easeInOutCubic:function(n,o,m,q,p){if((o/=p/2)<1){return q/2*o*o*o+m}return q/2*((o-=2)*o*o+2)+m},easeInQuart:function(n,o,m,q,p){return q*(o/=p)*o*o*o+m},easeOutQuart:function(n,o,m,q,p){return -q*((o=o/p-1)*o*o*o-1)+m},easeInOutQuart:function(n,o,m,q,p){if((o/=p/2)<1){return q/2*o*o*o*o+m}return -q/2*((o-=2)*o*o*o-2)+m},easeInQuint:function(n,o,m,q,p){return q*(o/=p)*o*o*o*o+m},easeOutQuint:function(n,o,m,q,p){return q*((o=o/p-1)*o*o*o*o+1)+m},easeInOutQuint:function(n,o,m,q,p){if((o/=p/2)<1){return q/2*o*o*o*o*o+m}return q/2*((o-=2)*o*o*o*o+2)+m},easeInSine:function(n,o,m,q,p){return -q*Math.cos(o/p*(Math.PI/2))+q+m},easeOutSine:function(n,o,m,q,p){return q*Math.sin(o/p*(Math.PI/2))+m},easeInOutSine:function(n,o,m,q,p){return -q/2*(Math.cos(Math.PI*o/p)-1)+m},easeInExpo:function(n,o,m,q,p){return(o==0)?m:q*Math.pow(2,10*(o/p-1))+m},easeOutExpo:function(n,o,m,q,p){return(o==p)?m+q:q*(-Math.pow(2,-10*o/p)+1)+m},easeInOutExpo:function(n,o,m,q,p){if(o==0){return m}if(o==p){return m+q}if((o/=p/2)<1){return q/2*Math.pow(2,10*(o-1))+m}return q/2*(-Math.pow(2,-10*--o)+2)+m},easeInCirc:function(n,o,m,q,p){return -q*(Math.sqrt(1-(o/=p)*o)-1)+m},easeOutCirc:function(n,o,m,q,p){return q*Math.sqrt(1-(o=o/p-1)*o)+m},easeInOutCirc:function(n,o,m,q,p){if((o/=p/2)<1){return -q/2*(Math.sqrt(1-o*o)-1)+m}return q/2*(Math.sqrt(1-(o-=2)*o)+1)+m},easeInElastic:function(n,q,m,w,v){var r=1.70158;var u=0;var o=w;if(q==0){return m}if((q/=v)==1){return m+w}if(!u){u=v*0.3}if(o<Math.abs(w)){o=w;var r=u/4}else{var r=u/(2*Math.PI)*Math.asin(w/o)}return -(o*Math.pow(2,10*(q-=1))*Math.sin((q*v-r)*(2*Math.PI)/u))+m},easeOutElastic:function(n,q,m,w,v){var r=1.70158;var u=0;var o=w;if(q==0){return m}if((q/=v)==1){return m+w}if(!u){u=v*0.3}if(o<Math.abs(w)){o=w;var r=u/4}else{var r=u/(2*Math.PI)*Math.asin(w/o)}return o*Math.pow(2,-10*q)*Math.sin((q*v-r)*(2*Math.PI)/u)+w+m},easeInOutElastic:function(n,q,m,w,v){var r=1.70158;var u=0;var o=w;if(q==0){return m}if((q/=v/2)==2){return m+w}if(!u){u=v*(0.3*1.5)}if(o<Math.abs(w)){o=w;var r=u/4}else{var r=u/(2*Math.PI)*Math.asin(w/o)}if(q<1){return -0.5*(o*Math.pow(2,10*(q-=1))*Math.sin((q*v-r)*(2*Math.PI)/u))+m}return o*Math.pow(2,-10*(q-=1))*Math.sin((q*v-r)*(2*Math.PI)/u)*0.5+w+m},easeInBack:function(n,o,m,r,q,p){if(p==e){p=1.70158}return r*(o/=q)*o*((p+1)*o-p)+m},easeOutBack:function(n,o,m,r,q,p){if(p==e){p=1.70158}return r*((o=o/q-1)*o*((p+1)*o+p)+1)+m},easeInOutBack:function(n,o,m,r,q,p){if(p==e){p=1.70158}if((o/=q/2)<1){return r/2*(o*o*(((p*=(1.525))+1)*o-p))+m}return r/2*((o-=2)*o*(((p*=(1.525))+1)*o+p)+2)+m},easeInBounce:function(n,o,m,q,p){return q-h.easing.easeOutBounce(n,p-o,0,q,p)+m},easeOutBounce:function(n,o,m,q,p){if((o/=p)<(1/2.75)){return q*(7.5625*o*o)+m}else{if(o<(2/2.75)){return q*(7.5625*(o-=(1.5/2.75))*o+0.75)+m}else{if(o<(2.5/2.75)){return q*(7.5625*(o-=(2.25/2.75))*o+0.9375)+m}else{return q*(7.5625*(o-=(2.625/2.75))*o+0.984375)+m}}}},easeInOutBounce:function(n,o,m,q,p){if(o<p/2){return h.easing.easeInBounce(n,o*2,0,q,p)*0.5+m}return h.easing.easeOutBounce(n,o*2-p,0,q,p)*0.5+q*0.5+m}})})(jQuery);(function(a,b){a.effects.blind=function(c){return this.queue(function(){var e=a(this),d=["position","top","bottom","left","right"];var i=a.effects.setMode(e,c.options.mode||"hide");var h=c.options.direction||"vertical";a.effects.save(e,d);e.show();var k=a.effects.createWrapper(e).css({overflow:"hidden"});var f=(h=="vertical")?"height":"width";var j=(h=="vertical")?k.height():k.width();if(i=="show"){k.css(f,0)}var g={};g[f]=i=="show"?j:0;k.animate(g,c.duration,c.options.easing,function(){if(i=="hide"){e.hide()}a.effects.restore(e,d);a.effects.removeWrapper(e);if(c.callback){c.callback.apply(e[0],arguments)}e.dequeue()})})}})(jQuery);(function(a,b){a.effects.bounce=function(c){return this.queue(function(){var f=a(this),m=["position","top","bottom","left","right"];var l=a.effects.setMode(f,c.options.mode||"effect");var o=c.options.direction||"up";var d=c.options.distance||20;var e=c.options.times||5;var h=c.duration||250;if(/show|hide/.test(l)){m.push("opacity")}a.effects.save(f,m);f.show();a.effects.createWrapper(f);var g=(o=="up"||o=="down")?"top":"left";var q=(o=="up"||o=="left")?"pos":"neg";var d=c.options.distance||(g=="top"?f.outerHeight({margin:true})/3:f.outerWidth({margin:true})/3);if(l=="show"){f.css("opacity",0).css(g,q=="pos"?-d:d)}if(l=="hide"){d=d/(e*2)}if(l!="hide"){e--}if(l=="show"){var j={opacity:1};j[g]=(q=="pos"?"+=":"-=")+d;f.animate(j,h/2,c.options.easing);d=d/2;e--}for(var k=0;k<e;k++){var p={},n={};p[g]=(q=="pos"?"-=":"+=")+d;n[g]=(q=="pos"?"+=":"-=")+d;f.animate(p,h/2,c.options.easing).animate(n,h/2,c.options.easing);d=(l=="hide")?d*2:d/2}if(l=="hide"){var j={opacity:0};j[g]=(q=="pos"?"-=":"+=")+d;f.animate(j,h/2,c.options.easing,function(){f.hide();a.effects.restore(f,m);a.effects.removeWrapper(f);if(c.callback){c.callback.apply(this,arguments)}})}else{var p={},n={};p[g]=(q=="pos"?"-=":"+=")+d;n[g]=(q=="pos"?"+=":"-=")+d;f.animate(p,h/2,c.options.easing).animate(n,h/2,c.options.easing,function(){a.effects.restore(f,m);a.effects.removeWrapper(f);if(c.callback){c.callback.apply(this,arguments)}})}f.queue("fx",function(){f.dequeue()});f.dequeue()})}})(jQuery);(function(a,b){a.effects.clip=function(c){return this.queue(function(){var g=a(this),k=["position","top","bottom","left","right","height","width"];var j=a.effects.setMode(g,c.options.mode||"hide");var l=c.options.direction||"vertical";a.effects.save(g,k);g.show();var d=a.effects.createWrapper(g).css({overflow:"hidden"});var f=g[0].tagName=="IMG"?d:g;var h={size:(l=="vertical")?"height":"width",position:(l=="vertical")?"top":"left"};var e=(l=="vertical")?f.height():f.width();if(j=="show"){f.css(h.size,0);f.css(h.position,e/2)}var i={};i[h.size]=j=="show"?e:0;i[h.position]=j=="show"?0:e/2;f.animate(i,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){if(j=="hide"){g.hide()}a.effects.restore(g,k);a.effects.removeWrapper(g);if(c.callback){c.callback.apply(g[0],arguments)}g.dequeue()}})})}})(jQuery);(function(a,b){a.effects.drop=function(c){return this.queue(function(){var f=a(this),e=["position","top","bottom","left","right","opacity"];var j=a.effects.setMode(f,c.options.mode||"hide");var i=c.options.direction||"left";a.effects.save(f,e);f.show();a.effects.createWrapper(f);var g=(i=="up"||i=="down")?"top":"left";var d=(i=="up"||i=="left")?"pos":"neg";var k=c.options.distance||(g=="top"?f.outerHeight({margin:true})/2:f.outerWidth({margin:true})/2);if(j=="show"){f.css("opacity",0).css(g,d=="pos"?-k:k)}var h={opacity:j=="show"?1:0};h[g]=(j=="show"?(d=="pos"?"+=":"-="):(d=="pos"?"-=":"+="))+k;f.animate(h,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){if(j=="hide"){f.hide()}a.effects.restore(f,e);a.effects.removeWrapper(f);if(c.callback){c.callback.apply(this,arguments)}f.dequeue()}})})}})(jQuery);(function(a,b){a.effects.explode=function(c){return this.queue(function(){var l=c.options.pieces?Math.round(Math.sqrt(c.options.pieces)):3;var f=c.options.pieces?Math.round(Math.sqrt(c.options.pieces)):3;c.options.mode=c.options.mode=="toggle"?(a(this).is(":visible")?"hide":"show"):c.options.mode;var k=a(this).show().css("visibility","hidden");var m=k.offset();m.top-=parseInt(k.css("marginTop"),10)||0;m.left-=parseInt(k.css("marginLeft"),10)||0;var h=k.outerWidth(true);var d=k.outerHeight(true);for(var g=0;g<l;g++){for(var e=0;e<f;e++){k.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-e*(h/f),top:-g*(d/l)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:h/f,height:d/l,left:m.left+e*(h/f)+(c.options.mode=="show"?(e-Math.floor(f/2))*(h/f):0),top:m.top+g*(d/l)+(c.options.mode=="show"?(g-Math.floor(l/2))*(d/l):0),opacity:c.options.mode=="show"?0:1}).animate({left:m.left+e*(h/f)+(c.options.mode=="show"?0:(e-Math.floor(f/2))*(h/f)),top:m.top+g*(d/l)+(c.options.mode=="show"?0:(g-Math.floor(l/2))*(d/l)),opacity:c.options.mode=="show"?1:0},c.duration||500)}}setTimeout(function(){c.options.mode=="show"?k.css({visibility:"visible"}):k.css({visibility:"visible"}).hide();if(c.callback){c.callback.apply(k[0])}k.dequeue();a("div.ui-effects-explode").remove()},c.duration||500)})}})(jQuery);(function(a,b){a.effects.fade=function(c){return this.queue(function(){var d=a(this),e=a.effects.setMode(d,c.options.mode||"hide");d.animate({opacity:e},{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){(c.callback&&c.callback.apply(this,arguments));d.dequeue()}})})}})(jQuery);(function(a,b){a.effects.fold=function(c){return this.queue(function(){var f=a(this),l=["position","top","bottom","left","right"];var i=a.effects.setMode(f,c.options.mode||"hide");var p=c.options.size||15;var o=!(!c.options.horizFirst);var h=c.duration?c.duration/2:a.fx.speeds._default/2;a.effects.save(f,l);f.show();var e=a.effects.createWrapper(f).css({overflow:"hidden"});var j=((i=="show")!=o);var g=j?["width","height"]:["height","width"];var d=j?[e.width(),e.height()]:[e.height(),e.width()];var k=/([0-9]+)%/.exec(p);if(k){p=parseInt(k[1],10)/100*d[i=="hide"?0:1]}if(i=="show"){e.css(o?{height:0,width:p}:{height:p,width:0})}var n={},m={};n[g[0]]=i=="show"?d[0]:p;m[g[1]]=i=="show"?d[1]:0;e.animate(n,h,c.options.easing).animate(m,h,c.options.easing,function(){if(i=="hide"){f.hide()}a.effects.restore(f,l);a.effects.removeWrapper(f);if(c.callback){c.callback.apply(f[0],arguments)}f.dequeue()})})}})(jQuery);(function(a,b){a.effects.highlight=function(c){return this.queue(function(){var e=a(this),d=["backgroundImage","backgroundColor","opacity"],g=a.effects.setMode(e,c.options.mode||"show"),f={backgroundColor:e.css("backgroundColor")};if(g=="hide"){f.opacity=0}a.effects.save(e,d);e.show().css({backgroundImage:"none",backgroundColor:c.options.color||"#ffff99"}).animate(f,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){(g=="hide"&&e.hide());a.effects.restore(e,d);(g=="show"&&!a.support.opacity&&this.style.removeAttribute("filter"));(c.callback&&c.callback.apply(this,arguments));e.dequeue()}})})}})(jQuery);(function(a,b){a.effects.pulsate=function(c){return this.queue(function(){var e=a(this),f=a.effects.setMode(e,c.options.mode||"show");times=((c.options.times||5)*2)-1;duration=c.duration?c.duration/2:a.fx.speeds._default/2,isVisible=e.is(":visible"),animateTo=0;if(!isVisible){e.css("opacity",0).show();animateTo=1}if((f=="hide"&&isVisible)||(f=="show"&&!isVisible)){times--}for(var d=0;d<times;d++){e.animate({opacity:animateTo},duration,c.options.easing);animateTo=(animateTo+1)%2}e.animate({opacity:animateTo},duration,c.options.easing,function(){if(animateTo==0){e.hide()}(c.callback&&c.callback.apply(this,arguments))});e.queue("fx",function(){e.dequeue()}).dequeue()})}})(jQuery);(function(a,b){a.effects.puff=function(c){return this.queue(function(){var g=a(this),h=a.effects.setMode(g,c.options.mode||"hide"),f=parseInt(c.options.percent,10)||150,e=f/100,d={height:g.height(),width:g.width()};a.extend(c.options,{fade:true,mode:h,percent:h=="hide"?f:100,from:h=="hide"?d:{height:d.height*e,width:d.width*e}});g.effect("scale",c.options,c.duration,c.callback);g.dequeue()})};a.effects.scale=function(c){return this.queue(function(){var h=a(this);var e=a.extend(true,{},c.options);var k=a.effects.setMode(h,c.options.mode||"effect");var i=parseInt(c.options.percent,10)||(parseInt(c.options.percent,10)==0?0:(k=="hide"?0:100));var j=c.options.direction||"both";var d=c.options.origin;if(k!="effect"){e.origin=d||["middle","center"];e.restore=true}var g={height:h.height(),width:h.width()};h.from=c.options.from||(k=="show"?{height:0,width:0}:g);var f={y:j!="horizontal"?(i/100):1,x:j!="vertical"?(i/100):1};h.to={height:g.height*f.y,width:g.width*f.x};if(c.options.fade){if(k=="show"){h.from.opacity=0;h.to.opacity=1}if(k=="hide"){h.from.opacity=1;h.to.opacity=0}}e.from=h.from;e.to=h.to;e.mode=k;h.effect("size",e,c.duration,c.callback);h.dequeue()})};a.effects.size=function(c){return this.queue(function(){var d=a(this),o=["position","top","bottom","left","right","width","height","overflow","opacity"];var n=["position","top","bottom","left","right","overflow","opacity"];var k=["width","height","overflow"];var q=["fontSize"];var l=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"];var g=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"];var h=a.effects.setMode(d,c.options.mode||"effect");var j=c.options.restore||false;var f=c.options.scale||"both";var p=c.options.origin;var e={height:d.height(),width:d.width()};d.from=c.options.from||e;d.to=c.options.to||e;if(p){var i=a.effects.getBaseline(p,e);d.from.top=(e.height-d.from.height)*i.y;d.from.left=(e.width-d.from.width)*i.x;d.to.top=(e.height-d.to.height)*i.y;d.to.left=(e.width-d.to.width)*i.x}var m={from:{y:d.from.height/e.height,x:d.from.width/e.width},to:{y:d.to.height/e.height,x:d.to.width/e.width}};if(f=="box"||f=="both"){if(m.from.y!=m.to.y){o=o.concat(l);d.from=a.effects.setTransition(d,l,m.from.y,d.from);d.to=a.effects.setTransition(d,l,m.to.y,d.to)}if(m.from.x!=m.to.x){o=o.concat(g);d.from=a.effects.setTransition(d,g,m.from.x,d.from);d.to=a.effects.setTransition(d,g,m.to.x,d.to)}}if(f=="content"||f=="both"){if(m.from.y!=m.to.y){o=o.concat(q);d.from=a.effects.setTransition(d,q,m.from.y,d.from);d.to=a.effects.setTransition(d,q,m.to.y,d.to)}}a.effects.save(d,j?o:n);d.show();a.effects.createWrapper(d);d.css("overflow","hidden").css(d.from);if(f=="content"||f=="both"){l=l.concat(["marginTop","marginBottom"]).concat(q);g=g.concat(["marginLeft","marginRight"]);k=o.concat(l).concat(g);d.find("*[width]").each(function(){child=a(this);if(j){a.effects.save(child,k)}var r={height:child.height(),width:child.width()};child.from={height:r.height*m.from.y,width:r.width*m.from.x};child.to={height:r.height*m.to.y,width:r.width*m.to.x};if(m.from.y!=m.to.y){child.from=a.effects.setTransition(child,l,m.from.y,child.from);child.to=a.effects.setTransition(child,l,m.to.y,child.to)}if(m.from.x!=m.to.x){child.from=a.effects.setTransition(child,g,m.from.x,child.from);child.to=a.effects.setTransition(child,g,m.to.x,child.to)}child.css(child.from);child.animate(child.to,c.duration,c.options.easing,function(){if(j){a.effects.restore(child,k)}})})}d.animate(d.to,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){if(d.to.opacity===0){d.css("opacity",d.from.opacity)}if(h=="hide"){d.hide()}a.effects.restore(d,j?o:n);a.effects.removeWrapper(d);if(c.callback){c.callback.apply(this,arguments)}d.dequeue()}})})}})(jQuery);(function(a,b){a.effects.shake=function(c){return this.queue(function(){var f=a(this),m=["position","top","bottom","left","right"];var l=a.effects.setMode(f,c.options.mode||"effect");var o=c.options.direction||"left";var d=c.options.distance||20;var e=c.options.times||3;var h=c.duration||c.options.duration||140;a.effects.save(f,m);f.show();a.effects.createWrapper(f);var g=(o=="up"||o=="down")?"top":"left";var q=(o=="up"||o=="left")?"pos":"neg";var j={},p={},n={};j[g]=(q=="pos"?"-=":"+=")+d;p[g]=(q=="pos"?"+=":"-=")+d*2;n[g]=(q=="pos"?"-=":"+=")+d*2;f.animate(j,h,c.options.easing);for(var k=1;k<e;k++){f.animate(p,h,c.options.easing).animate(n,h,c.options.easing)}f.animate(p,h,c.options.easing).animate(j,h/2,c.options.easing,function(){a.effects.restore(f,m);a.effects.removeWrapper(f);if(c.callback){c.callback.apply(this,arguments)}});f.queue("fx",function(){f.dequeue()});f.dequeue()})}})(jQuery);(function(a,b){a.effects.slide=function(c){return this.queue(function(){var f=a(this),e=["position","top","bottom","left","right"];var j=a.effects.setMode(f,c.options.mode||"show");var i=c.options.direction||"left";a.effects.save(f,e);f.show();a.effects.createWrapper(f).css({overflow:"hidden"});var g=(i=="up"||i=="down")?"top":"left";var d=(i=="up"||i=="left")?"pos":"neg";var k=c.options.distance||(g=="top"?f.outerHeight({margin:true}):f.outerWidth({margin:true}));if(j=="show"){f.css(g,d=="pos"?(isNaN(k)?"-"+k:-k):k)}var h={};h[g]=(j=="show"?(d=="pos"?"+=":"-="):(d=="pos"?"-=":"+="))+k;f.animate(h,{queue:false,duration:c.duration,easing:c.options.easing,complete:function(){if(j=="hide"){f.hide()}a.effects.restore(f,e);a.effects.removeWrapper(f);if(c.callback){c.callback.apply(this,arguments)}f.dequeue()}})})}})(jQuery);(function(a,b){a.effects.transfer=function(c){return this.queue(function(){var g=a(this),i=a(c.options.to),f=i.offset(),h={top:f.top,left:f.left,height:i.innerHeight(),width:i.innerWidth()},e=g.offset(),d=a('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(c.options.className).css({top:e.top,left:e.left,height:g.innerHeight(),width:g.innerWidth(),position:"absolute"}).animate(h,c.duration,c.options.easing,function(){d.remove();(c.callback&&c.callback.apply(g[0],arguments));g.dequeue()})})}})(jQuery);
var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    var global = typeof window !== 'undefined' ? window : {};
    var definedProcess = false;
    
    require.define = function (filename, fn) {
        if (!definedProcess && require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
            definedProcess = true;
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process,
                global
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",Function(['require','module','exports','__dirname','__filename','process','global'],"function filter (xs, fn) {\n    var res = [];\n    for (var i = 0; i < xs.length; i++) {\n        if (fn(xs[i], i, xs)) res.push(xs[i]);\n    }\n    return res;\n}\n\n// resolves . and .. elements in a path array with directory names there\n// must be no slashes, empty elements, or device names (c:\\) in the array\n// (so also no leading and trailing slashes - it does not distinguish\n// relative and absolute paths)\nfunction normalizeArray(parts, allowAboveRoot) {\n  // if the path tries to go above the root, `up` ends up > 0\n  var up = 0;\n  for (var i = parts.length; i >= 0; i--) {\n    var last = parts[i];\n    if (last == '.') {\n      parts.splice(i, 1);\n    } else if (last === '..') {\n      parts.splice(i, 1);\n      up++;\n    } else if (up) {\n      parts.splice(i, 1);\n      up--;\n    }\n  }\n\n  // if the path is allowed to go above the root, restore leading ..s\n  if (allowAboveRoot) {\n    for (; up--; up) {\n      parts.unshift('..');\n    }\n  }\n\n  return parts;\n}\n\n// Regex to split a filename into [*, dir, basename, ext]\n// posix version\nvar splitPathRe = /^(.+\\/(?!$)|\\/)?((?:.+?)?(\\.[^.]*)?)$/;\n\n// path.resolve([from ...], to)\n// posix version\nexports.resolve = function() {\nvar resolvedPath = '',\n    resolvedAbsolute = false;\n\nfor (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {\n  var path = (i >= 0)\n      ? arguments[i]\n      : process.cwd();\n\n  // Skip empty and invalid entries\n  if (typeof path !== 'string' || !path) {\n    continue;\n  }\n\n  resolvedPath = path + '/' + resolvedPath;\n  resolvedAbsolute = path.charAt(0) === '/';\n}\n\n// At this point the path should be resolved to a full absolute path, but\n// handle relative paths to be safe (might happen when process.cwd() fails)\n\n// Normalize the path\nresolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {\n    return !!p;\n  }), !resolvedAbsolute).join('/');\n\n  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';\n};\n\n// path.normalize(path)\n// posix version\nexports.normalize = function(path) {\nvar isAbsolute = path.charAt(0) === '/',\n    trailingSlash = path.slice(-1) === '/';\n\n// Normalize the path\npath = normalizeArray(filter(path.split('/'), function(p) {\n    return !!p;\n  }), !isAbsolute).join('/');\n\n  if (!path && !isAbsolute) {\n    path = '.';\n  }\n  if (path && trailingSlash) {\n    path += '/';\n  }\n  \n  return (isAbsolute ? '/' : '') + path;\n};\n\n\n// posix version\nexports.join = function() {\n  var paths = Array.prototype.slice.call(arguments, 0);\n  return exports.normalize(filter(paths, function(p, index) {\n    return p && typeof p === 'string';\n  }).join('/'));\n};\n\n\nexports.dirname = function(path) {\n  var dir = splitPathRe.exec(path)[1] || '';\n  var isWindows = false;\n  if (!dir) {\n    // No dirname\n    return '.';\n  } else if (dir.length === 1 ||\n      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {\n    // It is just a slash or a drive letter with a slash\n    return dir;\n  } else {\n    // It is a full dirname, strip trailing slash\n    return dir.substring(0, dir.length - 1);\n  }\n};\n\n\nexports.basename = function(path, ext) {\n  var f = splitPathRe.exec(path)[2] || '';\n  // TODO: make this comparison case-insensitive on windows?\n  if (ext && f.substr(-1 * ext.length) === ext) {\n    f = f.substr(0, f.length - ext.length);\n  }\n  return f;\n};\n\n\nexports.extname = function(path) {\n  return splitPathRe.exec(path)[3] || '';\n};\n\n//@ sourceURL=path"
));

require.define("__browserify_process",Function(['require','module','exports','__dirname','__filename','process','global'],"var process = module.exports = {};\n\nprocess.nextTick = (function () {\n    var canSetImmediate = typeof window !== 'undefined'\n        && window.setImmediate;\n    var canPost = typeof window !== 'undefined'\n        && window.postMessage && window.addEventListener\n    ;\n\n    if (canSetImmediate) {\n        return function (f) { return window.setImmediate(f) };\n    }\n\n    if (canPost) {\n        var queue = [];\n        window.addEventListener('message', function (ev) {\n            if (ev.source === window && ev.data === 'browserify-tick') {\n                ev.stopPropagation();\n                if (queue.length > 0) {\n                    var fn = queue.shift();\n                    fn();\n                }\n            }\n        }, true);\n\n        return function nextTick(fn) {\n            queue.push(fn);\n            window.postMessage('browserify-tick', '*');\n        };\n    }\n\n    return function nextTick(fn) {\n        setTimeout(fn, 0);\n    };\n})();\n\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\n\nprocess.binding = function (name) {\n    if (name === 'evals') return (require)('vm')\n    else throw new Error('No such module. (Possibly not yet loaded)')\n};\n\n(function () {\n    var cwd = '/';\n    var path;\n    process.cwd = function () { return cwd };\n    process.chdir = function (dir) {\n        if (!path) path = require('path');\n        cwd = path.resolve(dir, cwd);\n    };\n})();\n\n//@ sourceURL=__browserify_process"
));

require.define("/index.js",Function(['require','module','exports','__dirname','__filename','process','global'],"/*\n\tThis is a very basic note-taking app. It stores notes for the duration of a session.\n\tFor simplicity, we are not using any special MVP views (from nCombo's MVP plugin) - Just plain jQuery. \n\tIn a practical setting, you may want to split your code into several files and include them into one another using \n\t$n.grab.app.script().\n*/\n/*\n$n.grab.framework.style('bootstrap');\n\n$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.core.css');\n$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.dialog.css');\n$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.resizable.css');\n$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.selectable.css');\n$n.grab.framework.style('jqueryui/ui-lightness/jquery.ui.theme.css');\n$n.grab.framework.lib('jquery/ui');\n\n$n.grab.app.style('main');\n*/\nvar loginTemplate = $n.grab.app.template('login');\nvar mainTemplate = $n.grab.app.template('main');\nvar notesTableTemplate = $n.grab.app.template('notes_table');\nvar addNoteDialogTemplate = $n.grab.app.template('add_note_dialog');\n\nvar stage = $(document.body);\nvar screens = {};\n\n// Once all our scripts and styles are loaded\n$n.ready(function() {\n\t$n.local.exec('auth', 'isLoggedIn', function(err, isLoggedIn) {\n\t\tif(isLoggedIn) {\n\t\t\tmain();\n\t\t} else {\n\t\t\tstage.html(loginTemplate.render());\n\t\t\tvar lis = screens.loginScreen = stage.find('.login-screen');\n\t\t\t\n\t\t\tlis.find('.username').val('bob');\n\t\t\tlis.find('.password').val('hello');\n\t\t\tlis.find('.login-btn').click(function() {\n\t\t\t\tvar user = lis.find('.username').val();\n\t\t\t\tvar pass = lis.find('.password').val();\n\t\t\t\t\n\t\t\t\tvar authData = {username: user, password: pass};\n\t\t\t\t$n.local.exec('auth', 'login', authData, function(err, success) {\n\t\t\t\t\tif(success) {\n\t\t\t\t\t\tmain();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tscreens.loginScreen.find('.error-box').html('Failed. Wrong username or password.');\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t});\n\t\t}\n\t});\n});\n\nfunction main() {\n\tconsole.log('User is logged in');\n\tscreens.loginScreen && screens.loginScreen.remove();\n\t\n\t// Render all templates to the stage and get references to all major view components\n\tstage.html(mainTemplate.render());\n\tvar mainView = stage.find('.main');\n\tvar notesView = stage.find('.notes-view');\n\tnotesView.html(notesTableTemplate.render({notes:[]}));\n\tvar notesTable = stage.find('.notes-table');\n\tstage.append(addNoteDialogTemplate.render());\n\t\n\tvar addNoteDialog = stage.find('.add-note-dialog');\n\tvar addNoteDialogAddButton = addNoteDialog.find('.add-btn');\n\t\n\taddNoteDialogAddButton.click(function() {\n\t\tvar title = addNoteDialog.find('.title').val();\n\t\tvar message = addNoteDialog.find('.message').val();\n\t\t// Execute the notes sim's createNote method - This will add a new note to this session\n\t\t$n.local.exec('notes', 'createNote', {title: title, message: message});\n\t});\n\t\n\tvar addNoteButton = mainView.find('.add-note-btn');\n\t\n\taddNoteButton.click(function() {\n\t\taddNoteDialog.dialog({title: 'Add New Note'});\n\t});\n\t\n\tvar renderNotes = function(notes) {\n\t\t// Render the entire table from scratch for simplicity's sake; this leverages handlebars template capabilities\n\t\tnotesView.html(notesTableTemplate.render(notes));\n\t}\n\t\n\t// Execute the notes sim's getNotes method\n\t$n.local.exec('notes', 'getNotes', function(err, notes) {\n\t\trenderNotes(notes);\n\t});\n\t\n\t// Watch for the addednote server event which will be triggered whenever a new note is added\n\t$n.local.watch('addednote', renderNotes);\n}\n\n//@ sourceURL=/index.js"
));
require("/index.js");
