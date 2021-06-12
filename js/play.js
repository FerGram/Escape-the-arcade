const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 600; //DEFAULT 500, changed for debugging
const PLAYER_JUMP_VELOCITY = 650;
const JUMP_LIMIT = 4;

const CHECKPOINT_A_XPOS = 100;
const CHECKPOINT_B_XPOS = 100;
const CHECKPOINT_C_XPOS = 8000;

let remainingJumps = JUMP_LIMIT;

let player;
let cursors;
let platforms;
let ground;
let isGrounded = false;
let isWalking = false;
let isFlipped = false; //Is he looking left?
let playerScale = 3.5; 
let letPlayerMove = true;

let tweeningPlayer = false; //Also used in the Hall state animation

const WORLD_WIDTH = 100 * 16; //Get from Tiled
const WORLD_HEIGHT = 24 * 16; //Get from Tiled

let map;
let layer;
let tileset;

let size = new Phaser.Rectangle();
let zoomAmount = 0;


let level_1 = false;
let level_1_created = false;
let level_1_completed = false; 
let level_2 = false;
let level_2_created = false;
let level_2_completed = false;
let level_3 = false;
let level_3_created = false;
let level_3_completed = false;

let partA_score;
let partB_score;
let partC_score;
let partD_score;

let cameraTween;

// ~~PART C VARIABLES~~
const PLATFORMS_STARTING_X = 7500;

let movingPlatforms;
let stationaryPlatforms;

let firstTimeC = true;

