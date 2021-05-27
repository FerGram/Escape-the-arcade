// Creating part's B game mechanic
// Added to Fer's movement mechanic
const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;
const DISAPPEARANCE_TIME = 10000; // Five secons instead of the wanted 10
const TIMEOUTNEXTWORD = 2000;
const maxCorrectWords = 1;
let ALIEN_DOWN_VELOCITY = 0.5;


let player;
let cursors;

let platforms;
let movingPlatforms;;
let stationaryPlatforms;

let ground;
let isGrounded = false;



let isWalking = false; //used to check if walking or not, and to set the proper anim.
let playerScale = 2; //Scale of player.

let HUD;
let HUDupdate;
let keyboardSounds;
let correctSound;
let errorSound;
let remainingTime = DISAPPEARANCE_TIME/1000;
let alien;
let timer;
let error;  // incorrect answer sprite
let correct;    // correct answer sprite
let consoleSprite;
var options = ["nintendo 64","playstation one","dreamcast","xbox","nes","gameboy","playstation two","snes"];
let option = [];    // The string of the player's input
let currentLetterIndex = 0; // The index of the letter now waiting
let currentWordIndex = 0;   // The index of the word inside options
let doneWords = [false, false, false, false, false, false, false, false]; // For when the player fails and we loop the array
let correctAnswers = 0; // Number of correct answers
let typing; // Text that will display the game

let firstCol = false;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {

    game.load.image('ground2','/assets/imgs/WhiteSquare.jpg');
    game.load.image('ground','/assets/imgs/GreenSquare.png');

    //Loading the spritesheet for the player
    game.load.spritesheet('player', './assets/imgs/SpriteSheet.png', 32, 32, 23);

    game.load.image('bgMain', './assets/imgs/bgMain.jpg');
    game.load.image('tiles', './assets/imgs/Terrain.png');

    // PART B
    game.load.image('alien', '/assets/imgs/alien.png');
    game.load.image('error', '/assets/imgs/error.png');
    game.load.image('correct', '/assets/imgs/Consolas.gif');

    game.load.image('tetris1', '/assets/imgs/tetris1.png')
    game.load.image('tetris2', '/assets/imgs/tetris2.png')

    game.load.image('nintendo 64', '/assets/imgs/consoles/nintendo64.png');
    game.load.image('playstation one', '/assets/imgs/consoles/playstationOne.png');
    game.load.image('dreamcast', '/assets/imgs/consoles/dreamcast.png');
    game.load.image('xbox', '/assets/imgs/consoles/xbox.png');
    game.load.image('nes', '/assets/imgs/consoles/nes.png');
    game.load.image('gameboy', '/assets/imgs/consoles/gameboy.png');
    game.load.image('playstation two', '/assets/imgs/consoles/playstationTwo.png');
    game.load.image('snes', '/assets/imgs/consoles/snes.png');

    game.load.audio('correctSound', '/assets/sounds/correct.mp3');
    game.load.audio('incorrectSound', '/assets/sounds/error.mp3');
    game.load.audio('keyboardSound', '/assets/sounds/keyboard.mp3');

}

// --------CREATE PHASE -- CREATING ALL SPRITES AND OTHER STUFF----------
function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createPlayer();
    createAlien();
    createPlatforms();
    createKeyControls();
    createSounds();
    // Only shuffle the first time around
    if(correctAnswers == 0){
        shuffle(options);
        console.log(options);
    }

    // Add HUD for remaining time
    HUD = game.add.text(50, 0, 'Remaining time: ' + remainingTime, {font:'20px Krona One', fill:'#FFFFFF'});
    HUDupdate = setInterval(updateHUD, 1000);

    createTypeGame();
    game.world.setBounds(0, 0, 2000, GAME_HEIGHT);
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {

    isGrounded = game.physics.arcade.collide(player, platforms) || game.physics.arcade.collide(player, movingPlatforms);
    if(true) { //correctAnswers >= maxCorrectWords
        playerMovement();
         // Part C
         game.physics.arcade.overlap(movingPlatforms, stationaryPlatforms, collisionOfPlatforms, null, this)
    }
   else
        alienMovement();


}

function collisionOfPlatforms(movPlat, statPlat){
        movPlat.body.velocity.x = 0;
        console.log("Colliding");
        firstCol = true;
        posX = movPlat.x;
        //thirdWidth = .bounds.size.x/3;
        game.add.tween(movPlat).to({x:posX + 43}, 200, "Linear", true);
        //statPlat.body.velocity.x = 0;
        movingPlatforms.removeChildAt(0);
        stationaryPlatforms.add(movPlat);

}

// PLAYER MOVEMENT
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

// CREATE PLAYER
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

    stationaryPlatforms = game.add.group();
    stationaryPlatforms.enableBody = true;

    movingPlatforms = game.add.group();
    movingPlatforms.enableBody = true;

    ground = game.add.sprite(100, GAME_HEIGHT - 50, 'ground');
    platforms.add(ground);
    ground.scale.setTo(0.8, 1);
    ground.body.immovable = true;


    //Instance of the platform to be
    let platform;
    let stationaryPlatform;

    for (let i = 1; i <= 3; i++) {
        platform = game.add.sprite(ground.width + 50*i*6, GAME_HEIGHT - 128, 'tetris1'); // Cuidado con la X
        //platform.scale.setTo(0.1, 0.1);
        movingPlatforms.add(platform);
        platform.body.immovable = true;
        platform.body.onCollide = new Phaser.Signal();
        platform.body.onCollide.add(movePlatform, this);

        stationaryPlatform = game.add.sprite(platform.x+platform.width+5, GAME_HEIGHT-128, 'tetris2')

        stationaryPlatforms.add(stationaryPlatform);
        //stationaryPlatform.scale.setTo(0.1, 0.1);
        stationaryPlatform.body.immovable = true;
    }
}

    // E S T O  E S  M U Y  I N T E R E S A N T E
