const PLAYER_ARCADE_DISTANCE = 750;
//ALL PLAYER VARIABLES IN play.js 
let arcadeMachine;
let arcadeMachineX = 1500;
let playerVelocityReducer = 1;
let playerJumpVelocityReducer = 1;

let citySound;
let shopBell;
let swoosh;
let teleportSound;

let inside = false;

let hallState = {
    preload: preloadHall,
    create: createHall,
    update: updateHall
};

function preloadHall() {

    //------GENERAL-----------------------------------------
    game.load.image('bgMain', './assets/imgs/bgMain2.jpg');
    game.load.tilemap('map', './assets/levels/levelHall.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/Hall_Tiles.png');
    game.load.spritesheet('player','./assets/imgs/SpriteSheet.png', 15, 23, 13);
    game.load.image('arcadeMachine','./assets/imgs/arcadeMachine.png');

    game.load.audio('citySound', './assets/sounds/cityAmbience.mp3');
    game.load.audio('enterShop', './assets/sounds/bellring.mp3');
    game.load.audio('swoosh', './assets/sounds/swoosh.mp3');
    game.load.audio('teleportSound', './assets/sounds/teleport.mp3');
}

function createHall() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    createHallCameraSet();

    
    createHallLevel();
    createHallKeyControls();
    createHallPlayer();
    createHallSounds();
    
    //This goes here because otherwise the arcade would be in front of the player
    arcadeMachine = game.add.sprite(arcadeMachineX, 710, 'arcadeMachine'); 
    arcadeMachine.anchor.setTo(0.5, 0.5);
    arcadeMachine.scale.setTo(0.25, 0.25);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    citySound.play();
    
}

function createHallKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updateHall() {
    isGrounded = game.physics.arcade.collide(player, layer);

    //If close to arcade, reduce velocity and stop jumping
    if (arcadeMachine.x - player.body.x < PLAYER_ARCADE_DISTANCE) {
        if (!inside) {
            shopBell.play();
            citySound.fadeOut(3000);
        }
        inside = true;
        playerVelocityReducer = 0.5;
        playerJumpVelocityReducer = 0;
        isGrounded = false;
    }
    else {
        inside = false;
    }

    if (arcadeMachine.x - player.body.x < 175 & !tweeningPlayer) { //Last part of Hall state

        letPlayerMove = false;
        tweeningPlayer = true;
        game.time.events.add(2000, tweenHallPlayer);
    }

    playerHallMovement();
}

function playerHallMovement() {
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

function createHallCameraSet(){
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

function createHallPlayer() {
    let x = 200;
    let y = 500;

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

    player.body.z = 0;

    player.smoothed = false;
}

function createHallLevel() {

    // We had errors creating this. Nedded to embed the tileset into the tileset
    map = game.add.tilemap('map');
    map.addTilesetImage('Hall_Tiles', 'tiles'); 

    // Create a different layer for every layer in the JSON
    layerbg = map.createLayer('fondo');
    layerbg.smoothed = false;
    layer1 = map.createLayer('layer1');
    layer1.smoothed = false;
    layer = map.createLayer('Front');
    layer.smoothed = false;
    
    
    layer.setScale(2, 2);
    layer1.setScale(2, 2);
    layerbg.setScale(2, 2);
    layer.resizeWorld();

    map.setCollision([122, 141, 163, 164, 183, 184], true, layer);
}

function createHallSounds() {
    citySound = game.add.sound('citySound');
    citySound.loop = true;
    shopBell = game.add.sound('enterShop');
    swoosh = game.add.sound('swoosh');
    teleportSound = game.add.sound('teleportSound');
}

function tweenHallPlayer(){
    
    //ELEVATE PLAYER
    teleportSound.play();
    teleportSound.fadeOut(1500);

    let completed = game.add.tween(player).to( { y: arcadeMachine.y - 200 }, 1000, "Back.easeInOut", true, 0, 0, false);
    game.add.tween(player).to( { x: player.x - 50 }, 1000, "Back.easeIn", true, 0, 0, false);
    game.add.tween(player).to( { angle: 1200 }, 1000, "Back.easeOut", true, 500, 0, false);

    //WHEN FINISHED ELEVATING, REDUCE ITS SIZE AND TWEEN IT TO THE ARCADE MACHINE. THEN, DESTROY IT AND START 'play'.
    completed.onComplete.add(function(){
        swoosh.play();

        game.add.tween(player.scale).to( { x: 0.25, y: 0.25 }, 200, "Back.easeInOut", true, 0, 0, false);
        game.add.tween(player).to( { y: arcadeMachine.y }, 200, "Sine.easeIn", true, 0, 0, false);
        game.add.tween(player).to( { x: arcadeMachine.x }, 200, "Sine.easeIn", true, 0, 0, false);

        game.time.events.add(500, function(){

            player.kill();
            game.camera.unfollow();
        })
        game.time.events.add(2000, startPlayGame);
    });

}

function startPlayGame(){ 

    //Reset some variables
    letPlayerMove = true; 
    tweeningPlayer = false;
    playerVelocityReducer = 1;
    playerJumpVelocityReducer = 1;

    game.state.start('play');
}