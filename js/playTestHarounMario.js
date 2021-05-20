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

//var map;
//var tileset;
//var layer;
var p;
//var cursors;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};



function preloadPlay() {

    game.load.tilemap('mario', './assets/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/super_mario.png');
    game.load.image('player', './assets/phaser-dude.png');

}



function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    //  14 = ? block
    // map.setCollisionBetween(14, 15);

    map.setCollisionBetween(15, 16);
    map.setCollisionBetween(20, 25);
    map.setCollisionBetween(27, 29);
    map.setCollision(40);

    layer = map.createLayer('World1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    p = game.add.sprite(32, 32, 'player');

    game.physics.enable(p);

    game.physics.arcade.gravity.y = 250;

    p.body.bounce.y = 0.2;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;

    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();

}

function updatePlay() {

    game.physics.arcade.collide(p, layer);

    p.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
        if (p.body.onFloor())
        {
            p.body.velocity.y = -200;
        }
    }

    if (cursors.left.isDown)
    {
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        p.body.velocity.x = 150;
    }

}

function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(p, 32, 320);

}
