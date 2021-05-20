//Adding anims to Fer's playTest
//http://teseo.act.uji.es/~al394827/ProyectoWebTest/
const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;

//World bounds/size
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 900;

let player;
let cursors;
let platforms;
let ground;
let isGrounded = false;

let isWalking = false; //used to check if walking or not, and to set the proper anim.
let playerScale = 2; //Scale of player.

let map;
let layer;
let tileset;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('ground','./assets/imgs/GreenSquare.png');
    game.load.image('ground1','./assets/imgs/GreenSquare.png'); //Test for fixedToCamera for UI

    //Loading the spritesheet for the player
    game.load.spritesheet('player', './assets/imgs/SpriteSheet.png', 32, 32, 23);

    game.load.image('bgMain', './assets/imgs/bgMain.jpg');

    game.load.tilemap('map', './assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/Terrain.png');

}

function createPlay() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    createLevel();

    ground1 = game.add.sprite(5, 5, 'ground1'); //Test for fixedToCamera for UI
    ground1.fixedToCamera = true;
    ground1.scale.setTo(0.1, 0.1);

    createPlayer();
    createKeyControls();


    game.camera.follow(player);
    player.scrollFactorX = 0;
    player.scrollFactorY = 0;
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    game.physics.arcade.collide(player, layer);
    playerMovement();
}

function playerMovement() {
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
    if (cursors.up.isDown && isGrounded && player.body.touching.down){
        //player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
        isGrounded = false;
    }
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

function createPlatforms() {
    console.log("Yoooloo");

}

function createLevel(){
    //game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    //let bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bgMain');
    //bg.scrollFactorX = 0.7;
    //bg.scrollFactorY = 0.7;

    //Create
    map = game.add.tilemap('map');
    map.addTilesetImage('Terrain', 'tiles');


    layer = map.createLayer('layer1');
    layer.scale.setTo(4, 4);

    layer.debug = true;
    map.setCollisionBetween(0, 999, layer);
}