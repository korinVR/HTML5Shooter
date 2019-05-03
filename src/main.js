import GameScreen from "./gamelib/GameScreen";
import Loader from "./gamelib/Loader";
import GameLoop from "./gamelib/GameLoop";
import Renderer from "./gamelib/Renderer";
import Sprite from "./gamelib/Sprite";

import Global from "./Global";
import Layer from "./Layer";

import backgroundImageURL from '/assets/images/background.jpg';

const image = new Image();
image.src = backgroundImageURL;

// /* import */ var Sprite = gamelib.Sprite;

const gameScreen = new GameScreen();
gameScreen.init("gamescreen");

const loader = new Loader("resources/images/");

const gameLoop = new GameLoop();

const backgroundSprite = new Sprite(image, 320, 320);

const update = () => {
    gameScreen.clear();
    gameScreen.setAbstractScreen(Global.SCREEN_W, Global.SCREEN_H);
    const frameBuffer = gameScreen.getFrameBuffer();

    const renderer = new Renderer();
    renderer.setLayer(Layer.GROUND);
    renderer.drawSprite(backgroundSprite, Global.SCREEN_W / 2, Global.SCREEN_H / 2, 0, 1.5);
    renderer.render(frameBuffer);
}

gameLoop.run(update);


return;

gamelib.input.Input.init("gamescreen");
gamelib.input.Accelerometer.init();
gamelib.input.Gamepad.init();

// gamelib.Loader.init("resources/images/");

var myShipSprite = loadSprite("myShip.png", 20, 20);
var myShipShadowSprite;
var myShotSprite = loadSprite("myShot.png", 12, 12);
var enemySprite = loadSprite("enemy.png", 40, 40);
var enemyShadowSprite;
var flashedEnemySprite;
var enemyShotSprite = loadSprite("enemyShot.png", 10, 10);

var cloudSprite = loadSprite("cloud.png", 240, 240);
// var backgroundSprite = loadSprite("background.jpg", 320, 320);

var developmentSprite = loadSprite("development.png", -16, 32);
var instructionSprite = loadSprite("instruction.png", 0, 0);

var explosionSpriteSheet = loadSpriteSheet("explosion.png", 128, 128, 24, 64, 64);

var fragmentSprites = [
    loadSprite("fragment0.png", 4, 4),
    loadSprite("fragment1.png", 4, 4),
    loadSprite("fragment2.png", 4, 4)
];
var fragmentShadowSprites;

gamelib.Sound.init("resources/sounds");
gamelib.Sound.load("bgm");
gamelib.Sound.load("shot");
gamelib.Sound.load("explosion");

domScreen = new gamelib.dom.DOMScreen('gamescreen');
tweetButton = new gamelib.dom.DOMButton('tweetbutton.png');
tweetButton.setURL('https://twitter.com/intent/tweet?text=' + encodeURI('ツイートのテスト'), '_target');
//domScreen.addDOMSprite(tweetButton);

window.addEventListener('keydown', function (event) {
    if (event.keyCode == 'F'.charCodeAt(0)) {
        gamelib.GameScreen.requestFullScreen();
    }

    // stop by esc key to debug
    if (event.keyCode == 27) {
        gamelib.GameLoop.stop();
        gamelib.Sound.stopBGM();
    }
}, false);

var score;

// game objects
var myShip;

var myShots;
var enemies;
var enemyShots;
var effects;
var huds;

var enemyCreateTime;

var stick = new gamelib.input.VirtualStick(gamelib.Loader.load("virtualstick.png"));
var fireButton = new gamelib.input.TouchButton(gamelib.Loader.load("button.png"));
var dragStick = new gamelib.input.DragStick();

// var renderer = new gamelib.Renderer();
// var bgRenderer = new gamelib.Renderer();
var hudRenderer = new gamelib.Renderer();
var guiRenderer = new gamelib.Renderer();

gamelib.GameLoop.run(title);

