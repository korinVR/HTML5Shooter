
// gamelib.mathあたりに移動する？

gamelib.radian = function (degree) {
	return degree * Math.PI * 2 / 360;
}

gamelib.clamp = function (value, min, max) {
	if (value < min) {
		return min;
	}
	if (value > max) {
		return max;
	}
	return value;
}

gamelib.inRange = function (value, min, max) {
	return (value >= min && value <= max);
}

gamelib.random = function (min, max) {
	return min + Math.random() * (max - min);
}

gamelib.randomInt = function (min, max) {
	return Math.floor(gamelib.random(min, max + 1));
}

gamelib.map = function (value, s0, s1, d0, d1) {
	return d0 + (value - s0) * (d1 - d0) / (s1 - s0);
}

gamelib.vectorLength = function (x, y) {
	return Math.sqrt(x * x + y * y);
}

// normalize angle to [-PI, PI]
gamelib.wrapAngle = function (angle) {
	var t = angle - Math.floor((angle + Math.PI) / (Math.PI * 2)) * Math.PI * 2;
	return t;
}

gamelib.rotatePoint = function (px, py, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	
	var qx = px * c + py * -s;
	var qy = px * s + py * c;
	
	return {
		x : qx,
		y : qy
	};
}

gamelib.debug = function (message) {
	document.getElementById("debug").innerHTML += message + "<br>";
}

