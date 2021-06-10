const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;

let player;
let cursors;
let platforms;
let ground;
let isGrounded = false;
let isWalking = false;
let isFlipped = false; //Is he looking left?
let playerScale = 2; 
let letPlayerMove = true;

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
let level_2_completed = false;
let level_3 = false;
let level_3_created = false;
let level_3_completed = false;


let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {

    //------GENERAL-----------------------------------------
    game.load.image('bgMain', './assets/imgs/bgMain.jpg');

    game.load.tilemap('map', './assets/levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/Terrain.png');

    //------PONG--------------------------------------------
    game.load.image('ball','/assets/imgs/WhiteSquare.jpg');
    game.load.image('fireball','/assets/imgs/RedSquare.jpg');
    game.load.image('middle','/assets/imgs/WhiteSquare.jpg');
    game.load.image('players','/assets/imgs/WhiteSquare.jpg');

    game.load.image('ground1','./assets/imgs/GreenSquare.png')
    game.load.spritesheet('player','./assets/imgs/SpriteSheet.png', 32, 32, 23);

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
    createPlayer();
    createLevel();
    createKeyControls();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    isGrounded = game.physics.arcade.collide(player, layer);

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

        //Set level_2 in progress           DEFAULT VALUES: 3450 & 3550
        if (!level_2 & !level_2_completed & player.body.x > 3450 & player.body.x < 3550) level_2 = true; 

        //Set level_2 completed
        if (level_2_completed & level_2) {
            level_2 = false;
        }

        //Update level_2
        if (level_2){

            if(!level_2_created) {
                
                createTheChallenge();
                level_2_created = true;
            }

            updateTheChallenge();
        } 

    //#endregion
    
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
    let x = game.world.centerX;
    let y = game.world.height - 500;

    player = game.add.sprite(x, y, 'player');

    //Create animations
    player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7 ,8 ,9, 10], 12, true);
    player.animations.add('walk', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 12, true);

    player.animations.play('idle');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(playerScale, playerScale);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 1400;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.enableBody = true;
}

function createLevel() {

    map = game.add.tilemap('map');
    map.addTilesetImage('Terrain', 'tiles');

    map.setCollisionBetween(0, 60);

    layer = map.createLayer('layer1');
    layer.setScale(2, 2);
    layer.resizeWorld();
}
