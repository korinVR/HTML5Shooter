
// dummy console.log for IE
if (!window.console) {
	console = { log: function () {} };
}

// detect platform
var isiOS = false;
var isMobile = false;
var isTouchScreen = false;

var isWebKit = false;
var isFirefox = false;
var isOpera = false;

console.log("navigator.platform = " + navigator.platform);
console.log("navigator.userAgent = " + navigator.userAgent);

if (navigator.userAgent.indexOf('iPhone') >= 0 ||
	navigator.userAgent.indexOf('iPad') >= 0) {
	isiOS = true;
	isMobile = true;
	isTouchScreen = true;
}

if (navigator.userAgent.indexOf('Android') >= 0) {
	isMobile = true;
	isTouchScreen = true;
}

if (navigator.userAgent.indexOf('WebKit') >= 0) {
	isWebKit = true;
}

if (navigator.userAgent.indexOf('Firefox') >= 0) {
	isFirefox = true;
}

if (navigator.userAgent.indexOf('Opera') >= 0) {
	isOpera = true;
}

