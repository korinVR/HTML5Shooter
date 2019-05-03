
export default class Loader {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    load(id) {
        console.log("Loader : loading " + id);
        
        const image = new Image();
        
        image.onload = function () {
            this.loadingCount--;
        };
        
        try {
            if (IMAGES[id]) {
                // load from Data URI
                image.src = IMAGES[id];
            }
        } catch (e) {
            // load from file
            image.src = baseURL + this.id;
        }
        
        this.loadingCount++;
        
        return image;
    }

    getLoadingCount() {
        return this.loadingCount;
    }

    loadSprite(id, baseX, baseY)
    {
        return new Sprite(load(id), baseX, baseY);
    }

    loadSpriteSheet(id, w, h, number, baseX, baseY) {
        return new SpriteSheet(load(id), w, h, number, baseX, baseY);
    }
}
