// Creating part's B game mechanic

const DISAPPEARANCE_TIME = 10000; 
const THE_CHALLENGE_TIME_LIMIT = 30000;
const TIMEOUTNEXTWORD = 2000;
const maxCorrectWords = 4;
const BULLET_VELOCITY = -800;
const HUD_X = 30;
const HUD_Y = 100;
let ALIEN_DOWN_VELOCITY = 0.75;

let HUD;
let HUDupdate;

let alien;
let timer;  // Timer for the remaining time of each word
let remainingTime = THE_CHALLENGE_TIME_LIMIT/1000;  // Timer for the remaining time of the whole challenge
let error;  // incorrect answer sprite
let correct;    // correct answer sprite
let consoleSprite;
var options = ["nintendo 64","playstation one","dreamcast","xbox","nes","gameboy","playstation two","snes"];
options.length = 8;
let option = [];    // The string of the player's input
let currentLetterIndex = 0; // The index of the letter now waiting
let currentWordIndex = 0;   // The index of the word inside options
let doneWords = [false, false, false, false, false, false, false, false]; // For when the player fails and we loop the array, this is in the case we could guess more words
let correctAnswers = 0; // Number of correct answers
let typing; // Text that will display the game
let playingTheChallenge = false;
let theChallengeScore = 0;


let bullets; //Phaser group containing bullet pool
let bulletCounter = 0;


// CREATE PHASE -- CREATING ALL SPRITES AND OTHER STUFF
function createTheChallenge() {

    createAlien();
    createBullets();
    createSounds();

   // Only shuffle the first time around
   if(correctAnswers == 0){
        shuffle(options);
        console.log(options);
        //setTimeout(challengeFailed, THE_CHALLENGE_TIME_LIMIT);
        playingTheChallenge = true;
    }

     // Add HUD for remaining time
     HUD = game.add.text(game.camera.position.x + HUD_X, 
                            game.camera.position.y + HUD_Y, 'Remaining time: ' + remainingTime, {font:'20px Krona One', fill:'#FFFFFF'});
     HUDupdate = setInterval(updateHUD, 1000);
 
    createTypeGame();
}


// ------------ U P D A T E -----------------
function updateTheChallenge() {

    if(correctAnswers < maxCorrectWords && playingTheChallenge) 
        alienMovement(); 

    checkBullets();

    if (remainingTime == 0)
            challengeFailed();
}

//  TIMER ON SCREEN UPDATE
function updateHUD() {
    remainingTime -= 1;
    HUD.setText('Remaining time: ' + remainingTime);
}

function createAlien() {
    alien = game.add.sprite(player.x + 660, 0, 'alien');
    alien.anchor.setTo(0.5, 0.5);
    alien.scale.setTo(0.1);

    game.physics.arcade.enable(alien);
    alien.enableBody = true;
}

function alienMovement() {
    alien.y += ALIEN_DOWN_VELOCITY;
}

// Sounds for the keyboard, correct, error and gun
function createSounds() {
    keyboardSounds = game.add.sound('keyboardSound');
    keyboardSounds.allowMultiple = true;
    keyboardSounds.addMarker('1', 0, 0.2);
    keyboardSounds.addMarker('2', 0.5, 0.2);
    keyboardSounds.addMarker('3', 1, 0.2);
    keyboardSounds.addMarker('4', 1.5, 0.2);

    correctSound = game.add.sound('correctSound');
    errorSound = game.add.sound('incorrectSound');
    tetrisSoundCollision = game.add.sound('tetrisCollision');
    tetrisSoundMovement = game.add.sound('tetrisMovement');
}

function checkBullets() {
    if (game.physics.arcade.overlap(alien, bullets)){ //Has a bullet collided with the alien?

        bullets.children.forEach(bullet => {

            if (game.physics.arcade.overlap(alien, bullet)){ //Then which one? Reset it
                bullet.body.velocity.y = 0;
                bullet.alpha = 0;
                bullet.y = 700;
            }
        });

        alien.loadTexture('alien hit');
        game.time.events.add(300, function(){alien.loadTexture('alien');})
    }
}

function createBullets(){

    bullets = game.add.group();

    for (let i = 0; i < 15; i++){ //Populate the group with 15 bullets (to avoid killing and spawning repeatedly)

        let bullet = game.add.sprite(alien.x, 700, 'bullet');

        bullet.anchor.setTo(0.5, 0.5);
        bullet.scale.setTo(0.015, 0.03);
        bullet.alpha = 0;

        game.physics.arcade.enable(bullet);
        bullet.enableBody = true;

        bullets.add(bullet);
    }
}

