
/**
 *	@constructor
 */
var createMyShip = function () {
    var obj = new gamelib.GameObject();
    
    var x = SCREEN_W / 2;
    var y = SCREEN_H / 2;
    var vx = 0;
    var vy = 0;
    
    var angle = 0;
    
    var shotTime = 0;
    
    var SPEED = 300;
    var TURN_SPEED = 750;
    
    var useMouse = false;
    var prevMousePosition = {};

    function getStick() {
        var vx = gamelib.input.Gamepad.getAxis(0, 0);
        var vy = gamelib.input.Gamepad.getAxis(0, 1);
        
        if (gamelib.input.Gamepad.getAxis(0, 5) != 0 ||
            gamelib.input.Gamepad.getAxis(0, 6) != 0) {
            // use Xbox360 digital stick
            vx = gamelib.input.Gamepad.getAxis(0, 5);
            vy = gamelib.input.Gamepad.getAxis(0, 6);
        }
        
        if (gamelib.input.Input.getStickX() != 0 ||
            gamelib.input.Input.getStickY() != 0) {
            // use keyboard input
            vx = gamelib.input.Input.getStickX();
            vy = gamelib.input.Input.getStickY();
        }
        
        var length = gamelib.vectorLength(vx, vy);
        if (length > 1) {
            vx /= length;
            vy /= length;
        }
        if (length < 0.4) {
            vx = 0;
            vy = 0;
        }
        return {x: vx, y: vy};
    }
    
    function switchInput() {
        // select the appropriate device
        if (useMouse) {
            var stick = getStick();
            if (stick.x != 0 || stick.y != 0) {
                useMouse =false;
            }
        } else {
            var newMousePosition = gamelib.input.Input.getMousePosition();
            if (newMousePosition) {
                if (newMousePosition.x != prevMousePosition.x ||
                    newMousePosition.y != prevMousePosition.y) {
                    useMouse = true;
                }
                prevMousePosition = newMousePosition;
            }
        }
    }
    
    function moveByKeyboardOrGamepad(deltaTime) {
        var stick = getStick();
        if (stick.x != 0 || stick.y != 0) {
            var t = Math.atan2(stick.y, stick.x);
            
            //x += Math.cos(t) * SPEED * deltaTime;
            //y += Math.sin(t) * SPEED * deltaTime;
            x += stick.x * SPEED * deltaTime;
            y += stick.y * SPEED * deltaTime;
            
            var deltaAngle = gamelib.wrapAngle(t - angle);
            var maxDeltaAngle = gamelib.radian(TURN_SPEED * gamelib.vectorLength(stick.x, stick.y)) * deltaTime;
            deltaAngle = gamelib.clamp(deltaAngle, -maxDeltaAngle, maxDeltaAngle);
            
            angle += deltaAngle;
        }
    }
    
    function moveByMouse(deltaTime) {
        var vx;
        var vy;
        
        if (isTouchScreen) {
            // virtual stick
            vx = stick.getPosition().x;
            vy = stick.getPosition().y;
            
            if (gamelib.vectorLength(vx, vy) < 0.1) {
                return;
            }
        } else {
            var mouse = gamelib.input.Input.getMousePosition();
            if (!mouse) {
                return;
            }
            
            var dest = gamelib.GameScreen.getAbstractPosition(mouse.x, mouse.y);
            vx = gamelib.map(dest.x, 0, SCREEN_W, FIELD_X0, FIELD_X1) - x;
            vy = gamelib.map(dest.y, 0, SCREEN_H, FIELD_Y0, FIELD_Y1) - y;
            
            if (gamelib.vectorLength(vx, vy) < 10) {
                return;
            }
        }
        
        var t = Math.atan2(vy, vx);
        
        x += Math.cos(t) * SPEED * deltaTime;
        y += Math.sin(t) * SPEED * deltaTime;
        
        var deltaAngle = gamelib.wrapAngle(t - angle);
        var maxDeltaAngle = gamelib.radian(TURN_SPEED) * deltaTime;
        deltaAngle = gamelib.clamp(deltaAngle, -maxDeltaAngle, maxDeltaAngle);
        
        angle += deltaAngle;
    }
    
    var tailX = 0;
    var tailY = 0;
    
    function moveByDrag(deltaTime) {
        var delta = dragStick.getDelta();

        // convert from physical delta to abstract delta
        var abstractScreen = gamelib.GameScreen.getAbstractScreen();
        var dx = delta.x * SCREEN_W / abstractScreen.w * 940 / 640;
        var dy = delta.y * SCREEN_H / abstractScreen.h * 940 / 640;

        var t = Math.atan2(dy, dx);
        
        var magnitude = gamelib.vectorLength(dx, dy);
        
        if (magnitude < 2) {
            return;
        }
        
        dx /= magnitude;
        dy /= magnitude;
        
        x += dx * SPEED * deltaTime;
        y += dy * SPEED * deltaTime;
        
        // a trailer object to determine the tank direction
        var ax = x - tailX;
        var ay = y - tailY;
        
        var al = gamelib.vectorLength(ax, ay);
        var ix = ax / al;
        var iy = ay / al;
        
        var length = 20;
        tailX = x - ix * length;
        tailY = y - iy * length;
        
//		renderer.setLayer(Layer.SHADOWS);
//		renderer.fillCircle(tailX, tailY, 100, "#fff");
        
        angle = Math.atan2(y - tailY, x - tailX);
    }
    
    obj.update = function (deltaTime) {
        function shot(x, y, angle) {
            myShots.attach(createMyShot(x, y, Math.cos(angle) * shotSpeed, Math.sin(angle) * shotSpeed, angle));
//			effects.attach(createMyShotHitEffect(x, y, vx, vy));
        }
        
        switchInput();
        
        if (isTouchScreen) {
            moveByDrag(deltaTime);
        } else {
            if (useMouse) {
                moveByMouse(deltaTime);
//				moveByDrag(deltaTime);
            } else {
                moveByKeyboardOrGamepad(deltaTime);
            }
        }
        
        x = gamelib.clamp(x, FIELD_X0, FIELD_X1);
        y = gamelib.clamp(y, FIELD_Y0, FIELD_Y1);
        
        shotTime += deltaTime;
        if (shotTime > 0.08) {
            shotTime -= 0.08;
            
            if ((isTouchScreen/* && fireButton.isDown()*/) ||
//			if ((isTouchScreen && fireButton.isDown()) ||
                (!isTouchScreen && (gamelib.input.Input.isButtonPressed() ||
                                    gamelib.input.Input.isMouseButtonDown() ||
                                    gamelib.input.Gamepad.getButton(0, 0) ||
                                    gamelib.input.Gamepad.getButton(0, 1) ||
                                    gamelib.input.Gamepad.getButton(0, 2) ||
                                    gamelib.input.Gamepad.getButton(0, 3)))) {
                var shotSpeed = 800;
                
                var point;
                
                point = gamelib.rotatePoint(18, -18, angle + gamelib.radian(90));
                shot(x + point.x, y + point.y, angle);
                point = gamelib.rotatePoint(-18, -18, angle + gamelib.radian(90));
                shot(x + point.x, y + point.y, angle);
                
                var reaction = 0;
                vx += -Math.cos(angle) * reaction;
                vy += -Math.sin(angle) * reaction;
                
                gamelib.Sound.playSE("shot", Math.cos(angle) / 2, -Math.sin(angle) / 2, 0.5);
            }
        }
        
        this.setAABB(x, y, 16);
        
        if (this.alive) {
            renderer.setLayer(Layer.SHADOWS);
            renderer.drawSprite(myShipShadowSprite, x + 4, y + 4, angle + gamelib.radian(90), 1.5, 0.5);
            
            renderer.setLayer(Layer.GROUND_OBJECTS);
            renderer.drawSprite(myShipSprite, x, y, angle + gamelib.radian(90), 1.5);
        }
    };
    
    obj.onCollide = function () {
        effects.attach(createExplosion(x, y));
        this.destroy();
        
        huds.attach(createGameOver());
    };
    
    obj.getPosition = function () {
        return { x : x, y : y };
    };
    
    return obj;
};


