export default class Global {
    static get SCREEN_W() {
        return 640;
    }

    static get SCREEN_H() {
        return 640;
    }

    static get SCREEN_MARGIN() {
        return 150;
    }
    
    static get FIELD_X0() {
        return -SCREEN_MARGIN;
    }

    static get FIELD_Y0() {
        return -SCREEN_MARGIN;
    }

    static get FIELD_X1() {
        return SCREEN_W + SCREEN_MARGIN;
    }

    static get FIELD_Y1() {
        return SCREEN_H + SCREEN_MARGIN;
    }
    
    static outOfField(x, y, margin) {
        if (x < FIELD_X0 - margin ||
            y < FIELD_Y0 - margin ||
            x > FIELD_X1 + margin ||
            y > FIELD_Y1 + margin) {
            return true;
        }
        return false;
    }
    
    static nextXisOutOfField(x, vx, deltaTime, margin) {
        var nextX = x + vx * deltaTime;
        
        if (nextX < FIELD_X0 - margin ||
            nextX > FIELD_X1 + margin) {
            return true;
        }
        return false;
    }
    
    static nextYisOutOfField(y, vy, deltaTime, margin) {
        var nextY = y + vy * deltaTime;
        
        if (nextY < FIELD_Y0 - margin ||
            nextY > FIELD_Y1 + margin) {
            return true;
        }
        return false;
    }
}
