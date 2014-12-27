
gamelib.tween.Tween = function () {
	
	// TODO: change to linked list
	var sequenceList = [];
	var taskList = [];
	
	/**
	 *	@constructor
	 */
	var Task = function (duration, delayTime) {
		// keep delay time for Tween.serial
		this.delayTime = delayTime;
		
		// offset time from sequence start
		this.time = 0;
		
		this.duration = duration;
		
		this.getEndTime = function () {
			return this.time + this.duration;
		};
		
		this.start = function () {};
		this.update = function (currentTime) {};
		
		this.clone = function () {
			// TODO: need to deep clone?
			var o = {};
			
			for (key in this) {
				o[key] = this[key];
			}
			
			return o;
		};
	};
	
	/**
	 *	@constructor
	 */
	var tweenTask = function (target, to, from, duration, equation, delayTime) {
		var obj = new Task(duration, delayTime);
		
		obj.start = function () {
			if (from == null) {
				from = {};
				
				// retrieve start properties
				for (key in to) {
					from[key] = target[key];
				}
			}
		};
		
		obj.update = function (currentTime) {
			var t = (currentTime - this.startTime) / duration;
			
			if (t > 1) {
				t = 1;
			}
			
			for (key in to) {
				target[key] = equation(t, from[key], to[key] - from[key]);
			}
			
			if (t == 1) {
				return false;
			}
			
			return true;
		};
		
		return obj;
	};
	
	/**
	 *	@constructor
	 */
	var funcTask = function (callback, delayTime) {
		var obj = new Task(0, delayTime);
		
		obj.start = function () {
			callback();
		};
		
		obj.update = function (currentTime) {
			return false;
		};
		
		return obj;
	};

	return {
		// create a sequence contains one task
		tween : function (target, to, from, duration, equation, delayTime) {
			if (equation === undefined) {
				equation = this.linear;
			}
			if (delayTime === undefined) {
				delayTime = 0;
			}
			
			var sequence = new Sequence();
			sequence.addTask(tweenTask(target, to, from, duration, equation, delayTime));
			
			return sequence;
		},
		
		to : function (target, to, duration, equation, delayTime) {
			return this.tween(target, to, null, duration, equation, delayTime);
		},
		
		func : function (callback, delayTime) {
			if (delayTime === undefined) {
				delayTime = 0;
			}
			
			var sequence = new Sequence();
			sequence.addTask(funcTask(callback, delayTime));
			
			return sequence;
		},
		
		// concat sequences
		serial : function (/* sequences */) {
			var sequence = new Sequence();
			
			for (var i = 0; i < arguments.length; i++) {
				sequence.addSequence(arguments[i]);
			}
			return sequence;
		},
		
		// merge sequences
		parallel : function (/* sequences */) {
			var sequence = new Sequence();
			
			for (var i = 0; i < arguments.length; i++) {
				sequence.mergeSequence(arguments[i]);
			}
			return sequence;
		},
		
		repeat : function (sequence, count) {
			var s = new Sequence();
			
			for (var i = 0; i < count; i++) {
				s.addSequence(sequence);
			}
			return s;
		},
		
		update : function () {
			var currentTime = this.getTime();
			
			var i;
			
			for (i = 0; i < sequenceList.length; i++) {
				var sequence = sequenceList[i];
				
				if (!sequence.update(currentTime)) {
					sequenceList.splice(i, 1);
					i--;
				}
			}
			
			for (i = 0; i < taskList.length; i++) {
				var task = taskList[i];
				
				if (!task.update(currentTime)) {
					taskList.splice(i, 1);
					i--;
				}
			}
		},
		
		stopAll : function () {
			sequenceList = [];
			taskList = [];
		},
		
		// internal
		startSequence : function (sequence) {
			sequenceList.push(sequence);
		},
		
		// internal
		startTask : function (task) {
			taskList.push(task);
		},
		
		// internal
		getTime : function () {
			// using GameLoop time. replace to system time if needed
			return gamelib.GameLoop.getTime();
		},
		
		// TODO: more equations
		
		linear : function (t, b, c) {
			return c * t + b;
		},
		
		easeInQuad : function (t, b, c) {
			return c * t * t + b;
		},
		
		easeOutQuad : function (t, b, c) {
			return -c * t * (t - 2) + b;
		},
		
		easeInOutQuad : function (t, b, c) {
			t /= 0.5;
			if (t < 1) {
				return c / 2 * t * t + b;
			}
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		},
		
		easeInCubic : function (t, b, c) {
			return c * t * t * t + b;
		},
		
		easeOutCubic : function (t, b, c) {
			t--;
			return c * (t * t * t + 1) + b;
		},
		
		easeInOutCubic : function (t, b, c) {
			t /= 0.5;
			if (t < 1) {
				return c / 2 * t * t * t + b;
			}
			t -= 2;
			return c / 2 * (t * t * t + 2) + b;
		}
	};
}();


