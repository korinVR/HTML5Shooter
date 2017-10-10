
gamelib.Stopwatch = function () {
    var isRunning = {};
    var startTimes = {};
    var stopTimes = {};
    
    return {
        start : function (id) {
            startTimes[id] = new Date().getTime();
            isRunning[id] = true;
        },
        
        stop : function (id) {
            stopTimes[id] = new Date().getTime() - startTimes[id];
            isRunning[id] = false;
        },
        
        getTime : function (id) {
            if (isRunning[id]) {
                return new Date().getTime() - startTimes[id];
            }
            return stopTimes[id];
        }
    };
}();


