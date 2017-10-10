
/**
 *	@constructor
 */
gamelib.dom.DOMButton = function (imageURL) {
    var element;
    
    element = document.createElement('a');
    
    var css = '';
    css += 'position: absolute; ';
    css += 'background-image: url(' + imageURL + '); ';
    
    // resize background image
    css += 'background-size: contain; ';
    
    element.style.cssText = css;
    
    this.setPosition = function (rect) {
        x = rect.x;
        y = rect.y;
        w = rect.w;
        h = rect.h;
        
        var css = '';
        css += 'left: ' + x + 'px; ';
        css += 'top: ' + y + 'px; ';
        css += 'width: ' + w + 'px; ';
        css += 'height: ' + h + 'px; ';
        
        // remove link outline (this must be here)
        css += 'outline: none; ';
        
        element.style.cssText += css;
    };
    
    this.setURL = function (url, target) {
        element.setAttribute('href', url);
        
        if (target) {
            element.setAttribute('target', target);
        }
    }
    
    this.getElement = function () {
        return element;
    }
};


