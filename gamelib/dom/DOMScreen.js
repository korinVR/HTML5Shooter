
/**
 *	@constructor
 */
gamelib.dom.DOMScreen = function (id) {
    var element;
    
    element = document.getElementById(id);
    
    // for positioning DOM elements
    element.style.position = 'relative';
    
    this.addDOMSprite = function (domSprite) {
        element.appendChild(domSprite.getElement());
    }
    
    this.removeDOMSprite = function (domSprite) {
        element.removeChild(domSprite.getElement());
    }
};


