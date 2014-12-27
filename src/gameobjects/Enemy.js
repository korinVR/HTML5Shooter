
/**
 *	@constructor
 */
var createEnemy = function () {
	var obj = new gamelib.GameObject();
	
	var RADIUS = 80;
	
	var x;
	var y;
	var vx;
	var vy;
	
	var health = 5;
	var flash = false;
	
	var SPEED = 1000 / 16;
	
	switch (gamelib.randomInt(1, 4)) {
	case 1:
		x = gamelib.random(FIELD_X0, FIELD_X1);
		y = FIELD_Y0 - RADIUS
		vx = gamelib.random(-1, 1) * SPEED;
		vy = SPEED;
		break;
		
	case 2:
		x = gamelib.random(FIELD_X0, FIELD_X1);
		y = FIELD_Y1 + RADIUS;
		vx = gamelib.random(-1, 1) * SPEED;
		vy = -SPEED;
		break;
		
	case 3:
		x = FIELD_X0 - RADIUS;
		y = gamelib.random(FIELD_Y0, FIELD_Y1);
		vx = SPEED;
		vy = gamelib.random(-1, 1) * SPEED;
		break;
		
	case 4:
		x = FIELD_X1 + RADIUS;
		y = gamelib.random(FIELD_Y0, FIELD_Y1);
		vx = -SPEED;
		vy = gamelib.random(-1, 1) * SPEED;
		break;
	}
	
	var shotTime = gamelib.random(1.6, 4.8);
	
	obj.update = function (deltaTime) {
		var nextX = x + vx * deltaTime;
		var nextY = y + vy * deltaTime;
		
		if ((nextX < FIELD_X0 && vx < 0) ||
			(nextX > FIELD_X1 && vx > 0)) {
			vx = -vx;
		}
		if ((nextY < FIELD_Y0 && vy < 0) ||
			(nextY > FIELD_Y1 && vy > 0)) {
			vy = -vy;
		}
		
		x += vx * deltaTime;
		y += vy * deltaTime;
		
		shotTime -= deltaTime;
		if (shotTime < 0) {
			shotTime = gamelib.random(1.6, 4.8);
			
			var dest = myShip.getPosition();
			var angle = Math.atan2(dest.y - y, dest.x - x);
			var speed = 100;
			
			enemyShots.attach(createEnemyShot(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed));
		}
		
		this.setAABB(x, y, 60);
		
		renderer.setLayer(Layer.SHADOWS);
		renderer.drawSprite(enemyShadowSprite, x + 4, y + 4, 0, 2);
		renderer.setLayer(Layer.GROUND_OBJECTS);
		renderer.drawSprite(flash ? flashedEnemySprite : enemySprite, x, y, 0, 2);
		flash = false;
	};
	
	obj.onCollide = function (gameObject) {
		flash = true;
		
		score += 1;
		
		if (--health <= 0) {
			var audioX = gamelib.map(x, 0, SCREEN_W, -1, 1);
			var audioY = gamelib.map(y, 0, SCREEN_H, -1, 1);
			gamelib.Sound.playSE("explosion", audioX, audioY, 1);
			
			for (var i = 0; i < 4; i++) {
				effects.attach(createExplosion(x + gamelib.random(-30, 30), y + gamelib.random(-30, 30), gamelib.random(-50, 50), gamelib.random(-50, 50)));
			}
			
			var fragmentNum = isMobile ? 4 : 32;
			for (var i = 0; i < fragmentNum; i++) {
				effects.attach(createFragment(x, y, gamelib.randomInt(0, 2)));
			}
			
			this.destroy();
			score += 100;
		}
	};
	
	return obj;
};


