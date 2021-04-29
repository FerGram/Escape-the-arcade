const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth);
const GAME_HEIGHT = 720;
const GAME_WIDTH = GAME_HEIGHT * ratio;
const CONTAINER = document.getElementById("gamestage");
const SCALE = window.innerWidth / GAME_WIDTH;

CONTAINER.style.height = `${SCALE * GAME_HEIGHT}px`;

let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, CONTAINER);

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('init', initState);
    game.state.add('play', playState);
    game.state.add('hof', hofState);

    game.state.start('init');
}