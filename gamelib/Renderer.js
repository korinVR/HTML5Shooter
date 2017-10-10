
/**
 *	draw z-sorted (or layered) sprites using bucket sort
 *	@constructor
 */
gamelib.Renderer = function (numLayers) {
    
    var Command = {
        DRAW_SPRITE : 1,
        DRAW_SHEET_SPRITE : 2,
        DRAW_SHEET_SPRITE_ADD : 3,
        FILL_CIRCLE : 4,
        FILL_RECT : 5,
        DRAW_TEXT : 6,
        DRAW_IMAGE : 7
    };
    
    if (numLayers === undefined) {
        numLayers = 16;
    }
    
    var heads = new Array(numLayers);
    var tails = new Array(numLayers);
    
    var packets = [];
    
    for (var i = 0; i < numLayers; i++) {
        heads[i] = {};
    }
    
    var layer;
    var index;
    
    function extend() {
        packets.push({
            next : null,
            command : null,
            image : null,
            o1 : 0,
            o2 : 0,
            o3 : 0,
            o4 : 0,
            o5 : 0,
            o6 : 0,
            o7 : 0,
            o8 : 0
        });
    }
    
    function alloc() {
        if (index >= packets.length) {
            extend();
        }
        
        // allocate new packet
        var packet = packets[index++];
        packet.next = null;
        
        // link to the tail
        tails[layer].next = packet;
        tails[layer] = packet;
        
        return packet;
    }
    
    this.clear = function () {
        layer = 0;
        index = 0;
        
        for (var i = 0; i < numLayers; i++) {
            heads[i].next = null;
            tails[i] = heads[i];
        }
    };
    
    this.getSize = function () {
        return index;
    };
    
    this.render = function (frameBuffer) {
        if (frameBuffer === undefined) {
            throw 'error: Missing argument FrameBuffer';
        }
        
        var context = frameBuffer.getContext();
        
        for (var i = 0; i < numLayers; i++) {
            for (var p = heads[i].next; p; p = p.next) {
                switch (p.command) {
                case Command.DRAW_SPRITE:
                    context.save();
                    context.translate(p.o1, p.o2);
                    context.rotate(p.o3);
                    context.scale(p.o4, p.o4);
                    context.drawImage(p.image, -p.o5, -p.o6);
                    context.restore();
                    break;
                
                case Command.DRAW_SHEET_SPRITE:
                    context.save();
                    context.translate(p.o1, p.o2);
                    context.rotate(p.o7);
                    context.scale(p.o8, p.o8);
                    context.drawImage(p.image, p.o3, p.o4, p.o5, p.o6, -p.o9, -p.o10, p.o5, p.o6);
                    context.restore();
                    break;
                
                case Command.DRAW_SHEET_SPRITE_ADD:
                    context.save();
                    context.translate(p.o1, p.o2);
                    context.rotate(p.o7);
                    context.scale(p.o8, p.o8);
                    context.globalCompositeOperation = "lighter";
                    context.drawImage(p.image, p.o3, p.o4, p.o5, p.o6, -p.o9, -p.o10, p.o5, p.o6);
                    context.restore();
                    break;
                    
                case Command.FILL_RECT:
                    context.fillStyle = p.o5;
                    context.fillRect(p.o1, p.o2, p.o3, p.o4);
                    break;
                    
                case Command.FILL_CIRCLE:
                    context.fillStyle = p.o4;
                    context.beginPath();
                    context.arc(p.o1, p.o2, p.o3, 0, Math.PI * 2, true);
                    context.fill();
                    break;
                    
                case Command.DRAW_TEXT:
                    context.font = p.o5;
                    context.textAlign = p.o6 ? p.o6 : "left";
                    context.textBaseline = p.o7 ? p.o7 : "bottom";
                    
                    context.fillStyle = p.o4 ? p.o4 : "white";
                    context.fillText(p.o1, p.o2, p.o3);
                    break;
                    
                case Command.DRAW_IMAGE:
                    if (p.o4 === undefined) {
                        context.drawImage(p.o1, Math.floor(p.o2), Math.floor(p.o3));
                    } else {
                        context.drawImage(p.o1, p.o2, p.o3, p.o4, p.o5);
                    }
                    break;
                }
            }
        }
    };
    
    this.setLayer = function (z) {
        layer = Math.floor(z);
    }
    
    this.drawSprite = function (sprite, x, y, angle, scale) {
        var p = alloc();
        p.command = Command.DRAW_SPRITE;
        p.image = sprite.image;
        p.o1 = x;
        p.o2 = y;
        p.o3 = angle;
        p.o4 = scale;
        p.o5 = sprite.baseX;
        p.o6 = sprite.baseY;
    };
    
    this.drawSheetSprite = function (spriteSheet, index, x, y, angle, scale) {
        var s = spriteSheet.sprites[Math.floor(index)];
        
        if (!s) {
            return;
        }
        
//		if (angle === undefined) {
//			angle = 0;
//		}
        
//		if (scale === undefined) {
//			scale = 1;
//		}
        
        var p = alloc();
        p.command = Command.DRAW_SHEET_SPRITE;
        p.image = spriteSheet.image;
        p.o1 = x;
        p.o2 = y;
        p.o3 = s.x;
        p.o4 = s.y;
        p.o5 = s.w;
        p.o6 = s.h;
        p.o7 = angle;
        p.o8 = scale;
        p.o9 = spriteSheet.baseX;
        p.o10 = spriteSheet.baseY;
    };
    
    this.drawSheetSpriteAdd = function (spriteSheet, index, x, y, angle, scale) {
        var s = spriteSheet.sprites[Math.floor(index)];
        
        if (!s) {
            return;
        }
        
//		if (angle === undefined) {
//			angle = 0;
//		}
        
//		if (scale === undefined) {
//			scale = 1;
//		}
        
        var p = alloc();
        p.command = Command.DRAW_SHEET_SPRITE_ADD;
        p.image = spriteSheet.image;
        p.o1 = x;
        p.o2 = y;
        p.o3 = s.x;
        p.o4 = s.y;
        p.o5 = s.w;
        p.o6 = s.h;
        p.o7 = angle;
        p.o8 = scale;
        p.o9 = spriteSheet.baseX;
        p.o10 = spriteSheet.baseY;
    };
    
    this.fillRect = function (x, y, w, h, color) {
        var p = alloc();
        p.command = Command.FILL_RECT;
        p.o1 = x;
        p.o2 = y;
        p.o3 = w;
        p.o4 = h;
        p.o5 = color;
    };
    
    this.fillCircle = function (x, y, radius, color) {
        var p = alloc();
        p.command = Command.FILL_CIRCLE;
        p.o1 = x;
        p.o2 = y;
        p.o3 = radius;
        p.o4 = color;
    };
    
    this.drawText = function (text, x, y, color, font, align, baseline) {
        var p = alloc();
        p.command = Command.DRAW_TEXT;
        p.o1 = text;
        p.o2 = x;
        p.o3 = y;
        p.o4 = color;
        p.o5 = font;
        p.o6 = align;
        p.o7 = baseline;
    };
    
    this.drawImage = function (image, x, y, w, h) {
        var p = alloc();
        p.command = Command.DRAW_IMAGE;
        p.o1 = image;
        p.o2 = x;
        p.o3 = y;
        p.o4 = w;
        p.o5 = h;
    };
    
    this.clear();
};


