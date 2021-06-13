let btnStartAgain;

let endState = {
    preload: preloadEnd,
    create: createEnd
};

function preloadEnd () {
    game.load.image('gameFinished', '/assets/imgs/gameFinished.png')
    game.load.image('playAgain', '/assets/imgs/buttons/playAgain.png')
}

function createEnd() {
    
    let bgImg = game.add.sprite(GAME_WIDTH/2, GAME_HEIGHT/2, 'gameFinished');
    bgImg.anchor.setTo(0.5,0.5);

    let textI = "Total score: " + (partA_score + partB_score + partC_score + partD_score)
            + "\n\nTime: " + timeToComplete / 1000 + " seconds";
    let styleI = {font:'25px Krona One', fill:'#FFFFFF'};
    let text = game.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, textI, styleI);
    text.anchor.setTo(0.5, 0.5);

    // PLAY AGAIN BUTTON
    let posX = game.camera.width/2;
    let posY = game.camera.height * 0.7;
    btnStartAgain = game.add.button(posX, posY, 'playAgain', startHallAgain);
    btnStartAgain.checkWorldBounds = true;

    btnStartAgain.anchor.setTo(0.5, 0.5);
    btnStartAgain.scale.setTo(1.0);
    btnStartAgain.events.onInputOver.add(mouseOver, this);
    btnStartAgain.events.onInputOut.add(mouseOut, this);
}

function startHallAgain() {
    worldMusic.fadeOut(500);
    game.state.start('hall');
}

function mouseOver(button) {
    button.scale.setTo(button.scale.x*1.5);
}

function mouseOut(button) {
    button.scale.setTo(button.scale.x*2/3);
}