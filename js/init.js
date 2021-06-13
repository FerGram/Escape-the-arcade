const SHIP_OFFSET_HOR = 150;
const SHIP_OFFSET_VER = 90;

let btnStart;
let imgStop;
let imgLogo;

let firstTime = true;;

let mainTheme;
let startSound;

let initState = {
    preload: preloadInit,
    create: createInit
};

function preloadInit () {
    game.load.image('playButton', 'assets/imgs/buttons/play.png');
    game.load.image('instructions', 'assets/imgs/buttons/instructions.png');
    game.load.image('imgLogo', './assets/imgs/EscapeTheArcadeLogo.png');

    game.load.audio('startSound', './assets/sounds/startsound.mp3');
    game.load.audio('mainTheme', './assets/sounds/mainTheme.mp3');
}

function createInit() {

    let imgLogo = game.add.image(GAME_WIDTH/2, GAME_HEIGHT * 0.3, 'imgLogo')
    imgLogo.anchor.setTo(0.5, 0.5);
    imgLogo.scale.setTo(0.5, 0.5);

    /* let textI = 'ESCAPE THE ARCADE';     TEXT TITLE
    let styleI = {font:'50px Krona One', fill:'#FFFFFF'};
    let title = game.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.2, textI, styleI);
    title.anchor.setTo(0.5, 0.5);
    
    textI = "A game made by: Haroun Guechairi, Marc Pitarch\n& Fernando Gramage";
    styleI = {font:'25px Krona One', fill:'#FFFFFF', align:'center'};
    let text = game.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.4, textI, styleI);
    text.anchor.setTo(0.5, 0.5); */

    // PLAY BUTTON
    let btnposX = game.world.width/2;
    let btnposY = game.world.height/2 + 200;
    btnStart = game.add.button(btnposX, btnposY, 'playButton', onStartButtonPressed);
    btnStart.checkWorldBounds = true;

    btnStart.anchor.setTo(0.5, 0.5);
    btnStart.scale.setTo(1.0);
    btnStart.events.onInputOver.add(mouseOver, this);
    btnStart.events.onInputOut.add(mouseOut, this);

    // OTHER BUTTON
    btnposY += btnStart.height + 50;
    btnAbout = game.add.button(btnposX, btnposY,
        'instructions', onAboutButtonPressed);
    btnAbout.anchor.setTo(0.5, 0.5);
    btnAbout.scale.setTo(0.75);
    btnAbout.events.onInputOver.add(mouseOver, this);
    btnAbout.events.onInputOut.add(mouseOut, this);

    // SOUNDS
    
    if (firstTime){
        startSound = game.add.sound('startSound');
    mainTheme = game.add.sound('mainTheme');
        mainTheme.play();
        firstTime = false;
    }
       
}

function onStartButtonPressed() {
    startSound.play();
    game.camera.fade(0x000000, 4000);
    btnStart.events.destroy();
    btnAbout.events.destroy();
    setTimeout(startHall, 1000);
}

function startHall() {
    mainTheme.stop();
    game.state.start('hall');
}

const FREQUENCY = 1000/30;
function clickStart() {
    btnStart.inputEnabled = false;
    game.time.events.loop(
    FREQUENCY, moveButtonAndImage, this);
}

function mouseOver(button) {
    button.scale.setTo(button.scale.x*1.5);
}

function mouseOut(button) {
    button.scale.setTo(button.scale.x*2/3);
}

function onAboutButtonPressed() {
    // Add the instruction required to start the 'about' state
    game.state.start('instructions');
}