
//ALL PLAYER VARIABLES IN play.js 
let arcadeMachine;
let playerVelocityReducer = 1;
let playerJumpVelocityReducer = 1;

let hallState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() { //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!TODO CHANGE SPRITES

    //------GENERAL-----------------------------------------
    game.load.image('bgMain', './assets/imgs/bgMain.jpg');
    game.load.tilemap('map', './assets/levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/Terrain.png');
    game.load.spritesheet('player','./assets/imgs/SpriteSheet.png', 32, 32, 23);
    game.load.image('arcadeMachine','./assets/imgs/arcadeMachine.png');
}

function createPlay() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    createCameraSet();

    //This goes here because otherwise the arcade would be in front of the player
    arcadeMachine = game.add.sprite(2000, 710, 'arcadeMachine'); 

    createPlayer();
    createHallLevel();
    createKeyControls();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    isGrounded = game.physics.arcade.collide(player, layer);

    //If close to arcade, reduce velocity and stop jumping
    if (arcadeMachine.x - player.body.x < 750) {

        playerVelocityReducer = 0.5;
        playerJumpVelocityReducer = 0;
        isGrounded = false;
    }

    if (arcadeMachine.x - player.body.x < 175) {

        letPlayerMove = false;
        game.time.events.add(2000, tweenPlayer);
    }

    playerMovement();
}

function playerMovement() {
    if (letPlayerMove){
        if (cursors.left.isDown){
            player.body.velocity.x = -PLAYER_VELOCITY * playerVelocityReducer;
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
            player.body.velocity.x = PLAYER_VELOCITY * playerVelocityReducer;
        }
        else { //If nothing is pressed...
            if (isWalking){
                isWalking = false; //change bool to false 
                player.animations.play('idle'); //trigger idle anim.
            }
            player.body.velocity.x = 0; //change velocity on x to 0.
        }
        
        if (player.body.onFloor() && cursors.up.isDown){
            player.body.velocity.y = -PLAYER_JUMP_VELOCITY * playerJumpVelocityReducer;
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
    let y = 710;

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

function createHallLevel() {

    map = game.add.tilemap('map');
    map.addTilesetImage('Terrain', 'tiles');

    map.setCollisionBetween(0, 60);

    layer = map.createLayer('layer1');
    layer.setScale(2, 2);
    layer.resizeWorld();

    arcadeMachine.anchor.setTo(0.5, 0.5);
    arcadeMachine.scale.setTo(0.25, 0.25);
}

function tweenPlayer(){
    
    game.add.tween(player).to( { x: arcadeMachine.x + 100 }, 500, "Back.easeInOut", true, 0, 0, false);
    // game.add.tween(error).to( { alpha: 0 }, 30, "Linear", true, 15, 4, true);
    // game.add.tween(consoleSprite).to( { alpha: 1 }, 100, "Linear", true);

}
