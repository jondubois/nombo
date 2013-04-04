var mainTemplate = $n.grab.app.template('index.html');
$(document.body).html(mainTemplate.toString());

var stage = new createjs.Stage("mainCanvas");
var botImage = new createjs.Bitmap($n.grab.app.assetURL("bot.png"));
botImage.x = 200;
botImage.y = 200;
console.log($n.grab.app.assetURL("bot.png"));
stage.addChild(botImage);
//alert(111);
//createjs.Ticker.setFPS(40);
//createjs.Ticker.addEventListener("tick", handleTick);
stage.update();

function handleTick(event) {
	botImage.x += 10;
	stage.update();
}