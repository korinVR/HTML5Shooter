
/**
 *	@constructor
 */
var createInstruction = function () {
    var obj = new gamelib.GameObject();
    
    var font = "12px sans-serif";
    
    obj.update = function (deltaTime) {
        hudRenderer.drawSprite(instructionSprite, 10, 40, 0, 0.5);
        
/*		hudRenderer.fillRect(10, 30, 400, 80, "rgba(0, 0, 0, 0.3)");
        
        hudRenderer.drawText("PC：マウスで移動、クリックでショット", 20, 50, "#fff", font);
        hudRenderer.drawText("iOS：バーチャルスティックで移動、タッチボタンでショット", 20, 65, "#fff", font);
        hudRenderer.drawText("Chromeでは about:flags でCanvasのGPU描画をオンにしてください。", 20, 80, "#fff", font);
        hudRenderer.drawText("iOS 4以下だと遅いです。", 20, 95, "#fff", font);*/
    };
    
    return obj;
};


