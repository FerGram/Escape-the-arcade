// Creating part's B game mechanic

const DISAPPEARANCE_TIME = 5000; // Five secons instead of the wanted 30
const TIMEOUTNEXTWORD = 2000;
const maxCorrectWords = 4;
const BULLET_VELOCITY = -800;
let ALIEN_DOWN_VELOCITY = 0.5;

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

let bullets; //Phaser group containing bullet pool
let bulletCounter = 0;


// CREATE PHASE -- CREATING ALL SPRITES AND OTHER STUFF
function createTheChallenge() {

    createAlien();
    createBullets();

    // Only shuffle the first time around
    if(correctAnswers == 0){
        shuffle(options);
        console.log(options);
    }
    createTypeGame();
}

function updateTheChallenge() {

    if(correctAnswers < maxCorrectWords) alienMovement(); 

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

function createAlien() {
    alien = game.add.sprite(player.x + 680, 200, 'alien');
    alien.anchor.setTo(0.5, 0.5);
    alien.scale.setTo(0.1);

    game.physics.arcade.enable(alien);
    alien.enableBody = true;
}

function alienMovement() {
    alien.y += ALIEN_DOWN_VELOCITY;
}

// When the word is not completed
function wordTimeOut() {
    game.input.keyboard.enabled = false;
    error.alpha = 1;
    game.add.tween(error).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    timer.pause();
    ALIEN_DOWN_VELOCITY = 0;
    setTimeout(clearWordScreen, TIMEOUTNEXTWORD);
}
// When the word is completed
function wordCorrectAnswer() {
    correct.alpha = 1;
    game.add.tween(correct).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    timer.pause();
    ALIEN_DOWN_VELOCITY = 0;

    bullets.children.forEach(bullet => { //Reset every bullet
        bullet.body.velocity.y = 0;
        bullet.alpha = 0;
        bullet.y = 700;
    });

    game.time.events.add(310, function(){alien.loadTexture('alien death')});
    game.time.events.add(500, function(){setTimeout(clearWordScreen, TIMEOUTNEXTWORD)});

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

    if(e.key.toLowerCase() === option[currentLetterIndex]) {    // Make the input lower case, so there is no errors
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

    //  Create our Timer
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
    consoleSprite = game.add.sprite(game.camera.position.x + game.camera.width / 4, 
                                    game.camera.position.y + game.camera.height / 3,
                                    options[currentWordIndex]);
    consoleSprite.alpha = 0;
    game.add.tween(consoleSprite).to( { alpha: 1 }, 100, "Linear", true);

    // Prepare the current word
    option = options[currentWordIndex];

    typing = game.add.text(game.camera.position.x + game.camera.width/2, 
                            game.camera.position.y + game.camera.height / 2, 
                            "_ ".repeat(option.length) , 
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
    }
    else {

        consoleSprite.destroy();
        timer.destroy();
        alien.destroy();
        typing.destroy();
        //game.state.start('hof');
        game.input.keyboard.enabled = true;
        game.input.keyboard.onDownCallback = null;

        level_2_completed = true;
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