var content = '<div style="width: 0; height: 0; overflow: visible; position: absolute; top: 50%; left: 50%; font-size: 14px; font-family: Arial, Helvetica, sans-serif; line-height: 150%;">\
	<img src="/~framework/client/assets/logo.png" alt="Nombo" style="width: 80px; height: 80px; margin-top: -80px; margin-left: -40px; border: 0px;" />\
	<div style="text-align: center; width: 200px; margin-left: -100px;">\
		Server connection failed due to the following error: ' + NOMBO_ERROR + '.\
	</div>\
</div>';

document.body.innerHTML = content;