function shootAlien(){

    bulletCounter = (bulletCounter + 1) % 15; //Cycle counter

    bullets.children[bulletCounter].alpha = 1;
    bullets.children[bulletCounter].body.velocity.y = BULLET_VELOCITY;
}


//---------- THE CHALLENGE GAME FLOW ---------------

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

    bullets.children.forEach(bullet => { //Reset every bullet
        bullet.body.velocity.y = 0;
        bullet.alpha = 0;
        bullet.y = 700;
    });

    alien.loadTexture('alien death');
    setTimeout(clearWordScreen, TIMEOUTNEXTWORD);    
}

// Restart error and correct sprites and alien position
function clearWordScreen() {
    error.alpha = 0;
    correct.alpha = 0;
    timer.resume();
    alien.y = 0;
    ALIEN_DOWN_VELOCITY = 0.5;
    alien.loadTexture('alien');
    restartTypeGame();
}

// game flow of keyboard inputs
function getKeyboardInput(e) {

    if(e.key.toLowerCase() === option[currentLetterIndex]) {    // Make the input lower case, so there are no errors

        keyboardSounds.play(String(Math.floor(Math.random() * 4 + 1)));
        let newText = typing.text;
        newText = newText.replace("_", e.key);  // Replace the first character with the second argument (once)
        typing.setText(newText.toUpperCase());     // Show the word in upper case  
        currentLetterIndex += 1; 

        shootAlien();
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

    //  Create our Timer for each word
    timer = game.time.create(false);

    //  Set a TimerEvent to occur after X seconds
    timer.loop(DISAPPEARANCE_TIME, wordTimeOut, this);

    //  Start the timer running - this is important!
    timer.start();

    // Display and hide sprites for the correct and wrong answers
    error = game.add.sprite(game.camera.position.x + 50, game.camera.position.y + 50, 'error');
    error.anchor.setTo(0.5,0.5);
    error.scale.setTo(0.1);
    error.alpha = 0;

    correct = game.add.sprite(game.camera.position.x + 50, game.camera.position.y + 50, 'correct');
    correct.anchor.setTo(0.5,0.5);
    correct.scale.setTo(0.1);
    correct.alpha = 0;

    game.input.keyboard.onDownCallback = getKeyboardInput; // Calling getKeyboardInput when a key is pressed

    // Show the current console to be guessed
    consoleSprite = game.add.sprite(game.camera.position.x + game.camera.width / 2, 
                                    game.camera.position.y + game.camera.height / 3,
                                    options[currentWordIndex]);
    consoleSprite.alpha = 0;
    game.add.tween(consoleSprite).to( { alpha: 1 }, 100, "Linear", true);
console.log(currentWordIndex);
    // Prepare the current word
    option = options[currentWordIndex];

    typing = game.add.text(game.camera.position.x + game.camera.width / 1.5, 
                            game.camera.position.y + game.camera.height / 2, 
                            "_ ".repeat(option.length) , 
                            {fontSize: '20px', fill: '#FA2', font: 'Verdana'});
}

// Chooses new word and resets all timers and sprites
function restartTypeGame() {

    if (correctAnswers < maxCorrectWords & playingTheChallenge) {

        if (currentWordIndex > options.length-1) 
        currentWordIndex = 0;
        // Only show the words that were not completed
        while(doneWords[currentWordIndex]){
            if (currentWordIndex > options.length-1) 
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

        HUD.destroy();
        HUD = game.add.text(game.camera.position.x + HUD_X, 
                            game.camera.position.y + HUD_Y, 'Remaining time: ' + remainingTime, {font:'20px Krona One', fill:'#FFFFFF'});
        HUDupdate = setInterval(updateHUD, 1000);   // Reduce remaining time and update 
    }
    else {
        consoleSprite.destroy();
        timer.destroy();
        alien.destroy();
        typing.destroy();

        if (playingTheChallenge) {
        game.input.keyboard.enabled = true;
        game.input.keyboard.onDownCallback = null;
        level_2_completed = true;
        playingTheChallenge = false;
        }
    }
}

// NEED TO RESTART POSITION
function challengeFailed() {
    HUD.setText('TRY AGAIN :(')
    errorSound.play();
    playingTheChallenge = false;
    restartTypeGame();
    playingTheChallenge = true;
    remainingTime = THE_CHALLENGE_TIME_LIMIT / 1000;
    createAlien();
    createTypeGame();
    correctAnswers = 0;
    shuffle(options);
    console.log(options);
    setTimeout(challengeFailed, THE_CHALLENGE_TIME_LIMIT);
}

