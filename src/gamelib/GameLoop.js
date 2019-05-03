import Utils from './utils'

const MAX_FRAME_TIME = 0.05;

export default class GameLoop {
    constructor() {
        this.gameTime = 0;
    }
    
    run(updateCallback) {
        this.update = updateCallback;
        
        if (!this.running) {
            this.running = true;
            this.callback();
        }
    }

    stop() {
        this.running = false;
    }

    getTime() {
        return this.gameTime;
    }

    callback() {
        // console.log(this);
        if (!this.running) return;
        
        this.currentTime = new Date().getTime() / 1000;
        if (!this.lastTime) {
            this.lastTime = this.currentTime - 0.0166;
        }
        
        const deltaTime = Utils.clamp(this.currentTime - this.lastTime, 0, MAX_FRAME_TIME);
        this.lastTime = this.currentTime;
        
        this.gameTime += deltaTime;
        
        // update tween
        // gamelib.tween.Tween.update();
        
        if (this.update) {
            this.update(deltaTime);
        }
        
        const frameTime = (new Date().getTime() / 1000) - this.currentTime;
        
        if (window.requestAnimationFrame) {
            requestAnimationFrame(this.callback.bind(this), document.body);
        } else {
            const sleepTime = Utils.clamp(0.0166 - frameTime, 0, MAX_FRAME_TIME);

            setTimeout(this.callback.bind(this), sleepTime * 1000);
        }
    }
}
