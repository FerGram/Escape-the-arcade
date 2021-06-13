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

let gun;
let gunScale = 1;
let gunOffsetX = 2;
let gunOffsetY = 7;
let gunTip;

let ak47Scale = 1;
let pistolScale = 0.15;

let ak47OffsetX = 2;
let ak47OffsetY = 7;

let pistolOffsetX = 15;
let pistolOffsetY = 5;
let pistolTip;

let bullet;
let bulletScale = 1;

let alienBullets;
let alienBulletsScale = 1;
let livingAliens = [];

//Player fire vars
let fireSpeed = 50; //firerate
let fireCooldown = 0; //var to wait between fires.

//Alien fire vars
let alienBulletSpd = 350;
let alienFiringTimer = 1500;

let size = new Phaser.Rectangle();
let zoomAmount = 0;

//Paralax
let bg1;
let bg2;
let bg3;
let bg4;

//Aliens;
let aliens;
let alienScale = 2.5;

//Boss
let boss;
let bossScale = 0.3;
let isWalkingBoss;
let isJumpingBoss;

let mousePressedDown = false;

let door;

//Level States
let killedAllAliens = false;
let pickedAk47 = false;
let killedBoss = false;

let bossBullets;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay,
    render: renderPlay
};

function preloadPlay() {
    //Spritesheet for the player
    game.load.spritesheet('player', './assets/imgs/SpriteSheet.png', 15, 23, 13);

    //Boss spritesheets. TODO Can be grouped in one.
    game.load.spritesheet('boss', './assets/imgs/phase4/boss/BossSpriteSheet.png', 1000, 1000, 84);

    //Tilemap and level
    game.load.tilemap('map', './assets/levels/levelExtra.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', './assets/imgs/TF.png');

    //Guns and bullets
    game.load.spritesheet('gun', './assets/imgs/AK47.png', 84, 30, 20);
    game.load.image('pistol', './assets/imgs/pistol.png');
    game.load.image('gunTip', './assets/imgs/gunTip.png');

    game.load.image('playerBullet', './assets/imgs/bullet_H1.png');
    game.load.image('alienBullet', './assets/imgs/phase4/alienBullet.png');
    game.load.spritesheet('bossBullet', './assets/imgs/phase4/bossBullet.png', 1730, 270, 3);

    //Enemies
    game.load.spritesheet('smallAliens', './assets/imgs/phase4/smallAliens.png', 14, 14, 4);
    game.load.image('greenAlien', './assets/imgs/phase4/greenAlien.png');

    //paralax
    game.load.image('bg1', './assets/imgs/phase4/bgs/background_1.png');
    game.load.image('bg2', './assets/imgs/phase4/bgs/background_2.png');
    game.load.image('bg3', './assets/imgs/phase4/bgs/background_3.png');
    game.load.image('bg4', './assets/imgs/phase4/bgs/background_4.png');

    //Door
    game.load.image('door', './assets/imgs/phase4/door.png');
}

function createPlay() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    size.setTo(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    game.camera.focusOnXY(0, 0);

    game.camera.scale.x += zoomAmount;
    game.camera.scale.y += zoomAmount;

    game.camera.bounds.x = size.x * game.camera.scale.x;
    game.camera.bounds.y = size.y * game.camera.scale.y;

    game.camera.bounds.width = size.width * game.camera.scale.x;
    game.camera.bounds.height = size.height * game.camera.scale.y;

    createLevel();
    createBackground();
    createPlayer();

    createBoss();
    createBossBullets();

    door = game.add.sprite(1175, 600, 'door');
    game.physics.arcade.enable(door);
    door.bringToTop();
    door.scale.setTo(3, 6);
    door.body.moves = false;

    createKeyControls();

    createAliens();
    createAlienBullets();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    createPistol();
    createBullets();
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
}

function collisionOfBossWithBullets(gt, b){
    b.kill();

    boss.hurt(boss);
}

