

import AssetsDatabase from './base/AssetsDatabase.js';

// Game Logic
import Player from './game/Player.js';
import Monster from './game/Monster.js';

// The Game main class
import Game from './Game.js';

window.GAME = null;

var app = {

    init() {
        GAME = new Game(window.initialGameOptions);
        GAME.start();
    }

}

window.addEventListener('load', () => {
    app.init();
});