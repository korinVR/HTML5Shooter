
/**
 *	@constructor
 */
var createGameOver = function () {
    var obj = new gamelib.GameObject();
    
    var font = "20px 'Aldrich'";
    
    obj.update = function (deltaTime) {
        hudRenderer.drawText("GAME OVER", SCREEN_W / 2, SCREEN_H / 2, "#fff", font, "center", "middle");
        
        if (this.getTime() > 2) {
            gamelib.GameLoop.run(title);
        }
    };
    
    return obj;
};


