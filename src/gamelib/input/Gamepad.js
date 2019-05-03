
(function () {
    var gamepads = [];
    var gamepadIndex = 0;	
    
    function connectHandler(event) {
        gamepads[gamepadIndex] = event['gamepad'];
        
        console.log("Gamepad connected [" + gamepadIndex + "] : " + event['gamepad']['id']);
        
        gamepadIndex++;
    }
    
    function disconnectHandler(event) {
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i].id === event['gamepad']['id']) {
                // you can never access to the disconnected gamepad.
                delete gamepads[i];
                break;
            }
        }
    }
    
    /**
     *	@class ゲームパッドを扱うモジュールです。
     */
    gamelib.input.Gamepad = {
    };
    
    /**
     *	モジュールを初期化します。
     **/
    gamelib.input.Gamepad.init = function () {
        if (isFirefox) {
            window.addEventListener('MozGamepadConnected', connectHandler, false);
            window.addEventListener('MozGamepadDisconnected', disconnectHandler, false);
        }
    };
    
    /**
     *	レバーの状態を取得します。
     *	@param gamepadIndex ゲームパッドの番号（初期化されて最初に入力のあったゲームパッドから0, 1, 2...と割り当てられます）
     *	@param axisIndex レバーの番号
     *	@return レバーの状態
     **/
    gamelib.input.Gamepad.getAxis = function (/**Number*/ gamepadIndex,
                                              /**Number*/ axisIndex) /**Number*/ {
        if (isWebKit) {
            gamepads = navigator.webkitGamepads;
            if (!gamepads) {
                return 0;
            }
        }
        if (gamepads[gamepadIndex]) {
            if (gamepads[gamepadIndex]['axes'][axisIndex]) {
                return gamepads[gamepadIndex]['axes'][axisIndex];
            }
        }
        return 0;
    };
    
    /**
     *	ボタンの状態を取得します。
     *	@param gamepadIndex ゲームパッドの番号（初期化されて最初に入力のあったゲームパッドから0, 1, 2...と割り当てられます）
     *	@param buttonIndex ボタンの番号
     *	@return ボタンの状態
     **/
    gamelib.input.Gamepad.getButton = function (/**Number*/ gamepadIndex,
                                                /**Number*/ buttonIndex) /**Boolean*/ {
        if (isWebKit) {
            gamepads = navigator.webkitGamepads;
            if (!gamepads) {
                return false;
            }
        }
        if (gamepads[gamepadIndex]) {
            return gamepads[gamepadIndex]['buttons'][buttonIndex];
        }
        return false;
    };

})();


