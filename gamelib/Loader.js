
gamelib.Loader = function () {
	var loadingCount = 0;
	
	var baseURL;
	
	return {
		init : function (baseURL_) {
			baseURL = baseURL_;
		},
		
		load : function (id) {
			console.log("Loader : loading " + id);
			
			var image = new Image();
			
			image.onload = function () {
				loadingCount--;
			};
			
			try {
				if (IMAGES[id]) {
					// load from Data URI
					image.src = IMAGES[id];
				}
			} catch (e) {
				// load from file
				image.src = baseURL + id;
			}
			
			loadingCount++;
			
			return image;
		},
		
		getLoadingCount : function () {
//			console.log(loadingCount);
			return loadingCount;
		}
	};
}();

// helper functions

gamelib.loadSprite = function (id, baseX, baseY) {
	return new gamelib.Sprite(gamelib.Loader.load(id), baseX, baseY);
};

gamelib.loadSpriteSheet = function (id, w, h, number, baseX, baseY) {
	return new gamelib.SpriteSheet(gamelib.Loader.load(id), w, h, number, baseX, baseY);
};


