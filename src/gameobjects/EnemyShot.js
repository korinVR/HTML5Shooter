
/**
 *	@constructor
 */
var createEnemyShot = function (x, y, vx, vy) {
	var obj = new gamelib.GameObject();
	
	obj.update = function (deltaTime) {
		x += vx * deltaTime;
		y += vy * deltaTime;
		
		if (outOfField(x, y, 4)) {
			this.destroy();
		}
		
		this.setAABB(x, y, 3);
		
		renderer.setLayer(Layer.ENEMY_SHOTS);
		renderer.drawSprite(enemyShotSprite, x, y, this.getTime() * 30);
	};
	
	obj.onCollide = function (gameObject) {
		this.destroy();
	};
	
	return obj;
};


