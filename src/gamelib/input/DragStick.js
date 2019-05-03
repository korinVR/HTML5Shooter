
/**
 *	@constructor
 */
gamelib.input.DragStick = function () {
    
    // tracking ID
    var id = null;
    
    var prevX;
    var prevY;
    
    var dx;
    var dy;
    
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
    
    this.update = function () {
        this.setBoundary(0, 0, gamelib.GameScreen.getW(), gamelib.GameScreen.getH());
        
        var currentX;
        var currentY;
        
        var touched = false;
        
        for (var i = 0; i < gamelib.input.Input.pointCount; i++) {
            var point = gamelib.input.Input.points[i];
            
            if (gamelib.inRange(point.x, x, x + w) && 
                gamelib.inRange(point.y, y, y + h)) {
                if (id == null) {
                    // start tracking
                    id = point.id;
                    currentX = prevX = point.x;
                    currentY = prevY = point.y;
                    
                    touched = true;
                    break;
                }
                if (id == point.id) {
                    // continue tracking
                    currentX = point.x;
                    currentY = point.y;
                    
                    touched = true;
                    break;
                }
            }
        }
        
        if (!touched) {
            // stop tracking
            id = null;
            
            dx = 0;
            dy = 0;
            return;
        }
        
        dx = currentX - prevX;
        dy = currentY - prevY;
        
        prevX = currentX;
        prevY = currentY;
    };
    
    this.getDelta = function () {
        return { x : dx, y : dy };
    };
};


