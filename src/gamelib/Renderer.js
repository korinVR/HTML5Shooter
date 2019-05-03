const Command = {
    DRAW_SPRITE : 1,
    DRAW_SHEET_SPRITE : 2,
    DRAW_SHEET_SPRITE_ADD : 3,
    FILL_CIRCLE : 4,
    FILL_RECT : 5,
    DRAW_TEXT : 6,
    DRAW_IMAGE : 7
};

export default class Renderer {
    constructor(numLayers) {
        if (numLayers === undefined) {
            numLayers = 16;
        }

        this.numLayers = numLayers;

        this.heads = new Array(numLayers);
        this.tails = new Array(numLayers);

        this.packets = [];

        for (let i = 0; i < this.numLayers; i++) {
            this.heads[i] = {};
        }

        this.clear();
    }
    
    _extend() {
        this.packets.push({
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
    
    _alloc() {
        if (this.index >= this.packets.length) {
            this._extend();
        }
        
        // allocate new packet
        const packet = this.packets[this.index++];
        packet.next = null;
        
        // link to the tail
        this.tails[this.layer].next = packet;
        this.tails[this.layer] = packet;
        
        return packet;
    }
    
    clear() {
        this.layer = 0;
        this.index = 0;
        
        for (let i = 0; i < this.numLayers; i++) {
            this.heads[i].next = null;
            this.tails[i] = this.heads[i];
        }
    }
    
    getSize() {
        return index;
    }
    
    render(frameBuffer) {
        if (frameBuffer === undefined) {
            throw 'Missing argument FrameBuffer';
        }
        
        const context = frameBuffer.getContext();
        
        for (let i = 0; i < this.numLayers; i++) {
            for (let p = this.heads[i].next; p; p = p.next) {
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
                    context.globalCompositeOperation = 'lighter';
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
                    context.textAlign = p.o6 ? p.o6 : 'left';
                    context.textBaseline = p.o7 ? p.o7 : 'bottom';
                    
                    context.fillStyle = p.o4 ? p.o4 : 'white';
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
    }
    
    setLayer(z) {
        this.layer = Math.floor(z);
    }
    
    drawSprite(sprite, x, y, angle, scale) {
        const p = this._alloc();
        p.command = Command.DRAW_SPRITE;
        p.image = sprite.image;
        p.o1 = x;
        p.o2 = y;
        p.o3 = angle;
        p.o4 = scale;
        p.o5 = sprite.baseX;
        p.o6 = sprite.baseY;
    }
    
    drawSheetSprite(spriteSheet, index, x, y, angle, scale) {
        const s = spriteSheet.sprites[Math.floor(index)];
        
        if (!s) {
            return;
        }
        
//		if (angle === undefined) {
//			angle = 0;
//		}
        
//		if (scale === undefined) {
//			scale = 1;
//		}
        
        const p = alloc();
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
    }
    
    drawSheetSpriteAdd(spriteSheet, index, x, y, angle, scale) {
        const s = spriteSheet.sprites[Math.floor(index)];
        
        if (!s) {
            return;
        }
        
//		if (angle === undefined) {
//			angle = 0;
//		}
        
//		if (scale === undefined) {
//			scale = 1;
//		}
        
        const p = alloc();
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
    }
    
    fillRect(x, y, w, h, color) {
        const p = alloc();
        p.command = Command.FILL_RECT;
        p.o1 = x;
        p.o2 = y;
        p.o3 = w;
        p.o4 = h;
        p.o5 = color;
    }
    
    fillCircle(x, y, radius, color) {
        const p = alloc();
        p.command = Command.FILL_CIRCLE;
        p.o1 = x;
        p.o2 = y;
        p.o3 = radius;
        p.o4 = color;
    }
    
    drawText(text, x, y, color, font, align, baseline) {
        const p = alloc();
        p.command = Command.DRAW_TEXT;
        p.o1 = text;
        p.o2 = x;
        p.o3 = y;
        p.o4 = color;
        p.o5 = font;
        p.o6 = align;
        p.o7 = baseline;
    }
    
    drawImage(image, x, y, w, h) {
        const p = alloc();
        p.command = Command.DRAW_IMAGE;
        p.o1 = image;
        p.o2 = x;
        p.o3 = y;
        p.o4 = w;
        p.o5 = h;
    }
}
