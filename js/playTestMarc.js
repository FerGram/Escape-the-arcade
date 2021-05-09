// Creating part's B game mechanic
// Added to Fer's movement mechanic
const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const DISAPPEARANCE_TIME = 5000; // Five secons instead of the wanted 10
const TIMEOUT = 2000;
let ALIEN_DOWN_VELOCITY = 0.5;

const PLAYER_JUMP_VELOCITY = 1700;
let player;

let alien;
let timer;
let error;
let correct;
var options = ["nintendo 64","playstation one","dreamcast","xbox","nes","gameboy","playstation two","snes"];
let option = [];    // The string of the console
let currentLetterIndex = 0; // The index of the letter now waiting
let currentWordIndex = 0;   // The index of the word inside options
let doneWords = [false, false, false, false, false, false, false, false]; // List of completed words
let correctAnswers = 0; // Number of correct answers
let typing; // Text that will display the game

let cursors;
let platforms;
let ground;
let isGrounded = false;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('player','/assets/imgs/WhiteSquare.jpg');
    game.load.image('ground','/assets/imgs/GreenSquare.png');

    game.load.image('alien', '/assets/imgs/alien.png');
    game.load.image('error', '/assets/imgs/error.png');
    game.load.image('correct', '/assets/imgs/Consolas.gif')
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createPlayer();
    createAlien();
    createPlatforms();
    createKeyControls();

    // Only shuffle the first time around
    if(correctAnswers == 0){
        shuffle(options);
        console.log(options);
    }
    createTypeGame();
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    isGrounded = game.physics.arcade.collide(player, platforms);
    playerMovement();
    alienMovement();
}

function playerMovement() {
    if (cursors.left.isDown)
        player.body.velocity.x = -PLAYER_VELOCITY;
    else if (cursors.right.isDown)
        player.body.velocity.x = PLAYER_VELOCITY;
    else player.body.velocity.x = 0;

    if (cursors.up.isDown && isGrounded && player.body.touching.down){
        player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
        isGrounded = false;
    }
}


function createPlayer() {
    let x = game.world.centerX;
    let y = game.world.height - 500;

    player = game.add.sprite(x, y, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.2, 0.2);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 4000;
    //player.body.bounce.y = 0.2;
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

// NUEVO
function createAlien() {
    alien = game.add.sprite(player.x + 100, 0, 'alien');
    alien.scale.setTo(0.3);
}

function alienMovement() {
    alien.y += ALIEN_DOWN_VELOCITY;
}

// When the word is not hit
function stopAlienBad() {
    game.input.keyboard.enabled = false;
    error.alpha = 1;
    game.add.tween(error).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    timer.pause();
    ALIEN_DOWN_VELOCITY = 0;
    setTimeout(deleteAlien, TIMEOUT);
}
// When the word is hit
function stopAlienGood() {
    correct.alpha = 1;
    game.add.tween(correct).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    timer.pause();
    ALIEN_DOWN_VELOCITY = 0;
    setTimeout(deleteAlien, TIMEOUT);
}

// Restart error and correct sprites and alien position
function deleteAlien() {
    error.alpha = 0;
    correct.alpha = 0;
    timer.resume();
    alien.y = 0;
    ALIEN_DOWN_VELOCITY = 0.5;
    restartTypeGame();
}

// game flow of keyboard inputs
function getKeyboardInput(e) {

    if(e.key.toLowerCase() === option[currentLetterIndex]) {
        let newText = typing.text;
        newText = newText.replace("_", e.key);
        typing.setText(newText.toUpperCase());     
        currentLetterIndex += 1; 
    }
    // Game flow
    if (currentLetterIndex == option.length) {
        game.input.keyboard.enabled = false;
        correctAnswers += 1;
        doneWords[currentWordIndex] = true;
        stopAlienGood();
    }
    // When the next character is space, add it automatically
    else if (option[currentLetterIndex] == ' ') {
        let newText = typing.text;
            newText = newText.replace("_", " ");
            typing.setText(newText.toUpperCase());     
            currentLetterIndex += 1;
    }

    
}

// Gets a random order for the consoles
function shuffle(array) {
    let currentIndex = array.length, randomIndex, temporaryValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex); 
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue; 
    }
    return array;
} 
// Creates timers and words
function createTypeGame() {

    //  Create our Timer
    timer = game.time.create(false);

    //  Set a TimerEvent to occur after X seconds
    timer.loop(DISAPPEARANCE_TIME, stopAlienBad, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();

    error = game.add.sprite(50, 50, 'error');
    error.anchor.setTo(0.5,0.5);
    error.scale.setTo(0.1);
    error.alpha = 0;

    correct = game.add.sprite(50, 50, 'correct');
    correct.anchor.setTo(0.5,0.5);
    correct.scale.setTo(0.1);
    correct.alpha = 0;

    game.input.keyboard.onDownCallback = getKeyboardInput; // Calling getKeyboardInput when a key is pressed

    option = options[currentWordIndex];

    console.log(option);
    typing = game.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "_ ".repeat(option.length) , 
                            {fontSize: '20px', fill: '#FA2'});
}

// Chooses new word and resets all timers and sprites
function restartTypeGame() {

    if (correctAnswers < 8) {

        // Always pass to the next word
        currentWordIndex += 1;
        if (currentWordIndex > 7) 
                currentWordIndex = 0;
        // Only show the words that were not completed
        while(doneWords[currentWordIndex]){
            if (currentWordIndex > 7) 
                currentWordIndex = 0;
            else  
                currentWordIndex += 1;
        }
        timer.destroy();
        alien.destroy();
        typing.destroy();
        currentLetterIndex = 0;

        createAlien();
        createTypeGame();
        game.input.keyboard.enabled = true;
    }
    else {
        game.state.start('hof');
    }
}