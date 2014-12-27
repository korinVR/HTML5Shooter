
/**
 *	@class
 *	@constructor
 */
gamelib.audio.WebAudio = function () {
	var audios = {};
	
	var context;
	
	var loadingCount = 0;
	
	return {
		init : function () {
			// get context and check if Web Audio API is supported
			try {
				context = new webkitAudioContext();
			} catch(e) {
				return false;
			}
			return true;
		},
		
		load : function (baseDir, id) {
			var url = baseDir + "/" + id + ".ogg";
			
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";
			
			request.onload = onLoad;
			request.onerror = onerror;
			
			request.send();
			loadingCount++;
			
			function onLoad() {
				context["decodeAudioData"](
					request.response, 
					function (buffer) {
						audios[id] = buffer;
						loadingCount--;
					});
			}
			
			function onError() {
				alert("Error: loading audio failed");
			}
		},
		
		getLoadingCount : function () {
			return loadingCount;
		},
		
		play3D : function (id, loop, x, y, z) {
			var source = context["createBufferSource"]();
			source["buffer"] = audios[id];
			source["loop"] = loop;
			
			var panner = context["createPanner"]();
			panner["setPosition"](x, y, z);
			
			source["connect"](panner);
			panner["connect"](context["destination"]);
			source["start"](context["currentTime"]);
			
			return source;
		},
		
		play2D : function (id, loop) {
			var source = context["createBufferSource"]();
			source["buffer"] = audios[id];
			source["loop"] = loop;
			
			source["connect"](context["destination"]);
			source["start"](context["currentTime"]);
			
			return source;
		},
		
		stop : function (source) {
			source["stop"](context["currentTime"]);
		}
	};
}();


