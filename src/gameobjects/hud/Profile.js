
/**
 *	@constructor
 */
var createProfile = function () {
	var obj = new gamelib.GameObject();
	
	var font = "20px 'Aldrich'";
	
	obj.update = function (deltaTime) {
		hudRenderer.drawText("Update : " + gamelib.Stopwatch.getTime("update") + " ms" , SCREEN_W - 150, 30, "#fff", font);
		hudRenderer.drawText("Render : " + gamelib.Stopwatch.getTime("render") + " ms" , SCREEN_W - 150, 55, "#fff", font);
		hudRenderer.drawText("Sprites : " + renderer.getSize(), SCREEN_W - 150, 80, "#fff", font);
	};
	
	return obj;
};


