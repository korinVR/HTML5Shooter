
(function () {
	var offsetX = 0;
	var offsetY = 0;
	
	var pixelRatio;
	
	
	var keyState = [];
	var keyCount = new Array(256);
	
	var preventKeys = [ 37, 38, 39, 40, 32 ];
	
	var mouseButtonState;
	var mouseX;
	var mouseY;
	
	// for preserving touch events
	var touches = [];
	var touchCount = 0;
	
	function pageToScreenX(pageX) { return (pageX - offsetX) * pixelRatio; }
	function pageToScreenY(pageY) { return (pageY - offsetY) * pixelRatio; }

	function onKeyDown(event) {
	//		console.log(event.keyCode);
		keyState[event.keyCode] = true;
		
		// prevent page scrolling by keys
		for (var i in preventKeys) {
			if (event.keyCode == preventKeys[i]) {
				event.preventDefault();
			}
		}
	}
	
	function onKeyUp(event) {
		keyState[event.keyCode] = false;
	}
	
	function onMouseDown(event) {
		mouseButtonState = true;
		mouseX = pageToScreenX(event.pageX);
		mouseY = pageToScreenY(event.pageY);
	}
	
	function onMouseMove(event) {
		mouseX = pageToScreenX(event.pageX);
		mouseY = pageToScreenY(event.pageY);
	}
	
	function onMouseUp(event) {
		mouseButtonState = false;
		mouseX = pageToScreenX(event.pageX);
		mouseY = pageToScreenY(event.pageY);
	}
	
	function onTouchStart(event) {
		preserveTouches(event);
	}
	
	function onTouchMove(event) {
		preserveTouches(event);
		event.preventDefault();
	}
	
	function onTouchEnd(event) {
		preserveTouches(event);
	}
	
	function onTouchCancel(event) {
		preserveTouches(event);
		reset();
	}
	
	function preserveTouches(event) {
		for (var i = 0; i < event.touches.length; i++) {
			var touch = event.touches[i];
			
			touches[i] = {
				id : touch.identifier,
				x : pageToScreenX(touch.pageX),
				y : pageToScreenY(touch.pageY)
			};
		}
		touchCount = event.touches.length;
	}
	
	function reset() {
		mouseButtonState = false;
		
		for (var i = 0; i < keyCount.length; i++) {
			keyState[i] = false;
			keyCount[i] = 0;
		}
	}
	
	function onBlur() {
		reset();
	}
	
	/**
	 *	@class 入力を扱うモジュールです。
	 */
	gamelib.input.Input = {
		// current touches and mouse down point
		points : [],
		pointCount : 0
	};
			
	/**
	 *	モジュールを初期化します。
	 */
	gamelib.input.Input.init = function (/**String*/ id, /**Number*/ zoom) {
		function getOffset(element) {
			var _x = 0;
			var _y = 0;
			while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
				_x += element.offsetLeft - element.scrollLeft;
				_y += element.offsetTop - element.scrollTop;
				element = element.offsetParent;
			}
			return { top: _y, left: _x };
		}

		var element = document.getElementById(id);
		var offset = getOffset(element);
		offsetX = offset.left;
		offsetY = offset.top;
		
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
		
		element.addEventListener('mousedown', onMouseDown, false);
		element.addEventListener('mousemove', onMouseMove, false);
		element.addEventListener('mouseup', onMouseUp, false);
		
		element.addEventListener('touchstart', onTouchStart, false);
		element.addEventListener('touchmove', onTouchMove, false);
		element.addEventListener('touchend', onTouchEnd, false);
		element.addEventListener('touchcancel', onTouchCancel, false);
		
		window.addEventListener('onblur', onBlur, false);
		
		reset();
		
		pixelRatio = 1;
		if (window.devicePixelRatio) {
			pixelRatio = window.devicePixelRatio;
		}
		
		if (arguments.length == 2) {
			pixelRatio /= zoom;
		}
	};
	
	/**
	 *	右クリックを抑制します
	 */
	gamelib.input.Input.preventRightClick = function () {
		document.oncontextmenu = function () { return false; };
	};
	
	/**
	 *	キーが押下されているか調べます。
	 *	@return 押下されていればtrue、されていなければfalse
	 */
	gamelib.input.Input.isPressed = function (/**Number*/ keyCode) /**Boolean*/ {
		return keyState[keyCode];
	};
			
	gamelib.input.Input.isDown = function (keyCode) {
		return (keyCount[keyCode] == 1);
	};
			
	gamelib.input.Input.getStickX = function () {
		if (keyState[39]) {
			return 1;
		}
		if (keyState[37]) {
			return -1;
		}
		return 0;
	};
			
	gamelib.input.Input.getStickY = function () {
		if (keyState[38]) {
			return -1;
		}
		if (keyState[40]) {
			return 1;
		}
		return 0;
	};
			
	gamelib.input.Input.isButtonPressed = function () {
		if (keyState[32] || keyState[17]) {
			return true;
		}
		return false;
	};
			
	gamelib.input.Input.getMousePosition = function () {
		if (!mouseX) {
			// mouse cursor is out of window
			return null;
		}
		return {
			x : mouseX,
			y : mouseY
		};
	};
			
	gamelib.input.Input.isMouseButtonDown = function () {
		return mouseButtonState;
	};
			
	gamelib.input.Input.update = function () {
		// update key count
		for (var i = 0; i < keyCount.length; i++) {
			if (keyState[i]) {
				keyCount[i]++;
			} else {
				keyCount[i] = 0;
			}
		}
		
		// update points (merge touches and mouse down)
		var i;
		
		for (i = 0; i < touchCount; i++) {
			this.points[i] = {
				id : touches[i].id,
				x : touches[i].x,
				y : touches[i].y
			};
		}
		if (mouseButtonState) {
			this.points[i] = {
				id : "mouse button",
				x : mouseX,
				y : mouseY
			};
			i++;
		}
		this.pointCount = i;
	};

})();


