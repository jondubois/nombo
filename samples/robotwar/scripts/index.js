var mainTemplate = $n.grab.app.template('index.html');

$(document.body).css('overflow', 'hidden');
$(document.body).html(mainTemplate.toString());

var windowWidth = $(window).innerWidth();
var windowHeight = $(window).innerHeight();

$('#mainCanvas').attr('width', windowWidth);
$('#mainCanvas').attr('height', windowHeight);

var stage = new createjs.Stage("mainCanvas");

var botImage = new createjs.Bitmap($n.grab.app.assetURL("bot.png"));
botImage.x = 200;
botImage.y = 200;
stage.addChild(botImage);

createjs.Ticker.setFPS(40);
createjs.Ticker.addEventListener("tick", handleTick);

var mouseX = 0;
var mouseY = 0;

stage.addEventListener('stagemousemove', function(e) {
	mouseX = e.stageX;
	mouseY = e.stageY;
});

stage.update();

var speedDivider = 20;

function handleTick(event) {
	var dx = mouseX - botImage.x - 15;
	var dy = mouseY - botImage.y - 15;

	botImage.x += dx / speedDivider;
	botImage.y += dy / speedDivider;
	stage.update();
}