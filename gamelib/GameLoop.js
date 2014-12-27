
gamelib.GameLoop = function () {
	var gameTime = 0;
	
	var running = false;
	var update;
	
	var lastTime;
	var currentTime;
	
	var MAX_FRAME_TIME = 0.05;
	
	function callback() {
		if (!running) {
			return;
		}
		
		currentTime = new Date().getTime() / 1000;
		if (!lastTime) {
			lastTime = currentTime - 0.0166;
		}
		
//		d1 = d0;
//		d0 = currentTime - lastTime;
//		var deltaTime = gamelib.clamp((d1 + d0) / 2, 0, 0.05);
		var deltaTime = gamelib.clamp(currentTime - lastTime, 0, MAX_FRAME_TIME);
		lastTime = currentTime;
		
		gameTime += deltaTime;
		
		// update tween
		gamelib.tween.Tween.update();
		
		if (update) {
			update(deltaTime);
		}
		
		var frameTime = (new Date().getTime() / 1000) - currentTime;
		
		if (window.requestAnimationFrame) {
			requestAnimationFrame(callback, document.body);
		} else if (window.webkitRequestAnimationFrame) {
			webkitRequestAnimationFrame(callback, document.body);
		} else if (window.mozRequestAnimationFrame) {
			mozRequestAnimationFrame(callback, document.body);
		} else {
			var sleepTime = gamelib.clamp(0.0166 - frameTime, 0, MAX_FRAME_TIME);
			if (isMobile) {
//				sleepTime = 0.0166;
				sleepTime = 0.01;
			}
			setTimeout(callback, sleepTime * 1000);
		}
	}
	
	return {
		run : function (func) {
			update = func;
			
			if (!running) {
				running = true;
				callback();
			}
		},
		
		stop : function () {
			running = false;
		},
		
		getTime : function () {
			return gameTime;
		}
	};

}();


