
/**
 *	@constructor
 */
gamelib.tween.Sequence = function () {
    this.tasks = [];
    var taskPosition;
    
    // location time to add new task
    var location = 0;
    
    this.stopOnComplete = true;
    
    this.addTask = function (task) {
        task.time = location + task.delayTime;
        this.tasks.push(task);
        
        location = task.time + task.duration;
    };
    
    this.addSequence = function (sequence) {
        for (var i = 0; i < sequence.tasks.length; i++) {
            this.addTask(sequence.tasks[i].clone());
        }
    };
    
    this.mergeSequence = function (sequence) {
        for (var i = 0; i < sequence.tasks.length; i++) {
            var task = sequence.tasks[i];
            
            for (var j = 0; j < this.tasks.length; j++) {
                if (this.tasks[j].time > task.time) {
                    // insert task
                    this.tasks.splice(j, 0, task);
                    break;
                }
            }
            if (j == this.tasks.length) {
                this.tasks.push(task);
            }
        }
        
        // calculate end time
        for (var i = 0; i < this.tasks.length; i++) {
            if (location < this.tasks[i].getEndTime()) {
                location = this.tasks[i].getEndTime();
            };
        }
    };
    
    this.play = function () {
        this.reset();
        
        Tween.startSequence(this);
    };
    
    this.reset = function () {
        this.startTime = Tween.getTime();
        
        // set start time of each tasks
        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            
            task.startTime = this.startTime + task.time;
        }
        
        taskPosition = 0;
    };
    
    this.update = function (currentTime) {
        if (currentTime > this.startTime + location) {
            if (this.stopOnComplete) {
                return false;
            }
            this.reset();
        }
        
        while (taskPosition < this.tasks.length) {
            var task = this.tasks[taskPosition];
            
            if (currentTime < task.startTime) {
                break;
            }
            
            task.start();
            Tween.startTask(task);
            
            taskPosition++;
        }
        return true;
    };
};