function updatePlay() {
    game.physics.arcade.collide(boss.obj, layer); //Check for collison of boss with level
    game.physics.arcade.overlap(boss.gunTip, bullets, collisionOfBossWithBullets, null, this); //Check for collison of boss and bullets.

    game.physics.arcade.collide(player, door); //Check for collison of player with level
    game.physics.arcade.collide(player, layer); //Check for collison of player with level


    game.physics.arcade.overlap(bullets, aliens, collisionOfBulletsWithAliens, null, this);

    playerMovement();
    scrollBackground();
    gun.obj.position.setTo(player.position.x + gunOffsetX, player.position.y + gunOffsetY);
    gunRotation();

    if (game.input.activePointer.leftButton.isDown){
        if (gun.name == "ak47")
            shootAK47();
        else{
            if (!mousePressedDown){
                mousePressedDown = true;
                shootAK47();
            }
        }
    }
    else{
        mousePressedDown = false;
    }

    if (game.time.now > alienFiringTimer)
        fireAliens();

    if (killedAllAliens){
        //Boss logic
        boss.chooseState(bossBullets);
    }

}

function collisionOfBulletsWithAliens(b, a){
    b.kill();

    a.p.hp--;
    if (a.p.hp <= 0){
        a.kill();
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
        //scrollBackground();
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
        //scrollBackground();
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
    player.animations.add('idle', [0, 1, 2, 3, 4], 8, true);
    player.animations.add('walk', [5, 6, 7, 8], 10, true);

    player.animations.play('idle');
    player.scale.setTo(playerScale, playerScale);
    player.anchor.setTo(0.5, 0.5);
}

function createAk47(){
    gun = createGun("ak47", game.add.sprite(100, 100, 'gun'));

    gun.obj.animations.add('shoot', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 24, false);
    gun.obj.anchor.setTo(0.3, 0.5);
    gunScale = ak47Scale;

    gunTip = game.add.sprite(0, 0, 'gunTip');
    gunTip.anchor.setTo(0.5, 0.5);
    gun.obj.addChild(gunTip);
    gunTip.position.x = 60;
    gunTip.position.y = -5;

    gunOffsetX = ak47OffsetX;
    gunOffsetY = ak47OffsetY;
}

function createPistol(){
    gun = createGun("pistol", game.add.sprite(0, 0, 'pistol'));
    gun.obj.anchor.setTo(0.3, 0.5);
    gunScale = pistolScale;

    gunTip = game.add.sprite(0, 0, 'gunTip');
    gunTip.anchor.setTo(0.5, 0.5);
    gun.obj.addChild(gunTip);
    gunTip.position.x = 170;
    gunTip.position.y = -70;

    gunOffsetX = pistolOffsetX;
    gunOffsetY = pistolOffsetY;

}

function createBullets(){ //TODO Bullets break with world bounds, should break with screen bounds or should be a bigger pool
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(100, 'playerBullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true); //TODO fix, only kills bullets when out of world bounds, not cameras, player runs of of bullets.
    bullets.setAll('body.allowGravity', false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
}

function createAlienBullets(){ //TODO Bullets break with world bounds, should break with screen bounds or should be a bigger pool
    alienBullets = game.add.group();
    alienBullets.enableBody = true;
    alienBullets.physicsBodyType = Phaser.Physics.ARCADE;

    alienBullets.createMultiple(35, 'alienBullet');
    alienBullets.setAll('checkWorldBounds', true);
    alienBullets.setAll('outOfBoundsKill', true); //TODO fix, only kills alienBullets when out of world bounds, not cameras, player runs of of alienBullets.
    alienBullets.setAll('body.allowGravity', false);
    alienBullets.setAll('anchor.x', 0.5);
    alienBullets.setAll('anchor.y', 0.5);
}

function createBossBullets(){ //TODO Bullets break with world bounds,
    bossBullets = game.add.group();
    bossBullets.enableBody = true;
    bossBullets.physicsBodyType = Phaser.Physics.ARCADE;

    bossBullets.createMultiple(20, 'bossBullet');
    bossBullets.setAll('checkWorldBounds', true);
    bossBullets.setAll('outOfBoundsKill', true);
    bossBullets.setAll('body.allowGravity', false);
    bossBullets.setAll('anchor.x', 0);
    bossBullets.setAll('anchor.y', 0.5);

    bossBullets.forEach(bul => {
        bul.animations.add('shot', [0, 1, 2], 5);
        bul.scale.setTo(0.3, 0.3);
    });


}

function createAliens(){

    aliens = game.add.group();
    //aliens.fixedToCamera = true;
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    let alien;
    let cols = 2;
    let rows = 2;
    for (let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x++){
            if ((x == 0 || x == cols - 1) && y == 0)
                alien = createEnemy(aliens.create(x * 96, y * 64, 'greenAlien'));
            else{
                alien = createEnemy(aliens.create(x * 96, y * 64, 'smallAliens'));
                alien.frame = getRandomInt(0, 3);
            }

            alien.anchor.setTo(0.5, 0.5);
            alien.scale.setTo(alienScale, alienScale);
            alien.body.moves = false;
        }
    }

    aliens.x = 200;
    aliens.y = 350;

    let alienTween = game.add.tween(aliens).to( { x: 400 }, 1500, Phaser.Easing.Linear.None, true, 0, 1000, true);

    alienTween.onRepeat.add(descendAliens, this);
}

function descendAliens(){
    aliens.y += 30;
    //if () TODO add safe position, where the y is reset before they touch the ground.
}

function fireAliens(){
    alienBullet = alienBullets.getFirstExists(false);

    livingAliens.length = 0;

    aliens.forEachAlive(function(alien){
        livingAliens.push(alien);
    });

    if (alienBullet && livingAliens.length > 0){
        let rd = game.rnd.integerInRange(0, livingAliens.length - 1);

        let shooter = livingAliens[rd];

        alienBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(alienBullet, player, alienBulletSpd);
        alienFiringTimer = game.time.now + 1500;
    }
    else if (livingAliens.length <= 0 && !killedAllAliens)
        FinishedFirstPart();
}

function FinishedFirstPart(){
    killedAllAliens = true;
    door.position.y = 300;

    //createBoss();
    //createBossBullets();
}
function gunRotation(){
    gun.obj.rotation = game.physics.arcade.angleToPointer(gun.obj);
    if (gun.obj.angle < -90 || gun.obj.angle > 90){ //TODO add bool to check if it is already rotated.
        gun.obj.scale.setTo(gunScale, gunScale * -1);
    }
    else{
        gun.obj.scale.setTo(gunScale, gunScale);
    }
}

function createLevel(){
    //Create
    map = game.add.tilemap('map');
    map.addTilesetImage('TF', 'tiles');


    layer = map.createLayer('layer1');
    layer.setScale(2, 2);
    layer.resizeWorld();
    map.setCollisionByExclusion([67]);

    //layer.debug = true;
}

function renderPlay(){

        //game.debug.spriteInfo(gun, 32, 32);
    //game.debug.body(boss.obj);
    //game.debug.body(boss.gunTip);


    //game.debug.body(door);

}

function createBackground(){

    game.stage.backgroundColor = "#000003";

    bg1 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg1');
    //bg2 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg2');
    //bg3 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg3');
    bg4 = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg4');

    bg1.sendToBack();
    //bg2.sendToBack();
    //bg3.sendToBack();
    bg4.sendToBack();

    bg1.fixedToCamera = true;
    //bg2.fixedToCamera = true;
    //bg3.fixedToCamera = true;
    bg4.fixedToCamera = true;

}

function scrollBackground(){

    bg1.tilePosition.y += 0.6;
    //bg2.tilePosition.y += -0.3;
    //bg3.tilePosition.y += -0.2;
    bg4.tilePosition.y += 1;
}

function shootAK47(){

    if (game.time.now > fireCooldown && bullets.countDead() > 0){

        //gun.obj.animations.play('shoot');

        fireCooldown = game.time.now + fireSpeed;

        let bullet = bullets.getFirstDead();

        bullet.reset(gunTip.world.x, gunTip.world.y);

        bullet.rotation = gun.obj.rotation;
        game.physics.arcade.moveToPointer(bullet, 700);
    }
}

function createEnemy(spr){
    let enemy = new Alien(spr);
    game.physics.arcade.enable(enemy.obj);

    enemy.obj.body.linearDamping = 1;
    enemy.obj.body.gravity = 0;

    return enemy.obj;
}

function createGun(name, spr){
    return new Gun(name, spr);
}

function createBoss(){
    boss = new Boss(game.add.sprite(2000, 300, 'boss'), game.add.sprite(0, 0, 'player'), player, game, bossBullets);


    boss.createBoss();
}

//Generates random int between min and max.
function getRandomInt(min, max) { //TODO delete and use built in random phaser
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class Boss{
    constructor(boss, gt, p, g, b){
        this.game = g;
        this.player = p;
        this.hp = 5;

        this.obj = boss;
        this.obj.anchor.setTo(0.5, 0.5);
        this.obj.p = this;

        this.isWalking = false;
        this.jump = false;
        this.velocity = 120;
        this.jumpVelocity = -350;

        this.gunTip = gt;
        this.canShoot = false;
        this.isFiring = false;
        this.actionTimer = 3000;
        this.bullets = b;
        this.jumping = false;

        this.isDead = false;
    }

    hurt(b){
        b.hp--;
        if (b.hp <= 0 && !b.isDead){
            b.isDead = true;
            b.obj.animations.play('death');
        }
    }

    facePlayer(playerX){
        let dist = playerX - this.obj.position.x;

        if (dist > 0){
            this.obj.scale.setTo(bossScale, bossScale);
        }
        else{
            this.obj.scale.setTo(-bossScale, bossScale);
        }
        return dist;

    }

    createBoss(){

        this.obj.scale.setTo(bossScale, bossScale);

        this.game.physics.arcade.enable(boss.obj);
        this.game.physics.arcade.enable(boss.gunTip);


        this.obj.body.bounce.y = 0.1;
        this.obj.body.linearDamping = 1;
        this.obj.body.collideWorldBounds = true;
        this.obj.body.setSize(200 / Math.abs(this.obj.scale.x), 200 / Math.abs(this.obj.scale.y), 100 / this.obj.scale.x, 100 / this.obj.scale.y);

        this.gunTip.body.setSize(50 / Math.abs(this.obj.scale.x), 80 / Math.abs(this.obj.scale.y), -50, -40);
        this.createAnims();

        //Subobjet for jumping
        this.gunTip.body.moves = false;
        this.gunTip.anchor.setTo(0.5, 0.5);
        this.obj.addChild(this.gunTip);
        this.gunTip.position.x = 0;
        this.gunTip.position.y = 0;

        this.shootTimer = this.game.time.create(false);

    }

    createAnims(){
        this.obj.animations.add('idle', [0, 1], 4, true);
        this.obj.animations.add('walk', [14, 15, 16, 17, 18, 19, 20, 21], 10, true);
        this.obj.animations.add('shoot', [70, 71, 72, 73, 74], 10);
        this.obj.animations.add('jump', [28, 29, 30, 31], 10);
        this.obj.animations.add('death', [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55], 12);

        this.obj.animations.play('idle');
    }

    movement(playerX){
        let distance = this.facePlayer(playerX);
        let dir = Math.sign(distance);
        let isGrounded = this.obj.body.onFloor();
        this.obj.body.velocity.x = 0;

        if (this.isFiring) return;

        if (this.jump || this.obj.body.onWall()){
            if (isGrounded)
            {
                this.jump = false;
                this.obj.body.velocity.y = this.jumpVelocity;
                this.obj.body.velocity.x = 2 * this.velocity * dir;
                this.obj.animations.play('jump');
                return;
            }
        }

        if (Math.abs(distance) > 400){
            this.obj.body.velocity.x = this.velocity * dir;

            if (!this.isWalking && isGrounded){
                this.isWalking = true;
                this.obj.animations.play('walk');
            }
        }
        else{
            if (this.isWalking && isGrounded){
                this.isWalking = false;

                this.obj.animations.play('idle');
                this.canShoot = true;
            }
        }
    }

    canJump(){
        if (this.obj.body.onFloor()){
            this.jump = true;
        }
    }

    fireAtPlayer(){
        let bullet = bossBullets.getFirstExists(false);
        bullet.reset(this.obj.body.x + 50, this.obj.body.y);
        bullet.animations.play('shot');
        bullet.rotation = game.physics.arcade.angleToXY(bullet, player.position.x, player.position.y);
        //game.physics.arcade.moveToObject(bullet, this.player, 0);
        this.isFiring = false;
        //console.log("resetubg fureubg");
    }

    chooseState(){

        if (this.isDead) return;

        if (this.actionTimer < game.time.now){
            let rd = game.rnd.integerInRange(0, 2);
            this.isWalking = false;
            if (rd == 0){
                //console.log("firing at player");
                this.isFiring = true;
                this.obj.animations.play('shoot');
                let that = this;
                setTimeout(function (){
                    that.fireAtPlayer();
                }, 1000);

                this.actionTimer = this.game.time.now + 2000;
            }
            else if (rd == 1){
                //console.log("jumping at player");
                this.canJump();
                this.actionTimer = this.game.time.now + 1000;
            }
        }
        else{
            //console.log("moving to player");
            this.movement(this.player.position.x);
        }
    }
}

class Alien{
    constructor(enemy){
        this.hp = 2;

        this.obj = enemy;
        this.obj.p = this;
    }
}

class Gun{
    constructor(n, g){
        this.name = n;
        this.obj = g;

        this.obj.p = this;
    }
}