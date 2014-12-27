
/**
 *	@constructor
 */
var createFragment = function (x, y, no) {
	/* import */ var random = gamelib.random;
	
	var obj = new gamelib.GameObject();
	
	var direction = random(0, Math.PI * 2);
	var initialSpeed = random(10, 500);
	
	var vx = Math.cos(direction) * initialSpeed;
	var vy = Math.sin(direction) * initialSpeed;
	var vz = random(100, 500);
	
	var G = -500;
	
	var z = 0;
	
	var angle = random(0, Math.PI * 2);
	var deltaAngle = random(-30, 30);
	
	var lifespan = 1;
	
	obj.update = function (deltaTime) {
		
		vz += G * deltaTime;
		if (z + vz * deltaTime < 0) {
			var speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
			var d = speed * 0.5;
			
			vx += random(-d, d);
			vy += random(-d, d);
			
			vz = -vz * 0.5;
			vx *= 0.5;
			vy *= 0.5;
			
			var speed = 
			
			deltaAngle *= 0.5;
		}
		
		x += vx * deltaTime;
		y += vy * deltaTime;
		z += vz * deltaTime;
		angle += deltaAngle * deltaTime;
		
		if (z < 10) {
			lifespan -= deltaTime;
			if (lifespan < 0) {
				this.destroy();
			}
		}
		
		renderer.setLayer(Layer.SHADOWS);
		renderer.drawSprite(fragmentShadowSprites[no], x + z, y + z, angle);
		renderer.setLayer(Layer.SKY_OBJECTS);
		renderer.drawSprite(fragmentSprites[no], x, y, angle, 1 * Math.pow(2, z / 100));
	};
	
	return obj;
};


