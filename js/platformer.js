const PLATFORM_VEL = 150;

let tetrisSoundCollision;
let tetrisSoundMovement;

function updatePlatformer() {
    //isGrounded = game.physics.arcade.collide(player, platforms) || game.physics.arcade.collide(player, movingPlatforms);

    // Part C
    game.physics.arcade.overlap(movingPlatforms, stationaryPlatforms, collisionOfPlatforms, null, this);
    if (firstTimeC) {
       //HUD.destroy();
       HUD = game.add.text(HUD_X, HUD_Y, 'Remaining jumps: ' + remainingJumps, {font:'20px Krona One', fill:'#FFFFFF'});
       HUD.fixedToCamera = true;
       firstTimeC = false;
    }
    updateHUDplatformer();
}

function updateHUDplatformer() {
    HUD.setText("Remaining jumps: " + remainingJumps);
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


    // Instance of the platform to be created
    let platform;
    let stationaryPlatform;

    for (let i = 1; i <= 3; i++) {
        let tetrisType = [];
        // Choose a random type of piece for the tetris piece
        let random = Math.floor(Math.random() * 3)
        if (random == 0) {
            tetrisType[0] = 'tetris1';
            tetrisType[1] = 'tetris2';
        }
        else if(random == 1){
            tetrisType[0] = 'tetris3';
            tetrisType[1] = 'tetris4';
        }
        else {
            tetrisType[0] = 'tetris5';
            tetrisType[1] = 'tetris6';
        }

        let yposition = Math.random() * (GAME_HEIGHT/2 + 200 - (GAME_HEIGHT/2 + 75)) + GAME_HEIGHT/2 + 75;
        platform = game.add.sprite(PLATFORMS_STARTING_X + i * 800, yposition, tetrisType[0]); // Cuidado con la X

        movingPlatforms.add(platform);
        platform.body.immovable = true;
        platform.body.onCollide = new Phaser.Signal();
        platform.body.onCollide.add(movePlatform, this);

        stationaryPlatform = game.add.sprite(platform.x + platform.width + 300, platform.y, tetrisType[1]);
        stationaryPlatforms.add(stationaryPlatform);
        stationaryPlatform.body.immovable = true;
    }
}

function createSoundsPlatformer() {  // This is called at the create phase of play.js
    tetrisSoundCollision = game.add.sound('tetrisCollision');
    tetrisSoundMovement = game.add.sound('tetrisMovement');
}

function collisionOfPlatforms(movPlat, statPlat){
    let timeToFit = 200; // Time to get the pieces together
    movPlat.body.velocity.x = 0;
    firstCol = true;
    posX = movPlat.x;

    // Watch out for different lenghts of the pieces
    if(movPlat.key != 'tetris3')
        game.add.tween(movPlat).to({x:posX + 43}, timeToFit, "Linear", true);
    else
        game.add.tween(movPlat).to({x:posX + 86}, timeToFit, "Linear", true);

    //movingPlatforms.removeChildAt(0);
    stationaryPlatforms.add(movPlat);
    setTimeout(disappearanceOfPlatforms, timeToFit + 500, movPlat, statPlat);
}

function disappearanceOfPlatforms(movPlat, statPlat) {
    tetrisSoundMovement.play();
    game.add.tween(movPlat).to({alpha:0}, 700, "Linear", true);
    game.add.tween(statPlat).to({alpha:0}, 700, "Linear", true);
    setTimeout(destroyPlatforms, 1500, movPlat, statPlat);   // destroy platforms when they disappear
}

function movePlatform(p) {
    tetrisSoundCollision.play();
    p.body.velocity.x = PLATFORM_VEL;
    p.body.onCollide = null;
}

function destroyPlatforms(mp, sp) {
    mp.destroy();
    sp.destroy();
}

function partCScore() {
    return remainingJumps;
}

function resetPlatforms() {
    movingPlatforms.destroy();
    HUD.destroy();
    stationaryPlatforms.destroy();
    remainingJumps = JUMP_LIMIT;
    createPlatforms();
    firstTimeC = true;
}