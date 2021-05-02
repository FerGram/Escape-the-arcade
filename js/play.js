let player;
const HUD_HEIGHT = 50;
let cursors;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;
let stars;
const LASERS_GROUP_SIZE = 40;
let lasers;


let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('square','imgs/blank_square.jpg');
}

function createPlay() {

    createPlayer();
    createKeyControls();
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    playerMovement();
    //stars.tilePosition.y += 1;  // stars.tilePosition y stars.y son diferentes ejjejeje que chulo
}

function playerMovement() {
    if (cursors.left.isDown)
        player.body.velocity.x = -PLAYER_VELOCITY;
    else if (cursors.right.isDown)
        player.body.velocity.x = PLAYER_VELOCITY;
    else player.body.velocity.x = 0;

    if (cursors.up.isDown)
        player.body.velocity.y = PLAYER_JUMP_VELOCITY;
 }

function createPlayer() {
    let x = game.world.centerX;
    let y = game.world.height - 500;//HUD_HEIGHT;
    player = game.add.sprite(x, y, 'square');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.2, 0.2);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1400;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
}