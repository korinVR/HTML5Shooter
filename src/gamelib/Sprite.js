export default class Sprite {
    constructor(image, baseX, baseY) {
        this.image = image;

        if (baseX == undefined) {
            baseX = 0;
            baseY = 0;
        }

        this.baseX = baseX;
        this.baseY = baseY;
    }
}
