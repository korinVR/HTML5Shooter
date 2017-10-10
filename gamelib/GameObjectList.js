/**
 *	ゲームオブジェクトのコンテナを作成します。
 *	@class ゲームオブジェクトのコンテナです。
 *	@constructor
 */
gamelib.GameObjectList = function () {
    
    var size = 0;
    
    this.head = {};
    
    this.head.next = this.head;
    this.head.prev = this.head;
    
    /**
     *	ゲームオブジェクト群を１フレーム更新します。
     *	@param deltaTime デルタタイム
     */
    this.update = function (/**Number*/ deltaTime) {
        var o;
        
        for (o = this.head.next; o != this.head; o = o.next) {
            o.update(deltaTime);
        }
        
        for (o = this.head.next; o != this.head; o = o.next) {
            if (!o.alive) {
                o.prev.next = o.next;
                o.next.prev = o.prev;
                size--;
            }
        }
    };
    
    /**
     *	コンテナにゲームオブジェクトを追加します。
     *	@param gameObject 追加するゲームオブジェクト
     */
    this.attach = function (/**GameObject*/ gameObject) {
        gameObject.prev = this.head.prev;
        gameObject.next = this.head;
        
        gameObject.prev.next = gameObject;
        gameObject.next.prev = gameObject;
        
        size++;
    };
    
    /**
     *	ゲームオブジェクトの数を取得します。
     *	@return ゲームオブジェクトの数
     */
    this.getSize = function () /**Number*/ {
        return size;
    };

};