function createSounds() {
    keyboardSounds = game.add.sound('keyboardSound');
    keyboardSounds.allowMultiple = true;
    keyboardSounds.addMarker('1', 0, 0.2);
    keyboardSounds.addMarker('2', 0.5, 0.2);
    keyboardSounds.addMarker('3', 1, 0.2);
    keyboardSounds.addMarker('4', 1.5, 0.2);

    correctSound = game.add.sound('correctSound');
    errorSound = game.add.sound('incorrectSound');
}

// NUEVO
// PARTE C
function movePlatform(p) {
    p.body.velocity.x = 200;
    p.body.onCollide = null;
}


function stopPlatform(mp, sp) {
    mp.body.velocity.x = 0;
    setTimeout(destroyPlatforms, 1000, mp, sp);
}

function destroyPlatforms(mp, sp) {
    movingPlatforms.removeChildAt(0);
    stationaryPlatforms.removeChildAt(0);

    mp.destroy();
    sp.destroy();
}

// PARTE B
function createAlien() {
    alien = game.add.sprite(player.x + 100, 0, 'alien');
    alien.scale.setTo(0.3);
}

function alienMovement() {
    alien.y += ALIEN_DOWN_VELOCITY;
}

// When the word is not completed
function wordTimeOut() {
    errorSound.play();
    clearInterval(HUDupdate);
    game.input.keyboard.enabled = false;
    error.alpha = 1;
    game.add.tween(error).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    timer.pause();
    ALIEN_DOWN_VELOCITY = 0;
    setTimeout(clearWordScreen, TIMEOUTNEXTWORD);
}
// When the word is completed
function wordCorrectAnswer() {
    correctSound.play();
    clearInterval(HUDupdate);
    correct.alpha = 1;
    game.add.tween(correct).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    timer.pause();
    ALIEN_DOWN_VELOCITY = 0;
    setTimeout(clearWordScreen, TIMEOUTNEXTWORD);
}

// Restart error and correct sprites and alien position
function clearWordScreen() {
    error.alpha = 0;
    correct.alpha = 0;
    timer.resume();
    alien.y = 0;
    ALIEN_DOWN_VELOCITY = 0.5;
    restartTypeGame();
}

//
function updateHUD() {
    remainingTime -= 1;
    HUD.setText('Remaining time: ' + remainingTime);
}

// game flow of keyboard inputs
function getKeyboardInput(e) {

    if(e.key.toLowerCase() === option[currentLetterIndex]) {    // Make the input lower case, so there is no errors

        keyboardSounds.play(String(Math.floor(Math.random() * 4 + 1))); // play sound

        let newText = typing.text;
        newText = newText.replace("_", e.key);  // Replace the first character with the second argument (once)
        typing.setText(newText.toUpperCase());     // Show the word in upper case
        currentLetterIndex += 1;
    }
    // Game flow
    if (currentLetterIndex == option.length) {
        game.input.keyboard.enabled = false;    // When completing a word, cease keyboard listener
        correctAnswers += 1;
        doneWords[currentWordIndex] = true;
        wordCorrectAnswer();
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
    timer.loop(DISAPPEARANCE_TIME, wordTimeOut, this);

    //  Start the timer running - this is important!
    timer.start();

    // Display and hide sprites for the correct and wrong answers
    error = game.add.sprite(50, 50, 'error');
    error.anchor.setTo(0.5,0.5);
    error.scale.setTo(0.1);
    error.alpha = 0;

    correct = game.add.sprite(50, 50, 'correct');
    correct.anchor.setTo(0.5,0.5);
    correct.scale.setTo(0.1);
    correct.alpha = 0;

    // Introduce the event for the kayboard
    game.input.keyboard.onDownCallback = getKeyboardInput; // Calling getKeyboardInput when a key is pressed

    // Show the current console to be guessed
    consoleSprite = game.add.sprite(GAME_WIDTH / 4, GAME_HEIGHT / 3, options[currentWordIndex]);
    consoleSprite.alpha = 0;
    game.add.tween(consoleSprite).to( { alpha: 1 }, 100, "Linear", true);

    // Prepare the current word
    option = options[currentWordIndex];

    typing = game.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "_ ".repeat(option.length) , 
                            {fontSize: '20px', fill: '#FA2'});
}

// Chooses new word and resets all timers and sprites
function restartTypeGame() {

    // Always pass to the next word
    currentWordIndex += 1;

    if (correctAnswers < maxCorrectWords) {


        if (currentWordIndex > 7) 
                currentWordIndex = 0;
        // Only show the words that were not completed
        while(doneWords[currentWordIndex]){
            if (currentWordIndex > 7) 
                currentWordIndex = 0;
            else  
                currentWordIndex += 1;
        }
        consoleSprite.destroy();
        timer.destroy();
        alien.destroy();
        typing.destroy();
        currentLetterIndex = 0;

        createAlien();
        createTypeGame();

        game.input.keyboard.enabled = true;
        remainingTime = DISAPPEARANCE_TIME/1000;

        HUD.destroy();
        HUD = game.add.text(50, 0, 'Remaining time: ' + remainingTime, {font:'20px Krona One', fill:'#FFFFFF'});
        HUDupdate = setInterval(updateHUD, 1000);
    }
    else {
        HUD.destroy();
        consoleSprite.destroy();
        timer.destroy();
        alien.destroy();
        typing.destroy();
        //game.state.start('hof');
        game.input.keyboard.enabled = true;
        game.input.keyboard.onDownCallback = null;
    }
}