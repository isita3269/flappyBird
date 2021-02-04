var PLAY = 1;
var END = 0;
var gameState = PLAY;

var background;

var ground, invisibleground, groundImage;

var bat_flying;
var bat_collidedImg;

var restart, restartImg;
var gameover, gameoverImg;

var bg;

var cloudGroup, cloudImage;

var pipeNorth, pipeSouth;

var score = 0;
var obstacle;

function preload() {
    bat_flying = loadAnimation(
        "images/bat1.png",
        "images/bat2.png",
        "images/bat3.png",
        "images/bat4.png",
        "images/bat5.png",
        "images/bat6.png",
        "images/bat7.png",
        "images/bat8.png",
        "images/bat9.png",
        "images/bat10.png",
        "images/bat11.png"
    );

    bat_collidedImg = loadImage("images/bat_collided.png");

    // pipe Images
    pipeSouthImg = loadImage("images/pipeSouth.png");
    // pipeNorthImg = loadImage("images/pipeNorth.png");
    redPipeImg = loadImage("images/red.jpg");
    bluePipeImg = loadImage("images/blue.jpg");
    yellowPipeImg = loadImage("images/yellow.jpg");
    greenPipeImg = loadImage("images/green.jpg");

    restartImg = loadImage("images/restart.png");

    gameoverImg = loadImage("images/gameover.png");

    cloudImage = loadImage("images/cloud.png");

    groundImage = loadImage("images/ground.png");

    bg = loadImage("images/backgroundImg.png");

    sunAnimation = loadImage("images/sun.png");
}

function setup() {
    createCanvas(1300, 600);

    bat = createSprite(200, 200, 20, 50);
    bat.addAnimation("bat", bat_flying);
    bat.scale = 0.175;

    sun = createSprite(1200, 100, 10, 10);
    sun.addAnimation("sun", sunAnimation);
    sun.scale = 0.2;

    ground = createSprite(600, 600, 1200, 20);
    ground.addImage("ground", groundImage);
    // ground.shapeColor = ("green")
    ground.x = ground.width / 20;
    ground.velocityX = -(6 + (3 * score) / 100);
    // ground.scale = 0.5;

    gameover = createSprite(300, 100);
    gameover.addImage("gameover", gameoverImg);
    gameover.scale = 0.21;
    gameover.visible = false;

    restart = createSprite(300, 180);
    restart.addImage("restart", restartImg);
    restart.scale = 0.11;
    restart.visible = false;

    invisibleGround = createSprite(500, 190, 400, 10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    obsticalGroup = new Group();

    score = 0;
}

function draw() {
    background(bg);

    textSize(20);
    stroke("orange");
    fill("yellow");
    text("Score: " + score, 900, 70);

    if (gameState === PLAY) {
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + (3 * score) / 100);
        if (keyDown("space")) {
            bat.velocityY = -10;
        }

        bat.velocityY = bat.velocityY + 0.8;

        if (ground.x < 0) {
            ground.x = 100;
        }

        bat.collide(invisibleGround);

        if (ground.isTouching(bat)) {
            gameState = END;
        }
    } else if (gameState === END) {
        gameover.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        bat.velocityY = 0;
        pipeSouth.setVelocityX(0);
        pipeNorth.setVelocityX(0);
        cloudsGroup.setVelocityXEach(0);

        pipeSouth.setLifetime(-1);
        pipeNorth.setLifetime(-1);
        cloudsGroup.setLifetimeEach(-1);

        if (mousePressedOver(restart)) {
            reset();
        }
    }

    if (keyDown("up")) {
        bat_flying.y = bat_flying.y - 5;
    }

    bat_flying.y += 0.7;
    spawnObstaclesNorth();
    drawSprites();
}

function reset() {
    gameState = PLAY;
    gameover.visible = false;
    restart.visible = false;

    pipeNorth.destroy();
    pipeSouth.destroy();
    cloudsGroup.destroyEach();
    score = 0;
}

function spawnObstaclesNorth() {
    if (frameCount % 20 === 0) {
        var rand = Math.round(random(10, 100));
        obstacle = createSprite(1300, 475, 20, rand);
        obstacle.setCollider("circle", 0, 0, 45);
        // obstacle.debug = true

        obstacle.velocityX = -(6 + score / 100);
        var rand1 = Math.round(random(1, 5));
        switch (rand1) {
            case 1:
                obstacle.addImage("pipeSouth", pipeSouthImg);
                obstacle.scale = random(0.7, 1);
                break;
            case 2:
                obstacle.addImage("red", redPipeImg);
                obstacle.scale = random(0.8, 2);
                break;
            case 3:
                obstacle.addImage("blue", bluePipeImg);
                obstacle.scale = random(0.8, 2);
                break;
            case 4:
                obstacle.addImage(" yellow", yellowPipeImg);
                obstacle.scale = random(0.8, 2);
                break;
            case 5:
                obstacle.addImage(" green", greenPipeImg);
                obstacle.scale = random(0.8, 2);
                break;
            default:
                break;
        }

        if (obstacle.isTouching(bat)) {
            gameState = END;
        }
        //assign scale and lifetime to the obstacle

        obstacle.lifetime = 300;
        obstacle.depth = bat.depth;
        obstacle.depth = ground.depth;
        ground.depth += 2;
        bat.depth += 1;
        //add each obstacle to the group
        obsticalGroup.add(obstacle);
    }
}