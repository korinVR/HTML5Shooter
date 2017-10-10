
/**
 *	@constructor
 */
gamelib.SpriteSheet = function (image, w, h, number, baseX, baseY) {
    this.image = image;
    this.sprites = [];
    
    if (baseX === undefined) {
        baseX = 0;
        baseY = 0;
//		baseX = image.width / number / 2;
//		baseY = image.height / 2;
    }
    
    this.baseX = baseX;
    this.baseY = baseY;
    
    // create raw patterns
    for (var i = 0; i < number; i++) {
        this.sprites[i] = {
            x : i * w,
            y : 0,
            w : w,
            h : h
        };
    }
    
    this.setSprite = function(index, x, y, w, h) {
        this.sprites[index] = {
            x : x,
            y : y,
            w : w,
            h : h
        };
    };
}


