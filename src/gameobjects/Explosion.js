
/**
 *	@constructor
 */
var createExplosion = function (x, y, vx, vy) {
    var obj = new gamelib.GameObject();
    
    if (vx === undefined) {
        vx = 0;
        vy = 0;
    }
    
    obj.update = function (deltaTime) {
        x += vx * deltaTime;
        y += vy * deltaTime;
        
        var frame = this.getFrame(0.05);
        if (frame >= 24) {
            this.destroy();
        }
        
        renderer.setLayer(Layer.EFFECTS);
        renderer.drawSheetSpriteAdd(explosionSpriteSheet, frame, x, y, 0, 2);
    };
    
    return obj;
};

