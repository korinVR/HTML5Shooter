
gamelib.Sound = function () {
	/* import */ //var WebAudio = gamelib.audio.WebAudio;
	/* import */ //var HTML5Audio = gamelib.audio.HTML5Audio;
	
	var useWebAudio = false;
	var useHTML5Audio = false;
	var bgm;
	
	var baseURL;
	
	return {
		init : function (baseURL_) {
			baseURL = baseURL_;
			
			if (isiOS) {
				console.log("Sound : no available");
				return;
			}
			
			if (gamelib.audio.WebAudio.init()) {
				useWebAudio = true;
				console.log("Sound : use Web Audio API");
				return;
			}
			if (gamelib.audio.HTML5Audio.init()) {
				useHTML5Audio = true;
				console.log("Sound : use HTML5 Audio");
				return;
			}
			console.log("Sound : not supported");
		},
		
		load : function (id) {
			console.log("Sound : loading " + id);
			
			if (useWebAudio) {
				gamelib.audio.WebAudio.load(baseURL, id);
				return;
			}
			if (useHTML5Audio) {
				gamelib.audio.HTML5Audio.load(baseURL, id);
				return;
			}
		},
		
		getLoadingCount : function () {
			if (useWebAudio) {
				return gamelib.audio.WebAudio.getLoadingCount();
			}
			if (useHTML5Audio) {
				return gamelib.audio.HTML5Audio.getLoadingCount();
			}
			return 0;
		},
		
		playBGM : function (id) {
			if (useWebAudio) {
				if (bgm) {
					gamelib.audio.WebAudio.stop(bgm);
				}
				bgm = gamelib.audio.WebAudio.play2D(id, true);
				return;
			}
			if (useHTML5Audio) {
				bgm = id;
				gamelib.audio.HTML5Audio.loop(id);
			}
		},
		
		stopBGM : function () {
			if (useWebAudio) {
				gamelib.audio.WebAudio.stop(bgm);
			}
			if (useHTML5Audio) {
				gamelib.audio.HTML5Audio.stop(bgm);
			}
		},
		
		playSE : function (id, x, y, z) {
			if (useWebAudio) {
				gamelib.audio.WebAudio.play3D(id, false, x, y, z);
				return;
			}
			if (useHTML5Audio) {
				gamelib.audio.HTML5Audio.play(id);
			}
		}
	};
}();


