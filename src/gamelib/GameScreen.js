import FrameBuffer from './FrameBuffer';
import Rect from './Rect'

export default class GameScreen {
    // #element;
    // var element;
    
    // var frameBuffer;
    
    // // current bitmap size
    // var this.bitmapW;
    // var this.bitmapH;
    
    // // current style size
    // var this.styleW;
    // var this.styleH;
    
    // var this.pixelRatio;
    
    // // physical rect of Canvas abstract screen rect
    // var this.abstractScreen;
    
    // // abstract size of abstract screen
    // var this.abstractW;
    // var this.abstractH;
    
    isFullScreen() {
        return document.fullScreen || 
               document.mozFullScreen || 
               document.webkitIsFullScreen;
    }
    
    init(id, zoom) {
        this.element = document.getElementById(id);
        
        // fullscreen psudo class
        try {
            document.styleSheets[0].insertRule('#' + id +
                ':-webkit-full-screen { width: 100%; height: 100%; }');
        } catch (e) {
        }
        
        // create a zero size frame buffer
        // change to appropriate size at the first clear
        this.frameBuffer = new FrameBuffer(0, 0);
        
        var canvas = this.frameBuffer.getCanvas();
        // need to make the parent element same size
        canvas.style.display = 'block';
        
        this.element.appendChild(canvas);
        
        this.pixelRatio = 1;
        if (window.devicePixelRatio) {
            // draw crisp canvas on smartphones
            this.pixelRatio = window.devicePixelRatio;
        }
        
        // TODO: Remove zoom function. This is useless.
        if (zoom) {
            this.pixelRatio /= zoom;
        }
    }

    clear(color) {
        // Get desired canvas size. This is changed by:
        //		- resizing window
        //		- smartphone orientation
        //		- fullscreen
        
        var targetW = this.element.offsetWidth;
        var targetH = this.element.offsetHeight;
        
        if (this.isFullScreen()) {
            // this.element size is not changed
            // when width and height is set by pixel
            targetW = window.innerWidth;
            targetH = window.innerHeight;
        }
        
        // change canvas size if needed
        if (this.styleW != targetW ||
            this.styleH != targetH) {
            
            this.styleW = targetW;
            this.styleH = targetH;
            
            this.frameBuffer.setSize(this.styleW * this.pixelRatio, this.styleH * this.pixelRatio);
            
            var canvas = this.frameBuffer.getCanvas();
            canvas.style.width = this.styleW + 'px';
            canvas.style.height = this.styleH + 'px';
            
            this.bitmapW = this.frameBuffer.getW();
            this.bitmapH = this.frameBuffer.getH();
        }
        
        this.clearAbstractScreen();
        
        if (color) {
            this.frameBuffer.clear(color);
        }
    }
        
    getFrameBuffer() {
        return this.frameBuffer;
    }
        
    getW() {
        return this.bitmapW;
    }
        
    getH() {
        return this.bitmapH;
    }
        
    requestFullScreen() {
        if (this.element["requestFullScreen"]) {
            this.element["requestFullScreen"]();
            return;
        }
        if (this.element["webkitRequestFullScreen"]) {
            this.element["webkitRequestFullScreen"]();
            return;
        }
        if (this.element["mozRequestFullScreen"]) {
            this.element["mozRequestFullScreen"]();
            return;
        }
    }
        
    clearAbstractScreen() {
        this.abstractScreen = new Rect(0, 0, this.bitmapW, this.bitmapH);
        this.frameBuffer.getContext().setTransform(1, 0, 0, 1, 0, 0);
    }
        
    setAbstractScreen(w, h) {
        if (this.bitmapW > this.bitmapH) {
            this.abstractScreen.h = this.bitmapH;
            this.abstractScreen.w = w * (this.abstractScreen.h / h);
            
            this.abstractScreen.x = this.bitmapW / 2 - this.abstractScreen.w / 2;
            this.abstractScreen.y = 0;
        } else {
            this.abstractScreen.w = this.bitmapW;
            this.abstractScreen.h = h * (this.abstractScreen.w / w);
            
            this.abstractScreen.x = 0;
            if (isMobile) {
                this.abstractScreen.y = 0;
            } else {
                this.abstractScreen.y = this.bitmapH / 2 - this.abstractScreen.h / 2;
            }
        }
        
        this.abstractScreen.x = Math.round(this.abstractScreen.x);
        this.abstractScreen.y = Math.round(this.abstractScreen.y);
        
        var scaleX = this.abstractScreen.w / w;
        var scaleY = this.abstractScreen.h / h;
        this.frameBuffer.getContext().setTransform(scaleX, 0, 0, scaleY, this.abstractScreen.x, this.abstractScreen.y);
        
        // preserve physical size of abstract screen
        this.abstractW = w;
        this.abstractH = h;
    }
        
    getAbstractScreen() {
        return this.abstractScreen;
    }
        
    getAbstractPosition(x, y) {
        return {
            x: gamelib.map(x, this.abstractScreen.x, this.abstractScreen.x + this.abstractScreen.w, 0, this.abstractW),
            y: gamelib.map(y, this.abstractScreen.y, this.abstractScreen.y + this.abstractScreen.h, 0, this.abstractH)
        };
    }
        
    getPhysicalPosition(x, y) {
        return {
            x: gamelib.map(x, 0, this.abstractW, this.abstractScreen.x, this.abstractScreen.x + this.abstractScreen.w),
            y: gamelib.map(y, 0, this.abstractH, this.abstractScreen.y, this.abstractScreen.y + this.abstractScreen.h)
        };
    }
        
    // convert abstract screen rect to physical screen rect
    getPhysicalRect(rect) {
        return new gamelib.Rect(
            gamelib.map(rect.x, 0, this.abstractW, this.abstractScreen.x, this.abstractScreen.x + this.abstractScreen.w),
            gamelib.map(rect.y, 0, this.abstractH, this.abstractScreen.y, this.abstractScreen.y + this.abstractScreen.h),
            rect.w * this.abstractScreen.w / this.abstractW,
            rect.h * this.abstractScreen.h / this.abstractH
        );
    }
        
    // convert physical screen rect to abstract screen rect
    getAbstractRect(rect) {
        return new Rect(
            gamelib.map(rect.x, this.abstractScreen.x, this.abstractScreen.x + this.abstractScreen.w, 0, this.abstractW),
            gamelib.map(rect.y, this.abstractScreen.y, this.abstractScreen.y + this.abstractScreen.h, 0, this.abstractH),
            rect.w * this.abstractW / this.abstractScreen.w,
            rect.h * this.abstractH / this.abstractScreen.h
        );
    }

    drawFrame(color) {
        var context = this.frameBuffer.getContext();
        
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        context.fillStyle = color;
        
        // left border
        context.fillRect(0, 0, this.abstractScreen.x, this.bitmapH);
        
        // right border
        context.fillRect(this.abstractScreen.x + this.abstractScreen.w, 0, 
            this.bitmapW - (this.abstractScreen.x + this.abstractScreen.w), 
            this.bitmapH);
        
        // top border
        context.fillRect(0, 0, this.bitmapW, this.abstractScreen.y);
        
        // down border
        context.fillRect(0, this.abstractScreen.y + this.abstractScreen.h, 
            this.bitmapW, 
            this.bitmapH - (this.abstractScreen.y + this.abstractScreen.h));
        
        context.restore();
    }
}
