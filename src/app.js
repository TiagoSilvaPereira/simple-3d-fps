// The Game main class
import Game from './Game.js';

window.GAME = null;

var app = {

    init() {
        GAME = new Game(window.initialGameOptions);
        GAME.start();
    }

}

window.addEventListener('DOMContentLoaded', () => {
    app.init();
});