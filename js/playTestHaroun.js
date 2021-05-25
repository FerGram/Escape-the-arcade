//Adding anims to Fer's playTest

//const { TileSprite } = require("phaser-ce");

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

let gun;
let gunScale = 1;
let gunOffsetX = 2;
let gunOffsetY = 7;

let bullet;
let bulletScale = 1;

let fireSpeed = 50; //firerate
let fireCooldown = 0; //var to wait between fires.

let size = new Phaser.Rectangle();
let zoomAmount = 0;

//paralax
let sky;
let rocks;
let clouds;
let trees;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay,
    render: renderPlay
};

function preloadPlay() {
    //Loading the spritesheet for the player
    game.load.spritesheet('player', './assets/imgs/SpriteSheet.png', 32, 32, 23);

    //Tilemap and level
    game.load.tilemap('map', './assets/levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/Terrain.png');

    //Ak-47 and bullet
    game.load.spritesheet('gun', './assets/imgs/AK47.png', 84, 30, 20);
    game.load.image('bullet', './assets/imgs/bullet.png');

    //paralax
    game.load.image('sky', './assets/imgs/layer06_sky.png');
    game.load.image('rocks', './assets/imgs/layer05_rocks.png');
    game.load.image('clouds', './assets/imgs/layer04_clouds.png');
    game.load.image('trees', './assets/imgs/layer03_trees.png');
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

    //game.stage.backgroundColor = '#18C4BC'; //Bluish

    createBackground();
    createLevel();
    createPlayer();
    createKeyControls();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    createGun();
    createBullets();

    gun.position.setTo(gunOffsetX + 150, gunOffsetY + 150);
}

function createKeyControls() {
    //game.input.mouse.capture = false;

    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    game.physics.arcade.collide(player, layer); //Check for collison of player with level
    playerMovement();

    gun.position.setTo(player.position.x + gunOffsetX, player.position.y + gunOffsetY);
    gunRotation();

    if (game.input.activePointer.leftButton.isDown){
        shootAK47();
    }
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
        scrollBackground(1); //oposite dir of player
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
        scrollBackground(-1); //oposite dir of player
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

    player = game.add.sprite(32, 700, 'player');
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

function createGun(){
    gun = game.add.sprite(100, 100, 'gun');

    gun.animations.add('shoot', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 24, false);
    gun.anchor.setTo(0.5, 0.5);
    gun.scale.setTo(-1 * gunScale, gunScale);
}

function createBullets(){
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('body.allowGravity', false);
}

function gunRotation(){
    gun.rotation = game.physics.arcade.angleToPointer(gun);
    if (gun.angle < -90 || gun.angle > 90){ //TODO add bool to check if it is already rotated.
        gun.scale.setTo(gunScale * -1, gunScale * -1);
    }
    else{
        gun.scale.setTo(gunScale * -1, gunScale);
    }
}

function createLevel(){
    //Create
    map = game.add.tilemap('map');
    map.addTilesetImage('Terrain', 'tiles');

    map.setCollisionByExclusion([88, 89, 90, 91, 110, 111, 112, 113, 132, 133, 134, 135]); //Update in BU2

    layer = map.createLayer('layer1');
    layer.setScale(2, 2);
    layer.resizeWorld();
    //layer.debug = true;
}

function renderPlay(){
    game.debug.spriteInfo(gun, 32, 32);

}

function createBackground(){
    sky = game.add.tileSprite(0, 0, 1920, 1080, 'sky');
    rocks = game.add.tileSprite(0, 0, 1920, 1080, 'rocks');
    clouds = game.add.tileSprite(0, 0, 1920, 1080, 'clouds');
    trees = game.add.tileSprite(0, 0, 1920, 1080, 'trees');

    sky.fixedToCamera = true;
    rocks.fixedToCamera = true;
    clouds.fixedToCamera = true;
    trees.fixedToCamera = true;
}

function scrollBackground(dir){
    sky.tilePosition.x += 1 * dir;
    rocks.tilePosition.x += 2 * dir;
    clouds.tilePosition.x += 3 * dir;
    trees.tilePosition.x += 4 * dir;
}

function shootAK47(){

    if (game.time.now > fireCooldown && bullets.countDead() > 0){
        gun.animations.play('shoot');

        fireCooldown = game.time.now + fireSpeed;

        let bullet = bullets.getFirstDead();

        bullet.reset(gun.x + 24, gun.y - 16);
        bullet.rotation = gun.rotation;
        game.physics.arcade.moveToPointer(bullet, 700);
    }


}

