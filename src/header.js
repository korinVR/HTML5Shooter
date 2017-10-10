
var SCREEN_W = 640;
var SCREEN_H = 640;
var SCREEN_MARGIN = 150;

var FIELD_X0 = -SCREEN_MARGIN;
var FIELD_Y0 = -SCREEN_MARGIN;
var FIELD_X1 = SCREEN_W + SCREEN_MARGIN;
var FIELD_Y1 = SCREEN_H + SCREEN_MARGIN;

// rendering layers
var Layer = {
    GROUND : 0,
    SHADOWS : 1,
    EFFECTS : 2,
    GROUND_OBJECTS : 3,
    MYSHOTS : 4,
    SKY_OBJECTS : 5,
    ENEMY_SHOTS : 6
};

function outOfField(x, y, margin) {
    if (x < FIELD_X0 - margin ||
        y < FIELD_Y0 - margin ||
        x > FIELD_X1 + margin ||
        y > FIELD_Y1 + margin) {
        return true;
    }
    return false;
}

function nextXisOutOfField(x, vx, deltaTime, margin) {
    var nextX = x + vx * deltaTime;
    
    if (nextX < FIELD_X0 - margin ||
        nextX > FIELD_X1 + margin) {
        return true;
    }
    return false;
}

function nextYisOutOfField(y, vy, deltaTime, margin) {
    var nextY = y + vy * deltaTime;
    
    if (nextY < FIELD_Y0 - margin ||
        nextY > FIELD_Y1 + margin) {
        return true;
    }
    return false;
}


