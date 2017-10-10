
/**
 *	@constructor
 */
var createScore = function () {
    var obj = new gamelib.GameObject();
    
    var font = "20px 'Aldrich'";
    
    obj.update = function (deltaTime) {
        hudRenderer.drawText("SCORE " + score, 10, 30, "#fff", font);
    };
    
    return obj;
};


