
/**
 *	@constructor
 */
gamelib.dom.DOMSprite = function (x, y, w, h, imageURL) {
    var element;
    
    element = document.createElement('div');
    
    var css = '';
    css += 'position: absolute; ';
    css += 'left: ' + x + 'px; ';
    css += 'top: ' + y + 'px; ';
    css += 'width: ' + w + 'px; ';
    css += 'height: ' + h + 'px; ';
    css += 'background-image: url(' + imageURL + ')';
    
    element.style.cssText = css;
    
    this.setPosition = function (x_, y_) {
        x = x_;
        y = y_;
        
        var css = '';
        css += 'left: ' + x + 'px';
        css += 'top: ' + y + 'px';
        
        element.style.cssText += css;
    };
    
    this.getElement = function () {
        return element;
    }
};


