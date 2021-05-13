
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

const SPAWN_BALL_TIME = 7500; //In miliseconds

const BALL_VELOCITY = 500;
const X_OFFSET = 100;

let pongTestState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('players','/assets/imgs/WhiteSquare.jpg');
    game.load.image('ball','/assets/imgs/WhiteSquare.jpg');
    game.load.image('middle','/assets/imgs/WhiteSquare.jpg');
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    balls = game.add.group();
    
    game.time.events.add(1500, createPongPlayers);
    game.time.events.add(3000, createStage);
    game.time.events.add(4500, createScore);
    game.time.events.add(6000, createBall);
    game.time.events.add(6000, createTimer);
}

function updatePlay() {

    if (canStartGame){
        ballMovement();
        pongPlayerMovement();
    }
}

function ballMovement() {
    balls.forEach(ball => {

        if(game.physics.arcade.collide(ball, pongPlayer1)) ball.body.velocity.x = BALL_VELOCITY;
        else if(game.physics.arcade.collide(ball, pongPlayer2)) ball.body.velocity.x = -BALL_VELOCITY;

        //Collides with top/bottom limits
        else if (ball.body.blocked.up) ball.body.velocity.y = BALL_VELOCITY;
        else if (ball.body.blocked.down) ball.body.velocity.y = -BALL_VELOCITY;

        //Collides with left/right limits
        else if (ball.body.blocked.left || ball.body.blocked.right) {
            if (ball.body.blocked.left) {
                player2Score++;
                player2ScoreLabel.text = player2Score;
            }
            if (ball.body.blocked.right){
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

    if (leftBall.body.y >= pongPlayer1.y && leftBall.x < game.width/2) 
        pongPlayer1.body.velocity.y = pongPlayer1Velocity;
    else pongPlayer1.body.velocity.y = -pongPlayer1Velocity;

    if (rightBall.body.y >= pongPlayer2.y && rightBall.x > game.width/2) 
        pongPlayer2.body.velocity.y = pongPlayer2Velocity;
    else pongPlayer2.body.velocity.y = -pongPlayer2Velocity;
}

function updateTimer(){ //This is an event callback (not in update method)

    let currentTime = new Date();
    let timeDifference = currentTime.getTime() - timeStartPoint.getTime();

    timeElapsed = Math.abs(timeDifference / 1000);

    let minutes = Math.floor(timeElapsed / 60);
    let seconds = Math.floor(timeElapsed) - (60 * minutes);

    //GAME OVER
    if (minutes == 0 && seconds > 30 && canStartGame) stopGame();
}

function createTimer(){

    gameTimer = game.time.events.loop(100, updateTimer);
    gameBallSpawner = game.time.events.loop(SPAWN_BALL_TIME, createBall);

    timeStartPoint = new Date();
    canStartGame = true;
}

function createPongPlayers() {
    let x1 = X_OFFSET;
    let y1 = game.world.height/2;

    let x2 = game.world.width - X_OFFSET;
    let y2 = game.world.height/2;

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


    pongPlayers = game.add.group();
    pongPlayers.add(pongPlayer1);
    pongPlayers.add(pongPlayer2);
}

function createBall(){
    let ball;
    let x = game.world.width/2;
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
    player1ScoreLabel = game.add.text(game.width / 2 - 150, 40, '0', {font:'50px Arial', fill: "#fff"});
    player1ScoreLabel.anchor.setTo(0.5, 0.5);
    player2ScoreLabel = game.add.text(game.width / 2 + 150, 40, '0', {font:'50px Arial', fill: "#fff"});
    player2ScoreLabel.anchor.setTo(0.5, 0.5);
}

function createStage(){
    let middle = game.add.sprite(game.width / 2, 40, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);
    middle = game.add.sprite(game.width / 2, game.height - 40, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);
    middle = game.add.sprite(game.width / 2, game.height / 2, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);
    middle = game.add.sprite(game.width / 2, game.height / 4, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);
    middle = game.add.sprite(game.width / 2, game.height * 3 / 4, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);
}

function resetBall(ball) {

    ball.body.x = game.world.width/2;
    ball.body.y = game.world.height/2;
    ball.body.velocity.x = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
    ball.body.velocity.y = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
}

function stopGame(){

    canStartGame = false;

    balls.forEach(ball => {
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
    });
    pongPlayer1.body.velocity = 0;
    pongPlayer2.body.velocity = 0;

    let endtext = game.add.text(game.width/2, game.height/2 - 150, 
        (player1Score > player2Score? "Player 1 WINS" : "Player 2 WINS"), 
        {font:'50px Arial', fill: "#FF0000"});
    endtext.anchor.setTo(0.5, 0.5);
}
