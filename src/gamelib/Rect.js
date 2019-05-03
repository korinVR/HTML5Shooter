export default class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(x, y) {
        if (x >= this.x && x < this.x + this.w &&
            y >= this.y && y < this.y + this.h) {
            return true;
        }
        return false;
    }
}
