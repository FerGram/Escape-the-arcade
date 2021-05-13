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

//-----------------------------------------------------

const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;

let player;
let cursors;
let platforms;
let ground;
let isGrounded = false;
let isWalking = false;
let playerScale = 2; 


let pongTestState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('players','/assets/imgs/WhiteSquare.jpg');
    game.load.image('ball','/assets/imgs/WhiteSquare.jpg');
    game.load.image('middle','/assets/imgs/WhiteSquare.jpg');

    game.load.image('ground','./assets/imgs/GreenSquare.png');
    game.load.image('ground1','./assets/imgs/GreenSquare.png')
    game.load.spritesheet('player','./assets/imgs/SpriteSheet.png', 32, 32, 23);
    game.load.image('bgMain', './assets/imgs/bgMain.jpg');
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    balls = game.add.group();
    pongGroup = game.add.group();
    pongGroup.enableBody = true;


    createPlayer();
    createPlatforms();
    createKeyControls();
    
    game.camera.follow(player);
    
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
    isGrounded = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(pongPlayer1, platforms);
    game.physics.arcade.collide(pongPlayer2, platforms);
    game.physics.arcade.collide(player, pongPlayer1);
    game.physics.arcade.collide(player, pongPlayer2);

    if (game.physics.arcade.overlap(player, balls)){
        console.log("OUCH!"); 
        game.camera.shake(0.03, 250);
    } 
    
    playerMovement();
}

function ballMovement() {
    balls.forEach(ball => {

        if(game.physics.arcade.collide(ball, pongPlayer1)) ball.body.velocity.x = BALL_VELOCITY;
        else if(game.physics.arcade.collide(ball, pongPlayer2)) ball.body.velocity.x = -BALL_VELOCITY;

        //Collides with top/bottom limits
        else if (ball.body.blocked.up) ball.body.velocity.y = BALL_VELOCITY;
        else if (game.physics.arcade.collide(ball, platforms)) ball.body.velocity.y = -BALL_VELOCITY;

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
    if (minutes == 1 && seconds > 30) stopGame();
}

function createTimer(){

    gameTimer = game.time.events.loop(100, updateTimer);
    gameBallSpawner = game.time.events.loop(SPAWN_BALL_TIME, createBall);

    timeStartPoint = new Date();
    canStartGame = true;

    game.world.bringToTop(player);
    game.world.bringToTop(platforms);
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

    middle = game.add.sprite(game.width / 2, game.height / 2, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle = game.add.sprite(game.width / 2, game.height / 4, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);
    
    middle = game.add.sprite(game.width / 2, game.height * 3 / 4, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    middle = game.add.sprite(game.width / 2, game.height - 40, 'middle');
    middle.anchor.setTo(0.5, 0.5);
    middle.scale.setTo(0.015, 0.1);

    game.world.bringToTop(player);
    game.world.bringToTop(platforms);

}

function resetBall(ball) {

    ball.body.x = game.world.width/2;
    ball.body.y = game.world.height/2;
    ball.body.velocity.x = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
    ball.body.velocity.y = BALL_VELOCITY * (Math.random() > 0.5? -1 : 1);
}

function stopGame(){

    canStartGame = false;
    gameTimer.timer.destroy();
    gameBallSpawner.timer.destroy();

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

function createPlayer() {
    let x = game.world.centerX;
    let y = game.world.height - 500;

    player = game.add.sprite(x, y, 'player');

    //Create animations
    player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7 ,8 ,9, 10], 12, true);
    player.animations.add('walk', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 12, true);

    player.animations.play('idle');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(playerScale, playerScale);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 1400;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.enableBody = true;


}

function createPlatforms() {
    platforms = game.add.group();
    platforms.enableBody = true;
    
    ground = game.add.sprite(0, GAME_HEIGHT - 50, 'ground');
    platforms.add(ground);
    ground.scale.setTo(20, 1);
    ground.body.immovable = true;

}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function createLevel(){
    game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgMain');
    bg.scrollFactorX = 0.7;
    bg.scrollFactorY = 0.7;

}

function playerMovement() {
    if (cursors.left.isDown){
        player.body.velocity.x = -PLAYER_VELOCITY;
        if (!isWalking){
            isWalking = true;
            player.scale.setTo(playerScale * -1, playerScale);
            player.animations.play('walk');
        }
    }
    else if (cursors.right.isDown){
        if (!isWalking){
            isWalking = true;
            player.scale.setTo(playerScale, playerScale);
            player.animations.play('walk');
        }
        player.body.velocity.x = PLAYER_VELOCITY;
    }
    else { //If nothing is pressed...
        if (isWalking){
            isWalking = false; //change bool to false 
            player.animations.play('idle'); //trigger idle anim.
        }
        player.body.velocity.x = 0; //change velocity on x to 0.
    }
    if (cursors.up.isDown && isGrounded && player.body.touching.down){
        player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
        isGrounded = false;
    }
}
