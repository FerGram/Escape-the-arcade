
const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;
let player;
let cursors;
let platforms;
let ground;
let isGrounded = false;

let playTestState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('player','/assets/imgs/WhiteSquare.jpg');
    game.load.image('ground','/assets/imgs/GreenSquare.png');
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createPlayer();
    createPlatforms();
    createKeyControls();
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    playerMovement();
    game.physics.arcade.collide(player, platforms, playerOnGround, null, this);
    console.log(player.body.velocity.y);
}

function playerMovement() {
    if (cursors.left.isDown)
        player.body.velocity.x = -PLAYER_VELOCITY;
    else if (cursors.right.isDown)
        player.body.velocity.x = PLAYER_VELOCITY;
    else player.body.velocity.x = 0;

    if (cursors.up.isDown && isGrounded){
        player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
        isGrounded = false;
    }
}

function createPlayer() {
    let x = game.world.centerX;
    let y = game.world.height - 500;

    player = game.add.sprite(x, y, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.2, 0.2);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 1400;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.enableBody = true;
}

function createPlatforms() {
    
    platforms = game.add.group();
    platforms.enableBody = true;

    ground = game.add.sprite(0, GAME_HEIGHT - 50, 'ground');
    platforms.add(ground);
    ground.scale.setTo(20, 1);
    ground.body.immovable = true;
}

function playerOnGround(){
    if (player.body.touching.down) isGrounded = true;
    else isGrounded = false;
}
