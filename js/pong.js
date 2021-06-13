let pongPlayer1;
let pongPlayer2;
let balls; //This is a group
let collidedWithXBorder = false;
let collidedWithYBorder = false;
let timeElapsed = 0;
let gameTimer, gameBallSpawner, timeStartPoint, hitTimer;

let pongPlayer1Velocity = 500;
let pongPlayer2Velocity = 500;

let player1Score = 0;
let player2Score = 0;
let player1ScoreLabel, player2ScoreLabel, endText;
let middle, middle1, middle2, middle3, middle4;

let canStartGame = false;
let stageMiddle;
let fireBall;

let energy = 6;
let energySprite;

let pongStartSound;
let pongScoredSound;
let pongSound1;
let pongSound2;

const SPAWN_BALL_TIME = 7500; //In miliseconds
const BALL_VELOCITY = 500;
const FIREBALL_VELOCITY = 1.5;
const X_OFFSET = 100;
const INVULNERAVILITY_SEC = 1500; //In milliseconds

//-----------------------------------------------------

function createPONG() {

    createSoundsPong();

    balls = game.add.group();
    pongGroup = game.add.group();
    pongGroup.enableBody = true;

    hitTimer = game.time.create(false);
    
    hitTimer.add(1000, createBlackBG);
    hitTimer.add(1500, createPongPlayers);
    hitTimer.add(2000, createStage);
    hitTimer.add(2500, createScore);
    hitTimer.add(5000, createBall);
    hitTimer.add(5000, createTimer);
    hitTimer.add(5000, createEnergy);

    hitTimer.start();

    pongStartSound.play();
}

function updatePONG() {

    if (!canStartGame) return;

    ballMovement();
    pongPlayerMovement();

    game.physics.arcade.collide(pongPlayer1, layer);
    game.physics.arcade.collide(pongPlayer2, layer);
    game.physics.arcade.collide(player, pongPlayer1);
    game.physics.arcade.collide(player, pongPlayer2);

    if (game.physics.arcade.overlap(player, balls) & hitTimer.ms > INVULNERAVILITY_SEC){ //Player hit by ball

        console.log("OUCH!");
        game.camera.shake(0.03, 250);

        hitTimer.stop(); //Reset invulnerability timer
        hitTimer.start();

        energy--;
        updateEnergy();
    }

}

function ballMovement() {
    balls.forEach(ball => {

        if(game.physics.arcade.collide(ball, pongPlayer1)) {
            ball.body.velocity.x = BALL_VELOCITY;
            pongSound1.play();
        }
        else if(game.physics.arcade.collide(ball, pongPlayer2)) {
            ball.body.velocity.x = -BALL_VELOCITY;
            pongSound1.play();
        }

        //Collides with top/bottom limits
        else if (ball.body.blocked.up) {
            ball.body.velocity.y = BALL_VELOCITY;
            pongSound2.play();
        }
        else if (game.physics.arcade.collide(ball, layer)) {
            ball.body.velocity.y = -BALL_VELOCITY; 
            pongSound2.play();
        }

        //Collides with left/right limits
        else if (ball.body.x > pongPlayer2.body.x + 30 || ball.body.x < pongPlayer1.body.x - 30) {
            
            pongScoredSound.play();
            if (ball.body.x < pongPlayer1.body.x - 30) {
                player2Score++;
                player2ScoreLabel.text = player2Score;
            }
            if (ball.body.x > pongPlayer2.body.x + 30){
                player1Score++;
                player1ScoreLabel.text = player1Score;
            }
            resetBall(ball);

        }
    });
}

function pongPlayerMovement(){

    let leftBall = balls.children[0];
    let rightBall = balls.children[0];

    balls.forEach(ball => {
        if (ball.body.x < leftBall.body.x) leftBall = ball;
        else if (ball.body.x > rightBall.body.x) rightBall = ball;
    });

    if (leftBall.body.y >= pongPlayer1.y && leftBall.x < stageMiddle)
        pongPlayer1.body.velocity.y = pongPlayer1Velocity;
    else pongPlayer1.body.velocity.y = -pongPlayer1Velocity;

    if (rightBall.body.y >= pongPlayer2.y && rightBall.x > stageMiddle)
        pongPlayer2.body.velocity.y = pongPlayer2Velocity;
    else pongPlayer2.body.velocity.y = -pongPlayer2Velocity;
}

function updateTimer(){ //This is a time event callback

    let timeDifference = game.time.now - timeStartPoint;

    timeElapsed = Math.abs(timeDifference / 1000);

    let minutes = Math.floor(timeElapsed / 60);
    let seconds = Math.floor(timeElapsed) - (60 * minutes);

    //GAME OVER
    if (minutes == 0 && seconds > 40) stopGame();
}

function createBlackBG(){
    game.stage.backgroundColor = '#000000';
}

function createTimer(){

    gameTimer = game.time.create(false);
    gameBallSpawner = game.time.create(false);
    fireBallSpawner = game.time.create(false);

    gameTimer.loop(100, updateTimer);
    gameBallSpawner.loop(SPAWN_BALL_TIME, createBall);
    fireBallSpawner.loop(SPAWN_BALL_TIME * 2, makeFireBall); //Make fire ball every 3 balls created

    gameTimer.start();
    gameBallSpawner.start();
    fireBallSpawner.start();

    timeStartPoint = game.time.now;
    canStartGame = true;

    game.world.bringToTop(layer);
    game.world.bringToTop(player);
    game.world.bringToTop(arcadeMachine);
}

