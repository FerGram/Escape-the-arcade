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
    game.load.image('instructions', 'assets/imgs/buttons/instructions.png');
}

function createInit() {
    let textI = 'ESCAPE THE ARCADE';
    let styleI = {font:'50px Krona One', fill:'#FFFFFF'};
    let title = game.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.2, textI, styleI);
    title.anchor.setTo(0.5, 0.5);
    
    textI = "A game made by: Haroun Guechairi, Marc Pitarch\n& Fernando Gramage";
    styleI = {font:'25px Krona One', fill:'#FFFFFF', align:'center'};
    let text = game.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.4, textI, styleI);
    text.anchor.setTo(0.5, 0.5);

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
    let posY = game.world.height/2 + 100;
    btnStart = game.add.button(posX, posY, 'playButton', startHall);
    btnStart.checkWorldBounds = true;
    // btnStart.events.onOutOfBounds.add(startPlay, this);
    btnStart.anchor.setTo(0.5, 0.5);
    btnStart.scale.setTo(1.0);
    btnStart.events.onInputOver.add(mouseOver, this);
    btnStart.events.onInputOut.add(mouseOut, this);

    // OTHER BUTTON
    posY += btnStart.height + 50;
    btnAbout = game.add.button(posX, posY,
        'instructions', onAboutButtonPressed);
    btnAbout.anchor.setTo(0.5, 0.5);
    btnAbout.scale.setTo(0.75);
    btnAbout.events.onInputOver.add(mouseOver, this);
    btnAbout.events.onInputOut.add(mouseOut, this);
    /*imgStop = game.add.image(posX, posY, 'stop');
    imgStop.anchor.setTo(0.5, 0.5);
    imgStop.scale.setTo(0.5);
    imgStop.scale.setTo(0.5);*/
}

function startHall() {
    game.state.start('play');
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