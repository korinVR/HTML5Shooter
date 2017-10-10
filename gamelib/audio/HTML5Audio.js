
/**
 *	@class
 *	@constructor
 */
gamelib.audio.HTML5Audio = function () {
    var format;
    
    var audios = {};
    
    return {
        init : function () {
            try {
                // check if HTML5 Audio is supported
                var audio = new Audio("");
                
                // detect supported format
                if (audio.canPlayType("audio/mp3")) {
                    format = "mp3";
                } else if (audio.canPlayType("audio/ogg")) {
                    format = "ogg";
                }
            } catch(e) {
                return false;
            }
            return true;
        },
        
        load : function (baseDir, id) {
            if (format) {
                var audio = new Audio(baseDir + "/" + id + "." + format);
                audios[id] = audio;
            }
        },
        
        getLoadingCount : function () {
            var loadingCount = 0;
            
            for (var key in audios) {
//				console.log(key + " : " + audios[key].readyState);
                
                var LOADED = 4; // HAVE_ENOUGH_DATA
                if (isFirefox) {
                    // somehow ready states on Firefox 8 change from 4 to 2
                    
                    LOADED = 2; // HAVE_CURRENT_DATA
                }
                
                if (audios[key].readyState < LOADED) {
                    loadingCount++;
                }
            }
            return loadingCount;
        },
        
        play : function (id) {
            if (audios[id]) {
                if (!isiOS) {
                    audios[id].currentTime = 0;
                }
                audios[id].play();
            }
        },
        
        loop : function (id) {
            if (audios[id]) {
                audios[id].loop = true;
                audios[id].play();
            }
        },
        
        stop : function (id) {
            if (audios[id]) {
                audios[id].pause();
            }
        }
    };
}();


