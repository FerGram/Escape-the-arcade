let craft;
const HUD_HEIGHT = 50;
let cursors;
const CRAFT_VELOCITY = 150;
let stars;
const LASERS_GROUP_SIZE = 40;
let lasers;


let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('craft','assets/imgs/craft.png');
    game.load.image('stars','assets/imgs/stars.png');
}

function createPlay() {
    let w = game.world.width;
    let h = game.world.height;
    stars = game.add.tileSprite(0, 0, w, h, 'stars');

    createCraft();
    createKeyControls();

}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function updatePlay() {
    manageCraftMovements();
    stars.tilePosition.y += 1;  // stars.tilePosition y stars.y son diferentes ejjejeje que chulo
}

function manageCraftMovements() {
    craft.body.velocity.x = 0;
    if (cursors.left.isDown || game.input.speed.x < 0)
        craft.body.velocity.x = -CRAFT_VELOCITY;
    else if (cursors.right.isDown || game.input.speed.x > 0)
        craft.body.velocity.x = CRAFT_VELOCITY;
 }

function startHOF() {
    game.state.start('hof');
}

function createCraft() {
    let x = game.world.centerX;
    let y = game.world.height - HUD_HEIGHT;
    craft = game.add.sprite(x, y, 'craft');
    craft.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(craft);
    craft.body.collideWorldBounds = true;
}


    
