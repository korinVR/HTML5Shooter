
/**
 *	wrapper class of HTML5 Canvas
 *	@constructor
 */
export default class FrameBuffer {

    constructor(width, height) {
        this.w = width;
        this.h = height;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.width = 640;
        this.canvas.height = 640;
    }

    destroy() {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    
    getCanvas() {
        return this.canvas;
    }
    
    getContext() {
        return this.context;
    }
    
    setSize(width, height) {
        this.w = width;
        this.h = height;
        
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    };
    
    getW() {
        return this.w;
    }
    
    getH() {
        return this.h;
    }
    
    clear(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, w, h);
    }
}

// nearest neighbour scaling function to render crisp pixel arts
// scaling from 24x8 to 960x320 costs about 0.5s on iPhone 4

// !!! Please define scaling algorithms to Canvas drawImage !!!
// !!! This is very important for games !!!
/*
gamelib.createZoomedImage = function (image, zoom) {
    var w = image.width;
    var h = image.height;
    
    // create source canvas
    var srcCanvas = document.createElement('canvas');
    srcCanvas.width = w;
    srcCanvas.height = h;
    
    var srcContext = srcCanvas.getContext('2d');
    
    srcContext.drawImage(image, 0, 0);
    
    var src = srcContext.getImageData(0, 0, w, h).data;
    
    var dstCanvas = document.createElement('canvas');
    dstCanvas.width = w * zoom;
    dstCanvas.height = h * zoom;
    
    var dstContext = dstCanvas.getContext('2d');
    
    var dstImageData = dstContext.createImageData(w * zoom, h * zoom);
    
    var dst = dstImageData.data;
    
    var p0 = 0;
    var p1 = 0;
    
    for (var iy = 0; iy < h; iy ++) {
        for (var zy = 0; zy < zoom; zy++) {
            for (var ix = 0; ix < w; ix++) {
                for (var zx = 0; zx < zoom; zx++) {
                    dst[p1    ] = src[p0    ];
                    dst[p1 + 1] = src[p0 + 1];
                    dst[p1 + 2] = src[p0 + 2];
                    dst[p1 + 3] = src[p0 + 3];
                    
                    p1 += 4;
                }
                p0 += 4;
            }
            p0 -= w * 4;
        }
        p0 += w * 4;
    }
    
    dstContext.putImageData(dstImageData, 0, 0);
    
    return dstCanvas;
};

gamelib.createFlashImage = function (image, color) {
    if (color === undefined) {
        color = '#fff';
    }
    
    var w = image.width;
    var h = image.height;
    
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext('2d');
    
    context.drawImage(image, 0, 0);
    
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = color;
    context.fillRect(0, 0, w, h);
    
    return canvas;
};
*/

