
// Canvas drawImage() source which has a base position

/**
 *	@constructor
 */
gamelib.Sprite = function (image, baseX, baseY) {
	this.image = image;
	
	if (baseX === undefined) {
		baseX = 0;
		baseY = 0;
//		baseX = image.width / 2;
//		baseY = image.height / 2;
	}
	
	this.baseX = baseX;
	this.baseY = baseY;
};


