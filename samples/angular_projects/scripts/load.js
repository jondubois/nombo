/**
	Default loader for Nombo apps.
*/

(function () {
	_loader = null;
	_loaderTextBox = null;
	_loaderAnimInterval = 200;
	_loaderText = null;
	_frameworkURL = null;
	_fadeSpeed = 20;
	_alpha = 0;
	_fadeInterval = null;
	_isFinished = false;
    
	start = function (settings) {
		_frameworkURL = settings.frameworkURL;
		_frameworkClientURL = settings.frameworkClientURL;
		
		var imgURL = NOMBO_CACHE_MANAGER.setURLCacheVersion(_frameworkClientURL + 'assets/logo.png');
		var text = 'Loading';
		
		_load(imgURL, 'Nombo', 'http://nombo.io/', text);
	};
	
	progress = function (status) {
		if (_loaderTextBox != null) {
			var percentage;
			if(status.total == 0) {
				percentage = 100;
			} else {
				percentage = Math.round(status.loaded / status.total * 100);
			}
			_loaderTextBox.innerHTML = _loaderText + ' (' + percentage + '%)';
		}
	};
	
	_load = function (loadImageURL, loadImageCaption, loadImageLinkURL, text) {
		if (!NOMBO_DEBUG) {
			var showLoader = function () {
				if (!_isFinished) {
					_loader = document.createElement('div');
					_loader.style.position = 'absolute';
					_loader.style.visibility = 'hidden';
					_loader.style.overflow = 'visible';
					_loader.style.width = '0';
					_loader.style.height = '0';
					_loader.style.left = '50%';
					_loader.style.top = '50%';
					
					hideLoader();
					_loaderText = text;
					
					var linkEl = document.createElement('a');
					linkEl.setAttribute('href', loadImageLinkURL);
					linkEl.setAttribute('target', '_blank');
					
					var imgEl = document.createElement('img');
					imgEl.style.width = '80px';
					imgEl.style.height = '80px';
					imgEl.style.display = 'block';
					imgEl.style.marginTop = '-40px';
					imgEl.style.marginLeft = '-40px';
					imgEl.setAttribute('src', loadImageURL);
					imgEl.setAttribute('alt', loadImageCaption);
					imgEl.setAttribute('border', '0');
					
					_loaderTextBox = document.createElement('div');
					_loaderTextBox.style.width = '200px';
					_loaderTextBox.style.marginLeft = '-100px';
					_loaderTextBox.style.textAlign = 'center';
					_loaderTextBox.style.whiteSpace = 'nowrap';
					_loaderTextBox.style.marginTop = '5px';
					_loaderTextBox.style.fontFamily = 'Arial';
					_loaderTextBox.style.fontSize = '14px';
					_loaderTextBox.style.color = '#666';
					
					progress({loaded: 0, total: 1});
					
					linkEl.appendChild(imgEl);
					
					_loader.appendChild(linkEl);
					_loader.appendChild(_loaderTextBox);
					
					document.body.appendChild(_loader);
					
					_alpha = 0;
					_setOpacity(_loader, _alpha);
					
					_loader.style.visibility = 'visible';
					if (NOMBO_IS_FRESH) {
						$loader.progress(progress);
						_fadeInterval = setInterval(function () {
							if(_alpha < 100) {
								_alpha += _fadeSpeed;
							} else {
								_alpha = 100;
								clearInterval(_fadeInterval);
							}
							if(_loader) {
								_setOpacity(_loader, _alpha);
							} else {
								clearInterval(_fadeInterval);
							}
						}, 25);
					}
				}
			};
			
			var img = new Image();
			img.onload = showLoader;
			img.src = loadImageURL;
			
			$loader.on('loadall', _loaded);
		} else {
			$loader.on('loadall', $loader.finish);
		}
		
		$loader.loadAll();
	};
	
	_setOpacity = function (obj, value) {
		obj.style.opacity = value / 100;
		obj.style.filter = 'alpha(opacity=' + value + ')';
	};
	
	_loaded = function () {
		_isFinished = true;
		$loader.off('progress', progress);
		progress({loaded: 1, total: 1});
		fadeOutLoader($loader.finish);
	};
	
	hideLoader = function () {
		if(document.body && _loader && _loader.parentNode == document.body) {
			document.body.removeChild(_loader);
		}
	};
	
	fadeOutLoader = function (callback) {
		clearInterval(_fadeInterval);
		_fadeInterval = setInterval(function () {
			if(_alpha > 0) {
				_alpha -= _fadeSpeed;
			} else {
				_alpha = 0;
				hideLoader();
				_loader = null;
			}
			if(_loader) {
				_setOpacity(_loader, _alpha);
			} else {
				clearInterval(_fadeInterval);
				callback();
			}
		}, 25);
	};
	
	$loader.ready(start);
})();