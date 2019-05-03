
/**
 *	@constructor
 */
gamelib.input.TouchButton = function (image, downImage) {
    var count = 0;
    
    var x;
    var y;
    var w;
    var h;
    
    this.setBoundary = function (x_, y_, w_, h_) {
        x = x_;
        y = y_;
        w = w_;
        h = h_;
    };
    
    this.isDown = function () {
        return (count > 0);
    };
    
    this.update = function () {
        var size = (GameScreen.getW() + GameScreen.getH()) / 2 * 0.275;
        
        this.setBoundary(
            GameScreen.getW() - size, 
            GameScreen.getH() - size, 
            size, size);
        
        var hit = false;
        
        for (var i = 0; i < Input.pointCount; i++) {
            var point = Input.points[i];
            
            if (inRange(point.x, x, x + w) && 
                inRange(point.y, y, y + h)) {
                hit = true;
                break;
            }
        }
        
        if (hit) {
            count++;
        } else {
            count = 0;
        }
        
        if (image) {
            if (this.isDown()) {
                if (downImage) {
                    guiRenderer.drawImage(downImage, x, y, w, h);
                } else {
                    guiRenderer.drawImage(image, x, y, w, h);
                }
                return;
            }
            guiRenderer.drawImage(image, x, y, w, h);
        }
    };
};