function title(deltaTime) {
    // loading
    if (gamelib.Loader.getLoadingCount() + gamelib.Sound.getLoadingCount() > 0) {
        return;
    }

    var shadowColor = 'rgba(0, 0, 0, 0.5)';

    // create sprites
    myShipShadowSprite = new Sprite(gamelib.createFlashImage(myShipSprite.image, shadowColor), 20, 20);
    flashedEnemySprite = new Sprite(gamelib.createFlashImage(enemySprite.image), 40, 40);
    enemyShadowSprite = new Sprite(gamelib.createFlashImage(enemySprite.image, shadowColor), 40, 40);

    fragmentShadowSprites = [
        new Sprite(gamelib.createFlashImage(fragmentSprites[0].image, shadowColor), 4, 4),
        new Sprite(gamelib.createFlashImage(fragmentSprites[1].image, shadowColor), 4, 4),
        new Sprite(gamelib.createFlashImage(fragmentSprites[2].image, shadowColor), 4, 4)
    ];

    gamelib.GameScreen.clear("#000");

    score = 0;

    myShip = createMyShip();

    myShots = new gamelib.GameObjectList();
    enemies = new gamelib.GameObjectList();
    enemyShots = new gamelib.GameObjectList();
    effects = new gamelib.GameObjectList();
    huds = new gamelib.GameObjectList();

    huds.attach(createScore());
    huds.attach(createInstruction());
    huds.attach(createProfile());

    enemyCreateTime = 0;

    gamelib.Sound.playBGM("bgm");

    gamelib.GameLoop.run(main);
}

function main(deltaTime) {
    gamelib.Stopwatch.start("update");

    gamelib.GameScreen.clear("#000");
    gamelib.GameScreen.setAbstractScreen(SCREEN_W, SCREEN_H);

    enemyCreateTime -= deltaTime;
    if (enemyCreateTime < 0) {
        enemyCreateTime = 0.8;
        enemies.attach(createEnemy());
    }

    renderer.clear();
    guiRenderer.clear();

    // update inputs
    gamelib.input.Input.update();
    if (isTouchScreen) {
        //		stick.update();
        //		fireButton.update();
        //		dragStick.update();
    }
    dragStick.update();

    if (myShip.alive) {
        myShip.update(deltaTime);
    }
    myShots.update(deltaTime);
    enemies.update(deltaTime);
    enemyShots.update(deltaTime);
    effects.update(deltaTime);

    gamelib.hitTest1xN(myShip, enemyShots);
    gamelib.hitTest1xN(myShip, enemies);
    gamelib.hitTestNxN(myShots, enemies);

    gamelib.Stopwatch.stop("update");

    gamelib.Stopwatch.start("render");

    // draw background
    var fb = gamelib.GameScreen.getFrameBuffer();
    var context = fb.getContext();

    function scroll() {
        var pos = myShip.getPosition();

        context.translate(
            gamelib.map(pos.x, FIELD_X0, FIELD_X1, SCREEN_MARGIN, -SCREEN_MARGIN),
            gamelib.map(pos.y, FIELD_X0, FIELD_X1, SCREEN_MARGIN, -SCREEN_MARGIN));
    }
    /*	
        context.save();
        {
            var cx = SCREEN_W / 2;
            var cy = SCREEN_H / 2;
            var sx = 0.5;
            var sy = 0.5;
            context.translate(cx, cy);
            context.scale(sx, sy);
            context.translate(-cx, -cy);
            
            scroll();
            
    //		var cloudY = (GameLoop.getTime() * -800) % SCREEN_H * 3;
    //		var cloudY = 0;
            
            bgRenderer.clear();
            bgRenderer.drawSprite(cloudSprite, SCREEN_W / 2, SCREEN_H / 2, 0, 4);
            bgRenderer.render(fb);
        }
        context.restore();
    */
    context.save();
    {
        scroll();

        renderer.setLayer(Layer.GROUND);
        renderer.drawSprite(backgroundSprite, SCREEN_W / 2, SCREEN_H / 2, 0, 1.5);

        // draw game objects
        renderer.render(fb);
    }
    context.restore();

    // HUDs
    hudRenderer.clear();
    huds.update(deltaTime);
    hudRenderer.render(fb);

    // reposition tweet button
    tweetButton.setPosition(gamelib.GameScreen.getPhysicalRect(new gamelib.Rect(50, 50, 160, 80)));

    gamelib.GameScreen.drawFrame("#000");
    gamelib.GameScreen.clearAbstractScreen();

    //guiRenderer.drawSprite(developmentSprite, 0, gamelib.GameScreen.getH());
    guiRenderer.render(fb);
}


