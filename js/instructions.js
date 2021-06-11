let instructionNumber = 0;
var instructionsA,instructionsB,instructionsC,instructionsD;
var instructionSet = [];

var instrucText;

let instructionsState = {
    preload: loadAboutAssets,
    create: showInstructions
};

function loadAboutAssets() {
    game.load.image('backButton', 'assets/imgs/buttons/back.png');
    game.load.image('nextButton', 'assets/imgs/buttons/next.png');
    game.load.image('previousButton', 'assets/imgs/buttons/previous.png');
}

function showInstructions() {
    game.add.image(0, 0, 'bg');

    let textTitle = 'ESCAPE THE ARCADE: Instructions';
    let styleTitle = {
        font: 'Krona One',
        fontSize: '20pt',
        fontWeight: 'bold',
        fill: '#FFFFFF'
    };
    game.add.text(75, 25, textTitle, styleTitle);


    // ---------- INSTRUCTION SETS ----------
    // ----------------------------------------

    // INSTRUCTION SET A
    instructionsA = 'REAL LIFE PONG - AVOIDING HARM\n\n';
    instructionsA += 'You get caught up in a pong game, try to avoid all the pong balls that';
    instructionsA += 'will come at you and survive. UP, RIGHT and LEFT arrows are used for movement. Sometimes ';
    instructionsA += 'special red quick pong balls will come your way, so... WATCH OUT!';
    instructionSet.push(instructionsA);

    
    // INSTRUCTION SET B    
    instructionsB = 'CONSOLE INVASION- TIMED CHALLENGE\n\n';
    instructionsB += 'Save everyone\'s asses by killing 4 huge aliens that menace life on earth';
    instructionsB += '. You will have to write by pressing the letters the name of the console that corresponds to the displayed one.';
    instructionsB += ' No failed letters will be counted, so you can guess by pressing random keys!\n';
    instructionsB += '10 seconds per word and 30 seconds for the 4 words.';
    instructionSet.push(instructionsB);

    // INSTRUCTION SET c    
    instructionsC = 'TETRIS EFFECT - JUMP TO CROSS\n\n';
    instructionsC += 'The one and only Tetris game has been broken, the pieces now travel horizontally and need your help. ';
    instructionsC += 'Put the pieces together to traverse through this dangerous place where pixels will kill you.';
    instructionsC += 'Jump on a Tetris pieceso it moves until it reaches the next. When it does, both will disappear... Move swiftly!\n';
    instructionsC += 'You are allowed a maximum of 4 jumps.';
    instructionSet.push(instructionsC);

    // INSTRUCTION SET d    
    instructionsD = 'PART D - KILKILLKILLKILLKILLKILLLLLL';
    instructionSet.push(instructionsD);

    // TEXT BOX FOR INSTRUCTIONS
    instrucText = game.add.text(0 , 0, instructionsA, {
        font: '15pt Sniglet',

        fill: '#00ead3'
    });

    // Bounds for the boxes to format the text
    instrucText.setTextBounds(game.world.width / 4, 300, game.world.width / 2 + 10);    
    instrucText.boundsAlignH = 'center';
    instrucText.boundsAlignV = 'middle';
    instrucText.wordWrap = true;
    instrucText.wordWrapWidth = game.world.width / 2 - 60;
    

    // ---------- BUTTONS ----------
    // ------------------------------

    // BACK BUTTON
    let btnPlay = game.add.button(game.world.width / 2, game.world.height - 60, 'backButton',
        onBackButtonPressed);
    btnPlay.anchor.setTo(0.5, 0.5);

    // BUTTONS FOR CHANGING THE TEXT
    let nextInstructions = game.add.button(game.world.width - 100, game.world.height / 2, 'nextButton',
    nextInstruction);
    nextInstructions.anchor.setTo(0.5, 0.5);
    nextInstructions.scale.setTo(0.6);
    nextInstructions.events.onInputOver.add(mouseOver, this);
    nextInstructions.events.onInputOut.add(mouseOut, this);

    let previousInstructions = game.add.button(100, game.world.height / 2, 'previousButton',
    previousInstruction);
    previousInstructions.anchor.setTo(0.5, 0.5);
    previousInstructions.scale.setTo(0.6);
    previousInstructions.events.onInputOver.add(mouseOver, this);
    previousInstructions.events.onInputOut.add(mouseOut, this);

}


// ---------- FUNCTIONS  ----------
// ----------------------------------

function onBackButtonPressed() {
    game.state.start('init');
}

function overText(text, pointer) {
    text.fill = '#0e0eb3';
}

function outText(text, pointer) {
    text.fill = '#b60404';
}

function nextInstruction() {
    instructionNumber += 1;
    if (instructionNumber > 3)
        instructionNumber = 0;
    instrucText.setText(instructionSet[instructionNumber]);

}

function previousInstruction() {
    instructionNumber -= 1;
    if (instructionNumber < 0)
        instructionNumber = 3;
    instrucText.setText(instructionSet[instructionNumber]);
}