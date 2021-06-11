const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 800; //DEFAULT 500, changed for debugging
const PLAYER_JUMP_VELOCITY = 800;

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
let level_1_completed = true; //CHANGED TO TRUE JUST FOR DEBUGGING
let level_2 = false;
let level_2_created = false;
let level_2_completed = true;
let level_3 = false;
let level_3_created = false;
let level_3_completed = false;

let cameraTween;

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

    game.load.image('ground1','./assets/imgs/GreenSquare.png')
    game.load.spritesheet('player','./assets/imgs/SpriteSheet.png', 15, 23, 13);

    //-----THE CHALLENGE-----------------------------------
    game.load.image('alien', '/assets/imgs/alien.png');
    game.load.image('alien death', '/assets/imgs/alienDeath.png');
    game.load.image('alien hit', '/assets/imgs/alienHit.png');
    game.load.image('error', '/assets/imgs/error.png');
    game.load.image('correct', '/assets/imgs/Consolas.gif');

    game.load.image('bullet', '/assets/imgs/bullet.png');

    game.load.image('nintendo 64', '/assets/imgs/consoles/nintendo64.png');
    game.load.image('playstation one', '/assets/imgs/consoles/playstationOne.png');
    game.load.image('dreamcast', '/assets/imgs/consoles/dreamcast.png');
    game.load.image('xbox', '/assets/imgs/consoles/xbox.png');
    game.load.image('nes', '/assets/imgs/consoles/nes.png');
    game.load.image('gameboy', '/assets/imgs/consoles/gameboy.png');
    game.load.image('playstation two', '/assets/imgs/consoles/playstationTwo.png');
    game.load.image('snes', '/assets/imgs/consoles/snes.png');
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createCameraSet();
    createLevel();
    createPlayer();
    createKeyControls();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    isGrounded = game.physics.arcade.collide(player, layer);

    console.log(player.x);

    //#region LEVEL 1

        //Set level_1 in progress           DEFAULT VALUES: 1950 & 2050
        if (!level_1 & !level_1_completed & player.body.x > 1950 & player.body.x < 2050) level_1 = true;

        //Set level_1 completed
        if (level_1_completed & level_1) {
            level_1 = false;
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }

        //Update level_1
        if (level_1){

            if(!level_1_created) {
                letPlayerMove = false;
                game.camera.unfollow();
                game.time.events.add(6000, function()
                                        {letPlayerMove = true;});

                createPONG();
                level_1_created = true;
            }

            updatePONG();
        } 

    //#endregion
    
    //#region LEVEL 2

        //Set level_2 in progress           DEFAULT VALUES: 5600 & 6200
        if (!level_2 & !level_2_completed & player.body.x > 5950 & player.body.x < 6900) {

            level_2 = true; 

            letPlayerMove = false;
            game.camera.unfollow();

            cameraTween = game.add.tween(game.camera).to( { x: 5500 }, 2000, "Linear", true, 0, 0, false);
            cameraTween.onComplete.add(function(){

                level_2_created = true;
                createTheChallenge();
            });
        }

        //Set level_2 completed
        if (level_2_completed & level_2) {

            level_2 = false;
            letPlayerMove = true;
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }

        //Update level_2
        if (level_2){

            if(level_2_created) updateTheChallenge();
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
        if (player.body.onFloor() && cursors.up.isDown){
            player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
            isGrounded = false;
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

    //Little tween to the scale at start
    game.add.tween(player.scale).to( { x: playerScale, y: playerScale }, 400, "Back.easeInOut", true, 0, 0, false);
}

function createLevel() {

    map = game.add.tilemap('map');
    map.addTilesetImage('TF', 'tiles');

    //Sets collision to all tile layers except the ones below
    map.setCollisionByExclusion([-1, 196, 197, 199, 200, 201, 421, 422, 453, 454, 544]); 

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
