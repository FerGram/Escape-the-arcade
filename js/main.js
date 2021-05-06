const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth);
const WINDOW_GAME_HEIGHT = 1080;
const WINDOW_GAME_WIDTH = WINDOW_GAME_HEIGHT * ratio;
const CONTAINER = document.getElementById("gamestage");
const SCALE = window.innerWidth / WINDOW_GAME_WIDTH;
// console.log(SCALE);
// REAL SIZE THAT SHOULD BE DISPLAYED
const GAME_HEIGHT = WINDOW_GAME_HEIGHT*SCALE;
const GAME_WIDTH = WINDOW_GAME_WIDTH*SCALE;

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
    // About Screen
    game.state.add('instructions', instructionsState);
    // Gameplay Screen
    game.state.add('play', playState);
    // Some other screen
    game.state.add('hof', hofState);

    game.state.start('init');
}