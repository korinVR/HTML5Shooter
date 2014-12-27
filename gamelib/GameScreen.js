
gamelib.GameScreen = function () {
	var element;
	
	var frameBuffer;
	
	// current bitmap size
	var bitmapW;
	var bitmapH;
	
	// current style size
	var styleW;
	var styleH;
	
	var pixelRatio;
	
	// physical rect of Canvas abstract screen rect
	var abstractScreen;
	
	// abstract size of abstract screen
	var abstractW;
	var abstractH;
	
	function isFullScreen() {
		return document.fullScreen || 
			   document.mozFullScreen || 
			   document.webkitIsFullScreen;
	}
	
	return {
		init : function (id, zoom) {
			element = document.getElementById(id);
			
			// fullscreen psudo class
			try {
				document.styleSheets[0].insertRule('#' + id +
					':-webkit-full-screen { width: 100%; height: 100%; }');
			} catch (e) {
			}
			
			// create a zero size frame buffer
			// change to appropriate size at the first clear
			frameBuffer = new gamelib.FrameBuffer(0, 0);
			
			var canvas = frameBuffer.getCanvas();
			// need to make the parent element same size
			canvas.style.display = 'block';
			
			element.appendChild(canvas);
			
			pixelRatio = 1;
			if (window.devicePixelRatio) {
				// draw crisp canvas on smartphones
				pixelRatio = window.devicePixelRatio;
			}
			
			// TODO: Remove zoom function. This is useless.
			if (zoom) {
				pixelRatio /= zoom;
			}
		},
		
		clear : function (color) {
			// Get desired canvas size. This is changed by:
			//		- resizing window
			//		- smartphone orientation
			//		- fullscreen
			
			var targetW = element.offsetWidth;
			var targetH = element.offsetHeight;
			
			if (isFullScreen()) {
				// element size is not changed
				// when width and height is set by pixel
				targetW = window.innerWidth;
				targetH = window.innerHeight;
			}
			
			// change canvas size if needed
			if (styleW != targetW ||
				styleH != targetH) {
				
				styleW = targetW;
				styleH = targetH;
				
				frameBuffer.setSize(styleW * pixelRatio, styleH * pixelRatio);
				
				var canvas = frameBuffer.getCanvas();
				canvas.style.width = styleW + 'px';
				canvas.style.height = styleH + 'px';
				
				bitmapW = frameBuffer.getW();
				bitmapH = frameBuffer.getH();
			}
			
			this.clearAbstractScreen();
			
			if (color) {
				frameBuffer.clear(color);
			}
		},
		
		getFrameBuffer : function () {
			return frameBuffer;
		},
		
		getW : function () {
			return bitmapW;
		},
		
		getH : function () {
			return bitmapH;
		},
		
		requestFullScreen : function () {
			if (element["requestFullScreen"]) {
				element["requestFullScreen"]();
				return;
			}
			if (element["webkitRequestFullScreen"]) {
				element["webkitRequestFullScreen"]();
				return;
			}
			if (element["mozRequestFullScreen"]) {
				element["mozRequestFullScreen"]();
				return;
			}
		},
		
		clearAbstractScreen : function () {
			abstractScreen = new gamelib.Rect(0, 0, bitmapW, bitmapH);
			frameBuffer.getContext().setTransform(1, 0, 0, 1, 0, 0);
		},
		
		setAbstractScreen : function (w, h) {
			if (bitmapW > bitmapH) {
				abstractScreen.h = bitmapH;
				abstractScreen.w = w * (abstractScreen.h / h);
				
				abstractScreen.x = bitmapW / 2 - abstractScreen.w / 2;
				abstractScreen.y = 0;
			} else {
				abstractScreen.w = bitmapW;
				abstractScreen.h = h * (abstractScreen.w / w);
				
				abstractScreen.x = 0;
				if (isMobile) {
					abstractScreen.y = 0;
				} else {
					abstractScreen.y = bitmapH / 2 - abstractScreen.h / 2;
				}
			}
			
			abstractScreen.x = Math.round(abstractScreen.x);
			abstractScreen.y = Math.round(abstractScreen.y);
			
			var scaleX = abstractScreen.w / w;
			var scaleY = abstractScreen.h / h;
			frameBuffer.getContext().setTransform(scaleX, 0, 0, scaleY, abstractScreen.x, abstractScreen.y);
			
			// preserve physical size of abstract screen
			abstractW = w;
			abstractH = h;
		},
		
		getAbstractScreen : function () {
			return abstractScreen;
		},
		
		getAbstractPosition : function (x, y) {
			return {
				x: gamelib.map(x, abstractScreen.x, abstractScreen.x + abstractScreen.w, 0, abstractW),
				y: gamelib.map(y, abstractScreen.y, abstractScreen.y + abstractScreen.h, 0, abstractH)
			};
		},
		
		getPhysicalPosition : function (x, y) {
			return {
				x: gamelib.map(x, 0, abstractW, abstractScreen.x, abstractScreen.x + abstractScreen.w),
				y: gamelib.map(y, 0, abstractH, abstractScreen.y, abstractScreen.y + abstractScreen.h)
			};
		},
		
		// convert abstract screen rect to physical screen rect
		getPhysicalRect : function (rect) {
			return new gamelib.Rect(
				gamelib.map(rect.x, 0, abstractW, abstractScreen.x, abstractScreen.x + abstractScreen.w),
				gamelib.map(rect.y, 0, abstractH, abstractScreen.y, abstractScreen.y + abstractScreen.h),
				rect.w * abstractScreen.w / abstractW,
				rect.h * abstractScreen.h / abstractH
			);
		},
		
		// convert physical screen rect to abstract screen rect
		getAbstractRect : function (rect) {
			return new Rect(
				gamelib.map(rect.x, abstractScreen.x, abstractScreen.x + abstractScreen.w, 0, abstractW),
				gamelib.map(rect.y, abstractScreen.y, abstractScreen.y + abstractScreen.h, 0, abstractH),
				rect.w * abstractW / abstractScreen.w,
				rect.h * abstractH / abstractScreen.h
			);
		},
		
		drawFrame : function (color) {
			var context = frameBuffer.getContext();
			
			context.save();
			context.setTransform(1, 0, 0, 1, 0, 0);
			
			context.fillStyle = color;
			
			// left border
			context.fillRect(0, 0, abstractScreen.x, bitmapH);
			
			// right border
			context.fillRect(abstractScreen.x + abstractScreen.w, 0, 
				bitmapW - (abstractScreen.x + abstractScreen.w), 
				bitmapH);
			
			// top border
			context.fillRect(0, 0, bitmapW, abstractScreen.y);
			
			// down border
			context.fillRect(0, abstractScreen.y + abstractScreen.h, 
				bitmapW, 
				bitmapH - (abstractScreen.y + abstractScreen.h));
			
			context.restore();
		}
		
	};
}();


