/**
	Default loader for nCombo applications.
*/

var jLoad = {
	_ie: /MSIE (\d+\.\d+);/.test(navigator.userAgent),
	_loader: null,
	_loaderTextBox: null,
	_loaderInterval: null,
	_loaderAnimInterval: 200,
	_loaderAnimText: null,
	_loaderCounter: null,
	_frameworkURL: null,
	_imgLoaded: false,
	_fadeSpeed: 20,
	_alpha: 0,
	_fadeInterval: null,
    
	start: function(settings) {
		jLoad._frameworkURL = settings.frameworkURL;
		jLoad._frameworkClientURL = settings.frameworkClientURL;
		jLoad._loaderAnimText = [];
		
		var imgURL = smartCacheManager.setURLCacheVersion(jLoad._frameworkClientURL + 'assets/logo.png');
		var textAnim = ['Loading App', 'Loading App.', 'Loading App..', 
				'Loading App...', 'Loading App..', 'Loading App.'];
		
		jLoad._load(imgURL, 'nCombo', 'http://ncombo.com/', textAnim);
	},
	
	_load: function(loadImageURL, loadImageCaption, loadImageLinkURL, loadTextAnimation) {		
		jLoad._loader = document.createElement('div');
		jLoad._loader.style.position = 'absolute';
		jLoad._loader.style.visibility = 'hidden';
		jLoad._loader.style.width = '80px';
		
		jLoad._loaderCounter = 0;
		jLoad._imgLoaded = false;
		jLoad.hideLoader();
		jLoad._loaderAnimText = loadTextAnimation;
		
		var startText;
		if(jLoad._loaderAnimText.length > 0) {
			startText = jLoad._loaderAnimText[0];
		} else {
			startText = '';
		}
		
		var linkEl = document.createElement('a');
		linkEl.setAttribute('href', loadImageLinkURL);
		linkEl.setAttribute('target', '_blank');
		
		var imgEl = document.createElement('img');
		imgEl.style.width = '80px';
		imgEl.style.height = '80px';
		imgEl.style.display = 'block';
		imgEl.style.marginRight = 'auto';
		imgEl.style.marginLeft = 'auto';
		imgEl.setAttribute('src', loadImageURL);
		imgEl.setAttribute('alt', loadImageCaption);
		imgEl.setAttribute('border', '0px');
		
		jLoad._loaderTextBox = document.createElement('div');
		jLoad._loaderTextBox.style.whiteSpace = 'nowrap';
		jLoad._loaderTextBox.style.marginTop = '4px';
		jLoad._loaderTextBox.style.fontFamily = 'Arial';
		jLoad._loaderTextBox.style.fontSize = '12px';
		jLoad._loaderTextBox.style.color = '#666';
		
		jLoad._loaderTextBox.innerHTML = startText;
		
		linkEl.appendChild(imgEl);
		
		jLoad._loader.appendChild(linkEl);
		jLoad._loader.appendChild(jLoad._loaderTextBox);
		
		var img = new Image();
		img.onload = jLoad._ready;
		img.src = loadImageURL;
	},
	
	_setOpacity: function(obj, value) {
		obj.style.opacity = value / 100;
		obj.style.filter = 'alpha(opacity=' + value + ')';
	},
	
	_ready: function() {
		$loader.loadAll();
		$loader.on('loadall', jLoad._loaded);
		
		if(jLoad._loader) {
			document.body.appendChild(jLoad._loader);
			
			var loadWidth = jLoad._loader.offsetWidth;
			var loadHeight = jLoad._loader.offsetHeight;
			
			jLoad._loader.style.left = '50%';
			jLoad._loader.style.top = '50%';
			jLoad._loader.style.marginLeft = -loadWidth / 2 + 'px';
			jLoad._loader.style.marginTop = -loadHeight / 2 + 'px';
			
			jLoad._alpha = 0;
			jLoad._setOpacity(jLoad._loader, jLoad._alpha);
			
			jLoad._loader.style.visibility = 'visible';
			
			if(NCOMBO_IS_FRESH) {
				jLoad._fadeInterval = setInterval(function() {
					if(jLoad._alpha < 100) {
						jLoad._alpha += jLoad._fadeSpeed;
					} else {
						jLoad._alpha = 100;
						clearInterval(jLoad._fadeInterval);
					}
					if(jLoad._loader) {
						jLoad._setOpacity(jLoad._loader, jLoad._alpha);
					} else {
						clearInterval(jLoad._fadeInterval);
					}
				}, 25);
				
				jLoad._loaderInterval = setInterval(jLoad._animateLoader, jLoad._loaderAnimInterval);
			}
		}
	},
	
	_animateLoader: function() {
		if(jLoad._loader) {
			var animLen = jLoad._loaderAnimText.length;
			if(animLen > 0) {
				var frameNum = jLoad._loaderCounter++ % animLen;
				jLoad._loaderTextBox.innerHTML = jLoad._loaderAnimText[frameNum];
			} else {
				clearInterval(jLoad._loaderInterval);
				jLoad._loaderInterval = null;
			}
		}
	},
	
	_loaded: function() {
		jLoad.fadeOutLoader($loader.finish);
	},
	
	hideLoader: function() {		
		if(jLoad._loaderInterval) {
			clearInterval(jLoad._loaderInterval);
			jLoad._loaderInterval = null;
		}
		if(document.body && jLoad._loader && jLoad._loader.parentNode == document.body) {
			document.body.removeChild(jLoad._loader);
			jLoad._loader = null;
		}
	},
	
	fadeOutLoader: function(callback) {	
		clearInterval(jLoad._fadeInterval);
		jLoad._fadeInterval = setInterval(function() {
			if(jLoad._alpha > 0) {
				jLoad._alpha -= jLoad._fadeSpeed;
			} else {
				jLoad._alpha = 0;
				jLoad.hideLoader();
			}
			if(jLoad._loader) {
				jLoad._setOpacity(jLoad._loader, jLoad._alpha);
			} else {
				clearInterval(jLoad._fadeInterval);
				callback();
			}
		}, 25);
	},
	
	getWindowWidth: function() {
		if(jLoad._ie) {
			return document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
		} else {
			return window.innerWidth;
		}
	},
	
	getWindowHeight: function() {
		if(jLoad._ie) {
			return document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
		} else {
			return window.innerHeight;
		}
	}
};

$loader.ready(jLoad.start);