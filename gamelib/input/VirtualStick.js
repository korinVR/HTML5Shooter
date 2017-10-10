
/**
 *	@constructor
 */
gamelib.input.VirtualStick = function (image) {
    
    // radius of the image
    var imageRadius;
    
    // tracking ID
    var id = null;
    
    // tracking start position
    var baseX;
    var baseY;
    
    var stickCircleRadius = 40;
    var deadZone = 0.2;
    
    var stickX;
    var stickY;
    
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
    
    this.setImageRadius = function (radius) {
        imageRadius = radius;
    };
    
    this.update = function () {
        var size = (GameScreen.getW() + GameScreen.getH()) / 2 * 0.275;
        this.setBoundary(0, 0, GameScreen.getW() - size * 1.5, GameScreen.getH());
        this.setImageRadius(size / 2);
        
        var dx = 0;
        var dy = 0;
        
        var touched = false
        
        for (var i = 0; i < Input.pointCount; i++) {
            var point = Input.points[i];
            
            if (inRange(point.x, x, x + w) && 
                inRange(point.y, y, y + h)) {
                if (id == null) {
                    // start tracking
                    id = point.id;
                    baseX = point.x;
                    baseY = point.y;
                    
                    touched = true;
                    break;
                }
                if (id == point.id) {
                    // continue tracking
                    dx = point.x - baseX;
                    dy = point.y - baseY;
                    
                    touched = true;
                    break;
                }
            }
        }
        
        if (!touched) {
            // stop tracking
            id = null;
        }
        
        // normalize stick position
        dx /= stickCircleRadius;
        dy /= stickCircleRadius;
        
        var magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude > 1) {
            dx /= magnitude;
            dy /= magnitude;
        }
        
        // apply dead zone
        if (inRange(dx, -deadZone, deadZone)) {
            dx = 0;
        }
        if (inRange(dy, -deadZone, deadZone)) {
            dy = 0;
        }
        
        stickX = dx;
        stickY = dy;
        
        if (id) {
            var bx = baseX + stickX * stickCircleRadius;
            var by = baseY + stickY * stickCircleRadius;
            
            guiRenderer.drawImage(image, bx - imageRadius, by - imageRadius, 
                imageRadius * 2, imageRadius * 2);
        }
    };
    
    this.getPosition = function () {
        return { x : stickX, y : stickY };
    };
    
    this.render = function () {
    };
};


