const SHIP_OFFSET_HOR = 150;
const SHIP_OFFSET_VER = 90;

let btnStart;
let imgStop;

let initState = {
    preload: preloadInit,
    create: createInit
};

function preloadInit () {
    game.load.image('playButton', 'assets/imgs/buttons/play.png');
    game.load.image('stop', 'assets/imgs/buttons/stop.jpg');
}

function createInit() {
    let textI = 'TIME VAULT ARCADE';
    
    let styleI = {font:'50px Krona One', fill:'#FFFFFF'};
    let title = game.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.2, textI, styleI);
    title.anchor.setTo(0.5, 0.5);

    /*  ESTO LO TENEMOS QUE METER EN UNA ESCENA DISTINTA
        const TEXT_OFFSET_HOR = 40;
        const TEXT_OFFSET_VER = 40;
    let textC = 'Credits:\n';     
    textC += '* Original craft pic created by "Fran" (Desarrollo XNA).\n';
    textC += '* Original UFO pic created by "0melapics" (Freepik.com).\n';
    textC += '* Original laser pic from Phaser tutorial "Invaders".\n';
    textC += '* Blast animation from Phaser tutorial "Invaders".\n';
    textC += '* Blast sound created by "dklon" (OpenGameArt.Com).\n';
    textC += '* Laser sound created by "dklon" (OpenGameArt.Com).';
    let styleC = {font:'16px Krona One', fill:'#0088FF'};
    let credits = game.add.text(TEXT_OFFSET_HOR, game.world.height-TEXT_OFFSET_VER, textC, styleC);
    credits.anchor.setTo(0, 1);*/

    // PLAY BUTTON
    let posX = game.world.width/2;
    let posY = game.world.height/2;
    btnStart = game.add.button(posX, posY, 'playButton', clickStart);
    btnStart.checkWorldBounds = true;
    btnStart.events.onOutOfBounds.add(startPlay, this);
    btnStart.anchor.setTo(0.5, 0.5);
    btnStart.scale.setTo(1.0);

    // OTHER BUTTON
    posY = game.world.centerY + 100;
    imgStop = game.add.image(posX, posY, 'stop');
    imgStop.anchor.setTo(0.5, 0.5);
    imgStop.scale.setTo(0.5);
}

function startPlay() {
    game.state.start('playTest');
}

const FREQUENCY = 1000/30;
function clickStart() {
    btnStart.inputEnabled = false;
    game.time.events.loop(
    FREQUENCY, moveButtonAndImage, this);
}

const DECREASE_Y = 8;
const DECREASE_X = 10;
function moveButtonAndImage() {
btnStart.y -= DECREASE_Y;
imgStop.x -= DECREASE_X;
}