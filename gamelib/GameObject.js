
/**
 *	@constructor
 */
gamelib.GameObject = function () {
    this.alive = true;
    this.aabb = {};
    
    this.startTime = gamelib.GameLoop.getTime();
};

/**
 *	ゲームオブジェクトを１フレーム更新します。
 *	@param deltaTime デルタタイム
 */
gamelib.GameObject.prototype.update = function (deltaTime) {};

/**
 *	ゲームオグジェクトを破棄します。
 */
gamelib.GameObject.prototype.destroy = function () {
    this.alive = false;
};

/**
 *	他のゲームオブジェクトに衝突したときに呼び出されるコールバックメソッドです。
 *	@param another 衝突したゲームオブジェクト
 */
gamelib.GameObject.prototype.onCollide = function (/**GameObject*/ another) {};

/**
 *	衝突判定のための矩形領域を設定します。
 *	@param x 基準X座標
 *	@param y 基準Y座標
 *	@param r 矩形の幅・高さの半分の長さ
 */
gamelib.GameObject.prototype.setAABB = function (/**Number*/ x,
                                                 /**Number*/ y,
                                                 /**Number*/ r) {
    this.aabb.x0 = x - r;
    this.aabb.y0 = y - r;
    this.aabb.x1 = x + r;
    this.aabb.y1 = y + r;
};

/**
 *	ゲームオブジェクトが生成されてからの時刻を取得します。
 *	@return 時間（秒）
 */
gamelib.GameObject.prototype.getTime = function () /**Number*/ {
    return gamelib.GameLoop.getTime() - this.startTime;
};

/**
 *	ゲームオブジェクトが生成されてからのフレーム数を計算します。
 *	getTime()のヘルパ関数です。
 *	@param interval フレームあたりの時間（秒）
 *	@return フレーム
 */
gamelib.GameObject.prototype.getFrame = function (/**Number*/ interval) /**Number*/ {
    return this.getTime() / interval;
};


