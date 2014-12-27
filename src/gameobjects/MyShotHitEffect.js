
/**
 *	@constructor
 */
var createMyShotHitEffect = function (x, y, vx, vy) {
	var obj = new gamelib.GameObject();
	
	var radius = 10;
	
	var alpha = 1;
	
	var DISTRIBUTION = 0;
	vx += gamelib.random(-DISTRIBUTION, DISTRIBUTION);
	vy += gamelib.random(-DISTRIBUTION, DISTRIBUTION);
	
	obj.update = function (deltaTime) {
		x += vx * deltaTime;
		y += vy * deltaTime;
		
		alpha -= 3 * deltaTime;
		if (alpha < 0) {
			this.destroy();
		}
		
		renderer.setLayer(Layer.EFFECTS);
		renderer.fillCircle(x, y, radius, "rgba(255, 255, 255, " + alpha + ")");
	};
	
	return obj;
};