function createPongPlayers() {
    let x1 = game.camera.position.x + X_OFFSET;
    let y1 = game.camera.position.y/2;

    let x2 = game.camera.position.x + game.camera.width - X_OFFSET;
    let y2 = game.camera.position.y/2;

    stageMiddle = game.camera.position.x + game.camera.width/2;

    pongPlayer1 = game.add.sprite(x1, y1, 'players');
    pongPlayer1.anchor.setTo(0.5, 0.5);
    pongPlayer1.scale.setTo(0.05, 0.5);

    pongPlayer2 = game.add.sprite(x2, y2, 'players');
    pongPlayer2.anchor.setTo(0.5, 0.5);
    pongPlayer2.scale.setTo(0.05, 0.5);

    game.physics.arcade.enable(pongPlayer1);
    game.physics.arcade.enable(pongPlayer2);

    pongPlayer1.body.collideWorldBounds = true;
    pongPlayer2.body.collideWorldBounds = true;
    pongPlayer1.enableBody = true;
    pongPlayer2.enableBody = true;
    pongPlayer1.body.immovable = true;
    pongPlayer2.body.immovable = true;
}

function createBall(){
    let ball;
    let x = stageMiddle;
    let y = game.world.height/2;

    ball = game.add.sprite(x, y, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.scale.setTo(0.03, 0.03);

    game.physics.arcade.enable(ball);
    ball.enableBody = true;
    ball.body.collideWorldBounds = true;

    ball.body.velocity.x = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
    ball.body.velocity.y = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);

    balls.add(ball);
}

function createScore(){
    player1ScoreLabel = game.add.text(stageMiddle - 250, 200, '0', {font:'50px Arial', fill: "#fff"});
    player1ScoreLabel.anchor.setTo(0.5, 0.5);
    player2ScoreLabel = game.add.text(stageMiddle + 250, 200, '0', {font:'50px Arial', fill: "#fff"});
    player2ScoreLabel.anchor.setTo(0.5, 0.5);
}

function createStage(){
    middle = game.add.sprite(stageMiddle, 40, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle1 = game.add.sprite(stageMiddle, game.height / 2, 'middle');
    middle1.anchor.setTo(0.5, 0.5);
    middle1.scale.setTo(0.015, 0.1);

    middle2 = game.add.sprite(stageMiddle, game.height / 4, 'middle');
    middle2.anchor.setTo(0.5, 0.5);
    middle2.scale.setTo(0.015, 0.1);

    middle3 = game.add.sprite(stageMiddle, game.height * 3 / 4, 'middle');
    middle3.anchor.setTo(0.5, 0.5);
    middle3.scale.setTo(0.015, 0.1);

    middle4 = game.add.sprite(stageMiddle, game.height - 40, 'middle');
    middle4.anchor.setTo(0.5, 0.5);
    middle4.scale.setTo(0.015, 0.1);

    game.world.bringToTop(player);
}


function createSoundsPong() {
    pongStartSound = game.add.sound('pongstart');
    pongSound1 = game.add.sound('pong1');
    pongSound2 = game.add.sound('pong2');
    pongScoredSound = game.add.sound('pongscored');
}

function resetBall(ball) {

    ball.body.x = stageMiddle;
    ball.body.y = game.world.height/2;
    ball.body.velocity.x = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
    ball.body.velocity.y = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
}

function stopGame(){

    canStartGame = false;
    gameTimer.destroy();
    gameBallSpawner.destroy();

    balls.forEach(ball => {
        ball.destroy();
    });
    pongPlayer1.body.velocity = 0;
    pongPlayer2.body.velocity = 0;


    endtext = game.add.text(stageMiddle, game.height/2 - 150,
        (player1Score > player2Score? "Player 1 WINS" : "Player 2 WINS"),
        {font:'50px Arial', fill: "#FF0000"});
    endtext.anchor.setTo(0.5, 0.5);


    level_1_completed = true;
    game.stage.backgroundColor = '#18C4BC';
}

function makeFireBall(){

    fireBall = balls.children[0];
    fireBall.loadTexture('fireball');

    game.time.events.add(1000, moveFireBall);
    game.time.events.add(2000, function(){fireBall.loadTexture('ball');});
}

function moveFireBall(){

    //Move towards player
    fireBall.body.velocity.x = (player.body.x - fireBall.body.x) * FIREBALL_VELOCITY;
    fireBall.body.velocity.y = (player.body.y - fireBall.body.y) * FIREBALL_VELOCITY;
}

function createEnergy(){

    energySprite = game.add.sprite(stageMiddle - 500, game.camera.height - 150, 'battery6');
    energySprite.anchor.setTo(0.5, 0,5);
    energySprite.scale.setTo(0.5, 0.5);
}

function updateEnergy(){

    energySprite.loadTexture('battery' + energy);

    if (energy <= 0){

        resetGame();
    }

}

function resetGame(){
    player.body.x = CHECKPOINT_A_XPOS;

    canStartGame = false;
    gameTimer.destroy();
    gameBallSpawner.destroy();

    balls.forEach(ball => {
        ball.destroy();
    });

    energy = 6;
    energySprite.destroy();

    pongPlayer1.destroy();
    pongPlayer2.destroy();

    player1ScoreLabel.destroy();
    player2ScoreLabel.destroy();

    level_1_completed = false;
    level_1_created = false;
    level_1 = false;

    middle.destroy();
    middle1.destroy();
    middle2.destroy();
    middle3.destroy();
    middle4.destroy();

    game.stage.backgroundColor = '#18C4BC';

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}









