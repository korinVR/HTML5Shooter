/**
 *	矩形領域を保持するクラスを作成します。
 *	@constructor
 *	@class 矩形領域を保持するクラスです。
 *	@param x 始点のX座標
 *	@param y 始点のY座標
 *	@param w 幅
 *	@param h 高さ
 */
gamelib.Rect = function (/**Number*/ x, /**Number*/ y, /**Number*/ w, /**Number*/ h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    /**
     * 座標が矩形領域に含まれているか調べます。
     * @param x X座標
     * @param y Y座標
     * @return 含まれていればtrue、含まれていなければfalse
     */
    this.contains = function (/**Number*/ x, /**Number*/ y) /**Boolean*/ {
        if (x >= this.x && x < this.x + this.w &&
            y >= this.y && y < this.y + this.h) {
            return true;
        }
        return false;
    };
};


