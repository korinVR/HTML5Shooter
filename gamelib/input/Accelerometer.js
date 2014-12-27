
(function () {

var accelerometer = {
	x : 0, 
	y : 0,
	z : 0
};

var gyroscope = {
	x : 0, 
	y : 0,
	z : 0
};

function onDeviceMotion(event) {
	var a = event.accelerationIncludingGravity;
	if (a) {
		accelerometer.x = a.x;
		accelerometer.y = a.y;
		accelerometer.z = a.z;
	}
	var g = event.acceleration;
	if (g) {
		gyroscope.x = g.x;
		gyroscope.y = g.y;
		gyroscope.z = g.z;
	}
}

/**
 *	加速度センサーのモジュールです。
 *	@class
 */
gamelib.input.Accelerometer = {};

/**
 *	モジュールを初期化します。
 */
gamelib.input.Accelerometer.init = function () {
	window.addEventListener('ondevicemotion', onDeviceMotion, false);
};
		
/**
 *	加速度センサーの状態を取得します。
 *	@return 加速度センサーの状態
 */
gamelib.input.Accelerometer.getAccelerometer = function () {
	return accelerometer;
};

/**
 *	ジャイロスコープの状態を取得します。
 *	@return ジャイロスコープの状態
 */
gamelib.input.Accelerometer.getGyroscope = function () {
	return gyroscope;
};

})();


