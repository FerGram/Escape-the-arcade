const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth);
const GAME_HEIGHT = 720;
const GAME_WIDTH = GAME_HEIGHT * ratio;
const CONTAINER = document.getElementById("gamestage");
const SCALE = window.innerWidth / GAME_WIDTH;

CONTAINER.style.height = `${SCALE * GAME_HEIGHT}px`;

let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, CONTAINER);

let wfConfig = {
    active: function () { // Runs when the fonts are loaded
        startGame();
    },

    google: {
        families: ['Krona One', 'Sniglet']
    },

    /*custom: {
        families: ['FerrumExtracondensed', 'Basteleur Bold'],   // Had to modify the css in order to get it. Can only enter web fonts
        urls: ["https://fontlibrary.org/face/ferrum", "assets/fonts/Basteleur-Bold.ttf"]
    }
    custom: {
        families: ['GlyphWorld Meadow'],
        urls: ["assets/fonts/GlyphWorld-Meadow.otf"]
    }*/
};

WebFont.load(wfConfig);

function startGame() {

    // Menu Screen
    game.state.add('init', initState);
    // Gameplay Screen
    game.state.add('play', playState);
    // Some other screen
    game.state.add('hof', hofState);

    game.state.start('init');
}