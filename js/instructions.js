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

    // INSTRUCTION SET A
    instructionsA = 'You will have to collect all of the stars before the timer runs out to ';
    instructionsA += 'exit each level. Be aware of the enemies, which can hurt and damage you. ';
    instructionsA += 'If you lose your health completely you will die and you will lose time. ';
    instructionsA += 'You can kill your oponent by jumping (repeatedly) over its head. ';
    instructionsA += 'Get first-aid boxes to recover health. Enjoy the journey and good luck!';
    instructionSet.push(instructionsA);

    // INSTRUCTION SET B    
    instructionsB = 'soy tonto JASLKDJFGSALDNJKFHBVAZLUFG';
    instructionSet.push(instructionsB);

    // INSTRUCTION SET c    
    instructionsC = 'NO SÉ QUE DIGO';
    instructionSet.push(instructionsC);

    // INSTRUCTION SET d    
    instructionsD = 'este es el último :(';
    instructionSet.push(instructionsD);

    // TEXT BOX FOR INSTRUCTIONS
    instrucText = game.add.text(0 , 0, instructionsA, {
        font: '12pt Basteleur Bold',
        fill: '#add8e6'
    });
    instrucText.setTextBounds(game.world.width / 4, 300, game.world.width / 2 + 10);
    instrucText.boundsAlignH = 'left';
    instrucText.boundsAlignV = 'middle';
    instrucText.wordWrap = true;
    instrucText.wordWrapWidth = game.world.width / 2 - 60;
    
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