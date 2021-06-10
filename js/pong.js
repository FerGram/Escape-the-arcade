let pongPlayer1;
let pongPlayer2;
let balls; //This is a group
let collidedWithXBorder = false;
let collidedWithYBorder = false;
let timeElapsed = 0;
let gameTimer, gameBallSpawner, timeStartPoint;

let pongPlayer1Velocity = 500;
let pongPlayer2Velocity = 500;

let player1Score = 0;
let player2Score = 0;
let player1ScoreLabel, player2ScoreLabel;

let canStartGame = false;
let stageMiddle;
let fireBall;

const SPAWN_BALL_TIME = 7500; //In miliseconds
const BALL_VELOCITY = 500;
const FIREBALL_VELOCITY = 1.5;
const X_OFFSET = 100;

//-----------------------------------------------------

function createPONG() {

    balls = game.add.group();
    pongGroup = game.add.group();
    pongGroup.enableBody = true;

    game.time.events.add(1000, createBlackBG);
    game.time.events.add(1500, createPongPlayers);
    game.time.events.add(3000, createStage);
    game.time.events.add(4500, createScore);
    game.time.events.add(6000, createBall);
    game.time.events.add(6000, createTimer);
    layer.debug = true;
}

function updatePONG() {

    if (!canStartGame) return;

    ballMovement();
    pongPlayerMovement();

    game.physics.arcade.collide(pongPlayer1, layer);
    game.physics.arcade.collide(pongPlayer2, layer);
    game.physics.arcade.collide(player, pongPlayer1);
    game.physics.arcade.collide(player, pongPlayer2);

    if (game.physics.arcade.overlap(player, balls)){
        console.log("OUCH!");
        game.camera.shake(0.03, 250);
    }

}

function ballMovement() {
    balls.forEach(ball => {

        if(game.physics.arcade.collide(ball, pongPlayer1)) ball.body.velocity.x = BALL_VELOCITY;
        else if(game.physics.arcade.collide(ball, pongPlayer2)) ball.body.velocity.x = -BALL_VELOCITY;

        //Collides with top/bottom limits
        else if (ball.body.blocked.up) ball.body.velocity.y = BALL_VELOCITY;
        else if (game.physics.arcade.collide(ball, layer)) ball.body.velocity.y = -BALL_VELOCITY;

        //Collides with left/right limits
        else if (ball.body.x > pongPlayer2.body.x + 30 || ball.body.x < pongPlayer1.body.x - 30) {
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

function updateTimer(){ //This is a time event callback (not in update method)

    let currentTime = new Date();
    let timeDifference = currentTime.getTime() - timeStartPoint.getTime();

    timeElapsed = Math.abs(timeDifference / 1000);

    let minutes = Math.floor(timeElapsed / 60);
    let seconds = Math.floor(timeElapsed) - (60 * minutes);

    //GAME OVER
    if (minutes == 0 && seconds > 50) stopGame();
}

function createBlackBG(){
    game.stage.backgroundColor = '#000000';
}

function createTimer(){

    gameTimer = game.time.events.loop(100, updateTimer);
    gameBallSpawner = game.time.events.loop(SPAWN_BALL_TIME, createBall);
    fireBallSpawner = game.time.events.loop(SPAWN_BALL_TIME * 2, makeFireBall); //Make fire ball every 3 balls created

    timeStartPoint = new Date();
    canStartGame = true;

    game.world.bringToTop(player);
    game.world.bringToTop(layer);
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
    player1ScoreLabel = game.add.text(stageMiddle - 150, 100, '0', {font:'50px Arial', fill: "#fff"});
    player1ScoreLabel.anchor.setTo(0.5, 0.5);
    player2ScoreLabel = game.add.text(stageMiddle + 150, 100, '0', {font:'50px Arial', fill: "#fff"});
    player2ScoreLabel.anchor.setTo(0.5, 0.5);
}

function createStage(){
    let middle = game.add.sprite(stageMiddle, 40, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle = game.add.sprite(stageMiddle, game.height / 2, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle = game.add.sprite(stageMiddle, game.height / 4, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle = game.add.sprite(stageMiddle, game.height * 3 / 4, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle = game.add.sprite(stageMiddle, game.height - 40, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    game.world.bringToTop(player);
    //game.world.bringToTop(platforms);

}

function resetBall(ball) {

    ball.body.x = stageMiddle;
    ball.body.y = game.world.height/2;
    ball.body.velocity.x = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
    ball.body.velocity.y = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
}

function stopGame(){

    canStartGame = false;
    gameTimer.timer.destroy();
    gameBallSpawner.timer.destroy();

    balls.forEach(ball => {
        ball.destroy();
    });
    pongPlayer1.body.velocity = 0;
    pongPlayer2.body.velocity = 0;


    let endtext = game.add.text(stageMiddle, game.height/2 - 150,
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











