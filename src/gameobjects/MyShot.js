
/**
 *	@constructor
 */
var createMyShot = function (x, y, vx, vy, angle) {
    var obj = new gamelib.GameObject();
    
    obj.update = function (deltaTime) {
        x += vx * deltaTime;
        y += vy * deltaTime;
        
        if (outOfField(x, y, 40)) {
            this.destroy();
        }
        
        this.setAABB(x, y, 8);
        
        renderer.setLayer(Layer.MYSHOTS);
        renderer.drawSprite(myShotSprite, x, y, angle, 1.5);
    };
    
    obj.onCollide = function (gameObject) {
        effects.attach(createMyShotHitEffect(x, y, vx * 0.1, vy * 0.1));
        
        this.destroy();
    };
    
    return obj;
};


