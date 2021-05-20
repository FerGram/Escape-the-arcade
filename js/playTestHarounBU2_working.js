//Adding anims to Fer's playTest
//http://teseo.act.uji.es/~al394827/ProyectoWebTest/
const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 300;
const PLAYER_JUMP_VELOCITY = -350;

//World bounds/size
const WORLD_WIDTH = 100 * 16; //Get from Tiled
const WORLD_HEIGHT = 24 * 16; //Get from Tiled

let player;
let cursors;

let isWalking = false; //used to check if walking or not, and to set the proper anim.
let isFlipped = false; //Is he looking left?
let playerScale = 2; //Scale of player.

let map;
let layer;
let tileset;

let size = new Phaser.Rectangle();
let zoomAmount = 0;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    //Loading the spritesheet for the player
    game.load.spritesheet('player', './assets/imgs/SpriteSheet.png', 32, 32, 23);

    game.load.image('bgMain', './assets/imgs/bgMain.jpg');

    game.load.tilemap('map', './assets/levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/Terrain.png');

}

function createPlay() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //game.camera.scale.setTo(3, 3);
    //game.camera.visible = true;

    //game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    size.setTo(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    game.camera.focusOnXY(0, 0);

    game.camera.scale.x += zoomAmount;
    game.camera.scale.y += zoomAmount;

    game.camera.bounds.x = size.x * game.camera.scale.x;
    game.camera.bounds.y = size.y * game.camera.scale.y;

    game.camera.bounds.width = size.width * game.camera.scale.x;
    game.camera.bounds.height = size.height * game.camera.scale.y;

    game.stage.backgroundColor = '#18C4BC'; //Bluish

    createLevel();
    createPlayer();
    createKeyControls();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    game.physics.arcade.collide(player, layer); //Check for collison of player with level
    playerMovement();
}

function playerMovement() {
    player.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
        if (player.body.onFloor())
        {
            player.body.velocity.y = PLAYER_JUMP_VELOCITY;
        }
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -PLAYER_VELOCITY;
        if (!isWalking || !isFlipped){
            isWalking = true;
            isFlipped = true;
            player.scale.setTo(playerScale * -1, playerScale);
            player.animations.play('walk');
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = PLAYER_VELOCITY;
        if (!isWalking || isFlipped){
            isWalking = true;
            isFlipped = false;
            player.scale.setTo(playerScale, playerScale);
            player.animations.play('walk');
        }
    }
    else{
        if (isWalking){
            isWalking = false;
            player.animations.play('idle');
        }

    }
}

function createPlayer() {

    player = game.add.sprite(32, 32, 'player');

    game.physics.arcade.enable(player);
    game.physics.arcade.gravity.y = 450;

    player.body.bounce.y = 0.2;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    //Create animations
    player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7 ,8 ,9, 10], 12, true);
    player.animations.add('walk', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 12, true);

    player.animations.play('idle');
    player.scale.setTo(playerScale, playerScale);
    player.anchor.setTo(0.5, 0.5);
}

function createLevel(){
    //Create
    map = game.add.tilemap('map');
    map.addTilesetImage('Terrain', 'tiles');

    map.setCollisionBetween(0, 60);

    layer = map.createLayer('layer1');
    layer.setScale(2, 2);
    layer.resizeWorld();
    //layer.debug = true;

}