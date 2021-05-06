//Adding anims to Fer's playTest
//http://teseo.act.uji.es/~al394827/ProyectoWebTest/
const HUD_HEIGHT = 50;
const PLAYER_VELOCITY = 500;
const PLAYER_JUMP_VELOCITY = 1000;
let player;
let cursors;
let platforms;
let ground;
let isGrounded = false;


let isWalking = false; //used to check if walking or not, and to set the proper anim.
let playerScale = 2; //Scale of player.

let playTestState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    //game.load.image('player','/assets/imgs/WhiteSquare.jpg');
    game.load.image('ground','./assets/imgs/GreenSquare.png');

    //Loading the spritesheet for the player
    game.load.spritesheet('player', './assets/imgs/NinjaFrog/SpriteSheet.png', 32, 32, 23);

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
    isGrounded = game.physics.arcade.collide(player, platforms);
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
        player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
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
    platforms = game.add.group();
    platforms.enableBody = true;

    ground = game.add.sprite(0, GAME_HEIGHT - 50, 'ground');
    platforms.add(ground);
    ground.scale.setTo(20, 1);
    ground.body.immovable = true;
}