// GAME
let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {

    //------GENERAL-----------------------------------------
    game.load.image('bgMain', './assets/imgs/bgMain.jpg');

    game.load.tilemap('map', './assets/levels/level4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/TF.png');
    game.load.image('arcadeMachine','./assets/imgs/arcadeMachine.png');

    //------PONG--------------------------------------------
    game.load.image('ball','/assets/imgs/WhiteSquare.jpg');
    game.load.image('fireball','/assets/imgs/RedSquare.jpg');
    game.load.image('middle','/assets/imgs/WhiteSquare.jpg');
    game.load.image('players','/assets/imgs/WhiteSquare.jpg');

    game.load.image('battery0','/assets/imgs/Battery0.png');
    game.load.image('battery1','/assets/imgs/Battery1.png');
    game.load.image('battery2','/assets/imgs/Battery2.png');
    game.load.image('battery3','/assets/imgs/Battery3.png');
    game.load.image('battery4','/assets/imgs/Battery4.png');
    game.load.image('battery5','/assets/imgs/Battery5.png');
    game.load.image('battery6','/assets/imgs/Battery6.png');

    game.load.image('ground1','./assets/imgs/GreenSquare.png')
    game.load.spritesheet('player','./assets/imgs/SpriteSheet.png', 15, 23, 13);

    //-----THE CHALLENGE-----------------------------------
    game.load.image('bullet', '/assets/imgs/bullet.png');

    game.load.image('alien', '/assets/imgs/alien.png');
    game.load.image('error', '/assets/imgs/error.png');
    game.load.image('correct', '/assets/imgs/Consolas.gif');

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

    //----- PLATFORMS -----------------------------------
    game.load.image('tetris1', '/assets/imgs/Tetris1.png');
    game.load.image('tetris2', '/assets/imgs/Tetris2.png');
    game.load.image('tetris3', '/assets/imgs/Tetris3.png');
    game.load.image('tetris4', '/assets/imgs/Tetris4.png');
    game.load.image('tetris5', '/assets/imgs/Tetris5.png');
    game.load.image('tetris6', '/assets/imgs/Tetris6.png');
    game.load.audio('tetrisCollision', '/assets/sounds/tetris_clear.mp3');
    game.load.audio('tetrisMovement', '/assets/sounds/tetris_movement.mp3');
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createCameraSet();
    createLevel();
    createPlayer();
    createKeyControls();
    createSoundsPlatformer();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {

    isGrounded = game.physics.arcade.collide(player, layer) || game.physics.arcade.collide(player, movingPlatforms) 
                                                            || game.physics.arcade.collide(player, stationaryPlatforms);

    //#region LEVEL 1

        //Set level_1 in progress           DEFAULT VALUES: 1950 & 2050
        if (!level_1 & !level_1_completed & player.body.x > 2600 & player.body.x < 2800) level_1 = true;

        //Set level_1 completed
        if (level_1_completed & level_1) {
            level_1 = false;
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }

        //Update level_1
        if (level_1){

            if(!level_1_created) {
                letPlayerMove = false;
                createPONG();

                game.camera.unfollow();
                hitTimer.add(6000, function()
                                        {letPlayerMove = true;});
                level_1_created = true;
            }

            updatePONG();
        } 

    //#endregion
    
    //#region LEVEL 2

        //Set level_2 in progress           DEFAULT VALUES: 5600 & 6200
        if (!level_2 & !level_2_completed & player.body.x > 5950 & player.body.x < 6900) {

            console.log('LEVEL 2');
            level_2 = true; 

            letPlayerMove = false;
            game.camera.unfollow();


            //Add text: 'TYPE THE CONSOLES'
            stageMiddle = game.camera.position.x + game.camera.width/2;

            let instruction = game.add.text(stageMiddle - 350, 3*GAME_HEIGHT/4, 
                'TYPE THE CONSOLES', {font:'50px Verdana', fill: "#FFFFFF"});

            instruction.alpha = 0;
            game.add.tween(instruction).to( { alpha: 1 }, 400, "Linear", true, 0, 0, false);


            //Tween camera
            cameraTween = game.add.tween(game.camera).to( { x: 5500 }, 2000, "Linear", true, 0, 0, false);
            cameraTween.onComplete.add(function(){

                level_2_created = true;
                instruction.destroy();
                createTheChallenge();
            });
        }

        //Set level_2 completed
        if (level_2_completed & level_2) {

            level_2 = false;
            letPlayerMove = true;
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
            partB_score = partBScore();
            createPlatforms();
        }

        //Update level_2
        if (level_2){

            if(level_2_created) updateTheChallenge();
        } 
        partB_score = partBScore();
    //#endregion

    //#region LEVEL 3
                            // Start at 8300
    if(!level_3_completed && level_2_completed && player.body.x > CHECKPOINT_C_XPOS + 300 ) {
        updatePlatformer();
        level_3 = true;
        if (player.body.y > GAME_HEIGHT/2 + 250) {
            player.y = game.world.height - 500;
            player.x = CHECKPOINT_C_XPOS;
            resetPlatforms();
            level_3 = false;
        }
    }
    
    if (player.body.x > 10700) {
        level_3_completed = true;
        partC_score = partCScore();
        level_3 = false;    // Stop decresing number of jumps
        remainingJumps = 1; // Reset the remaining jumps
    }

    //#endregion

    //END GAME
    if (player.body.x > 10800 & !tweeningPlayer){

        letPlayerMove = false;
        tweeningPlayer = true;
        game.time.events.add(2000, tweenPlayer); //Method of HallState
    }
    
    playerMovement();
}

function playerMovement() {
    if (letPlayerMove){
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
        //Jumping
        if ( isGrounded && cursors.up.isDown && remainingJumps > 0){ //player.body.onFloor()
            player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
            isGrounded = false;
            if (level_3) { // for the limit on the jumps of part 3
                remainingJumps -= 1;
                updateHUDplatformer();
            }
        }
    }
    else{
        player.body.velocity.x = 0;
        player.animations.play('idle');
    }
}

function createCameraSet(){
    size.setTo(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    game.camera.focusOnXY(0, 0);

    game.camera.scale.x += zoomAmount;
    game.camera.scale.y += zoomAmount;

    game.camera.bounds.x = size.x * game.camera.scale.x;
    game.camera.bounds.y = size.y * game.camera.scale.y;

    game.camera.bounds.width = size.width * game.camera.scale.x;
    game.camera.bounds.height = size.height * game.camera.scale.y;

    game.stage.backgroundColor = '#18C4BC'; //Bluish

}

function createPlayer() {

    let x = 200;                            //Starting point of world 
    let y = game.world.height - 500;

    player = game.add.sprite(x, y, 'player');

    //Create animations
    player.animations.add('idle', [0, 1, 2, 3, 4], 8, true);
    player.animations.add('walk', [5, 6, 7, 8], 10, true);

    player.animations.play('idle');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(playerScale, playerScale);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 1400;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.enableBody = true;
    player.smoothed = false;

    //Little tween to the scale at start
    game.add.tween(player.scale).to( { x: playerScale, y: playerScale }, 400, "Back.easeInOut", true, 0, 0, false);
}

function createLevel() {

    map = game.add.tilemap('map');
    map.addTilesetImage('TF', 'tiles');

    //Sets collision to all tile layers except the ones below
    map.setCollisionByExclusion([-1, 0, 1, 2, 3, 196, 197, 199, 200, 201, 208, 421, 422, 453, 454, 543, 544, 545]); 

    layer = map.createLayer('layer1');
    layer.setScale(2, 2);
    layer.resizeWorld();
    //layer.debug = true;

    arcadeMachine = game.add.sprite(10900, 715, 'arcadeMachine');
    arcadeMachine.anchor.setTo(0.5, 0.5);
    arcadeMachine.scale.setTo(0.25, 0.25);
}

function tweenPlayer(){
    


    //ELEVATE PLAYER
    let completed = game.add.tween(player).to( { y: arcadeMachine.y - 200 }, 1000, "Back.easeInOut", true, 0, 0, false);
    game.add.tween(player).to( { x: player.x - 50 }, 1000, "Back.easeIn", true, 0, 0, false);
    game.add.tween(player).to( { angle: 1200 }, 1000, "Back.easeOut", true, 500, 0, false);



    //WHEN FINISHED ELEVATING, REDUCE ITS SIZE AND TWEEN IT TO THE ARCADE MACHINE. THEN, DESTROY IT AND START 'play'.
    completed.onComplete.add(function(){

        game.add.tween(player.scale).to( { x: 0.25, y: 0.25 }, 200, "Back.easeInOut", true, 0, 0, false);
        game.add.tween(player).to( { y: arcadeMachine.y }, 200, "Sine.easeIn", true, 0, 0, false);
        game.add.tween(player).to( { x: arcadeMachine.x }, 200, "Sine.easeIn", true, 0, 0, false);

        game.time.events.add(500, function(){

            player.kill();
            game.camera.unfollow();
        })

        //game.time.events.add(2000, ); //TODO FINISH
    });

}
